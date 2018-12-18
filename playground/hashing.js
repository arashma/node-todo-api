const {SHA256}  = require("crypto-js");
const jwt       = require('jsonwebtoken');
const bcrypt       = require('bcryptjs');
// var message =  "I am here";
// var hash     = SHA256(message).toString();
//
// console.log(`Message : ${message}`);
// console.log(`Hash : ${hash}`);
// var data = {
//   id:10
// };
//
// var token   = jwt.sign(data , '123abc');
// console.log(token);
//
//
// var decoded = jwt.verify(token , '123abc');
// console.log('decode' , decoded);


var password   = '123abc!';

bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash);
    });
});


var hsashpass = '$2a$10$wVp8ybCBZtETU6fZJl4uLubPixc9C6GWReVccW6WR/9fIB.6Gbh1.';


bcrypt.compare(password, hsashpass, function(err, res) {
    // res === true
    console.log(res);
});
