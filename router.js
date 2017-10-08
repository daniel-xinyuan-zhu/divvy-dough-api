var express = require('express');
var router = express.Router();

/*
GET /trips
List of current and past trips for this user
{ trips: […], pastTrips: […] }
GET /trips/:trip_id
POST /trips/:trip_id/deposit
Only applicable to non-leaders. Deposits the amount specified in the request into the group leader’s account.
POST /trips/:trip_id/withdraw
Only applicable to non-leaders. Withdraws the specified amount from the leader’s account.
POST /trips/:trip_id/charge
Only applicable to leaders. Charges the account(s) specified in the request by the specified amount.
POST /trips/:trip_id/complete_trip
Only applicable to leaders. Refunds everyone’s unspent balance. Moves the trip into the past trips category.
*/
var fs = require("fs");

// GET '/ping'
// Status 200 response if server is online
router.get('/ping', function(req, res){
  res.sendStatus(200);
});

router.get('/trips', function(req, res){
  fs.readFile( __dirname + "/" + "trips.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
  });
  res.end();
});

router.get('/trips/:trip_id/leader/transaction', function(req, res){
  var contents = fs.readFileSync(__dirname + "/" + "trips.json");
  var jsonContent = JSON.parse(contents);
  var index = 0;
  for (var i = 0; i <jsonContent.trips.length; i++){
    var temp = jsonContent.trips[i];
    if (req.params.trip_id == temp.id)
    {
      console.log(JSON.stringify(temp));
      index = i;
    }
  }
  console.log();
  var transactions = fs.readFileSync(__dirname + "/" + "transactions.json");
  var jsonTransactions = JSON.parse(transactions);
  for (var i = 0; i < jsonTransactions.transaction.length; i++)
  {
    var temp = jsonTransactions.transaction[i];
    if (temp.id == req.params.trip_id)
    {
      console.log(JSON.stringify(temp.sub_transactions));
      console.log();
    }
  }
  res.end();
});

router.get('/trips/:trip_id/leader/transactions', function(req, res){
  var transactions = fs.readFileSync(__dirname + "/" + "transactions.json");
  var jsonTransactions = JSON.parse(transactions);
  for (var i = 0; i < jsonTransactions.transaction.length; i++)
  {
    var temp = jsonTransactions.transaction[i];
    if (temp.id == req.params.trip_id)
    {
      console.log(JSON.stringify(temp));
      console.log();
    }
  }
  res.end();
});

router.get('/trips/:trip_id/leader/balance', function(req, res){
  var balances = fs.readFileSync(__dirname + "/" + "users.json");
  var jsonBalances = JSON.parse(balances);
  for (var i = 0; i < jsonBalances.person.length; i++)
  {
    console.log(jsonBalances.person[i].name);
    console.log(jsonBalances.person[i].balance);
  }
  res.end();
});

router.post('/addUser', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       data["user4"] = user["user4"];
       console.log( data );
       res.end( JSON.stringify(data));
   });
   res.end();
})

router.get('/trips/:trip_id/transactions/user_id=:user_id', function(req, res){
  var people = fs.readFileSync(__dirname + "/" + "users.json");
  var jsonPeople = JSON.parse(people);
  for (var i = 0; i < jsonPeople.person.length; i++)
  {
    var p = jsonPeople.person[i];
    if (req.params.user_id == p.id)
    {
      var name = p.name;
      console.log(name);
    }
  }
  var transactions = fs.readFileSync(__dirname + "/" + "transactions.json");
  var jsonTransactions = JSON.parse(transactions);
  for (var i = 0; i < jsonTransactions.transaction.length; i++)
  {
    var temp = jsonTransactions.transaction[i];
    if (temp.id == req.params.trip_id)
    {
      var sub_trans = temp.sub_transactions;
      for (var j = 0; j < sub_trans.length; j++)
      {
        if(sub_trans[j].from == name)
        {
          console.log(sub_trans[j]);
        }
      }
    }
  }
  res.end();
});

router.post('/trips/:trip_id/deposit', function (req, res){

});


router.post('/trips/:trip_id/withdraw', function (req,res){

});

router.post('/trips/:trip_id/charge', function (req,res){

});

router.post('/trips/:trip_id/complete_trip', function (req,res){

});

/*
router.get('/:id', function(req, res){
   res.send('GET route on things. Id entered is ' + req.params.id);
});

router.get('/:name/:id', function(req, res) {
   res.send('id: ' + req.params.id + ' and name: ' + req.params.name);
});
*/

router.post('/', function(req, res){
   res.send('POST route on things.');
});

//export this router to use in our index.js
module.exports = router;
