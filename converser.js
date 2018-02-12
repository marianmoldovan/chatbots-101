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
