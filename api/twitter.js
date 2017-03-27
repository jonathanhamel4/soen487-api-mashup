"use strict";
const twitter = require('twitter');
const tConfig = require('../config/config.json').twitter;

var client = new twitter(tConfig);

module.exports = {
  getTrends: getTrends
}

/*
 params = lat & long
*/
function getTrends(location){
  return getClosest(location).then((woeid) => {
    if(woeid){
      return getTrendingTweets(woeid);
    } else {
      return null;
    }
  }).catch(err => {
    console.log(err);
  })
}

function getClosest(location){
  return new Promise((resolve, reject) => {
    client.get('/trends/closest.json', location, function(error, trends, response){
      var woeid = trends.length > 0 ? trends[0].woeid : null;
      resolve(woeid);
    });
  });
}

function getTrendingTweets(woeid){
  return new Promise((resolve, reject) => {
    console.log(woeid);
    client.get("/trends/place.json", {id: woeid}, function(error, tweets, response){
      if(tweets.length && tweets[0].trends && tweets[0].trends.length){
        resolve(tweets[0].trends.slice(0, 3));
      } else {
        resolve([]);
      }
    });
  });
}