package com.miftah.app;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.InterfaceAddress;
import java.net.NetworkInterface;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

/**
 * The phone's side of "Phone and computer": finds Miftah for Windows on the home Wi-Fi, pairs with the six digits it shows,
 * and joins records with it. The wire format and the seal are the same as windows/src/Link.cs:
 *   request  "MFT1" | type | id length | phone id | length (big-endian) | sealed payload
 *   answer   status | length (big-endian) | sealed payload
 *   seal     AES-256-CBC (key = HMAC(key, "miftah-enc")), then HMAC-SHA256 (key = HMAC(key, "miftah-mac")) over IV and cipher text
 * Nothing here ever reaches the internet: only private addresses on the local network.
 */
final class Link {
    static final int TCP = 47731, UDP = 47732;
    static final byte PAIR = 1, HELLO = 2, GET = 3, PUT = 4, SYNC = 5;
    static final long MAX_FILE = 200L * 1024 * 1024;

    private final Context c;
    Link(Context c) { this.c = c; }
    private SharedPreferences prefs() { return c.getSharedPreferences("link", Context.MODE_PRIVATE); }

    String devId() {
        String id = prefs().getString("dev", null);
        if (id == null) { byte[] b = new byte[8]; new SecureRandom().nextBytes(b); id = hex(b); prefs().edit().putString("dev", id).apply(); }
        return id;
    }
    JSONObject paired() { try { String s = prefs().getString("pc", null); return s == null ? null : new JSONObject(s); } catch (Exception e) { return null; } }
    void forget() { prefs().edit().remove("pc").apply(); }

