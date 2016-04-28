var express = require('express');
var path = require('path');
var app = express();

const https = require('https');

app.set('port', (process.env.PORT || 8080));

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('api/artists', function(request, response) {
    res.send('WHATS up');
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


