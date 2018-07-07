'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var typeOfAccommodation = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var titleInput = adForm.querySelector('#title');
  var adFormInput = adForm.querySelectorAll('.ad-form fieldset');
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var pinList = document.querySelector('.map__pins');
  var checkinSelect = adForm.querySelector('#timein');
  var checkoutSelect = adForm.querySelector('#timeout');
  var roomSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');
  var submitButton = adForm.querySelector('.ad-form__submit');
  var inputs = adForm.querySelectorAll('input');
  var formReset = adForm.querySelector('.ad-form__reset');
  var successPopup = document.querySelector('.success');
  var minPrice = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var accomodationChangeHandler = function () {
    var accomodationMinPrice = minPrice[typeOfAccommodation.value];
    priceInput.setAttribute('min', accomodationMinPrice);
    priceInput.setAttribute('placeholder', accomodationMinPrice);
  };

  // Синхронизированы поля «Время заезда» и «Время выезда»
  var changeTime = function (check, index) {
    check.selectedIndex = index;
  };

  var checkinChangeHandler = function () {
    changeTime(checkoutSelect, checkinSelect.selectedIndex);
  };

  var checkoutChangeHandler = function () {
    changeTime(checkinSelect, checkoutSelect.selectedIndex);
  };

  // Поле «Количество комнат» синхронизировано с полем «Количество мест»
  var guestsNumberByPlace = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };

  var checkRoomCapacity = function () {
    var roomGuests = guestsNumberByPlace[roomSelect.value];
    if (roomGuests.indexOf(+capacitySelect.value) === -1) {
      capacitySelect.setCustomValidity('Количество гостей не соответствует количеству комнат');
      addError(capacitySelect);
    } else {
      capacitySelect.setCustomValidity('');
      removeError(capacitySelect);
    }
  };

  var addError = function (field) {
    field.style.borderColor = 'red';
    field.style.borderWidth = '3px';
  };

  var removeError = function (field) {
    field.style.borderColor = '';
    field.style.borderWidth = '';
  };
  var submitButtonClickHandler = function () {
    checkRoomCapacity();
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      if (input.checkValidity() === false) {
        addError(input);
      }
    }
  };

  var titleInputKeyupHandler = function () {
    if (titleInput.validity.valid) {
      removeError(titleInput);
    }
  };

  var priceInputKeyupHandler = function () {
    if (priceInput.validity.valid) {
      removeError(priceInput);
    }
  };

  var capacitySelectChangeHandler = function () {
    if (capacitySelect.validity.valid) {
      removeError(capacitySelect);
    }
  };

  var roomSelectChangeHandler = function () {
    if (roomSelect.validity.valid) {
      removeError(capacitySelect);
    }
  };

  // Нажатие на кнопку .ad-form__reset сбрасывает страницу в исходное неактивное состояние без перезагрузки
  var removePins = function () {
    var pinsList = pinList.querySelectorAll('button:not(.map__pin--main)');
    for (var j = 0; j < pinsList.length; j++) {
      pinsList[j].remove();
    }
  };

  var removeAds = function () {
    var adsList = map.querySelectorAll('article.map__card');
    if (adsList) {
      for (var k = 0; k < adsList.length; k++) {
        adsList[k].classList.add('hidden');
      }
    }
  };

  var returnMainPin = function () {
    mainPin.style.top = map.offsetHeight / 2 + 'px';
    mainPin.style.left = map.offsetWidth / 2 - window.map.MAIN_PIN.WIDTH / 2 + 'px';
  };

  var addListeners = function () {
    typeOfAccommodation.addEventListener('change', accomodationChangeHandler);
    checkinSelect.addEventListener('change', checkinChangeHandler);
    checkoutSelect.addEventListener('change', checkoutChangeHandler);
    submitButton.addEventListener('click', submitButtonClickHandler);
    titleInput.addEventListener('keyup', titleInputKeyupHandler);
    priceInput.addEventListener('keyup', priceInputKeyupHandler);
    capacitySelect.addEventListener('change', capacitySelectChangeHandler);
    roomSelect.addEventListener('change', roomSelectChangeHandler);
  };

  var removeListeners = function () {
    typeOfAccommodation.removeEventListener('change', accomodationChangeHandler);
    checkinSelect.removeEventListener('change', checkinChangeHandler);
    checkoutSelect.removeEventListener('change', checkoutChangeHandler);
    submitButton.removeEventListener('click', submitButtonClickHandler);
    titleInput.removeEventListener('keyup', titleInputKeyupHandler);
    priceInput.removeEventListener('keyup', priceInputKeyupHandler);
    capacitySelect.removeEventListener('change', capacitySelectChangeHandler);
    roomSelect.removeEventListener('change', roomSelectChangeHandler);
  };

  var resetPage = function () {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');

    for (var i = 0; i < adFormInput.length; i++) {
      adFormInput[i].setAttribute('disabled', true);
    }
    adForm.reset();
    removePins();
    removeAds();
    returnMainPin();
    window.map.fillAddress(window.map.mainPinX, window.map.mainPinYCenter);
    removeError(titleInput);
    removeError(priceInput);
    removeError(capacitySelect);
    removeListeners();
  };

  var closePopup = function () {
    successPopup.classList.add('hidden');
  };

  var popupEscPressHandler = function (evt) {
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      closePopup();
    }
  };

  var onSuccess = function () {
    resetPage();
    successPopup.classList.remove('hidden');
    document.addEventListener('keydown', popupEscPressHandler);
  };

  var onError = function (errorMessage) {
    window.utils.addErrorMessage(errorMessage);
  };

  adForm.addEventListener('submit', function (evt) {
    window.backend.getXhr(onSuccess, onError, new FormData(adForm));
    evt.preventDefault();
  });

  successPopup.addEventListener('click', closePopup);

  formReset.addEventListener('click', function (evt) {
    evt.preventDefault();
    resetPage();
  });

  window.form = {
    addListeners: addListeners,
    onError: onError
  };
})();
