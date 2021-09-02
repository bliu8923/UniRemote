/**
 * App ID for the skill
 */
 //var APP_ID = "amzn1.echo-sdk-ams.app.457b56c5-258f-4dda-8f46-89848bf11af7"; //replace with "amzn1.echo-sdk-ams.app.457b56c5-258f-4dda-8f46-89848bf11af7";
 var APP_ID = "amzn1.ask.skill.457b56c5-258f-4dda-8f46-89848bf11af7";
/**
 * The AlexaSkill prototype and helper functions
 */

var http = require('https');
var AlexaSkill = require('./AlexaSkill');

/*
 *
 * Particle is a child of AlexaSkill.
 *
 */
var Particle = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Particle.prototype = Object.create(AlexaSkill.prototype);
Particle.prototype.constructor = Particle;

Particle.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Particle onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
};

Particle.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Particle onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Particle Demo, you can ask me what is the temperature or humidity. You can also tell me to turn on Red or Green light.";
	
    response.ask(speechOutput);
};

Particle.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Particle onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
};

Particle.prototype.intentHandlers = {
    // register custom intent handlers
    ParticleIntent: function (intent, session, response) {
		var sensorSlot = intent.slots.sensor;
		var lightSlot = intent.slots.light;
		var onoffSlot = intent.slots.onoff;
		var typeSlot = intent.slots.text;
	
		var sensor = sensorSlot ? intent.slots.sensor.value : "";
		var light = lightSlot ? intent.slots.light.value : "";
		var onoff = onoffSlot ? intent.slots.onoff.value : "";
		var text = typeSlot ? intent.slots.text.value : "";
		
		var speakText = "";
		
		console.log("Sensor = " + sensor);
		console.log("Light = " + light);
		console.log("OnOff = " + onoff);
		console.log("Text = " + typeSlot)
		
		var op = "";
		var pin = "";
		var pinvalue = "";
		
		// Replace these with action device id and access token
		var deviceid = "280024000c47343438323536";
		var accessToken = "da81c60d426818bb33c6de63835f59ea3c0245e2";
		
		var sparkHst = "api.particle.io";
		
		console.log("Host = " + sparkHst);
		
		if(light == "t.v."){
			response.tell(light.length);

			light = "tv";
		}
		
		// Check slots and call appropriate Particle Functions
		if(sensor == "temperature"){
			speakText = "Temperature is 69°";
			
			op = "gettmp";
		}
		else if(sensor == "humidity"){
			speakText = "Humidity is 75%";
			
			op = "gethmd";
		}
		else if(light == "tv"){

			pin = "D2";
		}
		else if(light == "red"){
			pin = "D0";
		}
		else if(light == "green"){
			pin = "D1";
		}
		else if(text.length > 0){
			speakText = "Did you want to type hi";
		}
		// User is asking for temperature/pressure
		if(op.length > 0){
			var sparkPath = "/v1/devices/" + deviceid + "/" + op;
			
			console.log("Path = " + sparkPath);
		
			makeParticleRequest(sparkHst, sparkPath, "", accessToken, function(resp){
				var json = JSON.parse(resp);
				
				console.log(sensor + ": " + json.return_value);
				
				response.tellWithCard(sensor + " is " + json.return_value + ((sensor == "temperature") ? "° Farenheit" : "%"), "Particle", "Particle!");
			});
		}
		// User is asking to turn on/off lights
		else if(pin.length > 0){
			if((onoff == "on") || (onoff == "off" && light =="tv")){
				pinvalue = "HIGH";
			//	response.tell("1");
			}
			else if(onoff == "change"){
				pinvalue = "CHANGE";
		//		response.tell(light.length);
			}
			else{
				pinvalue = "LOW";
			}
			
			var sparkPath = "/v1/devices/" + deviceid + "/ctrlled";
			
			console.log("Path = " + sparkPath);
			
			var args = pin + "," + pinvalue;
		
			makeParticleRequest(sparkHst, sparkPath, args, accessToken, function(resp){
			//	var json = JSON.parse(resp);
				
			//	console.log("Temperature: " + json.return_value);
			//	if (pin == "D2"){
			//		response.tellWithCard("OK, " + light + " turned " + onoff, "Particle", "Particle!");
				//response.tellWithCard("boosh", "Particle", "Particle!");
			//	}
			//	else{
			//	if(!(onoff == "off" && light == "tv")){
			response.tellWithCard("OK, " + light + " turned " + onoff, "Particle", "Particle!");
				//	response.tell("OK, " + light + " turned " + onoff);

			//	}
			//	response.ask("Continue?");
			//	}
			});
		//	response.tell(pin + " " + pinvalue);
			if(onoff == "off" && light == "tv"){
				
				setTimeout(makeParticleRequest(sparkHst, sparkPath, args, accessToken, function(resp){
				//	var json = JSON.parse(resp);
				
				//	console.log("Temperature: " + json.return_value);
	
				//	response.tellWithCard("OK, " + light + " turned " + onoff, "Particle", "Particle!");
			
				//	response.ask("Continue?");
			}) , 1500);
		/*makeParticleRequest(sparkHst, sparkPath, args, accessToken, function(resp){
				var json = JSON.parse(resp);
				
				console.log("Temperature: " + json.return_value);
			//	if (pin == "D2"){
			//		response.tellWithCard("OK, " + light + " turned " + onoff, "Particle", "Particle!");
				//response.tellWithCard("boosh", "Particle", "Particle!");
			//	}
			//	else{
					response.tellWithCard("OK, " + light + " light turned " + onoff, "Particle", "Particle!");
			//	}
				response.ask("Continue?");
			}); */
			}
		//	response.tell("TV turned off");
		if(pinvalue == "CHANGE"){
			response.tell("Searching through tv inputs");
		}
	//	else{
	//		response.tell("OK, " + light + " turn" + onoff);
	//		}
		}
		else{
			response.tell("Sorry, I could not understand what you said");
		}
    },
    HelpIntent: function (intent, session, response) {
        response.ask("You can ask me what is the temperature or humidity. You can also tell me to turn on Red or Green light!");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Particle skill.
    var particleSkill = new Particle();
    particleSkill.execute(event, context);
};

function makeParticleRequest(hname, urlPath, args, accessToken, callback){
	// Particle API parameters
	var options = {
		hostname: hname,
		port: 443,
		path: urlPath,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Accept': '*.*'
		}
	}
	
	var postData = "access_token=" + accessToken + "&" + "args=" + args;
	
	console.log("Post Data: " + postData);
	
	// Call Particle API
	var req = http.request(options, function(res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		
		var body = "";
		
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
			
			body += chunk;
		});
		
		res.on('end', function () {
            callback(body);
        });
	});

	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	// write data to request body
	req.write(postData);
	req.end();
}