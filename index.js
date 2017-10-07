var express = require('express');
var app = express();

var router = require('./router.js');
//both index.js and things.js should be in same directory
app.use('/router', router);

//Other routes here
app.get('*', function(req, res){
   res.send('Sorry, this is an invalid URL.');
});

app.listen(3000);
