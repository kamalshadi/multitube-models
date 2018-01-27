mongoose = require('mongoose')
require('dotenv').config()

// const connection = mongoose.createConnection(process.env.MONGODB_URI, {
//   useMongoClient: true,
//   reconnectInterval: 500, // Reconnect every 500ms
//   poolSize: 10, // Maintain up to 10 socket connections
// });
//
// connection.on('error', (err) => {
//   console.log('Error connecting db:', err.message)
// });
//
// exports.connection = connection;
