'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var cardEscPressHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.map.closeCard();
    }
  };

  // Тасование массива
  var shuffleArray = function (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  // Случайное число в определенном диапазоне
  var getRandomNumber = function (min, max) {
    var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  };

  // Случайный элемент массива
  var getRandomElement = function (array) {
    var randomElement = Math.floor(Math.random() * array.length);

    return array[randomElement];
  };

  // Массив строк случайной длины
  var getRandomLengthArray = function (array) {
    var newLength = getRandomNumber(0, array.length);
    var tempArray = shuffleArray(array);
    var newArray = [];
    for (var i = 0; i < newLength; i++) {
      newArray.push(tempArray[i]);
    }
    return newArray;
  };

  var addErrorMessage = function (errorMessage) {
    var node = document.createElement('div');
    node.style.zIndex = '100';
    node.style.color = '#ff5635';
    node.style.backgroundColor = '#ffffff';
    node.style.position = 'absolute';
    node.style.bottom = 0;
    node.style.left = '50%';
    node.style.fontSize = '30px';
    node.style.padding = '10px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);

    setTimeout(function () {
      document.body.removeChild(node);
    }, 5000);
  };

  window.utils = {
    ESC_KEYCODE: ESC_KEYCODE,
    cardEscPressHandler: cardEscPressHandler,
    shuffleArray: shuffleArray,
    getRandomNumber: getRandomNumber,
    getRandomElement: getRandomElement,
    getRandomLengthArray: getRandomLengthArray,
    addErrorMessage: addErrorMessage
  };
})();
