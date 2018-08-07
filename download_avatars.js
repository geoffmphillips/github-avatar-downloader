var request = require('request');
var secrets = require('./secrets.js');
var dotenv = require('dotenv').config();
var downloadImages = require('./downloadImages.js');

var args = process.argv.slice(2);
var repoOwner = args[0];
var repoName = args[1];


function getRepoContributors(owner, name, cb) {
  if (owner === undefined || name === undefined) {
    console.log("Please enter a valid repo owner and name");
    return;
  }

  if (args.length > 2) {
    console.log("Too many words! Please only enter a repo owner and repo name.");
    return;
  }

  var options = {
    url: "https://api.github.com/repos/" + owner + "/" + name + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    var parsedJSON = JSON.parse(body);
    cb(err, parsedJSON);
  });
}

getRepoContributors(repoOwner, repoName, function(err, result) {
  if (err) {
    console.log("Sorry there was an error");
  }
  result.forEach(function(obj) {
    var path = "avatars/" + obj.login + ".jpg";
    var downloadURL = obj.avatar_url;
    downloadImages(downloadURL, path);
  });
});
