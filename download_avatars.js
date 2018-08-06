var request = require('request');
var secrets = require('./secrets.js');


function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets
    }
  };

  request(options, function(err, res, body) {
    cb(err, body);
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors: ", err);
  var parsedJSON = JSON.parse(result);
  parsedJSON.forEach(function(obj) {
    console.log("URLs: ", obj.avatar_url);
  });
});
