
const log = require("traccelog");
const uuidv1 = require('uuid/v1');


const mongoose = require("mongoose");


var options = {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };

  var app_log_path = "./logs"; 

  function exit(){
    console.log("#Micro service Consulta Cadastral NOT started!");     
    process.exit();   
}

function successCallback(result) {  
    
        mongoose.set('bufferCommands', false);
        
        mongoose.connection.on('open', function (ref) {  
            log.logPathWrite(app_log_path, uuidv1(), {consultaCadastral:{msg:"#Service open connection to mongo server." }});        
        });
    
        mongoose.connection.on('connected', function (ref) {  
            log.logPathWrite(app_log_path, uuidv1(), {consultaCadastral:{msg:"#Service connected to mongo server." }});        
        });
    
        mongoose.connection.on('disconnected', function (ref) {    
            log.logPathError(app_log_path, uuidv1(), {consultaCadastral:{error:"#Service disconnected from mongo server." }});        
        });
    
        mongoose.connection.on('close', function (ref) {
            log.logPathError(app_log_path, uuidv1(), {consultaCadastral:{error:"#Service close connection to mongo server." }}); 
        });
    
        mongoose.connection.on('error', function (err) {
            log.logPathError(app_log_path, uuidv1(), {consultaCadastral:{error:err }}); 
        });
    
        mongoose.connection.db.on('reconnect', function (ref) {
            log.logPathWrite(app_log_path, uuidv1(), {consultaCadastral:{error:"#Service reconnect to mongo server." }}); 
        });            
    
}

    function failureCallback(error_) {
        console.log("MongoDb isn't Connected!");              
        log.logError(1, {consultaCadastral:{error: error_, description:"MongoDB is not connected! "} });                  
        exit();       
    } 

    module.exports = function (app_log_path_){
        
        app_log_path = app_log_path_

        var connection = {}
        connection.createConnection = function(database, options_){

            if(options_)
                options = options_;

            const promise =  mongoose.connect(database, options);
            promise.then(successCallback, failureCallback);
        }

        return connection;
    }

