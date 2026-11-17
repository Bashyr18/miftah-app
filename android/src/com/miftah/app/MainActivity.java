package com.miftah.app;

import android.Manifest;
import android.app.Activity;
import android.appwidget.AppWidgetManager;
import android.content.ActivityNotFoundException;
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.AssetFileDescriptor;
import android.content.res.Configuration;
import android.graphics.Color;
import android.media.MediaRecorder;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Miftāḥ native shell.
 *  - The bundled app, its recitations and any parent recordings are served from the reserved origin
 *    https://appassets.androidplatform.net/ by request interception. No INTERNET permission: nothing ever leaves the phone.
 *  - File and content access are off; external links go to the system browser.
 *  - The bridge adds what a page cannot: the device voice, the microphone, haptics, backup, the widget and the reminder.
 */
public class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String URL = "https://" + HOST + "/index.html";
    private static final int REQ_MIC = 13, REQ_NOTIF = 12, REQ_EXPORT = 21, REQ_IMPORT = 22, REQ_FAMILY = 23;
    private static final int REQ_MEDIA = 77;

    private WebView web;
    private FrameLayout root;
    private boolean loaded;
    private volatile boolean ready;
    private String pendingRoute, pendingExport, pendingFamily;
    private Uri pendingImport;
    private final Handler ui = new Handler(Looper.getMainLooper());
    private TextToSpeech tts;
    private volatile boolean ttsReady;
    private String ttsLang = "";
    private MediaRecorder rec;
    private File recTmp, recDst;
    private static final Map<String, String> MIME = new HashMap<>();
    static {
        MIME.put("html", "text/html"); MIME.put("css", "text/css"); MIME.put("js", "application/javascript");
        MIME.put("json", "application/json"); MIME.put("woff2", "font/woff2"); MIME.put("svg", "image/svg+xml"); MIME.put("png", "image/png"); MIME.put("webp", "image/webp");
        MIME.put("mp3", "audio/mpeg"); MIME.put("m4a", "audio/mp4"); MIME.put("ogg", "audio/ogg");
    }

    @Override
    protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        takeFamilyFile(getIntent());
        getWindow().setStatusBarColor(Color.TRANSPARENT);
        getWindow().setNavigationBarColor(Color.TRANSPARENT);
        if (Build.VERSION.SDK_INT >= 29) { getWindow().setNavigationBarContrastEnforced(false); getWindow().setStatusBarContrastEnforced(false); }
        if (Build.VERSION.SDK_INT >= 30) getWindow().setDecorFitsSystemWindows(false);
        else getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
        if (Build.VERSION.SDK_INT >= 28) getWindow().getAttributes().layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;

        root = new FrameLayout(this);
        web = new WebView(this);
        /* the theme the page last chose, so the first frame matches it; the system's night setting only on the very first launch */
        String last = getSharedPreferences("m", MODE_PRIVATE).getString("theme", isNight() ? "dark" : "light");
        int bg = "dark".equals(last) ? 0xFF07080D : 0xFFF6EFE0;
        root.setBackgroundColor(bg); web.setBackgroundColor(bg);
        root.addView(web, new FrameLayout.LayoutParams(-1, -1));
        setContentView(root);
        final long t0 = android.os.SystemClock.uptimeMillis();
        root.getViewTreeObserver().addOnPreDrawListener(new android.view.ViewTreeObserver.OnPreDrawListener() {
            @Override public boolean onPreDraw() {
                if (!ready && android.os.SystemClock.uptimeMillis() - t0 < 1500) return false;
                root.getViewTreeObserver().removeOnPreDrawListener(this);
                return true;
            }
        });
        web.setRendererPriorityPolicy(WebView.RENDERER_PRIORITY_IMPORTANT, true);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        s.setMediaPlaybackRequiresUserGesture(false);   /* a recitation must be able to begin as a lesson step opens */
        s.setSupportMultipleWindows(false);
        s.setJavaScriptCanOpenWindowsAutomatically(false);
        s.setTextZoom(Math.round(Math.max(1f, Math.min(1.25f, getResources().getConfiguration().fontScale)) * 100));
        s.setUseWideViewPort(true);    /* the page's viewport is honoured: on a tablet it lays out a little smaller and is shown larger (js/core/form.js) */
        s.setLoadWithOverviewMode(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setGeolocationEnabled(false);
        if (Build.VERSION.SDK_INT >= 29) s.setForceDark(WebSettings.FORCE_DARK_OFF);
        if (Build.VERSION.SDK_INT >= 33) s.setAlgorithmicDarkeningAllowed(false);
        WebView.setWebContentsDebuggingEnabled((getApplicationInfo().flags & android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setVerticalScrollBarEnabled(false);
        web.addJavascriptInterface(new Bridge(), "AndroidBridge");

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                if (HOST.equals(u.getHost())) return asset(u.getPath());
                if (videoHost(u.getHost()) || simHost(u.getHost())) return null;   /* only a video or simulation a grown-up added ever reaches the network */
                return blocked();
            }
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                if (HOST.equals(u.getHost())) return false;
                if (!r.isForMainFrame() && videoHost(u.getHost())) return false;
                if (videoHost(u.getHost()) || "youtube.com".equals(u.getHost())) return true;   /* no way out of the player to the site */
                external(u);
                return true;
            }
            @Override
            public void onPageFinished(WebView v, String url) {
                loaded = true;
                pushInsets(); pushScreen();
                if (pendingRoute != null) { js("__native.onRoute(" + JSONObject.quote(pendingRoute) + ")"); pendingRoute = null; }
                if (pendingImport != null) { final Uri pi = pendingImport; pendingImport = null; new Thread(() -> readImport(pi, true)).start(); }
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public void onPermissionRequest(PermissionRequest r) { r.deny(); }
        });
        root.setOnApplyWindowInsetsListener((v, ins) -> { lastInsets = ins; pushInsets(); return ins; });
        root.addOnLayoutChangeListener((v, l, t, r, b, ol, ot, or, ob) -> { if (r - l != or - ol || b - t != ob - ot) pushScreen(); });
        watchFold();

        String route = routeOf(getIntent());
        if (saved == null) web.loadUrl(URL + (route != null ? route : ""));
        else web.restoreState(saved);
        Reminder.schedule(this);
    }

    private static boolean simHost(String h) {
        return "cdn.tailwindcss.com".equals(h) || "cdnjs.cloudflare.com".equals(h) || "cdn.jsdelivr.net".equals(h) || "unpkg.com".equals(h) || "fonts.googleapis.com".equals(h) || "fonts.gstatic.com".equals(h);
    }
    private static boolean videoHost(String h) {
        if (h == null) return false;
        return h.equals("www.youtube-nocookie.com") || h.equals("youtube-nocookie.com") || h.endsWith(".youtube.com") || h.endsWith(".ytimg.com") || h.endsWith(".googlevideo.com") || h.endsWith(".ggpht.com") || h.equals("www.gstatic.com") || h.equals("jnn-pa.googleapis.com");
    }

    /* ---------- printing: the phone's own print service, which can also save a PDF ---------- */
    private void printNow(String name) {
        android.print.PrintManager pm = (android.print.PrintManager) getSystemService(PRINT_SERVICE);
        if (pm == null) { toast("Printing is not available"); return; }
        android.print.PrintAttributes a = new android.print.PrintAttributes.Builder().setMediaSize(android.print.PrintAttributes.MediaSize.ISO_A4).build();
        pm.print(name, web.createPrintDocumentAdapter(name), a);
    }

    /* ---------- the family's own files, kept inside the app ---------- */
    private File mediaDir() { File d = new File(getFilesDir(), "media"); if (!d.exists()) d.mkdirs(); return d; }
    private void mediaImport(Uri uri) {
        new Thread(() -> {
            try {
                String type = getContentResolver().getType(uri); if (type == null) type = "";
                String kind = type.startsWith("video/") ? "video" : type.startsWith("audio/") ? "audio" : type.startsWith("image/") ? "image" : type.contains("html") ? "html" : null;
                if (kind == null) { ui.post(() -> toast("That kind of file cannot be used")); return; }
                String name = "file";
                try (android.database.Cursor c = getContentResolver().query(uri, null, null, null, null)) {
                    if (c != null && c.moveToFirst()) { int ix = c.getColumnIndex(android.provider.OpenableColumns.DISPLAY_NAME); if (ix >= 0) name = c.getString(ix); }
                }
                String ext = android.webkit.MimeTypeMap.getSingleton().getExtensionFromMimeType(type); if (ext == null) ext = "bin";
                String ref = "m" + Long.toString(System.currentTimeMillis(), 36) + "." + ext;
                try (java.io.InputStream in = getContentResolver().openInputStream(uri); java.io.OutputStream out = new java.io.FileOutputStream(new File(mediaDir(), ref))) {
                    byte[] b = new byte[65536]; int n; while ((n = in.read(b)) > 0) out.write(b, 0, n);
                }
                final String fk = kind, fn = name;
                ui.post(() -> js("__native.onMediaPicked(" + JSONObject.quote(ref) + "," + JSONObject.quote(fk) + "," + JSONObject.quote(fn) + ")"));
            } catch (Exception e) { ui.post(() -> toast("That file could not be copied")); }
        }).start();
    }
    private WebResourceResponse mediaFile(String path) {
        try {
            String n = path.substring("/media/".length()); if (n.contains("/") || n.contains("..")) return blocked();
            File f = new File(mediaDir(), java.net.URLDecoder.decode(n, "UTF-8")); if (!f.exists()) return blocked();
            String ext = n.substring(n.lastIndexOf('.') + 1), mime = ext.toLowerCase(Locale.US).startsWith("htm") ? "text/html" : android.webkit.MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext); if (mime == null) mime = "application/octet-stream";
            return new WebResourceResponse(mime, null, new java.io.FileInputStream(f));
        } catch (Exception e) { return blocked(); }
    }

    private WindowInsets lastInsets;
    private void pushInsets() {
        if (lastInsets == null || web == null) return;
        float dp = getResources().getDisplayMetrics().density;
        int top, bottom, ime = 0;
        if (Build.VERSION.SDK_INT >= 30) {
            android.graphics.Insets sb = lastInsets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
            android.graphics.Insets im = lastInsets.getInsets(WindowInsets.Type.ime());
            top = sb.top; bottom = sb.bottom; ime = im.bottom;
        } else {
            top = lastInsets.getSystemWindowInsetTop(); bottom = lastInsets.getStableInsetBottom();
            int sys = lastInsets.getSystemWindowInsetBottom(); if (sys > bottom + 100) ime = sys;
        }
        root.setPadding(0, 0, 0, ime > 0 ? ime : 0);
        if (loaded) js("__native.onInsets(" + Math.round(top / dp) + "," + (ime > 0 ? 0 : Math.round(bottom / dp)) + ")");
    }
    /* ---------- the screen's shape: its size in dp, and on a foldable where the hinge is and how far it is open ----------
       The hinge comes from the device's own window extensions (androidx.window.extensions, a shared library on foldables,
       declared optional in the manifest), read by reflection so the app needs no extra library and runs the same elsewhere. */
    private String foldJson = "null";
    private Object foldComponent, foldListener;
    private void pushScreen() {
        if (web == null || !loaded) return;
        float dp = getResources().getDisplayMetrics().density;
        int w = Math.round(web.getWidth() / dp), h = Math.round(web.getHeight() / dp);
        if (w <= 0 || h <= 0) return;
        js("window.__native.onScreen&&__native.onScreen(" + w + "," + h + "," + JSONObject.quote(foldJson) + ")");
    }
    private void watchFold() {
        try {
            Object ext = Class.forName("androidx.window.extensions.WindowExtensionsProvider").getMethod("getWindowExtensions").invoke(null);
            Object comp = ext.getClass().getMethod("getWindowLayoutComponent").invoke(ext);
            for (java.lang.reflect.Method m : comp.getClass().getMethods()) {
                if (!m.getName().equals("addWindowLayoutInfoListener") || m.getParameterTypes().length != 2) continue;
                Class<?> first = m.getParameterTypes()[0], cb = m.getParameterTypes()[1];
                if (!first.isAssignableFrom(Activity.class) || !cb.isInterface()) continue;
                Object listener = java.lang.reflect.Proxy.newProxyInstance(cb.getClassLoader(), new Class<?>[]{cb}, (proxy, method, args) -> {
                    if ("accept".equals(method.getName()) && args != null && args.length == 1) { onFold(args[0]); return null; }
                    if ("hashCode".equals(method.getName())) return System.identityHashCode(proxy);
                    if ("equals".equals(method.getName())) return proxy == args[0];
                    if ("toString".equals(method.getName())) return "MiftahFold";
                    return null;
                });
                m.invoke(comp, this, listener);
                foldComponent = comp; foldListener = listener;
                return;
            }
        } catch (Throwable e) { /* not a foldable, or extensions not offered: the page works from its size alone */ }
    }
    private void onFold(Object info) {
        String out = "null";
        try {
            java.util.List<?> feats = (java.util.List<?>) info.getClass().getMethod("getDisplayFeatures").invoke(info);
            float dp = getResources().getDisplayMetrics().density;
            int[] at = new int[2]; if (web != null) web.getLocationInWindow(at);
            for (Object f : feats) {
                if (!f.getClass().getName().endsWith("FoldingFeature")) continue;
                android.graphics.Rect b = (android.graphics.Rect) f.getClass().getMethod("getBounds").invoke(f);
                int state = (Integer) f.getClass().getMethod("getState").invoke(f);
                boolean vertical = b.height() > b.width();
                JSONObject o = new JSONObject();
                o.put("state", state); o.put("vertical", vertical);
                o.put("l", Math.round((b.left - at[0]) / dp)); o.put("r", Math.round((b.right - at[0]) / dp));
                o.put("t", Math.round((b.top - at[1]) / dp)); o.put("b", Math.round((b.bottom - at[1]) / dp));
                out = o.toString(); break;
            }
        } catch (Throwable e) { out = "null"; }
        final String j = out;
        ui.post(() -> { foldJson = j; pushScreen(); });
    }
    private void unwatchFold() {
        if (foldComponent == null) return;
        try {
            for (java.lang.reflect.Method m : foldComponent.getClass().getMethods())
                if (m.getName().equals("removeWindowLayoutInfoListener") && m.getParameterTypes().length == 1 && m.getParameterTypes()[0].isInstance(foldListener)) { m.invoke(foldComponent, foldListener); break; }
        } catch (Throwable e) { }
        foldComponent = null; foldListener = null;
    }
    private boolean isNight() { return (getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES; }

    private String routeOf(Intent i) {
        if (i == null) return null;
        Uri d = i.getData();
        if (d != null && "miftah".equals(d.getScheme()) && "route".equals(d.getHost())) {
            String p = d.getPath() == null ? "" : d.getPath();
            return "#/" + p.replaceFirst("^/+", "");
        }
        return null;
    }
    @Override
    protected void onNewIntent(Intent i) {
        super.onNewIntent(i);
        if (takeFamilyFile(i)) return;
        String r = routeOf(i);
        if (r == null) return;
        if (loaded) js("__native.onRoute(" + JSONObject.quote(r) + ")"); else pendingRoute = r;
    }

    /* ---------- recordings that do not ship with the app: fetched once from their source, then kept ---------- */
    private File audioDir() { File d = new File(getFilesDir(), "audio"); d.mkdirs(); return d; }
    private static String audioSource(String rel) {
        if (!rel.matches("(h|a|w)/[0-9_]+\\.mp3")) return null;
        String f = rel.substring(2);
        switch (rel.charAt(0)) {
            case 'h': return "https://everyayah.com/data/Husary_Muallim_128kbps/" + f;
            case 'a': return "https://everyayah.com/data/Alafasy_128kbps/" + f;
            default: return "https://verses.quran.com/wbw/" + f;
        }
    }
    private File cachedAudio(String rel) {
        String src = audioSource(rel); if (src == null) return null;
        File f = new File(audioDir(), rel.replace('/', '_'));
        if (f.isFile() && f.length() > 0) return f;
        File tmp = new File(audioDir(), rel.replace('/', '_') + "." + Thread.currentThread().getId() + ".part");
        /* word audio has two published hosts: if one is down, the other */
        String[] from = rel.charAt(0) == 'w' ? new String[]{src, "https://audio.qurancdn.com/wbw/" + rel.substring(2)} : new String[]{src};
        for (String u : from) {
            try {
                java.net.HttpURLConnection c = (java.net.HttpURLConnection) new java.net.URL(u).openConnection();
                c.setConnectTimeout(7000); c.setReadTimeout(30000); c.setRequestProperty("User-Agent", "Miftah");
                if (c.getResponseCode() != 200) { c.disconnect(); continue; }
                try (InputStream in = c.getInputStream(); FileOutputStream out = new FileOutputStream(tmp)) { byte[] b = new byte[32768]; int n; while ((n = in.read(b)) > 0) out.write(b, 0, n); }
                c.disconnect();
                if (tmp.length() > 0 && tmp.renameTo(f)) return f;
                tmp.delete(); if (f.isFile()) return f;
            } catch (Exception e) { tmp.delete(); }
        }
        return null;
    }
    private final java.util.concurrent.ExecutorService audioPool = java.util.concurrent.Executors.newFixedThreadPool(3);

    /* ---------- the asset server ---------- */
    private WebResourceResponse asset(String path) {
        if (path != null && path.startsWith("/media/")) return mediaFile(path);
        try {
            if (path == null || path.isEmpty() || path.equals("/")) path = "/index.html";
            String clean = path.replaceFirst("^/+", "");
            if (clean.contains("..") || clean.contains("\\")) return blocked();
            String ext = clean.substring(clean.lastIndexOf('.') + 1).toLowerCase(Locale.US);
            String mime = MIME.containsKey(ext) ? MIME.get(ext) : "application/octet-stream";
            InputStream is; long len = -1;
            if (clean.startsWith("voice/")) {
                File f = new File(voiceDir(), clean.substring(6));
                if (!f.isFile() || !f.getCanonicalPath().startsWith(voiceDir().getCanonicalPath())) return blocked();
                is = new FileInputStream(f); len = f.length();
            } else if (clean.startsWith("audio/") && ext.equals("mp3")) {
                File f = cachedAudio(clean.substring(6)); if (f == null) return blocked();
                is = new FileInputStream(f); len = f.length();
            } else {
                is = getAssets().open("www/" + clean);
            }
            Map<String, String> h = new HashMap<>();
            h.put("Cache-Control", len < 0 && (clean.startsWith("img/") || clean.startsWith("fonts/") || clean.startsWith("audio/")) ? "public, max-age=31536000, immutable" : "no-cache");
            h.put("X-Content-Type-Options", "nosniff");
            if (len >= 0) h.put("Content-Length", String.valueOf(len));
            return new WebResourceResponse(mime, mime.startsWith("text") || ext.equals("js") || ext.equals("json") ? "utf-8" : null, 200, "OK", h, is);
        } catch (IOException e) { return blocked(); }
    }
    private WebResourceResponse blocked() {
        return new WebResourceResponse("text/plain", "utf-8", 404, "Not Found", Collections.<String, String>emptyMap(), new ByteArrayInputStream(new byte[0]));
    }
    private void external(Uri u) {
        String sc = u.getScheme() == null ? "" : u.getScheme().toLowerCase(Locale.US);
        if (!(sc.equals("https") || sc.equals("http") || sc.equals("mailto"))) return;
        try { startActivity(new Intent(sc.equals("mailto") ? Intent.ACTION_SENDTO : Intent.ACTION_VIEW, u).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)); }
        catch (ActivityNotFoundException e) { toast("No app can open this link"); }
    }

    /* ---------- lifecycle ---------- */
    @Override protected void onResume() { super.onResume(); if (loaded) js("__native.onResume&&__native.onResume()"); }
    @Override protected void onPause() { stopRecording(); if (web != null) js("window.Voice&&Voice.stop()"); super.onPause(); }
    @Override protected void onSaveInstanceState(Bundle out) { super.onSaveInstanceState(out); if (web != null) web.saveState(out); }
    @Override protected void onDestroy() { unwatchFold(); stopRecording(); if (tts != null) { tts.shutdown(); tts = null; } if (web != null) { web.destroy(); web = null; } super.onDestroy(); }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        if (!loaded || web == null) { super.onBackPressed(); return; }
        web.evaluateJavascript("(window.__native&&__native.onBack)?__native.onBack():'exit'", v -> { if (v == null || v.contains("exit")) moveTaskToBack(true); });
    }

    private void js(final String code) {
        if (web == null) return;
        ui.post(() -> { if (web != null) web.evaluateJavascript("try{" + code + "}catch(e){}", null); });
    }
    /* ---------- updates ---------- */
    private static final String UPD_FROM = "https://github.com/Bashyr18/miftah-app/releases/";
    private static final String UPD_INFO = UPD_FROM + "latest/download/version.json";
    private final java.util.concurrent.ExecutorService updPool = java.util.concurrent.Executors.newSingleThreadExecutor();
    private static String jsq(String s) { return s == null ? "null" : org.json.JSONObject.quote(s); }
    private java.net.HttpURLConnection updOpen(String u) throws java.io.IOException {
        java.net.HttpURLConnection c = (java.net.HttpURLConnection) new java.net.URL(u).openConnection();
        c.setConnectTimeout(10000); c.setReadTimeout(60000); c.setRequestProperty("User-Agent", "Miftah"); c.setInstanceFollowRedirects(true);
        return c;
    }
    /** reads version.json from the latest release and says what this build is; the page decides what to show */
    private void updCheck() {
        String res = null;
        try {
            java.net.HttpURLConnection c = updOpen(UPD_INFO);
            if (c.getResponseCode() == 200) {
                java.io.ByteArrayOutputStream bo = new java.io.ByteArrayOutputStream();
                try (InputStream in = c.getInputStream()) { byte[] b = new byte[8192]; int n; while ((n = in.read(b)) > 0 && bo.size() < 65536) bo.write(b, 0, n); }
                android.content.pm.PackageInfo pi = getPackageManager().getPackageInfo(getPackageName(), 0);
                org.json.JSONObject cur = new org.json.JSONObject();
                cur.put("name", pi.versionName); cur.put("code", Build.VERSION.SDK_INT >= 28 ? pi.getLongVersionCode() : pi.versionCode);
                org.json.JSONObject o = new org.json.JSONObject(); o.put("latest", new org.json.JSONObject(bo.toString("UTF-8"))); o.put("current", cur);
                res = o.toString();
            }
            c.disconnect();
        } catch (Exception ignored) { }
        js("window.Upd&&Upd.onCheck(" + jsq(res) + ")");
    }
    private static String sha256(File f) throws Exception {
        java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
        try (InputStream in = new java.io.FileInputStream(f)) { byte[] b = new byte[65536]; int n; while ((n = in.read(b)) > 0) md.update(b, 0, n); }
        StringBuilder sb = new StringBuilder(); for (byte x : md.digest()) sb.append(String.format(Locale.US, "%02x", x)); return sb.toString();
    }
    /** downloads the new APK, checks its SHA-256, and hands it to the system installer (which also checks the signing key) */
    private void updInstall(String url, String sha) {
        File dir = new File(getCacheDir(), "share"); dir.mkdirs();
        File f = new File(dir, "Miftah-update.apk"), tmp = new File(dir, "Miftah-update.apk.part");
        try {
            if (!(f.isFile() && sha.equals(sha256(f)))) {
                f.delete();
                java.net.HttpURLConnection c = updOpen(url);
                if (c.getResponseCode() != 200) throw new java.io.IOException("http " + c.getResponseCode());
                long total = c.getContentLength(), got = 0; int last = -1;
                try (InputStream in = c.getInputStream(); FileOutputStream out = new FileOutputStream(tmp)) {
                    byte[] b = new byte[65536]; int n;
                    while ((n = in.read(b)) > 0) {
                        out.write(b, 0, n); got += n;
                        int pc = total > 0 ? (int) (got * 100 / total) : 0;
                        if (pc != last) { last = pc; js("window.Upd&&Upd.onProgress(" + (pc / 100.0) + ")"); }
                    }
                }
                c.disconnect();
                if (!sha.equals(sha256(tmp))) { tmp.delete(); js("window.Upd&&Upd.onDone('checksum')"); return; }
                if (!tmp.renameTo(f)) throw new java.io.IOException("rename");
            }
            ui.post(this::updHandOver);
        } catch (Exception e) { tmp.delete(); js("window.Upd&&Upd.onDone('failed')"); }
    }
    private void updHandOver() {
        try {
            if (Build.VERSION.SDK_INT >= 26 && !getPackageManager().canRequestPackageInstalls()) {
                startActivity(new Intent(android.provider.Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, android.net.Uri.parse("package:" + getPackageName())));
                js("window.Upd&&Upd.onDone('allow')"); return;
            }
            Intent i = new Intent(Intent.ACTION_VIEW).setDataAndType(android.net.Uri.parse("content://com.miftah.app.share/Miftah-update.apk"), "application/vnd.android.package-archive")
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(i);
            js("window.Upd&&Upd.onDone('ok')");
        } catch (Exception e) { js("window.Upd&&Upd.onDone('failed')"); }
    }
    private void toast(String s) { ui.post(() -> Toast.makeText(this, s, Toast.LENGTH_SHORT).show()); }

    /* ---------- the device voice ---------- */
    private void ensureTts(Runnable then) {
        if (tts != null && ttsReady) { then.run(); return; }
        if (tts == null) {
            tts = new TextToSpeech(getApplicationContext(), status -> {
                ttsReady = status == TextToSpeech.SUCCESS;
                if (ttsReady) {
                    tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                        @Override public void onStart(String id) { }
                        @Override public void onDone(String id) { js("__native.onSpeakEnd&&__native.onSpeakEnd()"); }
                        @Override public void onError(String id) { js("__native.onSpeakEnd&&__native.onSpeakEnd()"); }
                    });
                    then.run();
                } else js("__native.onSpeakEnd&&__native.onSpeakEnd()");
            });
        }
    }
    private void speakNow(String text, String lang, float rate) {
        ensureTts(() -> {
            Locale l = "ar".equals(lang) ? new Locale("ar") : Locale.UK;
            int ok = tts.isLanguageAvailable(l);
            if (ok < TextToSpeech.LANG_AVAILABLE && !"ar".equals(lang)) { l = Locale.US; ok = tts.isLanguageAvailable(l); }
            if (ok < TextToSpeech.LANG_AVAILABLE) { js("__native.onSpeakEnd&&__native.onSpeakEnd()"); return; }
            if (!lang.equals(ttsLang)) { tts.setLanguage(l); ttsLang = lang; }
            tts.setSpeechRate(Math.max(.6f, Math.min(1.3f, rate * .92f)));
            tts.setPitch(1.05f);
            Bundle b = new Bundle(); b.putInt(TextToSpeech.Engine.KEY_PARAM_STREAM, android.media.AudioManager.STREAM_MUSIC);
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, b, "m" + System.currentTimeMillis());
        });
    }

    /* ---------- the microphone: only when a parent or child starts it; files never leave the phone ---------- */
    private File voiceDir() { File d = new File(getFilesDir(), "voice"); if (!d.exists()) d.mkdirs(); return d; }
    private static boolean safeKey(String k) { return k != null && k.length() < 80 && !k.contains("/") && !k.contains("\\") && !k.contains(".."); }
    private boolean startRecording(String key) {
        if (!safeKey(key)) return false;
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            ui.post(() -> requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, REQ_MIC));
            return false;
        }
        stopRecording();
        try {
            recTmp = new File(voiceDir(), key + ".tmp"); recDst = new File(voiceDir(), key + ".m4a");
            rec = Build.VERSION.SDK_INT >= 31 ? new MediaRecorder(this) : new MediaRecorder();
            rec.setAudioSource(MediaRecorder.AudioSource.MIC);
            rec.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
            rec.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
            rec.setAudioEncodingBitRate(96000);
            rec.setAudioSamplingRate(44100);
            rec.setOutputFile(recTmp.getPath());
            rec.prepare(); rec.start();
            ui.post(() -> getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON));
            return true;
        } catch (Exception e) { stopRecording(); return false; }
    }
    private void stopRecording() {
        if (rec == null) return;
        boolean ok = true;
        try { rec.stop(); } catch (Exception e) { ok = false; }
        try { rec.release(); } catch (Exception ignored) { }
        rec = null;
        ui.post(() -> getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON));
        if (ok && recTmp != null && recTmp.isFile()) { if (recDst.exists()) recDst.delete(); recTmp.renameTo(recDst); }
        else if (recTmp != null) recTmp.delete();
    }

    @Override
    public void onRequestPermissionsResult(int req, String[] perms, int[] res) {
        super.onRequestPermissionsResult(req, perms, res);
        if (req == REQ_NOTIF) Reminder.schedule(this);
        if (req == REQ_MIC) {
            boolean ok = res.length > 0 && res[0] == PackageManager.PERMISSION_GRANTED;
            boolean never = !ok && !shouldShowRequestPermissionRationale(Manifest.permission.RECORD_AUDIO);
            js("window.__native.onMic&&__native.onMic(" + ok + "," + never + ")");
        }
    }
    @Override
    @SuppressWarnings("deprecation")
    protected void onActivityResult(int req, int code, Intent data) {
        super.onActivityResult(req, code, data);
        if (req == REQ_MEDIA) { if (code == RESULT_OK && data != null && data.getData() != null) mediaImport(data.getData()); return; }
        Uri u = data == null ? null : data.getData();
        if (req == REQ_EXPORT) {
            boolean ok = false;
            if (code == RESULT_OK && u != null && pendingExport != null) {
                try (OutputStream os = getContentResolver().openOutputStream(u, "wt")) { os.write(pendingExport.getBytes(StandardCharsets.UTF_8)); ok = true; } catch (Exception ignored) { }
            }
            pendingExport = null;
            js("__native.onExported&&__native.onExported(" + ok + ")");
        } else if (req == REQ_FAMILY) {
            final String json = pendingFamily; pendingFamily = null;
            if (code == RESULT_OK && u != null && json != null) { toast("Saving…"); new Thread(() -> writeFamily(u, json)).start(); }
            else js("__native.onExported&&__native.onExported(false)");
        } else if (req == REQ_IMPORT && code == RESULT_OK && u != null) {
            new Thread(() -> readImport(u, false)).start();
        }
    }

    /* ---------- the family file: the record, with photos, videos, simulations and voice recordings ---------- */
    private void addFiles(java.util.zip.ZipOutputStream z, File dir, String prefix) throws IOException {
        File[] fs = dir.listFiles(); if (fs == null) return; byte[] b = new byte[65536];
        for (File f : fs) {
            if (!f.isFile() || f.getName().endsWith(".tmp")) continue;
            java.util.zip.ZipEntry e = new java.util.zip.ZipEntry(prefix + f.getName()); z.putNextEntry(e);
            try (InputStream in = new FileInputStream(f)) { int n; while ((n = in.read(b)) > 0) z.write(b, 0, n); }
            z.closeEntry();
        }
    }
    private void packFamily(OutputStream os, String json) throws IOException {
        try (java.util.zip.ZipOutputStream z = new java.util.zip.ZipOutputStream(os)) {
            z.putNextEntry(new java.util.zip.ZipEntry("family.json")); z.write(json.getBytes(StandardCharsets.UTF_8)); z.closeEntry();
            addFiles(z, mediaDir(), "media/"); addFiles(z, voiceDir(), "voice/");
        }
    }
    private void writeFamily(Uri u, String json) {
        boolean ok = false;
        try (OutputStream os = getContentResolver().openOutputStream(u, "wt")) { packFamily(os, json); ok = true; } catch (Exception ignored) { }
        final boolean done = ok; ui.post(() -> js("__native.onExported&&__native.onExported(" + done + ")"));
    }
    /* the family file arrives from another device: tapped in a chat, or shared straight to this app */
    private boolean takeFamilyFile(Intent i) {
        if (i == null) return false; Uri u = null; String a = i.getAction();
        if (Intent.ACTION_SEND.equals(a)) u = i.getParcelableExtra(Intent.EXTRA_STREAM);
        else if (Intent.ACTION_VIEW.equals(a) && i.getData() != null && !"miftah".equals(i.getData().getScheme())) u = i.getData();
        if (u == null) return false;
        if (loaded) { final Uri fu = u; new Thread(() -> readImport(fu, true)).start(); } else pendingImport = u;
        return true;
    }
    private void readImport(Uri u, boolean shared) {
        try (InputStream raw = getContentResolver().openInputStream(u); java.io.BufferedInputStream is = new java.io.BufferedInputStream(raw)) {
            is.mark(4); int a = is.read(), b = is.read(); is.reset();
            String json = null; boolean files = false;
            if (a == 'P' && b == 'K') {
                files = true;
                try (java.util.zip.ZipInputStream z = new java.util.zip.ZipInputStream(is)) {
                    java.util.zip.ZipEntry e; byte[] buf = new byte[65536];
                    while ((e = z.getNextEntry()) != null) {
                        String name = e.getName();
                        if (name.equals("family.json") || name.equals("challenge.json")) { java.io.ByteArrayOutputStream bo = new java.io.ByteArrayOutputStream(); int n; while ((n = z.read(buf)) > 0) bo.write(buf, 0, n); json = bo.toString("UTF-8"); continue; }
                        File dir = name.startsWith("media/") ? mediaDir() : name.startsWith("voice/") ? voiceDir() : null;
                        if (dir == null || e.isDirectory()) continue;
                        File dst = new File(dir, name.substring(6));
                        /* a file may only land in its own folder, and never replaces what is here */
                        if (!dst.getCanonicalPath().startsWith(dir.getCanonicalPath() + File.separator) || dst.exists()) continue;
                        try (OutputStream out = new FileOutputStream(dst)) { int n; while ((n = z.read(buf)) > 0) out.write(buf, 0, n); }
                    }
                }
            } else {
                BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
                StringBuilder sb = new StringBuilder(); char[] buf = new char[8192]; int n;
                while ((n = br.read(buf)) > 0) { sb.append(buf, 0, n); if (sb.length() > 30_000_000) break; }
                json = sb.toString();
            }
            if (json == null) { ui.post(() -> toast("Could not read that file")); return; }
            final String j = json; final boolean f = files;
            ui.post(() -> js("__native.onImport(" + JSONObject.quote(j) + "," + f + "," + shared + ")"));
        } catch (Exception e) { ui.post(() -> toast("Could not read that file")); }
    }

    /* ---------- the bridge ---------- */
    private Link lan;
    private class Bridge {
        @JavascriptInterface public void ready(final double ms) { if (ready) return; ready = true; ui.post(() -> root.invalidate()); }
        @JavascriptInterface public void saveState(final String json) {
            if (json == null || json.length() > 30_000_000) return;
            new Thread(() -> {
                try {
                    File tmp = new File(getFilesDir(), "state.json.tmp"), dst = new File(getFilesDir(), "state.json");
                    try (FileOutputStream fo = new FileOutputStream(tmp)) { fo.write(json.getBytes(StandardCharsets.UTF_8)); fo.getFD().sync(); }
                    if (!tmp.renameTo(dst)) { dst.delete(); tmp.renameTo(dst); }
                    File dir = new File(getFilesDir(), "daily"); dir.mkdirs();
                    File today = new File(dir, new java.text.SimpleDateFormat("yyyyMMdd", Locale.US).format(new java.util.Date()) + ".json");
                    if (!today.exists()) {
                        try (FileOutputStream fo = new FileOutputStream(today)) { fo.write(json.getBytes(StandardCharsets.UTF_8)); }
                        File[] all = dir.listFiles();
                        if (all != null && all.length > 30) { java.util.Arrays.sort(all); for (int i = 0; i < all.length - 30; i++) all[i].delete(); }
                    }
                } catch (Exception ignored) { }
            }).start();
        }
        @JavascriptInterface public String loadState() {
            File f = new File(getFilesDir(), "state.json");
            if (!f.exists()) return null;
            try (InputStream is = new FileInputStream(f)) {
                java.io.ByteArrayOutputStream bo = new java.io.ByteArrayOutputStream(); byte[] b = new byte[16384]; int n;
                while ((n = is.read(b)) > 0) bo.write(b, 0, n);
                return new String(bo.toByteArray(), StandardCharsets.UTF_8);
            } catch (Exception e) { return null; }
        }
        /* ---------- updates: only when a grown-up asks (web/js/core/update.js) ---------- */
        @JavascriptInterface public boolean updateCheck() { updPool.execute(MainActivity.this::updCheck); return true; }
        @JavascriptInterface public boolean updateInstall(String url, String sha) {
            if (url == null || sha == null || !url.startsWith(UPD_FROM) || !sha.matches("[0-9a-fA-F]{64}")) return false;
            updPool.execute(() -> updInstall(url, sha.toLowerCase(Locale.US))); return true;
        }
        @JavascriptInterface public String version() { try { return getPackageManager().getPackageInfo(getPackageName(), 0).versionName; } catch (Exception e) { return "android"; } }
        @JavascriptInterface public void haptic(String k) {
            Vibrator vb = getSystemService(Vibrator.class);
            if (vb == null || !vb.hasVibrator()) return;
            try {
                VibrationEffect ef;
                if ("success".equals(k)) ef = VibrationEffect.createWaveform(new long[]{0, 14, 70, 22}, new int[]{0, 140, 0, 220}, -1);
                else if (Build.VERSION.SDK_INT >= 29) ef = VibrationEffect.createPredefined("heavy".equals(k) ? VibrationEffect.EFFECT_HEAVY_CLICK : "click".equals(k) ? VibrationEffect.EFFECT_CLICK : VibrationEffect.EFFECT_TICK);
                else ef = VibrationEffect.createOneShot("heavy".equals(k) ? 30 : "click".equals(k) ? 16 : 8, VibrationEffect.DEFAULT_AMPLITUDE);
                vb.vibrate(ef);
            } catch (Exception ignored) { }
        }
        /* the page's theme, kept for the next launch's first frame (the bars alone can't tell: the sky screens use dark bars in either theme) */
        @JavascriptInterface public String lastTheme() { return getSharedPreferences("m", MODE_PRIVATE).getString("theme", ""); }
        @JavascriptInterface public void rememberTheme(String t) { if ("light".equals(t) || "dark".equals(t)) getSharedPreferences("m", MODE_PRIVATE).edit().putString("theme", t).apply(); }
        @JavascriptInterface public void setSystemBars(final boolean light) {
            ui.post(() -> {
                int bg = light ? 0xFFF6EFE0 : 0xFF07080D;
                root.setBackgroundColor(bg); if (web != null) web.setBackgroundColor(bg);
                if (Build.VERSION.SDK_INT >= 30) {
                    WindowInsetsController c = getWindow().getInsetsController();
                    if (c != null) c.setSystemBarsAppearance(light ? WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS : 0, WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS);
                } else {
                    int f = View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION;
                    if (light) f |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
                    getWindow().getDecorView().setSystemUiVisibility(f);
                }
            });
        }
        /* voice */
        @JavascriptInterface public void speak(String text, String lang, double rate) { if (text != null) ui.post(() -> speakNow(text, lang, (float) rate)); }
        @JavascriptInterface public void speakStop() { ui.post(() -> { if (tts != null) tts.stop(); }); }
        @JavascriptInterface public boolean recStart(String key) { return startRecording(key); }
        @JavascriptInterface public boolean micAllowed() { return checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED; }
        @JavascriptInterface public void openAppSettings() { ui.post(() -> { try { startActivity(new Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + getPackageName()))); } catch (Exception ignored) { } }); }
        @JavascriptInterface public void recStop() { stopRecording(); }
        @JavascriptInterface public void audioKeep(final String json) {
            try {
                JSONArray a = new JSONArray(json); final int total = a.length(); final java.util.concurrent.atomic.AtomicInteger done = new java.util.concurrent.atomic.AtomicInteger(), bad = new java.util.concurrent.atomic.AtomicInteger();
                for (int i = 0; i < total; i++) {
                    final String rel = a.getString(i);
                    audioPool.execute(() -> {
                        if (cachedAudio(rel) == null) bad.incrementAndGet();
                        int d = done.incrementAndGet();
                        if (d == total || d % 20 == 0) ui.post(() -> js("window.__native.onAudioKeep&&__native.onAudioKeep(" + d + "," + total + "," + bad.get() + ")"));
                    });
                }
            } catch (Exception ignored) { }
        }
        @JavascriptInterface public String audioStats() {
            long bytes = 0; int n = 0; File[] fs = audioDir().listFiles();
            if (fs != null) for (File f : fs) { bytes += f.length(); n++; }
            return "{\"bytes\":" + bytes + ",\"files\":" + n + "}";
        }
        @JavascriptInterface public void audioClear() { File[] fs = audioDir().listFiles(); if (fs != null) for (File f : fs) f.delete(); }
        @JavascriptInterface public String voiceList() {
            JSONArray a = new JSONArray(); File[] fs = voiceDir().listFiles();
            if (fs != null) for (File f : fs) if (f.getName().endsWith(".m4a")) a.put(f.getName().substring(0, f.getName().length() - 4));
            return a.toString();
        }
        /* the widget and the reminder read this */
        @JavascriptInterface public void sync(String json) {
            getSharedPreferences("m", MODE_PRIVATE).edit().putString("config", json).apply();
            new Thread(() -> { Reminder.schedule(MainActivity.this); PathWidget.refresh(MainActivity.this); }).start();
        }
        @JavascriptInterface public boolean requestNotifications() {
            if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) { ui.post(() -> requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, REQ_NOTIF)); return false; }
            return true;
        }
        @JavascriptInterface public boolean pinWidget() {
            AppWidgetManager m = getSystemService(AppWidgetManager.class);
            return m != null && m.isRequestPinAppWidgetSupported() && m.requestPinAppWidget(new ComponentName(MainActivity.this, PathWidget.class), null, null);
        }
        @JavascriptInterface public void exportFile(String name, String text) {
            pendingExport = text;
            boolean html = name != null && name.endsWith(".html");
            Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType(html ? "text/html" : "application/json").putExtra(Intent.EXTRA_TITLE, name);
            ui.post(() -> { try { startActivityForResult(i, REQ_EXPORT); } catch (Exception e) { toast("No file manager available"); } });
        }
        @JavascriptInterface public void shareFamily(final String json) {
            new Thread(() -> {
                try {
                    File dir = new File(getCacheDir(), "share"); dir.mkdirs();
                    File f = new File(dir, "Miftah-family.zip");
                    try (OutputStream os = new FileOutputStream(f)) { packFamily(os, json); }
                    Uri u = Uri.parse("content://" + getPackageName() + ".share/Miftah-family.zip");
                    Intent send = new Intent(Intent.ACTION_SEND).setType("application/zip").putExtra(Intent.EXTRA_STREAM, u).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    ui.post(() -> { try { startActivity(Intent.createChooser(send, "Send to my other device")); } catch (Exception e) { toast("No way to share on this device"); } });
                } catch (Exception e) { ui.post(() -> toast("Could not prepare the file")); }
            }).start();
        }
        /* a picture for a homeschool group: the weekly card or a challenge result, made by the page, shared as a PNG with a caption */
        @JavascriptInterface public void shareImage(final String b64, final String caption, final String name) {
            new Thread(() -> {
                try {
                    File dir = new File(getCacheDir(), "share"); dir.mkdirs();
                    String n = (name == null || !name.matches("[A-Za-z0-9._-]{1,60}\\.png")) ? "Miftah-card.png" : name;
                    File f = new File(dir, n);
                    try (OutputStream os = new FileOutputStream(f)) { os.write(android.util.Base64.decode(b64, android.util.Base64.DEFAULT)); }
                    Uri u = Uri.parse("content://" + getPackageName() + ".share/" + n);
                    Intent send = new Intent(Intent.ACTION_SEND).setType("image/png").putExtra(Intent.EXTRA_STREAM, u).putExtra(Intent.EXTRA_TEXT, caption == null ? "" : caption).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    ui.post(() -> { try { startActivity(Intent.createChooser(send, "Share to my group")); } catch (Exception e) { toast("No way to share on this device"); } });
                } catch (Exception e) { ui.post(() -> toast("Could not prepare the picture")); }
            }).start();
        }
        /* a challenge pack: a tiny file, zipped like the family file so it opens with Miftah when tapped in a chat */
        @JavascriptInterface public void shareChallenge(final String json, final String caption) {
            new Thread(() -> {
                try {
                    File dir = new File(getCacheDir(), "share"); dir.mkdirs();
                    File f = new File(dir, "Miftah-challenge.zip");
                    try (java.util.zip.ZipOutputStream z = new java.util.zip.ZipOutputStream(new FileOutputStream(f))) { z.putNextEntry(new java.util.zip.ZipEntry("challenge.json")); z.write(json.getBytes(StandardCharsets.UTF_8)); z.closeEntry(); }
                    Uri u = Uri.parse("content://" + getPackageName() + ".share/Miftah-challenge.zip");
                    Intent send = new Intent(Intent.ACTION_SEND).setType("application/zip").putExtra(Intent.EXTRA_STREAM, u).putExtra(Intent.EXTRA_TEXT, caption == null ? "" : caption).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    ui.post(() -> { try { startActivity(Intent.createChooser(send, "Send to my group")); } catch (Exception e) { toast("No way to share on this device"); } });
                } catch (Exception e) { ui.post(() -> toast("Could not prepare the file")); }
            }).start();
        }
        @JavascriptInterface public void exportFamily(String name, String json) {
            pendingFamily = json;
            Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("application/zip").putExtra(Intent.EXTRA_TITLE, name);
            ui.post(() -> { try { startActivityForResult(i, REQ_FAMILY); } catch (Exception e) { toast("No file manager available"); } });
        }
        @JavascriptInterface public boolean printPage(String name) { ui.post(() -> { try { printNow(name); } catch (Exception e) { toast("Printing is not available"); } }); return true; }
        @JavascriptInterface public boolean mediaPickType(String mime) {
            Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType(mime == null || mime.isEmpty() ? "*/*" : mime);
            ui.post(() -> { try { startActivityForResult(i, REQ_MEDIA); } catch (Exception e) { toast("No file manager available"); } });
            return true;
        }
        @JavascriptInterface public boolean mediaPick() {
            Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("*/*").putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"video/*", "audio/*", "image/*", "text/html"});
            ui.post(() -> { try { startActivityForResult(i, REQ_MEDIA); } catch (Exception e) { toast("No file manager available"); } });
            return true;
        }
        @JavascriptInterface public void mediaDelete(String ref) { if (ref != null && !ref.contains("/") && !ref.contains("..")) new File(mediaDir(), ref).delete(); }
        @JavascriptInterface public void importFile() {
            Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("*/*").putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/zip", "application/x-zip-compressed", "application/json", "text/plain", "application/octet-stream"});
            ui.post(() -> { try { startActivityForResult(i, REQ_IMPORT); } catch (Exception e) { toast("No file manager available"); } });
        }
        /* ---------- phone and computer, on the home Wi-Fi (see Link.java and windows/src/Link.cs) ---------- */
        private Link link() { if (lan == null) lan = new Link(MainActivity.this); return lan; }
        private String phoneName() { String m = Build.MODEL == null ? "Phone" : Build.MODEL; String b = Build.MANUFACTURER == null ? "" : Build.MANUFACTURER; return (m.toLowerCase(Locale.US).startsWith(b.toLowerCase(Locale.US)) ? m : (b.isEmpty() ? m : b.substring(0, 1).toUpperCase(Locale.US) + b.substring(1) + " " + m)); }
        @JavascriptInterface public String lanInfo() {
            try { JSONObject pc = link().paired(); JSONObject o = new JSONObject().put("paired", pc != null).put("last", link().last()).put("phone", phoneName()); if (pc != null) o.put("name", pc.optString("name")).put("ip", pc.optString("ip")); return o.toString(); }
            catch (Exception e) { return "{}"; }
        }
        @JavascriptInterface public void lanFind() {
            new Thread(() -> { final String r = link().find(2200).toString(); ui.post(() -> js("window.__native.onLanFound&&__native.onLanFound(" + r + ")")); }).start();
        }
        @JavascriptInterface public void lanPair(final String ip, final int port, final String pcId, final String code) {
            new Thread(() -> {
                String name = null, err = null;
                try { name = link().pair(ip, port > 0 ? port : Link.TCP, pcId, code, phoneName()); } catch (Exception e) { err = e.getMessage() == null ? "fail" : e.getMessage(); }
                final String n = name, er = err;
                ui.post(() -> js("window.__native.onLanPaired&&__native.onLanPaired(" + (n != null) + "," + JSONObject.quote(n == null ? "" : n) + "," + JSONObject.quote(er == null ? "" : er) + ")"));
            }).start();
        }
        @JavascriptInterface public void lanSync(final String state, final boolean quiet) {
            if (state == null || state.length() > 30_000_000) return;
            new Thread(() -> {
                Link.Result r = null; String err = null;
                try { r = link().sync(state, phoneName(), new Link.Files() { public File media() { return mediaDir(); } public File voice() { return voiceDir(); } }); }
                catch (Exception e) { err = e.getMessage() == null ? "fail" : e.getMessage(); }
                final Link.Result fr = r; final String er = err;
                ui.post(() -> {
                    if (fr == null) js("window.__native.onLanSynced&&__native.onLanSynced(false,null," + JSONObject.quote(er) + ",0,0," + quiet + ")");
                    else js("window.__native.onLanSynced&&__native.onLanSynced(true," + JSONObject.quote(fr.state) + "," + JSONObject.quote(fr.name) + "," + fr.got + "," + fr.sent + "," + quiet + ")");
                });
            }).start();
        }
        @JavascriptInterface public void lanForget() { link().forget(); }
        @JavascriptInterface public void lanProbe(final String ip) {
            new Thread(() -> { final String r = link().find(1500, ip).toString(); ui.post(() -> js("window.__native.onLanFound&&__native.onLanFound(" + r + ")")); }).start();
        }
        @JavascriptInterface public void openUrl(String url) { if (url != null && !url.isEmpty()) ui.post(() -> external(Uri.parse(url))); }
    }
}
