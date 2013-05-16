var config = require('../config');
var gapi;

module.exports = function (app, google_calendar, google_plus) {
    //The redirect URL must be matched!!
    app.all('/authentication', function (req, res) {
        //Redirect the user to Authentication From
        google_calendar.getGoogleAuthorizeTokenURL(function (err, redirecUrl) {
            if (err) return res.send(500, err);
            return res.redirect(redirecUrl);
        });
    });

    app.all("/oauthcallback", function (req, res) {

        //Get access_token from the code
        google_calendar.getGoogleAccessToken(req.query, function (err, access_token, refresh_token) {

            if (err) return res.send(500, err);

            req.session.access_token = access_token;
            req.session.refresh_token = refresh_token;
            return res.redirect('/');
        });
    });

    app.all("/login", function (req, res) {
        res.render("login.html");
    });

    app.all("/app", function (req, res) {
        var access_token = req.session.access_token;
        if (!access_token)return res.redirect('/login');

        res.render("app.html");
    });

    app.all("/addEvent", function (req, res) {
        var access_token = req.session.access_token;
        if (!access_token)return res.redirect('/login');

        res.render("addEvent.html");
    });

    app.all("/listContacts", function (req, res) {
        var access_token = req.session.access_token;
        if (!access_token)return res.redirect('/login');

        res.render("listContacts.html");
    });

    app.post('/ajax/addEvent', function (req, res) {
        var access_token = req.session.access_token;
        if (!access_token) return res.redirect('/login');

        var params = req.body;
        var entry = params.event;

        if (entry) {
            google_calendar.listCalendarList(access_token, function (err, data) {

                console.log(data);

                if (err) return res.send(500, err);

                var calendars = data.items.filter(function (calendar) {
                    return calendar.accessRole == 'owner';
                })

                var calendar = calendars[0];
                google_calendar.insertEvent(access_token, calendar.id, entry, function (err, event) {

                    if (err) {
                        return res.send(500, event);
                    }

                    return res.send(true);
                });
            });
        }

        return false;
    });

//    app.post('/ajax/listContacts', function(req, res){
////        listContacts();
//    });

    app.all('/', function (req, res) {

        var access_token = req.session.access_token;
        if (!access_token)return res.redirect('/login');

        return res.redirect('/app');
    });
}