const Telegraf = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.on('text', (ctx) => {
  console.log(ctx)
  return ctx.reply('¡Hola pecador de la pradera!')
})

bot.startPolling()
