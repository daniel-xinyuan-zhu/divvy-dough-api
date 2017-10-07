var express = require('express');
var router = express.Router();

/*
GET /trips
List of current and past trips for this user
{ trips: […], pastTrips: […] }
GET /trips/:trip_id
Data for this particular trip, including current user’s balance, other group members’ identities (names, who the group leader is, etc.), and, if current user is group leader, the balance of all other people.
POST /trips/:trip_id/deposit
Only applicable to non-leaders. Deposits the amount specified in the request into the group leader’s account.
POST /trips/:trip_id/withdraw
Only applicable to non-leaders. Withdraws the specified amount from the leader’s account.
POST /trips/:trip_id/charge
Only applicable to leaders. Charges the account(s) specified in the request by the specified amount.
POST /trips/:trip_id/complete_trip
Only applicable to leaders. Refunds everyone’s unspent balance. Moves the trip into the past trips category.
*/

// GET '/ping'
// Status 200 response if server is online
router.get('/ping', function(req, res){
  res.sendStatus(200);
});

router.get('/trips', function(req, res){

});

router.get('trips/:trip_id', function(req, res)){

}

router.post('/trips/:trip_id/deposit', function (req, res){

});


router.post('/trips/:trip_id/withdraw', function (req,res){

});

router.post('/trips/:trip_id/charge', function (req,res){

});

router.post('/trips/:trip_id/complete_trip', function (req,res){

});


router.get('/:id', function(req, res){
   res.send('GET route on things. Id entered is ' + req.params.id);
});

router.get('/:name/:id', function(req, res) {
   res.send('id: ' + req.params.id + ' and name: ' + req.params.name);
});

router.post('/', function(req, res){
   res.send('POST route on things.');
});

//export this router to use in our index.js
module.exports = router;
