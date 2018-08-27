'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {dialogflow} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

const CAFFEINE_CONSUMPTION = 3;

// Handle the Dialogflow intent named 'coffee ask'.
// The intent collects a parameter named 'coffeeAsking'.
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

// Respond end the conversation.
// conv.close('You could, ' + coffeeAsking + ' has ' + amountCaffeine + " milligrams of caffeine in it. You'll stop feeling the effects at "
//  + doHalfLifeCalculations(amountCaffeine));
});

// Handle the Dialogflow intent named 'coffee ask'.
// The intent collects two lists named 'pastCoffees and pastTimes'.
app.intent('coffee past', (conv, {pastCoffees, pastTimes}) => {

    if (pastCoffees.length != pastTimes.length)
{
    conv.ask("I'm sorry, but I need each individual time you had caffeine and what you had. Want to try again?");
}
else
{
    var coffees = "";

    // Respond end the conversation.
    for (var coffee in pastCoffees)
    {
        coffees+=pastCoffees[coffee]+", "
    }

    conv.close('If you had a ' + coffees + 'you could!!');
}
});


function getCaffeineLimit()
{
    //The available guidelines for caffeine use suggests that
    // performance benefits can be seen with moderate amounts (2-4 mg·kg–1 body mass) of caffeine -
    // benefits are lost between 4-6 mg·kg–1, which aligns with the recommendations of Health Canada and the EU.

    //CAFFEINE CONSUMPTION is returned from GenomeLink, and the value is converted in the following way:
    var MGperKG = 4 + CAFFEINE_CONSUMPTION * 0.5;

    //This gets the user's body mass and converts to Kg - only needed once


    return 400;
}

function doHalfLifeCalculations(amountCaffeine)
{
    //Half-life of caffeine in minutes
    const HALFLIFE = 5*60;

    //Equation for half-life is N(t) = AMOUNT * e ^ (k*t), where t is time, and k is (ln(1/2)/HALFLIFE) - N(t) is the amount left

    var K = (-0.693147181/HALFLIFE);

    //We need to check when N(t) =< UNNOTICEABLE_AMOUNT, which is when caffeine effects become unnoticeable

    var UNNOTICEABLE_AMOUNT = getCaffeineLimit() / 2;
    var t = 0;
    var N_t = amountCaffeine * Math.exp(K*t);

    while (N_t >= UNNOTICEABLE_AMOUNT)
    {
        N_t = amountCaffeine * Math.exp(K*t);
        t++;
    }

    //t is now equal to the number of minutes until caffeine < 20mg. We now need to convert that into a time
    var d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes();

    minutes += t%60;

    hours += (t-t%60)/60;


    var minutesFinal = minutes%60;
    hours += (minutes-minutesFinal)/60;
    hours = hours%24;

    //Fixes notation

    var AMorPM = "AM";
    if (hours > 12)
    {
        AMorPM = "PM";
    }
    hours=hours%12;

    if (hours === 0)
        hours = 12;

    if (minutesFinal < 10)
        minutesFinal = "0"+minutesFinal;

    var result = hours+":"+minutesFinal+" "+AMorPM;

    return result;
}

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);