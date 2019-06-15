$(document).ready(function(){
    $("#btnSetConfig").click(function(){
        var objConfigure = {
            ipPlc: $("#ipPlc").val(),
            portPlc: $("#portPlc").val(),
            ipSensor: $("#ipSensor").val(),
            portSensor: $("#portSensor").val()
        }
        for(i in objConfigure){
            if(objConfigure[i] == ""){
                alert("ERROR: input");
                return;
            }
        }
        console.log("SEND: ", objConfigure);
        $.post("/control",
        objConfigure,
        function(data, status){
            console.log("RESPONSE: ", data, " - STAUS: ", status)
            alert("Update configure success...");
        });
    });

    $("#btnSetConfigRule").click(()=>{
        var objConfigure = {
            hum_max: $("#hum_max").val(),
            hum_min: $("#hum_min").val(),
            tem_max: $("#tem_max").val(),
            tem_min: $("#tem_min").val(),
            tem_time: $("#tem_time").val(),
            hum_time: $("#hum_time").val()
        }
        for(i in objConfigure){
            if(objConfigure[i] == ""){
                alert("ERROR: input");
                return;
            }
        }
        $.post("/configRules",
        objConfigure,
        function(data, status){
            console.log("RESPONSE: ", data, " - STAUS: ", status)
            alert("Update configure success...");
        });
    });

    $("#btnDevice").click(function(){
        configDisplay(1);
    })
    $("#btnRule").click(function(){
        configDisplay(0);
    });
    $('#configRules').hide(); 
    $('#configDevice').show(); 
    $.get("/handle", function(data, status){
        console.log(data);
        $("#hum_max").val(data.hum_max);
        $("#hum_min").val(data.hum_min);
        $("#hum_time").val(data.hum_time);
        $("#tem_max").val(data.tem_max);
        $("#tem_min").val(data.tem_min);
        $("#tem_time").val(data.tem_time);
        $("#ipPlc").val(data.ip_plc);
        $("#portPlc").val(data.port_plc);
        $("#ipSensor").val(data.ip_sensor);
        $("#portSensor").val(data.port_sensor);
    });
});

function configDisplay(an){
    if(an == 1){
        $('#configRules').hide(); 
        $('#configDevice').show();
    } else {
        $('#configRules').show(); 
        $('#configDevice').hide();        
    }
    console.log("CONFIGURE", an)
}