    /* ---------- the seal ---------- */
    static byte[] sub(byte[] key, String label) throws Exception { Mac m = Mac.getInstance("HmacSHA256"); m.init(new SecretKeySpec(key, "HmacSHA256")); return m.doFinal(label.getBytes(StandardCharsets.US_ASCII)); }
    static byte[] pairKey(String code, String pcId) throws Exception {
        SecretKeyFactory f = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        PBEKeySpec spec = new PBEKeySpec(code.toCharArray(), ("miftah-pair:" + pcId).getBytes(StandardCharsets.UTF_8), 50000, 256);
        return f.generateSecret(spec).getEncoded();
    }
    static byte[] close(byte[] key, byte[] plain) throws Exception {
        byte[] iv = new byte[16]; new SecureRandom().nextBytes(iv);
        Cipher ci = Cipher.getInstance("AES/CBC/PKCS5Padding"); ci.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(sub(key, "miftah-enc"), "AES"), new IvParameterSpec(iv));
        byte[] ct = ci.doFinal(plain);
        Mac m = Mac.getInstance("HmacSHA256"); m.init(new SecretKeySpec(sub(key, "miftah-mac"), "HmacSHA256")); m.update(iv); m.update(ct);
        byte[] mac = m.doFinal(), out = new byte[16 + ct.length + 32];
        System.arraycopy(iv, 0, out, 0, 16); System.arraycopy(ct, 0, out, 16, ct.length); System.arraycopy(mac, 0, out, 16 + ct.length, 32);
        return out;
    }
    static byte[] open(byte[] key, byte[] body) throws Exception {
        if (body == null || body.length < 64) return null;
        Mac m = Mac.getInstance("HmacSHA256"); m.init(new SecretKeySpec(sub(key, "miftah-mac"), "HmacSHA256")); m.update(body, 0, body.length - 32);
        byte[] mac = m.doFinal(), got = new byte[32]; System.arraycopy(body, body.length - 32, got, 0, 32);
        if (!MessageDigest.isEqual(mac, got)) return null;
        Cipher ci = Cipher.getInstance("AES/CBC/PKCS5Padding"); ci.init(Cipher.DECRYPT_MODE, new SecretKeySpec(sub(key, "miftah-enc"), "AES"), new IvParameterSpec(body, 0, 16));
        return ci.doFinal(body, 16, body.length - 48);
    }

    /* ---------- one request, one answer ---------- */
    static final class Answer { int status; byte[] body; }
    private Answer ask(String ip, int port, byte type, byte[] payload, int timeout) throws Exception {
        try (Socket s = new Socket()) {
            s.connect(new InetSocketAddress(ip, port), 2500); s.setSoTimeout(timeout);
            OutputStream o = s.getOutputStream(); byte[] id = devId().getBytes(StandardCharsets.US_ASCII);
            ByteArrayOutputStream h = new ByteArrayOutputStream();
            h.write("MFT1".getBytes(StandardCharsets.US_ASCII)); h.write(type); h.write(id.length); h.write(id);
            int n = payload.length; h.write(new byte[]{(byte) (n >> 24), (byte) (n >> 16), (byte) (n >> 8), (byte) n});
            o.write(h.toByteArray()); o.write(payload); o.flush();
            DataInputStream in = new DataInputStream(s.getInputStream());
            Answer a = new Answer(); a.status = in.readUnsignedByte(); int len = in.readInt();
            if (len < 0 || len > MAX_FILE + 1024) throw new Exception("too big");
            a.body = new byte[len]; in.readFully(a.body);
            return a;
        }
    }

    /* ---------- finding the computer ---------- */
    static boolean privateIp(InetAddress a) {
        byte[] b = a.getAddress(); if (b.length != 4) return false; int x = b[0] & 255, y = b[1] & 255;
        return x == 10 || (x == 172 && y >= 16 && y < 32) || (x == 192 && y == 168) || (x == 169 && y == 254) || x == 127;
    }
    JSONArray find(int ms) { return find(ms, null); }
    /** the computer at one address the parent typed, or every computer answering a broadcast */
    JSONArray find(int ms, String only) {
        JSONArray out = new JSONArray(); Set<String> seen = new HashSet<>();
        try (DatagramSocket s = new DatagramSocket()) {
            s.setBroadcast(true); s.setSoTimeout(250);
            byte[] q = "MFT1?".getBytes(StandardCharsets.US_ASCII);
            List<InetAddress> to = new ArrayList<>();
            if (only != null) { InetAddress one = InetAddress.getByName(only); if (!privateIp(one)) return out; to.add(one); } else to.add(InetAddress.getByName("255.255.255.255"));
            if (only == null) for (NetworkInterface ni : Collections.list(NetworkInterface.getNetworkInterfaces())) {
                if (!ni.isUp() || ni.isLoopback()) continue;
                for (InterfaceAddress ia : ni.getInterfaceAddresses()) if (ia.getBroadcast() != null && ia.getAddress() instanceof Inet4Address) to.add(ia.getBroadcast());
            }
            long end = System.currentTimeMillis() + ms, next = 0;
            byte[] buf = new byte[2048];
            while (System.currentTimeMillis() < end) {
                if (System.currentTimeMillis() >= next) { for (InetAddress a : to) try { s.send(new DatagramPacket(q, q.length, a, UDP)); } catch (Exception ignored) { } next = System.currentTimeMillis() + 600; }
                try {
                    DatagramPacket p = new DatagramPacket(buf, buf.length); s.receive(p);
                    String m = new String(p.getData(), 0, p.getLength(), StandardCharsets.UTF_8);
                    if (!m.startsWith("MFT1!") || !privateIp(p.getAddress())) continue;
                    JSONObject card = new JSONObject(m.substring(5)); String id = card.optString("id");
                    if (id.isEmpty() || !seen.add(id)) continue;
                    card.put("ip", p.getAddress().getHostAddress()); out.put(card);
                } catch (java.net.SocketTimeoutException ignored) { }
            }
        } catch (Exception ignored) { }
        return out;
    }

    /* ---------- pairing ---------- */
    /** returns the computer's name, or throws with a reason the page can show */
    String pair(String ip, int port, String pcId, String code, String phoneName) throws Exception {
        if (!privateIp(InetAddress.getByName(ip))) throw new Exception("home");
        byte[] pk = pairKey(code, pcId);
        JSONObject me = new JSONObject().put("name", phoneName);
        Answer a = ask(ip, port, PAIR, close(pk, me.toString().getBytes(StandardCharsets.UTF_8)), 20000);
        if (a.status == 2) throw new Exception("code");
        if (a.status == 4) throw new Exception("locked");
        if (a.status != 0) throw new Exception("fail");
        byte[] plain = open(pk, a.body); if (plain == null) throw new Exception("code");
        JSONObject r = new JSONObject(new String(plain, StandardCharsets.UTF_8));
        JSONObject pc = new JSONObject().put("id", r.getString("id")).put("name", r.optString("name", "Computer")).put("key", r.getString("key")).put("ip", ip).put("port", port);
        prefs().edit().putString("pc", pc.toString()).apply();
        return pc.getString("name");
    }

    /* ---------- joining records ---------- */
    interface Files { File media(); File voice(); }
    static final class Result { String state; String name; int got, sent; }
    Result sync(String state, String phoneName, Files files) throws Exception {
        JSONObject pc = paired(); if (pc == null) throw new Exception("unpaired");
        byte[] key = android.util.Base64.decode(pc.getString("key"), android.util.Base64.DEFAULT);
        String ip = pc.optString("ip"); int port = pc.optInt("port", TCP);
        /* the computer may have a new address since last time: look for it by its id */
        Answer hello;
        JSONObject me = new JSONObject().put("name", phoneName);
        try { hello = ask(ip, port, HELLO, close(key, me.toString().getBytes(StandardCharsets.UTF_8)), 8000); }
        catch (Exception first) {
            JSONArray found = find(1600); String nip = null;
            for (int i = 0; i < found.length(); i++) if (found.getJSONObject(i).optString("id").equals(pc.getString("id"))) { nip = found.getJSONObject(i).getString("ip"); port = found.getJSONObject(i).optInt("port", TCP); }
            if (nip == null) throw new Exception("away");
            ip = nip; pc.put("ip", ip).put("port", port); prefs().edit().putString("pc", pc.toString()).apply();
            hello = ask(ip, port, HELLO, close(key, me.toString().getBytes(StandardCharsets.UTF_8)), 8000);
        }
        if (hello.status == 1) throw new Exception("forgotten");
        if (hello.status != 0) throw new Exception("fail");
        JSONObject theirs = new JSONObject(new String(open(key, hello.body), StandardCharsets.UTF_8));
        Result res = new Result(); res.name = theirs.optString("name", pc.optString("name"));
        /* recordings and the family's files first, so the joined record finds them */
        String[][] kinds = {{"media"}, {"voice"}};
        for (String[] k : kinds) {
            File dir = k[0].equals("media") ? files.media() : files.voice();
            Set<String> there = new HashSet<>(); JSONArray l = theirs.optJSONArray(k[0]); if (l != null) for (int i = 0; i < l.length(); i++) there.add(l.getString(i));
            Set<String> here = new HashSet<>(); File[] fs = dir.listFiles(); if (fs != null) for (File f : fs) if (f.isFile() && !f.getName().endsWith(".tmp")) here.add(f.getName());
            for (String n : here) if (!there.contains(n)) {
                File f = new File(dir, n); if (f.length() > MAX_FILE) continue;
                byte[] head = new JSONObject().put("kind", k[0]).put("name", n).toString().getBytes(StandardCharsets.UTF_8), data = read(f);
                byte[] p = new byte[4 + head.length + data.length]; p[0] = (byte) (head.length >> 24); p[1] = (byte) (head.length >> 16); p[2] = (byte) (head.length >> 8); p[3] = (byte) head.length;
                System.arraycopy(head, 0, p, 4, head.length); System.arraycopy(data, 0, p, 4 + head.length, data.length);
                if (ask(ip, port, PUT, close(key, p), 120000).status == 0) res.sent++;
            }
            for (String n : there) if (!here.contains(n) && safe(n)) {
                Answer a = ask(ip, port, GET, close(key, new JSONObject().put("kind", k[0]).put("name", n).toString().getBytes(StandardCharsets.UTF_8)), 120000);
                if (a.status != 0) continue; byte[] data = open(key, a.body); if (data == null) continue;
                File tmp = new File(dir, n + ".tmp"); try (FileOutputStream o = new FileOutputStream(tmp)) { o.write(data); }
                if (tmp.renameTo(new File(dir, n))) res.got++; else tmp.delete();
            }
        }
        Answer s = ask(ip, port, SYNC, close(key, state.getBytes(StandardCharsets.UTF_8)), 90000);
        if (s.status != 0) throw new Exception("fail");
        byte[] merged = open(key, s.body); if (merged == null) throw new Exception("fail");
        res.state = new String(merged, StandardCharsets.UTF_8);
        prefs().edit().putLong("last", System.currentTimeMillis()).apply();
        return res;
    }
    long last() { return prefs().getLong("last", 0); }

    private static boolean safe(String n) { return n != null && !n.isEmpty() && !n.contains("/") && !n.contains("\\") && !n.contains("..") && n.length() < 120; }
    private static byte[] read(File f) throws Exception { try (InputStream in = new java.io.FileInputStream(f)) { ByteArrayOutputStream b = new ByteArrayOutputStream(); byte[] buf = new byte[65536]; int n; while ((n = in.read(buf)) > 0) b.write(buf, 0, n); return b.toByteArray(); } }
    private static String hex(byte[] b) { StringBuilder s = new StringBuilder(); for (byte x : b) s.append(String.format("%02x", x)); return s.toString(); }
}
