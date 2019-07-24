var http = require("http");
var fs = require("fs");
var path = require("path");
var querystring = require("querystring");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/ritik";

var server = http.createServer(function (req, res) {
    if (req.url === "/") {
        fs.readFile("./Homepage.html", "UTF-8", function (err, data) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    } else if (req.url.match("\.css$")) {
        var cssPath = path.join(__dirname, req.url);
        var fileStream = fs.createReadStream(cssPath, "UTF-8");
        res.writeHead(200, { "Content-Type": "text/css" });
        fileStream.pipe(res);
    } else if (req.url.match("\.png$")) {
        var imgPath = path.join(__dirname, req.url);
        var fileStream = fs.createReadStream(imgPath);
        res.writeHead(200, { "Content-Type": "image/png" });
        fileStream.pipe(res);
    } else if (req.url.match("\.jpg$")) {
        var imgPath = path.join(__dirname, req.url);
        var fileStream = fs.createReadStream(imgPath);
        res.writeHead(200, { "Content-Type": "image/jpg" });
        fileStream.pipe(res);
    } else if (req.url.match("\.jpeg$")) {
        var imgPath = path.join(__dirname, req.url);
        var fileStream = fs.createReadStream(imgPath);
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        fileStream.pipe(res);
    } else if (req.url.match("\.gif$")) {
        var imgPath = path.join(__dirname, req.url);
        var fileStream = fs.createReadStream(imgPath);
        res.writeHead(200, { "Content-Type": "image/gif" });
        fileStream.pipe(res);
    } else if (req.url.match("\.webm$")) {
        var videoPath = path.join(__dirname, req.url);
        var fileStream = fs.createReadStream(videoPath);
        res.writeHead(200, { "Content-Type": "video/webm" });
        fileStream.pipe(res);
    } else if (req.url.match("\.html$")) {
        var htmlPath = path.join(__dirname, req.url);
        var fileStream = fs.createReadStream(htmlPath, "UTF-8");
        res.writeHead(200, { "Content-Type": "text/html" });
        fileStream.pipe(res);
    }
    if (req.url == "/SignUp.html") {
        res.writeHead(200, { "Content-Type": "text/html" });
        fs.createReadStream("./SignUp.html", "UTF-8").pipe(res);
    }
    if (req.method === "POST") {
        var data = "";
        req.on("data", function (chunk) {
            data += chunk;
        });
        req.on("end", function (chunk) {
            MongoClient.connect(url, function (err, database) {
                if (err) throw err;
                var q = querystring.parse(data);
                const myAwesomeDB = database.db('ritik');
                if (q.form === "SignUp") {
                    myAwesomeDB.collection('Users').insertOne(q, function (err, response) {
                        if (err) throw err;
                        console.log("1 data inserted");
                    });
                }else if(q.form==="Login"){
                    myAwesomeDB.collection('Users').findOne({uname:q.uname}, function (err, result) {
                        if (err) throw err;
                        console.log("Hello"+JSON.stringify(result));
                    });
                }
            });

        });
    }
});
server.listen(8000);