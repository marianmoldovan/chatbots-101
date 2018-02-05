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
