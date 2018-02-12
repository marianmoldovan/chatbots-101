## Chatbots 101 or 'Chatbots, de cero a ¡Perdona, no te he entendido!'

The idea of this workshop is to develop a chatbot with the personality of Chiquito de la Calzada, the famous spanish humourist. For that, will use Telegram as the messaging channel, [Telegraf](https://github.com/telegraf/telegraf) as the bot development framework and Node.JS along with Javascript.

### Milestone 1. A Hello world chat that answers anything.

#### 1. Create a repository in github and clone it locally (you can also not use git, but meah)
#### 2. Go to the folder and init a NPM project
```
npm init
```
#### 3. Install [Telegraf](https://github.com/telegraf/telegraf)
```
npm install telegraf -s
```
#### 4. Write some code for a Hello World chatbot, something like:
```
const Telegraf = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.on('text', (ctx) => {
  return ctx.reply('¡Hola pecador de la pradera!')
})

bot.startPolling()
```
#### 5. If we run it, it will fail, so ne need a Bot Token from Telegram. So we need to go to a Telegram client and talk to the [BotFather](https://telegram.me/BotFather) to create a bot. We can use any name, we can change it later. We just have to copy the token and set it up in the BOT_TOKEN environment variable, just like:
```
export BOT_TOKEN=somerandomkeythatshouldbethetokenkeyfromthebotfather
```
#### 6. Run the bot and test it, talking with the chatbot you created earlier
```
node index.js
```

### Milestone 2. Let's make some small talk

We are going to use Wit.ai as a NLU engine. That means that we are going to send every message the user writes to us to an API, and this service of NLU will let us know what is the intention of the phrase along with the possible entities.

#### 1. We need to design the conversation. We are going to map a series of sentences to an intent. Let's use this:
* smalltalk.hello => hola/buenas  
* smalltalk.bye => adiós/hasta luego/bye  
* smalltalk.love => me quieres/me amas/me deseas  
* smalltalk.creator => quien ha hecho el bot/quien es tu creador/quien te ha hecho  
* smalltalk.how => que haces/que tal/que estas haciendo  
* smalltalk.miss => te echamos de menos/te echo de menos  
* smalltalk.heaven => que tal en el cielo/estas en el cielo/cielo  
* smalltalk.menu => que puedes hacer/menu/que funciones tienes  

#### 2. Create a [Wit.ai](https://wit.ai/) account and create a new project (in this case in Spanish). Then start writting the sentences from above and associate them with the entity called 'intent' and named just as above. After finished with all the phrases, test a few of them in the wit.ai console to check.

#### 3. Integrate the Wit.ai NLU features in your chatbot. For that, we are going to use the [telegraf-wit](https://github.com/telegraf/telegraf-wit) pluging.

So first install it:
```npm install telegraf-wit --save```
Next, add the dependency and create an instance of the object. You may need to search for the API KEY back in the wit console, in the settings area.
```
const TelegrafWit = require('telegraf-wit')
const wit = new TelegrafWit(process.env.WIT_TOKEN)
```
Then, inside the on 'text' event we will call wit using the following block. Then we will return the json to the user (just for now).
```
return wit.meaning(ctx.message.text).then((result) => {
    return ctx.reply(JSON.stringify(result, null, 2))
  })
```

#### 4. Create response for each one of the intents we create previously. I created a little file containing the text responses to the intents, the file is called [converser.js](converser.js). So, integrate this file in your project and import it as a module. Finally, you need to respond with the phrases from that file. Modify the index.js to have something like this:
```
bot.on('text', (ctx) => {
  return wit.meaning(ctx.message.text).then(respond).then(ctx.reply)
})

function respond(nlu) {
  return new Promise((resolve, reject) => {
    if(nlu.entities.intent && nlu.entities.intent.length > 0){
      let intent = nlu.entities.intent[0]
      resolve(converser.smalltalk[intent.value])
    }
    else resolve('No te entiendorrrl. Pregúntame otra cosa fistro pecador.')
  });
}
```
#### 5. Finally, run again the bot and check that responds to the messages. You now, ```node index```

### Milestone 3. Let's make the chatbot a little bit smarter

We are going to add two dynamic features. We are making chiquitobot say jokes, consuming an API, and also find comedy venues near your city. All this features are contained in an REST API. So we have this 2 endpoinds:
1. This one will return a random joke ```https://ll7g87zs1c.execute-api.eu-west-1.amazonaws.com/latest/joke```
2. And this will return 5 venues happening in a city (the param is optional) ```https://ll7g87zs1c.execute-api.eu-west-1.amazonaws.com/latest/events?city=Madrid```

#### 1. First, we will add 2 more intents to the conversation, so we need to train 2 new actions in the wit.ai dashboard:
* action.joke => dime un chiste/cuentate un chiste/un chiste/cuentame otro chiste  
* action.circ => llevame al circo/ quiero comedia/llevame al teatro/dime donde ir/que puedo hacer  

Additionally, we are going to add a city entity to the action.circ intent, so when we add a phrase like 'llevame al circo de Madrid', we will mark Madrid as a new entity called 'city'. We should train a few cities, so we can make sure that it gets recognized properly.

#### 2. Control in the dialog's flow, when the intent name starts with action, and create the proper functions in the [converser.js](converser.js) file. We are gonna make the respective calls to the API's provided. We also have to install the request module, ```npm install request --save```.So, this is the code of the files:

[converser.js](converser.js)
```
'use strict';

const request = require('request');

module.exports.smalltalk = {
  'smalltalk.bye': '¡Hasta luego, Lucas!',
  'smalltalk.hello': '¡Hola hijo míoorrr!',
  'smalltalk.love': 'Te va a hasé pupitaa sexuarl torpedo',
  'smalltalk.creator': 'Mi creador es un pecador, twitea @marianmoldovan',
  'smalltalk.how': 'Estoy más perdido que el carro de Manolo Escobar',
  'smalltalk.miss': '¡Te voy a borrar el cerito sesualrllr!',
  'smalltalk.heaven': 'Más feliz que McGuiver en un desgüace ¿Te da cuen?',
  'smalltalk.menu': 'Mi chatbot duodeno es muy limitado, pregúntame por un chiste o por un circo en tu ciudad'
}

module.exports.action = {
  'action.joke': (ctx, callback) => {
    request('https://ll7g87zs1c.execute-api.eu-west-1.amazonaws.com/latest/joke', function (error, response, body) {
      callback(JSON.parse(body).content)
    })
  },
  'action.circ': (ctx, callback) => {
    let queryUrl = 'https://ll7g87zs1c.execute-api.eu-west-1.amazonaws.com/latest/events'
    if(ctx.nlu.entities.city && ctx.nlu.entities.city.length > 0)
      queryUrl = queryUrl + '?city=' + ctx.nlu.entities.city[0].value
    request(queryUrl, function (error, response, body) {
      let venues = JSON.parse(body)
      let venue = venues[Math.floor(Math.random() * venues.length)];
      ctx.replyWithPhoto(venue.logo, {caption: venue.name + ' en ' + venue.venue_name + '. Más info en ' + venue.url})
      callback('Podrías ir a este chow, pecadorr!')
    })
  }
}

```

[index.js](index.js)
```
const Telegraf = require('telegraf')
const TelegrafWit = require('telegraf-wit')
const converser = require('./converser');

const bot = new Telegraf(process.env.BOT_TOKEN)
const wit = new TelegrafWit(process.env.WIT_TOKEN)

bot.on('text', (ctx) => {
  wit.meaning(ctx.message.text)
    .then(nlu => dialog(nlu, ctx))
    .then(ctx.reply)
})

function dialog(nlu, ctx){
  return new Promise((resolve, reject) => {
    if(nlu.entities.intent && nlu.entities.intent.length > 0){
      let intent = nlu.entities.intent[0]
      if(intent.value.startsWith('smalltalk'))
        resolve(converser.smalltalk[intent.value])
      else {
        ctx.nlu = nlu
        converser.action[intent.value](ctx, (content) => {
          resolve(content)
        })
      }
    }
    else resolve('No te entiendorrrl. Pregúntame otra cosa fistro pecador.')
  })
}

bot.startPolling()
```

As you can see, we also changed the text of the menu intent, indicating the features of the chatbot

#### 3. Finally, run again the bot and check that responds to the messages. You now, ```node index```
