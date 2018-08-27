'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {dialogflow} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent('coffee ask', (conv, {coffeeAsking}) => {
   
    var amountCaffeine;
    
    switch(coffeeAsking){
        case 'small coffee':
            amountCaffeine = 100;
            break;
        case 'medium coffee':
            amountCaffeine = 140;
            break;
        case 'large coffee':
            amountCaffeine = 200;
            break;
        case 'RedBull':
            amountCaffeine = 80;
            break;
    }
    
    // Respond with the user's lucky number and end the conversation.
    conv.close('You could! ' + coffeeAsking + ' has ' + amountCaffeine + " miligrams of caffeine in it");
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);