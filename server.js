var express = require('express');
var app = express();

var expressMongoDb = require('express-mongo-db');
app.use(expressMongoDb(process.env.MONGODB_URI));

app.get('/create/:url', (req, res) => {
    req.db.collection('urls').count().then(result => {
        var item = {
            url: req.params['url'],
            slug: String(result)
        };
    
        req.db.collection('urls').save(item, (err, result) => {
            if (err) {
                res.end("Could not create slug.");
            }
            
            res.end(JSON.stringify({
                originalUrl: item.url,
                shortUrl: 'http://' + req.hostname + '/' + item.slug
            }));
        });
    });
    
    
});

app.get('/:slug', (req, res) => {
    var slug = req.params['slug'];
    req.db.collection('urls').findOne({slug: slug}).then(result => {
        res.redirect(result.url);
    });
});

app.get('/', (req, res) => {
    res.end('Use /create/:url to create a new shortened url, or /:slug to redirect.');
})

app.listen(process.env.PORT, "0.0.0.0", function() {
    console.log("listening on port" + process.env.PORT);
});



