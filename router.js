var express = require('express');
var router = express.Router();
var fs = require("fs");
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// GET '/ping'
// Status 200 response if server is online
router.get('/ping', function(req, res){
  res.sendStatus(200);
});

router.get('/trips/user_id=:user_id', function(req, res){
  var total;
  // make a hash table
  var trips = fs.readFileSync(__dirname + "/" + "trips.json");
  var jsonTrips = JSON.parse(trips);
  var users = fs.readFileSync(__dirname + "/" + "users.json");
  var jsonUsers = JSON.parse(users);
  var nameOfPerson;
  for (var i = 0; i < jsonUsers.person.length; i++)
  {
    if(jsonUsers.person[i].id == req.params.user_id)
    {
      nameOfPerson = jsonUsers.person[i].name;
    }
  }
  var currentTrips = [];
  for (var i = 0; i < jsonTrips.trips.length; i++)
  {
    for(var j = 0; j<jsonTrips.trips[i].members.length; j++)
    {
      if (jsonTrips.trips[i].members[j] == nameOfPerson)
      {
        currentTrips.push(jsonTrips.trips[i]);
      }
    }
  }
  var pastTrips = [];
  for (var i = 0; i < jsonTrips.past_trips.length; i++)
  {
    for(var j = 0; j<jsonTrips.past_trips[i].members.length; j++)
    {
      if (jsonTrips.past_trips[i].members[j] == nameOfPerson)
      {
        pastTrips.push(jsonTrips.past_trips[i]);
      }
    }
  }
  total = {["trips"]: currentTrips, ["past_trips"]: pastTrips};
  console.log(JSON.stringify(total));
  res.send(JSON.stringify(total));
  res.end();
});

router.get('/trips/:trip_id/user_id=:user_id', function(req, res){
  var contents = fs.readFileSync(__dirname + "/" + "trips.json");
  var jsonContent = JSON.parse(contents);
  var index = 0;
  for (var i = 0; i <jsonContent.trips.length; i++){
    var temp = jsonContent.trips[i];
    if (req.params.trip_id == temp.id)
    {
      res.end(JSON.stringify(temp));
      console.log(JSON.stringify(temp));
      index = i;
    }
  }
  /*
  console.log();
  var transactions = fs.readFileSync(__dirname + "/" + "transactions.json");
  var jsonTransactions = JSON.parse(transactions);
  for (var i = 0; i < jsonTransactions.transaction.length; i++)
  {
    var temp = jsonTransactions.transaction[i];
    if (temp.id == req.params.trip_id)
    {
      console.log(JSON.stringify(temp.sub_transactions));
      res.send(JSON.stringify(temp.sub_transactions));
      console.log();
    }
  }
  */
  res.end();
});

router.get('/trips/:trip_id/leader/transactions', function(req, res){
  var output = [];
  var transactions = fs.readFileSync(__dirname + "/" + "transactions.json");
  var jsonTransactions = JSON.parse(transactions);
  for (var i = 0; i < jsonTransactions.transaction.length; i++)
  {
    var temp = jsonTransactions.transaction[i];
    if (temp.id == req.params.trip_id)
    {
      console.log(JSON.stringify(temp));
      output.push(temp);
      console.log();
    }
  }
  res.send(JSON.stringify(output));
  res.end();
});

router.get('/trips/:trip_id/leader/balance', function(req, res){
  var balances = fs.readFileSync(__dirname + "/" + "users.json");
  var transaction = fs.readFileSync(__dirname + "/" + "transactions.json");
  var jsonBalances = JSON.parse(balances);
  var jsonTransactions = JSON.parse(transaction);
  var returnValue;
  var list = [];
  for (var i = 0; i < jsonBalances.person.length; i++)
  {
    /*
    var transactions = [];
    for (var j = 0; j < jsonTransactions.transaction.length; j++)
    {
      for (var k = 0; k < jsonTransactions.transaction[j].sub_transactions.length; k++)
      {
        if (jsonTransactions.transaction[j].sub_transactions[k].from === jsonBalances.person[i].name)
        {
          transactions.push(jsonTransactions.transaction[j].sub_transactions[k]);
        }
      }
    }*/
    list.push({"name": jsonBalances.person[i].name, "balance": jsonBalances.person[i].balance});
    returnValue = {list};
  }
  res.send(returnValue);
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
    }
  }
  var transactions = fs.readFileSync(__dirname + "/" + "transactions.json");
  var jsonTransactions = JSON.parse(transactions);
  var output = [];
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
          output.push(sub_trans[j]);
        }
      }
    }
  }
  res.send(output);
  res.end();
});

router.post('/trips/:trip_id/deposit', function (req, res){
  console.log(req.body);
  var fileName = __dirname + "/" + "users.json";
  var file = require(fileName);
  file.person[req.body.user_id].balance += parseFloat(req.body.amount);
  fs.writeFile(fileName, JSON.stringify(file), function (err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(file, null, 2));
    console.log('writing to ' + fileName);
  });
  res.send(JSON.stringify("true"));
  res.end();
});


router.post('/trips/:trip_id/withdraw', function (req,res){
  var fileName = __dirname + "/" + "users.json";
  var file = require(fileName);
  console.log(req.body);
  file.person[req.body.user_id].balance -= parseFloat(req.body.amount);
  if (file.person[req.body.user_id].balance < 0)
  {
    file.person[req.body.user_id].balance += parseFloat(req.body.amount);
    res.sendStatus(400);
    res.send(JSON.stringify("false")); // this line
    res.end();
  }
  fs.writeFile(fileName, JSON.stringify(file), function (err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(file, null, 2));
    console.log('writing to ' + fileName);
  });
  res.send(JSON.stringify("true"));
  res.end();
});

router.post('/trips/:trip_id/leader/charge', function (req,res){
  var fileName = __dirname + "/" + "users.json";
  var file = require(fileName);
  var trips = fs.readFileSync(__dirname + "/" + "trips.json");
  var jsonTrips = JSON.parse(trips);
  console.log(req.body);
  var userList = [];
  for (var i = 0; i < jsonTrips.trips.length; i++)
  {
    if(jsonTrips.trips[i].id == req.params.trip_id)
    {
        userList = jsonTrips.trips[i].members;
    }
  }
  console.log(userList)
  var counter = 0;
  // update users.json file (balance field)
  for (var i = 0; i < file.person.length; i++)
  {
    // if (file.person[i].name == userList[counter])
    // {
    //   counter ++;
      console.log(parseFloat(req.body.amount))
      file.person[i].balance -= parseFloat(req.body.amount);
    // }
  }
  console.log(file)
  fs.writeFile(fileName, JSON.stringify(file), function (err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(file, null, 2));
    console.log('writing to ' + fileName);
  });
  // var fileTwoName = __dirname + "/" + ".json";
  // var fileTwo = require(fileTwoName);
  res.send(JSON.stringify("true"));
  res.end();
  // append to transactions.json as well
  // append to trips.json as well
});

router.post('/trips/:trip_id/complete_trip', function (req,res){

  // append to trips.json
  // append to users.json
});

router.post('/', function(req, res){
   res.send('POST route on things.');
});

//export this router to use in our index.js
module.exports = router;
