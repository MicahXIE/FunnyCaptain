// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
const {
  dialogflow,
  BasicCard,
  Permission,
  Suggestions,
  Carousel,
  Image,
} = require('actions-on-google');

//const SELECTED_ITEM_RESPONSES = {
//  [SELECTION_KEY_ONE]: 'You selected the first item',
//  [SELECTION_KEY_GOOGLE_HOME]: 'You selected the Google Home!',
//  [SELECTION_KEY_GOOGLE_PIXEL]: 'You selected the Google Pixel!',
//};

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Define a mapping of fake color strings to basic card objects.
const colorMap = {
  'indigo taco': new BasicCard({
    title: 'Supreme',
    image: {
      url: 'https://fashionista.com/.image/c_limit%2Ccs_srgb%2Cq_auto:good%2Cw_1080/MTUwNzQ3MjI2OTI5NDM5OTYw/stockx-supreme.webp',
      accessibilityText: 'Now 20% off',
    },
    display: 'WHITE',
  }),
  'pink unicorn': new BasicCard({
    title: 'Pink Unicorn',
    image: {
      url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDbFVfTXpoaEE5Vzg/style-color-uiapplication-palette2.png',
      accessibilityText: 'Pink Unicorn Color',
    },
    display: 'WHITE',
  }),
  'blue grey coffee': new BasicCard({
    title: 'fast loan',
    image: {
      url: 'https://rxchange.s3.amazonaws.com/blog_contents/blog_image/2901488792284loan%20approved%20with%20no%20credit%20history.jpg',
      accessibilityText: 'Fast loan',
    },
    display: 'WHITE',
  }),
};

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
  // Asks the user's permission to know their name, for personalization.
  conv.ask(new Permission({
    context: 'Hi there, may I access your account?',
    permissions: 'NAME',
  }));

});

// Handle the Dialogflow intent named 'take a photo for your ID'.
//app.intent('take a photo for your ID', (conv) => {
  // Asks the user's permission to know their name, for personalization.
//  conv.ask(new Permission({
//    context: 'Hi there, to get to know you better',
//    permissions: 'NAME',
//  }));
//});

// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
  if (!permissionGranted) {
    // If the user denied our request, go ahead with the conversation.
    conv.ask(`OK, bye`);
  } else {
    
    // If the user accepted our request, store their name in
    // the 'conv.data' object for the duration of the conversation.
    conv.data.userName = conv.user.name.display;
    conv.ask(`Thanks, ${conv.data.userName}. Welcome to OCBC Assistant, How Can I help you?`);
    //conv.ask('Hi there, Welcome to OCBC Assistant, How Can I help you?')
    conv.ask(new Suggestions('insurance'));
    conv.ask(new Suggestions('loan'));
    conv.ask(new Suggestions('promotion'));
  }
});


  const SELECTION_KEY_ONE='You selected the first item';
  const SELECTION_KEY_GOOGLE_HOME = 'You selected the Google Home!';
  const SELECTION_KEY_GOOGLE_PIXEL = 'You selected the Google Pixel!';
// Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
app.intent('show the promotion list', (conv, {business}) => {

  const service = business;
  conv.ask(` ${service} `);

  // Create a carousel
  
  conv.ask(new Carousel({
    items: {
      // Add the first item to the carousel
      [SELECTION_KEY_ONE]: {
        synonyms: [
        'synonym of title 1',
        'synonym of title 2',
        'synonym of title 3',
        ],
      title: 'Title of First Carousel Item',
      description: 'This is a description of a carousel item.',
      image: new Image({
        url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDbFVfTXpoaEE5Vzg/style-color-uiapplication-palette2.png',
        alt: 'Image alternate text',
      }),
      },

          // Add the second item to the carousel
      [SELECTION_KEY_GOOGLE_HOME]: {
        synonyms: [
        'Google Home Assistant',
        'Assistant on the Google Home',
        ],
        title: 'Google Home',
        description: 'Google Home is a voice-activated speaker powered by ' +
        'the Google Assistant.',
        image: new Image({
          url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDbFVfTXpoaEE5Vzg/style-color-uiapplication-palette2.png',
          alt: 'Google Home',
      }),
      },

          // Add third item to the carousel
      [SELECTION_KEY_GOOGLE_PIXEL]: {
        synonyms: [
          'Google Pixel XL',
          'Pixel',
          'Pixel XL',
        ],
        title: 'Google Pixel',
        description: 'Pixel. Phone by Google.',
        image: new Image({
          url: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0BxFyKV4eeNjDbFVfTXpoaEE5Vzg/style-color-uiapplication-palette2.png',
          alt: 'Google Pixel',
        }),
      },
    },
  }));

  });


  app.intent('show the best loan', (conv, {loan}) => {

  const service = loan;
  conv.ask(` ${service} `);
  conv.ask(`Here's the loan information`, colorMap['blue grey coffee']);
});

 const SELECTED_ITEM_RESPONSES = {
  [SELECTION_KEY_ONE]: 'You selected the first item',
  [SELECTION_KEY_GOOGLE_HOME]: 'You selected the Google Home!',
  [SELECTION_KEY_GOOGLE_PIXEL]: 'You selected the Google Pixel!',
};

app.intent('actions.intent.OPTION', (conv, params, option) => {
  let response = 'You did not select any item';
  if (option && SELECTED_ITEM_RESPONSES.hasOwnProperty(option)) {
    response = SELECTED_ITEM_RESPONSES[option];
  }
  //conv.ask(response);
  conv.ask(`Here's the information`, colorMap['indigo taco']);
  conv.ask(new Suggestions('super saving loan!!'));
  conv.ask(new Suggestions('fast loan today'));
  conv.ask(new Suggestions('super low interests loan'));
  //conv.close(`Thank you for using our OCBC Assistant`);
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
