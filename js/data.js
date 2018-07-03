'use strict';

(function () {

  window.data = {
    adsNumber: 8,
    TITLES: [
      'Большая уютная квартира',
      'Маленькая неуютная квартира',
      'Огромный прекрасный дворец',
      'Маленький ужасный дворец',
      'Красивый гостевой домик',
      'Некрасивый негостеприимный домик',
      'Уютное бунгало далеко от моря',
      'Неуютное бунгало по колено в воде'
    ],
    TYPES: ['palace', 'flat', 'house', 'bungalo'],
    CHECKS: ['12:00', '13:00', '14:00'],
    FEATURES: [
      'wifi',
      'dishwasher',
      'parking',
      'washer',
      'elevator',
      'conditioner'
    ],
    PHOTOS: [
      'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
    ],
    price: {
      min: 1000,
      max: 1000000
    },
    rooms: {
      min: 1,
      max: 5
    },
    guests: {
      min: 1,
      max: 10
    }
  };

})();
