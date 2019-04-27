
const log = require("traccelog");
const uuidv1 = require('uuid/v1');


const mongoose = require("mongoose");

  var options = {
    useNewUrlParser: true
  };

  var app_log_path = "./logs"; 
  
  function exit(){
    console.log("#Micro service NOT started!");     
    process.exit();   
}

function successCallback(result) {     
    
        mongoose.set('bufferCommands', false);
        
        mongoose.connection.on('open', function (ref) {  
            log.logPathWrite(app_log_path, uuidv1(), {consultaCadastral:{msg:"#Service OPEN connection to mongo server." }});        
        });
    
        mongoose.connection.on('connected', function (ref) {  
            log.logPathWrite(app_log_path, uuidv1(), {consultaCadastral:{msg:"#Service CONNECTED to mongo server." }});        
        });
    
        mongoose.connection.on('disconnected', function (ref) {    
            log.logPathError(app_log_path, uuidv1(), {consultaCadastral:{error:"#Service DISCONNECTED from mongo server." }});        
        });
    
        mongoose.connection.on('close', function (ref) {
            log.logPathError(app_log_path, uuidv1(), {consultaCadastral:{error:"#Service CLOSE connection to mongo server." }}); 
        });
    
        mongoose.connection.on('error', function (err) {
            log.logPathError(app_log_path, uuidv1(), {consultaCadastral:{error:err }}); 
        });
    
        mongoose.connection.db.on('reconnect', function (ref) {
            log.logPathWrite(app_log_path, uuidv1(), {consultaCadastral:{error:"#Service RECONNECTED to mongo server." }}); 
        }); 
                
}

    function failureCallback(error_) {
        console.log("MongoDb isn't Connected!");              
        log.logError(1, {consultaCadastral:{error: error_, description:"MongoDB is NOT connected! "} });                  
        exit();       
    } 

    module.exports = function (app_log_path_){
        
        app_log_path = app_log_path_;
   
        var connection = {}
        connection.createConnection = function(database, options_){

            if(options_)
                options = options_;

            const promise =  mongoose.connect(database, options);
            promise.then(successCallback, failureCallback);
        }

        connection.isConnected = function(){
            //0 = disconnected
            //1 = connected
            let connectionState = 0;

            if(mongoose)
               if(mongoose.connection)
                  if(mongoose.connection.readyState)
                      connectionState = mongoose.connection.readyState;

            return (connectionState == 1);
        }

        connection.getMongoose = function(){
            return mongoose;            
        }
     

        return connection;
    }

