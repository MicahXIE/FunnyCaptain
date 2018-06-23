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

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Define a mapping of fake color strings to basic card objects.
const map = {
  'supreme': new BasicCard({
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
  'loan': new BasicCard({
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
        'Supreme Assistant',
        ],
      title: 'Supreme',
      description: 'Supreme is an American skateboarding shop and clothing brand established in New York City in April 1994. The brand caters to the skateboarding, hip hop, and rock cultures, as well as to the youth culture in general.',
      image: new Image({
        url: 'https://fashionista.com/.image/c_limit%2Ccs_srgb%2Cq_auto:good%2Cw_1080/MTUwNzQ3MjI2OTI5NDM5OTYw/stockx-supreme.webp',
        alt: 'supreme',
      }),
      },

          // Add the second item to the carousel
      [SELECTION_KEY_GOOGLE_HOME]: {
        synonyms: [
        'LOUIS VUITTON Assistant',
        ],
        title: 'LOUIS VUITTON',
        description: 'Louis Vuitton is one of the world leading international fashion houses; it sells its products through standalone boutiques, lease departments in high-end department stores, and through the e-commerce section of its website.',
        image: new Image({
          url: 'https://scontent-sit4-1.xx.fbcdn.net/v/t1.0-9/13076942_10156779867925125_7551374868537674552_n.png?_nc_cat=0&oh=e145579abb3f07e7819ce7fece2206be&oe=5BA78585',
          alt: 'LOUIS VUITTON',
      }),
      },

          // Add third item to the carousel
      [SELECTION_KEY_GOOGLE_PIXEL]: {
        synonyms: [
          'Google Pixel XL 2',
          'Pixel',
          'Pixel XL 2',
        ],
        title: 'Google Pixel',
        description: 'Pixel. Phone by Google.',
        image: new Image({
          url: 'https://www.singtel.com/content/dam/singtel/eshop/Mobile/Handset/Google/pixel%202%20XL/google-pixel-2-XL-black-380x380-01.jpg',
          alt: 'Google Pixel',
        }),
      },
    },
  }));

  });


app.intent('show the best loan', (conv, {loan}) => {

  const service = loan;
  conv.ask(` ${service} `);
  conv.ask(`Here's the loan information`, map['loan']);
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

  conv.ask(`Here's the information`, map['supreme']);
  conv.ask(new Suggestions('super saving loan'));
  conv.ask(new Suggestions('fast loan today'));
  conv.ask(new Suggestions('super low interests loan'));
  
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);


