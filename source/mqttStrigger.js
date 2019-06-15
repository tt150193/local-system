var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://iot.eclipse.org:1883')
var mysql = require('./mysqlObject');
var s = new mysql();
var e = require("./errorLog");
var E = new e();
// client.on('connect', function () {
//   client.subscribe('esp/sensor/+', function (err) {
//     if (!err) {
//     //   client.publish('presence', 'Hello mqtt')
//     }
//   })
// })

// client.on('error', function(err){
//   E.save(err, "mqtt");
// });
 
// client.on('message', function (topic, message) {
    // var query = "INSERT INTO sensor (id,device,data, time) VALUES (1,'"+topic.toString()+"','"+message.toString()+"',"+(new Date()).getTime()+")";
    // s.query(query);
// })