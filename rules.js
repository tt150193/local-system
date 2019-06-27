var logSystem = require("./source/logSystem");
var upload = require("./requestLocalServer");
var env = require("./source/queryFileSystem");
var request = require('request');
var envSensor = {};
var status = "HANDLING";
var JSONUPLOAD = 0;
function getEnviromentStartup(){
    env.getEnviroment(__dirname + "/data/sensor.conf", function(data){
        envSensor = data;
        console.log(envSensor);
    })
}

getEnviromentStartup();
// var TIME_INTERVAL = 1*60*1000;
var TIME_INTERVAL = 10*1000;
var TIME_DEFINE_MIN = 1;
// var TIME_DEFINE_MIN = 5*60;
var d;

d = setInterval(function(){
    if(status == "HANDLING"){
        return;
    } else if (status == "AUTO") {
        console.log("SYSTEM MODE:", status);
    } else {
        console.log("SYSTEM MODE:", status);
        return;
    }
    getDataSensor(function(data){
        if((data == "ERROR")||(data == "CANNOT PARSE BODY")){
            console.log("GET SENSOR:", data);
            return;
        }
        var checkRuleStatus = checkRule(JSON.parse(data.data));
        
    })
    checkLogDelay();
}, TIME_INTERVAL);    

function checkLogDelay(){
    logSystem.getLog("/data/log.txt", function(d){
        if(d.length > 0){
            for(i in d){
                upload.uploadSystem(d[i].actionCode, d[i].status, d[i].actionName, function(a){
                    console.log(a);
                });
            }
        }
    })
}
var objDataSensor = {
    temperature: "",
    humidity: ""
}

//actionCode
function checkRule(ob){
    //System sotre to server
    var actionCode = new Date();
    actionCode = Math.round(actionCode.getTime()/1000) + "-" + envSensor.name_local;
    var dataRun = {
        sensor: {
            humidity: "",
            temperature: ""
        },
        watering: "false",
        lighting: "false"
    }
    var temperature = parseInt(ob.temperature);
    var humidity = parseInt(ob.humidity);
    console.log(ob, temperature, humidity);
    dataRun.sensor.temperature = temperature;
    dataRun.sensor.humidity = humidity;
    if(temperature > parseInt(envSensor.tem_max)){
        console.log("RUN LIGHT");
        if(JSONUPLOAD == 0) {
            controlPlcHandle("LIGHTING", "true", envSensor.tem_time*TIME_DEFINE_MI, function(d){
                // var r = "";
                // if(d == "ERROR"){
                //     r = "FAILURE";
                // } else {
                //     r = "SUCCESS";
                // }
                // upload.uploadSystem(actionCode, r, "TURN_ON_LIGHT", function(data){
                //     console.log("UPLOAD LOCAL SYSTEMs");
                //     console.log(data);
                // });
            })
        }

        dataRun.lighting = "true";
    } else if (temperature < parseInt(envSensor.tem_min)) {
        console.log("STOP LIGHT");
if(JSONUPLOAD == 0){
    controlPlcHandle("LIGHTING", "false", 0, function(d){
        // var r = "";
        // if(d == "ERROR"){
        //     r = "FAILURE";
        // } else {
        //     r = "SUCCESS";
        // }
        // upload.uploadSystem(actionCode, r, "TURN_OFF_LIGHT", function(data){
        //     console.log("UPLOAD LOCAL SYSTEMs");
        //     console.log(data);
        // });
    });
}
        dataRun.lighting = "false";
    } else {
        console.log("NOTHING-LIGHTING");
        if(JSONUPLOAD == 0) {
            upload.uploadSystem(actionCode, "SUCCESS", "NORMAL_LIGHT", function(data){
                console.log("UPLOAD LOCAL SYSTEMs");
                console.log(data);
            });
        }
 
    }
    var countDelay = 0;

    if(humidity < parseInt(envSensor.hum_min)) {
        console.log("RUN WATER", envSensor.hum_time*TIME_DEFINE_MIN);
        if(JSONUPLOAD == 0){
            controlPlcHandle("WATERING", "true", envSensor.hum_time*TIME_DEFINE_MIN, function(d){
                // var r = "";
                // if(d == "ERROR"){
                //     r = "FAILURE";
                // } else {
                //     r = "SUCCESS";
                // }
                // upload.uploadSystem(actionCode, r, "TURN_ON_WATER", function(data){
                //     console.log("UPLOAD LOCAL SYSTEMs");
                //     console.log(data);
                // });
            });
        }

        dataRun.watering = "true";
    } else if (humidity > parseInt(envSensor.hum_max)) {
        console.log("STOP WATERING");
if(JSONUPLOAD == 0){
    controlPlcHandle("WATERING", "false", 0, function(d){
        // var r = "";
        // if(d == "ERROR"){
        //     r = "FAILURE";
        // } else {
        //     r = "SUCCESS";
        // }
        // upload.uploadSystem(actionCode, r, "TURN_OFF_WATER", function(data){
        //     console.log("UPLOAD LOCAL SYSTEMs");
        //     console.log(data);
        // });
    });
}
        dataRun.watering = "false";
    } else {
        console.log("NOTHING-WATERING");
    if(JSONUPLOAD == 0) {
        upload.uploadSystem(actionCode, "SUCCESS", "NORMAL_WATER", function(data){
            console.log("UPLOAD LOCAL SYSTEMs");
            console.log(data);
        });
    }

    }
    if(JSONUPLOAD == 0){
        upload.uploadSystem(actionCode, "SUCCESS", JSON.stringify(dataRun), function(data){
            console.log("UPLOAD LOCAL SYSTEMs");
            console.log(data);
        })
    }

    return "SUCCESS";
}

var objControlPlc = {
	"identifier": "PLC-123",
    "actionId": "12345",
    "type": "WATERING",           
    "on": "true",          
    "time": "5"
}

function controlPlcHandle(device, mode, time, cb){
    objControlPlc.type = device;
    objControlPlc.on = mode;
    objControlPlc.time = time;
    request.post("http://" + envSensor.ip_plc + ":" + envSensor.port_plc + "/device", 
    {
        headers: {'content-type': 'application/json'}, 
        body: JSON.stringify(objControlPlc)
    }, function (error, response, body) {
        if(error){
            console.log('error:', error); // Print the error if one occurred
            if(cb){
                cb("ERROR");
            }
            return;
        }
        if(response.statusCode == 200) {
            if(cb){
                cb(JSON.parse(body))
                return;
            }
        }
        console.log("HERE-FINAL");
        cb();
    });
}

function getDataSensor(cb){
    request("http://" + envSensor.ip_sensor + "/sensor", {timeout: 2000}, function(err, res, body){
            if(err){
                console.log("ERR: ", err);
                if(cb){
                    cb("ERROR");
                }
                return;
            }
            if(cb){
                
                var oR;
                try{
                    oR = JSON.parse(body);
                } catch (e) {
                    oR = "CANNOT PARSE BODY";
                }

                cb(oR);
            }
    });
}
function setModeConrol(mode, cb){
    if(mode == "HANDLING"){
        status = mode;
    } else if (mode == "AUTO"){
        status = mode;
    } else {
        if(cb){
            cb("MODE: HANDLING or AUTO");
        }
        console.log("MODE: HANDLING or AUTO");
        return;
    }
    if(cb){
        cb(mode);
    }
    return mode
}

function getModeControl(cb){
    if(cb){
        cb(mode);
    }
    return mode;
}

status = "AUTO";
module.exports.getEnviromentStartup = getEnviromentStartup;