'use strict';

(function () {
  var map = document.querySelector('.map');
  var PIN = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  // Создайте DOM-элементы, соответствующие меткам на карте, и заполните их данными из массива. Итоговую разметку метки .map__pin можно взять из шаблона .map__card
  var createPin = function (mapPin) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.style.left = mapPin.location.x - PIN.WIDTH / 2 + 'px';
    pinElement.style.top = mapPin.location.y - PIN.HEIGHT + 'px';
    pinElement.querySelector('img').src = mapPin.author.avatar;
    pinElement.querySelector('img').alt = mapPin.offer.title;
    var pinElementClickHandler = function () {
      var card = map.querySelector('.map__card');
      if (card) {
        card.remove();
      }
      window.map.renderCard(mapPin);
      document.addEventListener('keydown', window.utils.escPressHandler);
    };
    pinElement.addEventListener('click', pinElementClickHandler);

    return pinElement;
  };

  window.pin = {
    createPin: createPin,
  };

})();
