const Telegraf = require('telegraf')
const TelegrafWit = require('telegraf-wit')
const converser = require('./converser');

const bot = new Telegraf(process.env.BOT_TOKEN)
const wit = new TelegrafWit(process.env.WIT_TOKEN)

bot.on('text', (ctx) => {
  return wit.meaning(ctx.message.text).then(respond).then(ctx.reply)
})

function respond(nlu){
  return new Promise((resolve, reject) => {
    if(nlu.entities.intent && nlu.entities.intent.length > 0){
      let intent = nlu.entities.intent[0]
      resolve(converser.smalltalk[intent.value])
    }
    else resolve('No te entiendorrrl. Pregúntame otra cosa fistro pecador.')
  });
}

bot.startPolling()
