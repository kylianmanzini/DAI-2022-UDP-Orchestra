const HOST = '239.1.1.1';
const PORT = 5555;
const INSTRUMENTS = {
  piano: 'ti-ta-ti',
  trumpet: 'pouet',
  flute: 'trulu',
  violin: 'gzi-gzi',
  drum: 'boum-boum',
};

const dgram = require('dgram');
const net = require('net');

const tcpPort = 2205;
const intervalInactive = 5000;
const socket = dgram.createSocket('udp4');
const server = net.createServer();

var musicians = new Map();

socket.bind(PORT, () => {
  console.log('Joining multicast group : ' + HOST + ":" + PORT);
  socket.addMembership(HOST);
});

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

socket.on('message', (msg, src) => {
    var received = JSON.parse(msg);
    var payload = {
      uuid: received.uuid,
      lastActive: Date.now(),
    };

    payload.instrument = getKeyByValue(INSTRUMENTS,received.sound);
    payload.activeSince = musicians.has(payload.uuid) ? musicians.get(payload.uuid).activeSince : payload.lastActive;
    delete payload.sound;
  
    musicians.set(payload.uuid, payload);
  
    console.log('Data: ' + msg + '. Source: ' + src.address + ":" + src.port);
    console.log('Payload: ' + payload.uuid + " " + payload.instrument);
  });

server.listen(tcpPort);

server.on('connection', (socket) => {
    var toSend = Array.from(musicians.entries())
      .filter(([uuid, musician]) => {
        var toRemove = Date.now() - musician.lastActive > intervalInactive;
        if (toRemove) musicians.delete(uuid);
        return !toRemove;
      })
      .map(([uuid, musician]) => ({
        uuid,
        instrument: musician.instrument,
        activeSince: new Date(musician.activeSince),
      }));
  
    socket.write(`${JSON.stringify(toSend)}\n`);
    socket.end();
  });