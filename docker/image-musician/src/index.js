const HOST = 'localhost';
const PORT = 2205;

const INSTRUMENTS = {
  piano: 'ti-ta-ti',
  trumpet: 'pouet',
  flute: 'trulu',
  violin: 'gzi-gzi',
  drum: 'boum-boum',
};

const instrument = process.argv[2];
if(!INSTRUMENTS.includes(instrument)){
    console.log('This instrument (${instrument}) is not correct.');
    return;
}

var udp = require('dgram');

var client = udp.createSocket('udp4');

var crypto = require('crypto');

var uuid = crypto.randomUUID();

var payload = JSON.stringify({
    uuid,
    sound: INSTRUMENTS[instrument]
})

function instrumentsSend() {
    client.send(message, 0, message.length, PORT, HOST, () => {
      console.log('payload ' + payload + 'on port ' + client.address().port);
    });
  }
  
  setInterval(instrumentsSend, 1000);