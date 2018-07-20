'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var pinList = document.querySelector('.map__pins');
  var adForm = document.querySelector('.ad-form');
  var filters = document.querySelector('.map__filters');
  var filterFields = filters.querySelectorAll('select, input');
  var cardEscPressHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.map.closeCard();
    }
  };

  var addErrorMessage = function (errorMessage) {
    var node = document.createElement('div');
    node.style.zIndex = '100';
    node.style.color = '#ff5635';
    node.style.backgroundColor = '#ffffff';
    node.style.position = 'fixed';
    node.style.top = '50%';
    node.style.left = '40%';
    node.style.fontSize = '30px';
    node.style.padding = '10px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('beforeend', node);

    setTimeout(function () {
      document.body.removeChild(node);
    }, 5000);
  };

  window.utils = {
    ESC_KEYCODE: ESC_KEYCODE,
    cardEscPressHandler: cardEscPressHandler,
    addErrorMessage: addErrorMessage,
    map: map,
    mainPin: mainPin,
    pinList: pinList,
    adForm: adForm,
    filters: filters,
    filterFields: filterFields
  };
})();
