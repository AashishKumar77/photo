var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/photography');
var con = mongoose.connection;
con.on('error', console.error.bind(console, 'connection error:'));
con.once('open', function callback () {
  console.log("connected");
  con.collection('photography', function(err, collection) {
    console.log(collection);
  });
});

module.exports = con;


