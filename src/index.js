var APP_ID = UNDEFINED;

var AlexaSkill = require('./AlexaSkill');
var https = require('https');

var somervilleGuide = function() {
  AlexaSkill.call(this, APP_ID);
};


var getInfo = function(intent, session, response) {
  var options = {
    host: "somerville.herokuapp.com",
    path: "/api/alexa/handler",
    method: "GET",
  };

  https.get(options, function(res) {
    var body = '';

    res.on('data', function(data){
      body += data;
    });

    res.on('end', function() {
      var parsed = JSON.parse(body);
      console.log(parsed.name);
      if(parsed.name === undefined) {
        var answer = "Sorry, I couldn't find anything.";
        response.tellWithCard(answer, "Activity", answer);
      } else {
        var answer = "You should try " + parsed.name;
        response.tellWithCard(answer, "Activity", answer);
      }
    });
  })

  .on('error', function(e) {
    console.log("Got error: " + e.message);
  });
};

somervilleGuide.prototype = Object.create(AlexaSkill.prototype);
somervilleGuide.prototype.constructor = somervilleGuide;

somervilleGuide.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {

    var speechOutput = "Welcome to Somerville Guide. What can I do for you?";
    var repromptText = "What do you want?";

    response.ask(speechOutput, repromptText);
};

somervilleGuide.prototype.intentHandlers = {
  getActivity: function(intent, session, response){
    getInfo(intent, session, response);
  },

  HelpIntent: function(intent, session, response){
    var speechOutput = 'Get a random activity that you can do in Somerville. ' +
      'Ask for an activity?';
    response.ask(speechOutput);
  }
};

exports.handler = function (event, context) {
  var skill = new somervilleGuide();
  skill.execute(event, context);
};
