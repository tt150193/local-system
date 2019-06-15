var rules = require("./rules");
var env = require("./source/queryFileSystem");
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');

var app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views','./views');

app.get("/", function(req, res){
    res.render("index");
});

app.post("/control", function(req, res){
    var a = req.body;
    console.log(a);
    var b = "SUCCESS";
    var envSensor;
    env.getEnviroment(__dirname + "/data/sensor.conf", function(data){
        envSensor = data;
        console.log(envSensor);
        envSensor.ip_sensor = a.ipSensor;
        envSensor.port_sensor = a.portSensor;
        envSensor.ip_plc = a.ipPlc;
        envSensor.portPlc = a.portPlc;
        env.setEnviroment(__dirname + "/data/sensor.conf", envSensor, function(d){
            res.send(d);
            rules.getEnviromentStartup();
        })
    })
});
/* 
{
  ip_sensor: '192.168.1.17',
  port_sensor: '80',
  name_sensor: 'SENSOR-123',
  ip_plc: '192.168.1.22',
  port_plc: '3000',
  name_plc: 'PLC-123',
  hum_max: '90',
  hum_min: '80',
  tem_max: '30',
  tem_min: '25',
  hum_time: '5',
  tem_time: '5',
  portPlc: '3000'
}
*/
app.post("/configRules", (req, res) => {
    var a = req.body;
    console.log(a);
    var b = "SUCCESS";
    var envSensor;
    env.getEnviroment(__dirname + "/data/sensor.conf", function(data){
        envSensor = data;
        console.log(envSensor);
        envSensor.hum_max = a.hum_max;
        envSensor.hum_min = a.hum_min;
        envSensor.tem_max = a.tem_max;
        envSensor.tem_min = a.tem_min;
        envSensor.tem_time = a.tem_time;
        envSensor.hum_time = a.hum_time;
        env.setEnviroment(__dirname + "/data/sensor.conf", envSensor, function(d){
            res.send(d);
            rules.getEnviromentStartup();
        })
    })
});
app.get("/sensor", function(req, res){
    
});

app.get("/plc", function(req, res){
    
})
app.get("/handle", function(req, res){
    env.getEnviroment(__dirname + "/data/sensor.conf", function(data){
        res.send(data);
    })
});
app.listen(8000);