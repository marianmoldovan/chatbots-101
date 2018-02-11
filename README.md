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
smalltalk.hello => hola/buenas
smalltalk.bye => adiós/hasta luego/bye
smalltalk.love => me quieres/me amas/me deseas
smalltalk.creator => quien ha hecho el bot/quien es tu creador/quien te ha hecho
smalltalk.how => que haces/que tal/que estas haciendo
smalltalk.miss => te echamos de menos/te echo de menos
smalltalk.heaven => que tal en el cielo/estas en el cielo/cielo
smalltalk.menu => que puedes hacer/menu/que funciones tienes

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
