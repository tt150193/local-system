var request = require('request');
var token = "";
var status = "LOGIN";
var ID_PLC = "5cf78a0e29e82302efaf8890"
var ID_SEN = "5cfdca83bf71a3b3265a0536"
function login(user, pass, cb){
    request.post("https://farm-iot.herokuapp.com/api/v1/user/login", 
    {
        headers: {'content-type': 'application/json'}, 
        body: JSON.stringify({username: user, password: pass})
    }, function (error, response, body) {
        if(error){
            console.log('error:', error); // Print the error if one occurred
            if(cb){
                cb("ERROR");
            }
            return "ERROR";
        }
        if(response.statusCode == 200) {
            // token = JSON.parse(body).result.jwt;
            // console.log('body:', JSON.parse(body).result);
            if(cb){
                status = "NORMAL"
                cb(JSON.parse(body).result.jwt)
            }
            return "SUCCESS";
        }
    });
}

function updateHistory(sId, aId, sta, actionName, cb){
    console.log("UPLOAD-FUNCTION")
    if(status == "LOGIN"){
        console.log("LOGIN NOW");
        return;
    }
    request.post("https://farm-iot.herokuapp.com/api/v1/history", 
    {
        headers: {
            'content-type': 'application/json',
            'Authorization': token
        }, 
        body: JSON.stringify({
            "systemId": sId,
            "actionCode": aId, 
            "status": sta,
            "ID": sId,
            actionName: actionName
        })
    }, function (error, response, body) {
        if(error){
            console.log('error:', error); // Print the error if one occurred
            if(cb){
                cb("ERROR")
                return "ERROR";
            }
        }
        // console.log("UPDATE SUCEES", body, response)
        if(response.statusCode == 200) {
            // token = JSON.parse(body).result.jwt;
            // console.log('body:', JSON.parse(body).result);
            if(cb){
                cb(JSON.parse(body))
            }
        }
    });
}


function uploadSystem(actionCode, status, actionName,callback){
    login("vo", "a12345678", function(to){
        if(to == "ERROR"){
            console.log("CANNOT LOGIN");
            if(callback){
                callback("ERROR");
            }
            return;
        }
        token = to;
        console.log("GET TOKEN: ", token);
        updateHistory(ID_PLC, actionCode, status, actionName,function(d){
            console.log("UPLOAD");
            console.log(d);
        });
    });
}

function uploadPlc(actionCode, status, callback){
    login("vo", "a12345678", function(to){
        if(to == "ERROR"){
            console.log("CANNOT LOGIN");
            if(callback){
                callback("ERROR");
            }
            return;
        }
        token = to;
        console.log("GET TOKEN: ", token);
        updateHistory(ID_SEN, actionCode, status, function(d){
            console.log("UPLOAD");
            console.log(d);
        });
    });
}

module.exports.uploadSystem = uploadSystem;
module.exports.uploadPlc = uploadPlc;