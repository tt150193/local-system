const { exec } = require('child_process');
function getLog(pathFile, cb){
    exec('cat ' + pathFile, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      var system = [];
      console.log(stdout);
      var o = stdout.split("***")
      for(i in o){
        var temp1 = o[i].split("==");
        console.log("TEM: ", temp1)
        if(temp1.length == 2){
          var obj = {
            actionCode: temp1[0],
            status: temp1[1]
          }
          system.push(obj);
        } else {
          continue;
        }
      }
      if(cb){
          cb(system);
          exec('rm ' + pathFile, (error, stdout, stderr) => {
          });
      }
    });
}
  
function setEnviroment(pathFile, obj, cb){
    var str = "";
    // console.log("SAVE: ",system);
    for(i in obj){
      str += i + "=" + obj[i] + "***";
    }
    // console.log('echo "' + str + "\" > " + __dirname + '/conf.plc');
    exec('echo ' + str + " > " + pathFile, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        if(cb){
            cb("SUCCESS");
        }  
      // console.log("SAVE ENVIROMENT");
    });
}

function insertLog(pathFile, obj, cb){
    var log_string = "";
    if((obj.actionCode != undefined) && (obj.status != undefined)){
      log_string += obj.actionCode + "==" + obj.status + "***";
    } else {
      console.log("NOT MATCH DEFINED LOG");
      return "ERROR";
    }
    exec('echo "' + log_string + "\" >> " + pathFile, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            if(cb){
                cb("FAILURE");
            }        
          return;   
        }
        if(cb){
            cb("SUCCESS");
        }        
    });
}

function query(pathFile, amount, cb){
    exec('echo "' + log_string + "\" >> " + pathFile, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            if(cb){
                cb("FAILURE");
            }        
          return;
        }
        if(cb){
            cb("SUCCESS");
        }        
    });
}

module.exports.insertLog = insertLog;
module.exports.getLog = getLog;
module.exports.setEnviroment = setEnviroment;