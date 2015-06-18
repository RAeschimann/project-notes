var fs = require('fs');

var dataFile = "notes.json";
var dataPath = "./data/" + dataFile;


module.exports.getNotesFromServer = function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/json'});
    var stream = fs.createReadStream(dataPath);
    stream.on('open', function() {
        console.log("getNotesFromServer called.");
        stream.pipe(res);
    });
    stream.on('error', function(err) { // node.json not existing
        fs.writeFile(dataPath, '[]', function(err){
            if (err) {
                return console.log(err);
            }
        });
        stream = fs.createReadStream(dataPath);
        stream.pipe(res);
        console.log(err);
    });


};


module.exports.storeNotesOnServer = function(req, res) {
    console.log("storeNotesOnServer called.");

    var body = "";
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        res.end();
        fs.writeFile(dataPath, body , function (err) {
            if (err) return console.log(err);
            console.log('recieved via post: ' + body);
        });

    });
};

