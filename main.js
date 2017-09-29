var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(morgan("dev"));

app.get('/', function(req, res){
    res.send('hello');
});

app.listen(process.env.PORT || 3000, function(){
    console.log('listening on port 3000');
});