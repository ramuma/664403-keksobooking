'use strict';

(function () {
  var typeOfAccommodation = window.utils.adForm.querySelector('#type');
  var priceInput = window.utils.adForm.querySelector('#price');
  var titleInput = window.utils.adForm.querySelector('#title');
  var adFormInputs = window.utils.adForm.querySelectorAll('.ad-form fieldset');
  var checkinSelect = window.utils.adForm.querySelector('#timein');
  var checkoutSelect = window.utils.adForm.querySelector('#timeout');
  var roomSelect = window.utils.adForm.querySelector('#room_number');
  var capacitySelect = window.utils.adForm.querySelector('#capacity');
  var submitButton = window.utils.adForm.querySelector('.ad-form__submit');
  var inputs = window.utils.adForm.querySelectorAll('input');
  var formReset = window.utils.adForm.querySelector('.ad-form__reset');
  var successPopup = document.querySelector('.success');
  var featuresFieldset = window.utils.filters.querySelector('#housing-features');
  var featuresItems = featuresFieldset.querySelectorAll('input');
  var MinPrice = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var accomodationChangeHandler = function () {
    var accomodationMinPrice = MinPrice[typeOfAccommodation.value];
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
  var GuestsNumberByPlace = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };

  var checkRoomCapacity = function () {
    var roomGuests = GuestsNumberByPlace[roomSelect.value];
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
    inputs.forEach(function (it) {
      var input = it;
      checkFieldValidity(input);
    });
  };

  var checkFieldValidity = function (item) {
    if (item.validity.valid) {
      removeError(item);
    } else {
      addError(item);
    }
  };

  var titleInputKeyupHandler = function () {
    checkFieldValidity(titleInput);
  };

  var priceInputKeyupHandler = function () {
    checkFieldValidity(priceInput);
  };

  var capacitySelectChangeHandler = function () {
    checkFieldValidity(capacitySelect);
  };

  var roomSelectChangeHandler = function () {
    if (roomSelect.validity.valid) {
      removeError(capacitySelect);
    }
  };

  // Нажатие на кнопку .ad-form__reset сбрасывает страницу в исходное неактивное состояние без перезагрузки
  var removePins = function () {
    var pinsList = window.utils.pinList.querySelectorAll('button:not(.map__pin--main)');
    pinsList.forEach(function (it) {
      it.remove();
    });
  };

  var removeAd = function () {
    var ad = window.utils.map.querySelector('article.map__card');
    if (ad) {
      ad.classList.add('hidden');
    }
  };

  var returnMainPin = function () {
    window.utils.mainPin.style.top = window.utils.map.offsetHeight / 2 + 'px';
    window.utils.mainPin.style.left = window.utils.map.offsetWidth / 2 - window.map.MainPin.WIDTH / 2 + 'px';
  };

  var clearFilter = function () {
    window.utils.filterFields.forEach(function (field) {
      field.value = 'any';
    });
    featuresItems.forEach(function (feature) {
      feature.checked = false;
    });
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
    window.utils.filters.removeEventListener('change', window.map.filterChangeHandler);
  };

  var resetPage = function () {
    window.utils.map.classList.add('map--faded');
    window.utils.adForm.classList.add('ad-form--disabled');
    adFormInputs.forEach(function (it) {
      it.setAttribute('disabled', true);
    });
    window.utils.filterFields.forEach(function (field) {
      field.disabled = true;
    });
    window.utils.adForm.reset();
    removePins();
    removeAd();
    returnMainPin();
    window.map.fillAddress(window.map.mainPinX, window.map.mainPinYCenter);
    removeError(titleInput);
    removeError(priceInput);
    removeError(capacitySelect);
    removeListeners();
    clearFilter();
  };

  var closePopup = function () {
    successPopup.classList.add('hidden');
  };

  var popupEscPressHandler = function (evt) {
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      closePopup();
    }
  };

  var successHandler = function () {
    resetPage();
    successPopup.classList.remove('hidden');
    document.addEventListener('keydown', popupEscPressHandler);
  };

  var errorHandler = function (errorMessage) {
    window.utils.addErrorMessage(errorMessage);
  };

  window.utils.adForm.addEventListener('submit', function (evt) {
    window.backend.upload(successHandler, errorHandler, new FormData(window.utils.adForm));
    evt.preventDefault();
  });

  successPopup.addEventListener('click', closePopup);

  formReset.addEventListener('click', function (evt) {
    evt.preventDefault();
    resetPage();
  });

  window.form = {
    addListeners: addListeners,
    errorHandler: errorHandler,
    removePins: removePins,
    removeAd: removeAd
  };
})();
