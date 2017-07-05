/**
 * Created by mark.sancho on 6/27/2017.
 */
'user strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

const token = 'EAATKiHYPEmABANfbzt0wOJ6qhDoMDv8fxEhfT6MBdQfnZC1iLoOfDh5GvaxNS3VWxYXYU7hzTpY9oPiOLOLSRnsNjjKZAuwxiuy8MhuuyQMbtwVZCSHFSZBweAZBLh3Ld355dtNQvDLI90HIC2yXw6b3eT7kwURnfCJ653Im8KxlNZAMFROY7d';

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot');
});

app.get('/help', function (req, res) {
    res.send('Privacy Policy');
});

app.get('/tos', function (req, res) {
    res.send('Terms of Service');
});

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
});

app.post('/webhook/', function (req, res) {
    var messaging_events = req.body.entry[0].messaging
    for (var i = 0; i < messaging_events.length; i++) {
        var event = req.body.entry[0].messaging[i]
        var sender = event.sender.id
        if (event.message && event.message.text) {
            var text = event.message.text
            if(text.indexOf('weather') > -1) {
                sendTextMessage(sender, "the weather in manila is cloudy");
            }
            else if(text.indexOf('time') > -1) {
                var date = new Date();
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var ampm = hours >= 12 ? 'pm' : 'am';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? '0'+minutes : minutes;
                var strTime = hours + ':' + minutes + ' ' + ampm;
                sendTextMessage(sender, "The time now is " + strTime);
            } 
			else if(text.indexOf('pogi') > -1) {
				sendTextMessage(sender, "of course you!");
			}
			//else {
                //sendTextMessage(sender, "try asking about the weather or time.");
            //}
        }
    }
    res.sendStatus(200)
});

function sendTextMessage(sender, text) {
    var messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})


