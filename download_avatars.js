var request = require('request');
var secrets = require('./secrets.js');
var fs = require('fs');


function getRepoContributors(repoOwner, repoName, cb) {

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    cb(err, body);
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


getRepoContributors("jquery", "jquery", function(err, result) {
  if (err) {
    console.log("Sorry there was an error");
  }
  var parsedJSON = JSON.parse(result);
  parsedJSON.forEach(function(obj) {
    console.log("URLs: ", obj.avatar_url);
  });
});

downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg");
