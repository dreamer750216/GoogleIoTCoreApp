const admin = require('firebase-admin');
admin.initializeApp();
var db = admin.firestore();

exports.telemetryToFirestore = (event, callback) => {
  const pubsubMessage = event;

  const payload = Buffer.from(pubsubMessage.data, 'base64').toString();
  const telemetry = JSON.parse(payload);
  const attributes = pubsubMessage.attributes;
  const deviceId = attributes.deviceId;

//device
  db.collection(`devices/${deviceId}/measurements`).add({
    'timestamp': telemetry.timestamp,
    'temperature': telemetry.temperature,
    'bpm': telemetry.bpm
  }).then((writeResult) => {
    console.log({'result': 'Message with ID: ' + writeResult.id + ' added.'});
    return;
  }).catch((err) => {
    console.log(err);
    return;
  });

//fake device
  var item = Math.floor(Math.random()*20);
  db.collection(`devices/esp32_C30DE1/measurements`).add({
    'timestamp': telemetry.timestamp,
    'temperature': telemetry.temperature + item,
    'bpm': telemetry.bpm + item
  }).then((writeResult) => {
    console.log({'result': 'Message with ID: ' + writeResult.id + ' added.'});
    return;
  }).catch((err) => {
    console.log(err);
    return;
  });

  callback();

};