const { exec } = require('child_process');
function getEnviroment(pathFile, cb){
    exec('cat ' + pathFile, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      var system = {};
      // console.log(stdout);
      var o = stdout.split("***")
      for(i in o){
        var a = o[i].split("=");
        if(a.length == 2){
          system[a[0]] = a[1];
        } else {
          continue;
        }
      }
      if(cb){
          cb(system);
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

function insert(pathFile, str, cb){
    var t = new Date();
    var log_string = "";
    t = Math.round(t.getTime()/1000).toString();
    log_string = t + ":::" + str + "\r\n";
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

module.exports.insert = insert;
module.exports.getEnviroment = getEnviroment;
module.exports.setEnviroment = setEnviroment;