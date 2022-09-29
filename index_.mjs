// require('dotenv').config();
/*
const express = require('express');
import express as express;
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
import fetch from "node-fetch";
*/

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

import fetch from "node-fetch";

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


app.post("/api/shorturl/", function(req, res, next){
  
  console.log(req.body.url);
  let post = req.body.url;
  console.log(post);


  const url = new URL(
    "https://t.ly/api/v1/link/shorten"
);
const params = {
    "api_token":process.env.API,
};
  
Object.keys(params)
    .forEach(key => url.searchParams.append(key, params[key]));

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "long_url": post,
    "include_qr_code": false
};

fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
}).then(response => response.json())
  .then((data) => {
    let url_json = data;
    let url_long = url_json.long_url;
let url_short = url_json.short_url;

  res.json({original_url: url_long,short_url:url_short});
//    res.json(data);
  });

});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
