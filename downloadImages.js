var request = require('request');
var fs = require('fs');

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

module.exports = downloadImageByURL;
