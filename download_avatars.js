var fs = require('fs');
var request = require('request');
var downloadImages = require('./downloadImages.js');
require('dotenv').config();

var args = process.argv.slice(2);
var repoOwner = args[0];
var repoName = args[1];

// Creates ./avatars directory if it doesn't exist
fs.access("avatars", function(err) {
  if (err && err.code === "ENOENT") {
    fs.mkdir("avatars", function(error) {
      if (error) {
        console.log("Error: ", error);
      }
    });
  }
});

function getRepoContributors(owner, name, cb) {
  // Throws user error if user does not input both a repo owner and repo name
  if (args.length < 2) {
    console.log("Please enter both a repo owner and repo name");
    return;
  }

  // Throws error if user inputs too many arguments
  if (args.length >= 3) {
    console.log("Too many words! Please only enter a repo owner and repo name.");
    return;
  }

  var options = {
    url: "https://api.github.com/repos/" + owner + "/" + name + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': process.env.GITHUB_TOKEN
    }
  };

  // Creates and parses JSON, passes it to callback function
  request(options, function(err, res, body) {

    // Gives user errors if status is 404 (invalid repo owner or name) or 401 (bad github token)
    var status = res.caseless.dict.status;
    switch (status) {
      case "404 Not Found":
        console.log("Error: ", status, "\nPlease enter a valid repo owner and name.");
        return;
      case "401 Unauthorized":
        console.log("Error: ", status, "\nPlease use valid github token.");
        return;
      default:
        break;
    }

    // Passes parsedJSON to callback function
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
