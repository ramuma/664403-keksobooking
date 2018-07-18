'use strict';

(function () {
  var PINS_NUMBER = 5;
  var MAIN_PIN = {
    WIDTH: 62,
    HEIGHT: 62,
    TAIL: 22,
    TOTAL_HEIGHT: 84
  };
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var pinList = document.querySelector('.map__pins');
  var adForm = document.querySelector('.ad-form');
  var adFormInput = adForm.querySelectorAll('.ad-form fieldset');
  var mainPinX = Math.round(parseInt(mainPin.style.left, 10) + MAIN_PIN.WIDTH / 2);
  var mainPinYCenter = Math.round(parseInt(mainPin.style.top, 10) + MAIN_PIN.HEIGHT / 2);
  var mainPinYPointed = Math.round(parseInt(mainPin.style.top, 10) + MAIN_PIN.HEIGHT + MAIN_PIN.TAIL);
  var addressInput = document.querySelector('#address');
  var adTemplate = document.querySelector('template').content.querySelector('.map__card');
  var filters = map.querySelector('.map__filters-container');
  var filterFields = filters.querySelectorAll('select, input');
  var topPinLimit = 130;
  var bottomPinLimit = 630;
  var activeCard;
  var pinDragLimits = {
    x: {
      min: 0,
      max: map.clientWidth - MAIN_PIN.WIDTH
    },
    y: {
      min: topPinLimit - MAIN_PIN.TOTAL_HEIGHT,
      max: bottomPinLimit - MAIN_PIN.TOTAL_HEIGHT
    }
  };

  var titleByType = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  var filterChangeHandler = window.debounce(function () {
    window.form.removePins();
    window.form.removeAds();
    renderPins(window.filter.sortAds(window.filter.sortedAds).slice(0, PINS_NUMBER));
  });

  var successHandler = function (data) {
    renderPins(data.slice(0, PINS_NUMBER));
    filterFields.forEach(function (field) {
      field.disabled = false;
    });
    filters.addEventListener('change', filterChangeHandler);
    window.filter.sortedAds = data;
  };

  var errorHandler = function (errorMessage) {
    window.utils.addErrorMessage(errorMessage);
  };

  var renderPins = function (ads) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < ads.length; i++) {
      fragment.appendChild(window.pin.createPin(ads[i]));
    }
    pinList.appendChild(fragment);
  };

  // Добавляем фотографии

  var addPhotos = function (photos, photoArray) {
    var photo = photos.querySelector('.popup__photo');
    if (photoArray.length === 0) {
      photos.classList.add('visually-hidden');
    } else {
      photo.src = photoArray[0];
      photos.appendChild(photo);
      for (var i = 1; i < photoArray.length; i++) {
        var newPhoto = photo.cloneNode(true);
        newPhoto.src = photoArray[i];
        photos.appendChild(newPhoto);
      }
    }
  };

  // Добавляем список доступных удобств

  var removeChildren = function (parent) {
    parent.innerHTML = '';
  };

  var addFeatures = function (featuresParent, featuresArray) {
    if (featuresArray.length === 0) {
      featuresParent.classList.add('visually-hidden');
    } else {
      removeChildren(featuresParent);
      for (var i = 0; i < featuresArray.length; i++) {
        var li = document.createElement('li');
        li.classList.add('popup__feature');
        var classString = 'popup__feature--' + featuresArray[i];
        li.classList.add(classString);
        featuresParent.appendChild(li);
      }
    }
  };

  var renderCard = function (advert) {
    var adElement = adTemplate.cloneNode(true);
    adElement.querySelector('.popup__title').textContent = advert.offer.title;
    adElement.querySelector('.popup__text--address').textContent = advert.offer.address;
    adElement.querySelector('.popup__text--price').textContent = advert.offer.price + '₽/ночь';
    adElement.querySelector('.popup__type').textContent = titleByType[advert.offer.type];
    adElement.querySelector('.popup__text--capacity').textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
    adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
    addFeatures(adElement.querySelector('.popup__features'), advert.offer.features);
    adElement.querySelector('.popup__description').innerHTML = advert.offer.description;
    addPhotos(adElement.querySelector('.popup__photos'), advert.offer.photos);
    adElement.querySelector('.popup__avatar').src = advert.author.avatar;
    map.insertBefore(adElement, filters);
    activeCard = adElement;

    // Закрываем попап
    var closeButton = adElement.querySelector('.popup__close');
    var closeButtonClickHandler = function () {
      closeCard();
    };
    closeButton.addEventListener('click', closeButtonClickHandler);
    return adElement;
  };

  var closeCard = function () {
    if (activeCard) {
      map.removeChild(activeCard);
      document.removeEventListener('keydown', window.utils.cardEscPressHandler);
      window.pin.deactivatePin();
      activeCard = null;
    }
  };

  // Функция для активации страницы
  var activatePage = function () {
    window.backend.download(successHandler, errorHandler);
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    // window.filter.sortAds();

    for (var i = 0; i < adFormInput.length; i++) {
      adFormInput[i].removeAttribute('disabled', '');
    }
  };

  // Функция для заполнения поля адреса
  var fillAddress = function (coordX, coordY) {
    addressInput.value = coordX + ', ' + coordY;
  };

  // Заполнение адреса при открытии страницы
  var fillingAddressHandler = function () {
    fillAddress(mainPinX, mainPinYCenter);
  };

  document.addEventListener('DOMContentLoaded', fillingAddressHandler);

  var isMapActive = function () {
    return !(map.classList.contains('map--faded'));
  };

  // Вызов функций при событии mouseup
  mainPin.addEventListener('mouseup', function () {
    if (!isMapActive()) {
      document.removeEventListener('DOMContentLoaded', fillingAddressHandler);
      activatePage();
      fillAddress(mainPinX, mainPinYPointed);
      window.form.addListeners();
    }
  });

  // Перемещение маркера
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var left = mainPin.offsetLeft - shift.x;
      if (left > pinDragLimits.x.max) {
        left = pinDragLimits.x.max;
      } else if (left <= pinDragLimits.x.min) {
        left = pinDragLimits.x.min;
      }

      var top = mainPin.offsetTop - shift.y;
      if (top > pinDragLimits.y.max) {
        top = pinDragLimits.y.max;
      } else if (top <= pinDragLimits.y.min) {
        top = pinDragLimits.y.min;
      }
      var coordX = left + MAIN_PIN.WIDTH / 2;
      var coordY = top + MAIN_PIN.TOTAL_HEIGHT;

      mainPin.style.top = top + 'px';
      mainPin.style.left = left + 'px';
      fillAddress(coordX, coordY);
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  window.map = {
    MAIN_PIN: MAIN_PIN,
    renderCard: renderCard,
    renderPins: renderPins,
    fillAddress: fillAddress,
    closeCard: closeCard,
    mainPinX: mainPinX,
    mainPinYCenter: mainPinYCenter,
    mainPinYPointed: mainPinYPointed
  };
})();
