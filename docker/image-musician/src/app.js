const HOST = '239.1.1.1';
const PORT = 5555;

const INSTRUMENTS = {
  piano: 'ti-ta-ti',
  trumpet: 'pouet',
  flute: 'trulu',
  violin: 'gzi-gzi',
  drum: 'boum-boum',
};

const instrument = process.argv[2];
if(!(instrument in INSTRUMENTS)){
    console.log('This instrument (${instrument}) is not correct.');
    return;
}

var udp = require('dgram');
var client = udp.createSocket('udp4');
var crypto = require('crypto');
var uuid = crypto.randomUUID();

var payload =  JSON.stringify({
    uuid,
    sound: INSTRUMENTS[instrument]
})

var msg = Buffer.from(payload);

function instrumentsSend() {
    client.send(msg, PORT, HOST, () => {
      console.log('payload ' + payload + ' on port ' + client.address().port);
    });
  }
  
setInterval(instrumentsSend, 1000);