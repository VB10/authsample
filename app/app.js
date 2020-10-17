const express = require('express')
var jwtExpress = require('express-jwt');
var jwt = require('jsonwebtoken');
require('dotenv').config()

const {
  ReasonPhrases,
  StatusCodes
} = require('http-status-codes');

const Credantial = require('./model/credantial');

const fs = require('fs');

const app = express()
const port = 3000

var publicKey = fs.readFileSync('./private.key');

app.listen(port, () => console.log(`Example app listening on port port!`))

app.use(jwtExpress({
  secret: process.env.ACCESS_TOKEN_SECRET,
  credentialsRequired: false,
  algorithms: ['HS256']
}));


app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {

    res.status(err.status).send({
      message: err.message
    });
    logger.error(err);
    return;
  }
  next();
});



app.get('/protected',
  jwtExpress({
    secret: process.env.ACCESS_TOKEN_SECRET,
    algorithms: ['HS256']
  }),
  function (req, res) {
    console.log(req.user.admin);
    if (!req.user.admin) return res.sendStatus(StatusCodes.UNAUTHORIZED);
    res.sendStatus(StatusCodes.OK);
  });

app.get('/token', (req, res) => {
  jwt.sign({
    "user": "VB",
    "date": Date()
  }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1m",
    issuer: "VB",
    algorithm: 'HS256',
  }, (err, token) => {
    console.log(token);
    console.log(err);
    res.status(StatusCodes.OK).jsonp(new Credantial('VB', token));
  })
});