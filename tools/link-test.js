/* Plays the phone against a running Miftah for Windows, to prove the Wi-Fi protocol end to end:
   discovery, a wrong code refused, pairing with the right code, a file each way, and joining records.
     MIFTAH_LINK_LOCAL=1 MIFTAH_DEBUG_PORT=9444 dist/Miftah.exe     (then turn on "Let my phone find this computer")
     node tools/link-test.js <six-digit code> [host]
   The phone side in the app is android/src/com/miftah/app/Link.java; the computer side is windows/src/Link.cs. */
const net = require('net'), dgram = require('dgram'), crypto = require('crypto');
const [code, host = '127.0.0.1'] = process.argv.slice(2);
const TCP = 47731, UDP = 47732, DEV = 'testphone' + crypto.randomBytes(4).toString('hex');
const sub = (k, l) => crypto.createHmac('sha256', k).update(l).digest();
function close(key, plain) {
  const iv = crypto.randomBytes(16), c = crypto.createCipheriv('aes-256-cbc', sub(key, 'miftah-enc'), iv);
  const ct = Buffer.concat([c.update(plain), c.final()]), mac = crypto.createHmac('sha256', sub(key, 'miftah-mac')).update(Buffer.concat([iv, ct])).digest();
  return Buffer.concat([iv, ct, mac]);
}
function open(key, body) {
  const mac = crypto.createHmac('sha256', sub(key, 'miftah-mac')).update(body.subarray(0, body.length - 32)).digest();
  if (!crypto.timingSafeEqual(mac, body.subarray(body.length - 32))) return null;
  const d = crypto.createDecipheriv('aes-256-cbc', sub(key, 'miftah-enc'), body.subarray(0, 16));
  return Buffer.concat([d.update(body.subarray(16, body.length - 32)), d.final()]);
}
function ask(type, payload) {
  return new Promise((ok, no) => {
    const s = net.connect(TCP, host), id = Buffer.from(DEV), len = Buffer.alloc(4); len.writeUInt32BE(payload.length);
    let got = Buffer.alloc(0);
    s.on('connect', () => s.write(Buffer.concat([Buffer.from('MFT1'), Buffer.from([type, id.length]), id, len, payload])));
    s.on('data', d => { got = Buffer.concat([got, d]); if (got.length >= 5 && got.length >= 5 + got.readUInt32BE(1)) { s.end(); ok({ status: got[0], body: got.subarray(5, 5 + got.readUInt32BE(1)) }); } });
    s.on('error', no); s.setTimeout(30000, () => { s.destroy(); no(new Error('timeout')); });
  });
}
function discover() {
  return new Promise(ok => {
    const s = dgram.createSocket('udp4'); let card = null;
    s.on('message', m => { const t = m.toString(); if (t.startsWith('MFT1!')) card = JSON.parse(t.slice(5)); });
    s.bind(() => { s.send('MFT1?', UDP, host); setTimeout(() => { s.close(); ok(card); }, 800); });
  });
}
const check = (name, ok) => { console.log((ok ? 'PASS ' : 'FAIL ') + name); if (!ok) process.exitCode = 1; };
(async () => {
  const card = await discover();
  check('the computer answers discovery: ' + JSON.stringify(card), !!(card && card.id && card.port === TCP));
  const bad = await ask(1, close(crypto.pbkdf2Sync('000000' === code ? '111111' : '000000', 'miftah-pair:' + card.id, 50000, 32, 'sha256'), Buffer.from('{"name":"x"}')));
  check('a wrong code is refused', bad.status === 2);
  const pk = crypto.pbkdf2Sync(code, 'miftah-pair:' + card.id, 50000, 32, 'sha256');
  const pr = await ask(1, close(pk, Buffer.from(JSON.stringify({ name: 'Test phone' }))));
  const paired = pr.status === 0 && JSON.parse(open(pk, pr.body).toString());
  check('the right code pairs, and the answer opens with it', !!(paired && paired.key));
  const key = Buffer.from(paired.key, 'base64');
  const stranger = await ask(2, close(crypto.randomBytes(32), Buffer.from('{}')));
  check('a message sealed with any other key is refused', stranger.status === 1);
  const hello = await ask(2, close(key, Buffer.from(JSON.stringify({ name: 'Test phone' }))));
  const h = JSON.parse(open(key, hello.body).toString());
  check('hello lists the computer\'s files', hello.status === 0 && Array.isArray(h.voice) && Array.isArray(h.media));
  const name = 'linktest' + Date.now() + '.m4a', data = crypto.randomBytes(5000), head = Buffer.from(JSON.stringify({ kind: 'voice', name }));
  const hl = Buffer.alloc(4); hl.writeUInt32BE(head.length);
  const put = await ask(4, close(key, Buffer.concat([hl, head, data])));
  check('a recording goes to the computer', put.status === 0);
  const get = await ask(3, close(key, Buffer.from(JSON.stringify({ kind: 'voice', name }))));
  check('and comes back byte for byte', get.status === 0 && open(key, get.body).equals(data));
  const escape = await ask(3, close(key, Buffer.from(JSON.stringify({ kind: 'voice', name: '../state.json' }))));
  const leaked = escape.status === 0 && /profiles/.test(open(key, escape.body).toString());
  check('a file outside its folder cannot be fetched', !leaked);
  const state = { profiles: [{ id: 'ph1', name: 'Zayd', by: 2018, bm: 1, g: 'm', hue: 'violet', since: '2026-11-01' }], data: { ph1: { led: [{ i: 'e1', s: 'm1.count5', k: 'production', ok: true, t: Date.now() }], keys: {}, hifz: {}, time: {}, obs: [], placed: {}, recs: {} } }, media: [], familyFile: 1 };
  const sy = await ask(5, close(key, Buffer.from(JSON.stringify(state))));
  const merged = sy.status === 0 && JSON.parse(open(key, sy.body).toString());
  check('records join: the computer now has the phone\'s child', !!(merged && merged.profiles.some(p => p.name === 'Zayd')));
})().catch(e => { console.log('FAIL', e.message); process.exitCode = 1; });
