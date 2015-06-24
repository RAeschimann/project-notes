var fs = require('fs');

var dataFile = "./data/notes.json";


module.exports.getNotesFromServer = function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/json'});
    var stream = fs.createReadStream(dataFile);
    stream.on('open', function() {
        stream.pipe(res);
    });
    stream.on('error', function(err) { // node.json not existing
        fs.writeFile(dataFile, '[]', function(err){
            if (err) {
                res.end();
                return console.log("Error creating a new notes.json. Root cause: " + err);
            }
        });
        stream = fs.createReadStream(dataFile).pipe(res);
        console.log("creating a new notes.json because it didn't already exist.");
    });
};


module.exports.storeNotesOnServer = function(req, res) {
    var body = "";
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        res.end();
        fs.writeFile(dataFile, body , function (err) {
            if (err) return console.log(err);
            console.log('recieved via post: ' + body);
        });

    });
};

