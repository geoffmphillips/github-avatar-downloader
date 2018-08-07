var request = require('request');
var secrets = require('./secrets.js');
var fs = require('fs');

var repoOwner = process.argv[2];
var repoName = process.argv[3];


function getRepoContributors(owner, name, cb) {
  var options = {
    url: "https://api.github.com/repos/" + owner + "/" + name + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };

  var repURL = options.url;

  request(options, function(err, res, body) {
    var parsedJSON = JSON.parse(body);
    cb(err, parsedJSON);
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
          .on('error', function(err) {
            throw err;
          })
          .pipe(fs.createWriteStream(filePath))
          .on('finish', function () {
            console.log("DOWNLOAD COMPLETE");
          });
}


getRepoContributors(repoOwner, repoName, function(err, result) {
  if (err) {
    console.log("Sorry there was an error");
  }
  result.forEach(function(obj) {
    var path = "avatars/" + obj.login + ".jpg";
    downloadImageByURL("https://api.github.com/repos/jquery/jquery/contributors", path);
  });
});
