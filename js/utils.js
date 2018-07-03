'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var escPressHandler = function (evt) {
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
  window.utils = {
    escPressHandler: escPressHandler,
    shuffleArray: shuffleArray,
    getRandomNumber: getRandomNumber,
    getRandomElement: getRandomElement,
    getRandomLengthArray: getRandomLengthArray,
    shuffledTitles: shuffleArray(window.data.TITLES)
  };
})();
