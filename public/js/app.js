
/*

 This example is showing how to access google calendar with OAuth (version 2).
 After successfully login, the example generate a simple webpage that list all of your calendars' name.

 require - express (http://expressjs.com)
 - restler (https://github.com/danwrong/restler)

 */

var util = require('util');
var url  = require('url');
var express  = require('express');

var GoogleCalendar = require('./GoogleCalendar');
var GooglePlusAPI = require('./GooglePlus');
var config = require('../config');

var app = express.createServer();
app.use(express.cookieParser());
app.use(express.session({
    secret: "skjghskdjfhbqigohqdiouk"
}));

app.set('views', __dirname + '/../views');
app.use(express.bodyParser());
app.use(express.static(__dirname + '/../'));
app.set('view options', {
    layout: false
});

app.register('.html', {
    compile: function(str, options){
        return function(locals){
            return str;
        };
    }
});

app.listen(8080);

//Create OAuth Instance
var google_calendar = new GoogleCalendar.GoogleCalendar(
    config.google.clientID,
    config.google.clientSecret,
    config.google.callbackURL);

var google_plus = new GooglePlusAPI(config.google.APIKey2);

require('./routes.js')(app, google_calendar, google_plus);