$("#googleLogin").on("click", function(){
    window.location = "/authentication";
});

$("#addEvent").on("click", function(){
   window.location = "/addEvent"
});

$("#newEvent").on("click", function(){
    var date = new Date();
    date.setHours(20, 0, 0);

    date = date.toISOString();

    var title = $("#eventTitle").val();
    var desc = $("#eventDescription").val();
    var location = $("#eventLocation").val();

    var event = {
        "kind": "calendar#event",
        summary: title,
        description: desc,
        location: location,
        creator:
        { email: 'cgosa@tremend.ro',
            displayName: 'Cornel Gosa',
            self: true },
        organizer:
        { email: 'cgosa@tremend.ro',
            displayName: 'Cornel Gosa',
            self: true },
        start: { dateTime: date },
        end: { dateTime: date },
        "reminders": {
            "useDefault": true
        }
    };

    var params = {};
    params.event = event;

    $.post('/ajax/addEvent', params, function(success){
        if(success){
            alert("The event has been successfully added!");

            window.location = "/app";
        } else {
            alert("There has been a problem adding the event!");
        }
    });
});

var clientId = '1052598923377.apps.googleusercontent.com';
var apiKey = 'AIzaSyB0XT5iLqT2qMyU0Vy2MkDcSBVoDwriPeM';
var scopes = 'https://www.googleapis.com/auth/plus.login';

var myId;

// Use a button to handle authentication the first time.
function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth,1);
}

function checkAuth() {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}


function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
        makeApiCall();
    } else {
        handleAuthClick();
    }
}

function handleAuthClick(event) {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
    return false;
}

// Load the API and make an API call.  Display the results on the screen.
function makeApiCall() {
    gapi.client.load('plus', 'v1', function() {
        var request = gapi.client.plus.people.get({
            'userId': 'me'
        });
        request.execute(function(resp) {
            var heading = document.createElement('h4');
            heading.appendChild(document.createTextNode("Welcome "+resp.displayName));
            myId = resp.id;

            document.getElementById('welcome').appendChild(heading);
        });
    });
}

function listContacts(){
    gapi.client.load('plus', 'v1', function() {
        var request = gapi.client.plus.people.get({
            'userId': 'me'
        });
        var request2 = gapi.client.request('plus/v1/people/'+myId+'/people/visible', 'v1');
        request2.execute(function(rsp) {

            var people = rsp.items;
            var contactsDiv = $("#contacts");

            for(var i=0; i<people.length; i++){
                var item = $(document.createElement("div")).addClass("contact");
                var contact = $(document.createElement("span")).html(people[i].displayName);
                var photo = $(document.createElement("img")).attr("src", people[i].image.url).addClass("photo");

                item.append(photo);
                item.append(contact);

                contactsDiv.append(item);
            }
        });
    });
}

$("#listContacts").on("click", function(){
//    $.post('/ajax/listContacts', {}, function(res){
//
//    });

    listContacts();
});