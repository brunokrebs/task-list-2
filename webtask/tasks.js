'use strict';
// imports node modules
const express = require('express');
const mongojs = require('mongojs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// creates Express app with JSON body parser
const app = new express();
app.use(bodyParser.json());

// defines REST API (HTTP methods)
app.get('/', getTasks);
app.post('/', addTask);
app.delete('/', deleteTask);

// exports REST API
module.exports = app;

function addTask(req, res) {
  let userCollection = loadUserCollection(req.webtaskContext);
  
  // save new task to user collection
  userCollection.save({
    createdAt: new Date(),
    description: req.body.description
  }, () => res.end())
}

function getTasks(req, res) {
  let userCollection = loadUserCollection(req.webtaskContext);
  
  // retrieves all tasks sorting by descending creation date
  userCollection.find().sort({ createdAt: -1 }, (err, data) => {
    res.status(err ? 500 : 200).send(err || data);
  });
}

function deleteTask(req, res) {
  let userCollection = loadUserCollection(req.webtaskContext);
  
  // removes a task based on its id
  userCollection.remove({ _id: mongojs.ObjectId(req.query.id) }, () => res.end());
}

function loadUserCollection(webtaskContext) {
  // this secrets are configured when creating the Webtask
  const AUTH0_SECRET = webtaskContext.secrets.AUTH0_SECRET;
  const MONGO_USER = webtaskContext.secrets.MONGO_USER;
  const MONGO_PASSWORD = webtaskContext.secrets.MONGO_PASSWORD;
  const MONGO_URL = webtaskContext.secrets.MONGO_URL;
  
  // removes the 'Bearer ' prefix that comes in the authorization header,
  let authorizationHeader = webtaskContext.headers.authorization;
  authorizationHeader = authorizationHeader.replace('Bearer ', '');
  
  // verifies token authenticity
  let token = jwt.verify(authorizationHeader, AUTH0_SECRET);
  
  // connects to MongoDB and returns the user collection
  let mongodb = mongojs(`${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URL}`);
  return mongodb.collection(token.sub);
}