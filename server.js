var express = require('express');
var path = require('path');
var app = express();
const https = require('https');
var bodyParser = require('body-parser');

var fs = require('fs');
var ARTISTS_FILE = path.join(__dirname, 'defaultArtists.json');

app.set('port', (process.env.PORT || 8080));


app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/artists', function(req, res) {

  fs.readFile(ARTISTS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.stdout.write(data);
    res.json(JSON.parse(data));
    console.log(data);

  });


  //res.send("what the ehck ");
});

app.get('/main', function(request, response) {

    response.send('I am main');
});

app.get('/api/artists/search', function(request, response) {
    var keywords = request.param('keywords');

    var searchUrl = "https://api-3283.iheart.com/api/v1/catalog/searchAll?"
                    + "keywords=" + keywords + "&"
                    + "queryTrack=false" + "&"
                    + "queryBundle=false" + "&"
                    + "queryArtist=true" + "&"
                    + "queryStation=false" + "&"
                    + "queryFeaturedStation=false" + "&"
                    + "queryTalkShow=false" + "&"
                    + "queryTalkTheme=false" + "&"
                    + "queryKeyword=false" + "&"
                    + "countryCode=US";


    https.get(searchUrl, (res) => {
        console.log('statusCode: ', res.statusCode);
        console.log('headers: ', res.headers);

        res.on('data', (d) => {
            response.json(JSON.parse(d));
            //process.stdout.write(d);
        });

    }).on('error', (e) => {
        console.error(e);
    });

});

app.listen(app.get('port'), function() {
	console.log('Server started: http://localhost:' + app.get('port') + '/');

}); 


