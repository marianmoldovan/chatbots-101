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
