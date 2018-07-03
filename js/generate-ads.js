'use strict';

(function () {

  // Массив похожих объявлений
  window.generateAds = function (number) {
    var similarAds = [];

    for (var i = 0; i < number; i++) {
      var randomX = window.utils.getRandomNumber(300, 900);
      var randomY = window.utils.getRandomNumber(130, 630);
      var adFeatures = {
        author: {
          avatar: 'img/avatars/user0' + (i + 1) + '.png'
        },
        offer: {
          title: window.utils.shuffledTitles[i],
          address: randomX + ' ' + randomY,
          price: window.utils.getRandomNumber(window.data.price.min, window.data.price.max),
          type: window.utils.getRandomElement(window.data.TYPES),
          rooms: window.utils.getRandomNumber(window.data.rooms.min, window.data.rooms.max),
          guests: window.utils.getRandomNumber(window.data.guests.min, window.data.guests.max),
          checkin: window.utils.getRandomElement(window.data.CHECKS),
          checkout: window.utils.getRandomElement(window.data.CHECKS),
          features: window.utils.getRandomLengthArray(window.data.FEATURES),
          description: '',
          photos: window.utils.shuffleArray(window.data.PHOTOS)
        },
        location: {
          x: randomX,
          y: randomY
        }
      };

      similarAds.push(adFeatures);
    }
    return similarAds;
  };
})();
