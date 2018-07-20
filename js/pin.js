'use strict';

(function () {
  var Pin = {
    WIDTH: 50,
    HEIGHT: 70
  };
  var map = document.querySelector('.map');
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var activePin;

  var activatePin = function (element) {
    if (activePin) {
      deactivatePin();
    }
    activePin = element;
    activePin.classList.add('map__pin--active');
  };

  var deactivatePin = function () {
    activePin.classList.remove('map__pin--active');
    activePin = null;
  };

  // Создайте DOM-элементы, соответствующие меткам на карте, и заполните их данными из массива
  var createPin = function (mapPin) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.style.left = mapPin.location.x - Pin.WIDTH / 2 + 'px';
    pinElement.style.top = mapPin.location.y - Pin.HEIGHT + 'px';
    pinElement.querySelector('img').src = mapPin.author.avatar;
    pinElement.querySelector('img').alt = mapPin.offer.title;
    var pinElementClickHandler = function () {
      var card = map.querySelector('.map__card');
      if (card) {
        card.remove();
      }
      window.map.renderCard(mapPin);
      activatePin(pinElement);
      document.addEventListener('keydown', window.utils.cardEscPressHandler);
    };
    pinElement.addEventListener('click', pinElementClickHandler);

    return pinElement;
  };

  window.pin = {
    createPin: createPin,
    deactivatePin: deactivatePin
  };

})();
