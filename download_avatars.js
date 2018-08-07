var request = require('request');
var secrets = require('./secrets.js');
var downloadImages = require('./downloadImages.js');

var repoOwner = process.argv[2];
var repoName = process.argv[3];


function getRepoContributors(owner, name, cb) {
  if (owner === undefined || name === undefined) {
    console.log("Please enter a valid repo owner and name");
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
