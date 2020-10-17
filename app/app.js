const express = require('express')
var jwtExpress = require('express-jwt');
var jwt = require('jsonwebtoken');
require('dotenv').config()

const {
  ReasonPhrases,
  StatusCodes
} = require('http-status-codes');

const Credantial = require('../model/credantial');
const User = require('../model/user');

const fs = require('fs');

const app = express()
const port = 3000


app.listen(port, () => console.log(`Example app listening on port port!`))

app.use(jwtExpress({
  secret: process.env.ACCESS_TOKEN_SECRET,
  credentialsRequired: true,
  algorithms: ['HS256'],
}).unless({
  path: ['/token']
}));

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    console.log("aa");
    res.status(err.status).send({
      message: err.message
    });
    logger.error(err);
    return;
  }
  next();
});


app.get('/veli', (req, res) => {
  res.jsonp({
    "name": "vb"
  });
});



app.get('/user',
  jwtExpress({
    secret: process.env.ACCESS_TOKEN_SECRET,
    algorithms: ['HS256']
  }),
  function (req, res) {
    return res.status(StatusCodes.OK).jsonp(new User("Veli", Date(), "Istanbul"));
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

    res.status(StatusCodes.OK).jsonp(new Credantial('VB', token));
  })
});