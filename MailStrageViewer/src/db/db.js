const mongoose = require("mongoose");
var db_host = process.env.npm_package_config_db_host;
var db_port = process.env.npm_package_config_db_port;
var db_name = process.env.npm_package_config_db_name;
mongoose.connect(`mongodb://${db_host}:${db_port}/${db_name}`);
var db = mongoose.connection;
db.on('error', ()=>{
    console.log('Error: faile to connect database');
});
db.once('open',()=>{
    console.log('we are connected to the database');
});

export default db;
