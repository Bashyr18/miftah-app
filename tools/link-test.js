/* Plays the phone against a running Miftah for Windows, to prove the Wi-Fi protocol end to end:
   discovery, a wrong code refused, pairing with the right code, a file each way, and joining records.
     MIFTAH_LINK_LOCAL=1 MIFTAH_DEBUG_PORT=9444 dist/Miftah.exe     (then turn on "Let my phone find this computer")
     node tools/link-test.js <pairing code> [host]
   The phone side in the app is android/src/com/miftah/app/Link.java; the computer side is windows/app/src/link.rs. */
const net = require('net'), dgram = require('dgram'), crypto = require('crypto');
const [code, host = '127.0.0.1'] = process.argv.slice(2);
const TCP = 47731, UDP = 47732, DEV = 'testphone' + crypto.randomBytes(4).toString('hex');
const sub = (key, ...parts) => {
  const mac = crypto.createHmac('sha256', key);
  for (const part of parts) mac.update(part);
  return mac.digest();
};
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
async function ask(type, key, plain) {
  const socket = net.connect(TCP, host);
  socket.setTimeout(30000, () => socket.destroy(new Error('timeout')));
  const stream = socket[Symbol.asyncIterator]();
  let got = Buffer.alloc(0);
  async function read(n) {
    while (got.length < n) {
      const next = await stream.next();
      if (next.done) throw new Error('incomplete response');
      got = Buffer.concat([got, next.value]);
    }
    const value = got.subarray(0, n); got = got.subarray(n); return value;
  }
  try {
    const id = Buffer.from(DEV), len = Buffer.alloc(4);
    const header = Buffer.concat([Buffer.from('MFT2'), Buffer.from([type, id.length]), id, crypto.randomBytes(32)]);
    socket.write(header);
    let status = (await read(1))[0];
    if (status) return { status };
    const nonce = await read(32), proof = await read(32);
    const request = sub(key, 'miftah-v2/request', nonce, header);
    const response = sub(key, 'miftah-v2/response', nonce, header);
    if (!crypto.timingSafeEqual(proof, sub(response, 'challenge'))) return { status: type === 1 ? 2 : 1 };
    const payload = close(request, plain); len.writeUInt32BE(payload.length);
    socket.write(Buffer.concat([len, sub(request, 'length', len), payload]));
    status = (await read(1))[0];
    if (status) return { status };
    const length = await read(4), tag = await read(32);
    if (!crypto.timingSafeEqual(tag, sub(response, 'length', length))) throw new Error('bad reply proof');
    const size = length.readUInt32BE();
    if (size < 64 || size > 200 * 1024 * 1024 + 1024) throw new Error('invalid reply size');
    const body = open(response, await read(size));
    if (!body) throw new Error('bad reply seal');
    return { status, body };
  } finally { socket.destroy(); }
}
function discover() {
  return new Promise(ok => {
    const s = dgram.createSocket('udp4'); let card = null;
    s.on('message', m => { const t = m.toString(); if (t.startsWith('MFT2!')) card = JSON.parse(t.slice(5)); });
    s.bind(() => { s.send('MFT2?', UDP, host); setTimeout(() => { s.close(); ok(card); }, 800); });
  });
}
const check = (name, ok) => { console.log((ok ? 'PASS ' : 'FAIL ') + name); if (!ok) process.exitCode = 1; };
(async () => {
  if (!/^[a-f0-9]{32}$/.test(code || '')) throw new Error('a 32-character pairing code is required');
  const card = await discover();
  check('the computer answers discovery: ' + JSON.stringify(card), !!(card && card.id && card.port === TCP));
  const wrong = crypto.randomBytes(16).toString('hex');
  const pk = sub(code, 'miftah-v2/pair/' + card.id);
  const bad = await ask(1, sub(wrong, 'miftah-v2/pair/' + card.id), Buffer.from('{"name":"x"}'));
  check('a wrong code is refused', bad.status === 2);
  const pr = await ask(1, pk, Buffer.from(JSON.stringify({ name: 'Test phone' })));
  const paired = pr.status === 0 && JSON.parse(pr.body.toString());
  check('the right code pairs, and the answer opens with it', !!(paired && paired.key));
  const key = Buffer.from(paired.key, 'base64');
  const stranger = await ask(2, crypto.randomBytes(32), Buffer.from('{}'));
  check('a message sealed with any other key is refused', stranger.status === 1);
  const hello = await ask(2, key, Buffer.from(JSON.stringify({ name: 'Test phone' })));
  const h = JSON.parse(hello.body.toString());
  check('hello lists the computer\'s files', hello.status === 0 && Array.isArray(h.voice) && Array.isArray(h.media));
  const name = 'linktest' + Date.now() + '.m4a', data = crypto.randomBytes(5000), head = Buffer.from(JSON.stringify({ kind: 'voice', name }));
  const hl = Buffer.alloc(4); hl.writeUInt32BE(head.length);
  const put = await ask(4, key, Buffer.concat([hl, head, data]));
  check('a recording goes to the computer', put.status === 0);
  const get = await ask(3, key, Buffer.from(JSON.stringify({ kind: 'voice', name })));
  check('and comes back byte for byte', get.status === 0 && get.body.equals(data));
  const escape = await ask(3, key, Buffer.from(JSON.stringify({ kind: 'voice', name: '../state.json' })));
  const leaked = escape.status === 0 && /profiles/.test(escape.body.toString());
  check('a file outside its folder cannot be fetched', !leaked);
  const state = { profiles: [{ id: 'ph1', name: 'Zayd', by: 2018, bm: 1, g: 'm', hue: 'violet', since: '2026-11-01' }], data: { ph1: { led: [{ i: 'e1', s: 'm1.count5', k: 'production', ok: true, t: Date.now() }], keys: {}, hifz: {}, time: {}, obs: [], placed: {}, recs: {} } }, media: [], familyFile: 1 };
  const sy = await ask(5, key, Buffer.from(JSON.stringify(state)));
  const merged = sy.status === 0 && JSON.parse(sy.body.toString());
  check('records join: the computer now has the phone\'s child', !!(merged && merged.profiles.some(p => p.name === 'Zayd')));
})().catch(e => { console.log('FAIL', e.message); process.exitCode = 1; });
