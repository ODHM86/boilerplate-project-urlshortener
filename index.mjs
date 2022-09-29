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
import mongoose from 'mongoose';
import validator from 'validator';
import fetch from "node-fetch";

const isValidUrl = urlString=> {
	  	var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
	    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
	    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
	    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
	    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
	    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
	  return !!urlPattern.test(urlString);
	};

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


let shorturl = new mongoose.Schema({
  url: {
    type: String,
    required: true,
//    unique: true,
    },
  short_url: Number,
  index: Number,
  full_url_short: String,
  
});
let URL_string = mongoose.model('URL', shorturl);


const app = express();



// Basic Configuration
const port = process.env.PORT || 3000;



app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use('/public', express.static(`${process.cwd()}/public`));


var list_size;

var index_url = 0;
URL_string.find()                   // find all users
         .skip()                // skip the first 100 items
         .limit()                // limit to 10 items
         .sort({url: 1})      // sort ascending by firstName
         .select({url: true}) // select firstName only
         .exec()                   // execute the query
         .then(docs => {
            console.log("the result",docs);
           console.log("size of results",docs.length);
          list_size = docs;
           index_url = docs.length +1;
          return list_size
          })
         .catch(err => {
            console.error(err)
          });
index_url = list_size;
console.log("index is (root)",index_url);


app.get('/', function(req, res) {
  let childs = req.query;
  console.log(typeof childs);
  console.log("size of child", childs[0]);
  console.log("query size: ",req.query);

  if (childs[0] == undefined){
  res.sendFile(process.cwd() + '/views/index.html');
    }
  else {
    console.log("url is invalid, sending json");
    res.json({error: "invalid url"})
  }
});

app.route('/', function(req, res) {
    console.log("value of get is: ");
  console.log("value of get is: ",req.query.v);
  /*
  if(req.value == undefined){
  res.sendFile(process.cwd() + '/views/index.html');
  }
  else{
    console.log("url is invalid, sending json");
    res.json({error: "invalid url"})
  }
  */
});
// Your first API endpoint
app.use('/api/shorturl/:url', function(req, res) {
 console.log("visit url in app.GET: ",parseInt(req.params.url));
let post_get = req.params.url;


  console.log("url is in db, query is: ", post_get);

  
    URL_string.find({short_url: post_get}).exec(function(err,personFound){
    if(err){
      console.error(err);
    }
    else{
      console.log('object is: ',personFound);
   //   let redirect = new URL("//"+personFound[0].url,"https://example.com");
      let redirect = new URL(personFound[0].url);
      console.log("type of redirect: ", typeof redirect);
      console.log("object is: ",personFound[0].url);
      res.redirect(redirect['href']);
    }
    });
  
});

app.post("/api/shorturl/", function(req, res, next){
console.log("post");
  

URL_string.find()                   // find all users
         .skip()                // skip the first 100 items
         .limit()                // limit to 10 items
         .sort({url: 1})      // sort ascending by firstName
         .select({url: true}) // select firstName only
         .exec()                   // execute the query
         .then(docs => {
            console.log("the result",docs);
           console.log("size of results",docs.length);
          list_size = docs;
           index_url = docs.length +1;
          return list_size
          })
         .catch(err => {
            console.error(err)
          });
  
console.log("list_size after db query",list_size);
  
 // index_url = list_size.length;
  console.log("value of the docs: ",list_size);
console.log(URL_string);

  console.log("size of list results: ", list_size);

  
  console.log("req.body.url: ",req.body.url);
  let post = req.body.url;
  console.log("var post: ",post);
console.log("value of docs is:", list_size);
 let short_url_value = "https://boilerplate-project-urlshortener.odhm86.repl.co/api/shorturl/" + String(index_url);

  let url_value = new URL_string({url: post, index: index_url, short_url: index_url, full_url_short: short_url_value });
  let url_short = "https://boilerplate-project-urlshortener.odhm86.repl.co/api/shorturl/" + index_url;
  let is_in = post.search('https://boilerplate-project-urlshortener.odhm86.repl.co/api/shorturl/');

let a = "data:"+post;
let  is_URL = isValidUrl(post);
  
console.log("is valid url?: ",is_URL);
  if(is_URL === false){
    console.log("url is invalid, sending json");
    res.json({error: "invalid url"})
  }
else{

    
if (is_in > -1){
  console.log("url is in db, query is: ", short_url_value);
  
    URL_string.find({full_short_url: short_url_value}).exec(function(err,personFound){
    if(err){
      console.error(err);
    }
    else{
      console.log('object is: ',personFound);
      let redirect = personFound[0].short_url;
      console.log("object is: ",personFound[0].short_url);
      res.redirect(redirect);
    }
    });
}


  
  else{
url_value.save(function (err,data){
    if(err){ 
      return console.error(err);
    }
    else {
    console.log(data);
      console.log("post saved on db");
      res.json({original_url:post ,short_url:data.short_url})
    }
  });
}
}

}
         );

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
