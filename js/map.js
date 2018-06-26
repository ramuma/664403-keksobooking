'use strict';

var PIN = {
  WIDTH: 50,
  HEIGHT: 70
};

var MAIN_PIN = {
  WIDTH: 62,
  HEIGHT: 62,
  TAIL: 22
};

var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKS = ['12:00', '13:00', '14:00'];
var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var adsNumber = 8;

var price = {
  min: 1000,
  max: 1000000
};

var rooms = {
  min: 1,
  max: 5
};

var guests = {
  min: 1,
  max: 10
};

var map = document.querySelector('.map');
var adForm = document.querySelector('.ad-form');
var adFormInput = adForm.querySelectorAll('.ad-form fieldset');
var mainPin = map.querySelector('.map__pin--main');
var addressInput = adForm.querySelector('#address');
var mainPinX = Math.round(parseInt(mainPin.style.left, 10) + MAIN_PIN.WIDTH / 2);
var mainPinYCenter = Math.round(parseInt(mainPin.style.top, 10) + MAIN_PIN.HEIGHT / 2);
var mainPinYPointed = Math.round(parseInt(mainPin.style.top, 10) + MAIN_PIN.HEIGHT + MAIN_PIN.TAIL);

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

var shuffledTitles = shuffleArray(TITLES);

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

// Перевод типа жилья
var titleByType = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

// Массив похожих объявлений
var generateAds = function (number) {
  var similarAds = [];

  for (var i = 0; i < number; i++) {
    var randomX = getRandomNumber(300, 900);
    var randomY = getRandomNumber(130, 630);
    var adFeatures = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: shuffledTitles[i],
        address: randomX + ' ' + randomY,
        price: getRandomNumber(price.min, price.max),
        type: getRandomElement(TYPES),
        rooms: getRandomNumber(rooms.min, rooms.max),
        guests: getRandomNumber(guests.min, guests.max),
        checkin: getRandomElement(CHECKS),
        checkout: getRandomElement(CHECKS),
        features: getRandomLengthArray(FEATURES),
        description: '',
        photos: shuffleArray(PHOTOS)
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

// Находим нужный блок и шаблон
var pinList = document.querySelector('.map__pins');

var pinTemplate = document
  .querySelector('template')
  .content.querySelector('.map__pin');

// Создайте DOM-элементы, соответствующие меткам на карте, и заполните их данными из массива. Итоговую разметку метки .map__pin можно взять из шаблона .map__card
var createPin = function (mapPin) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style.left = mapPin.location.x - PIN.WIDTH / 2 + 'px';
  pinElement.style.top = mapPin.location.y - PIN.HEIGHT + 'px';
  pinElement.querySelector('img').src = mapPin.author.avatar;
  pinElement.querySelector('img').alt = mapPin.offer.title;
  // Добавляем обработчик для показа объявления
  pinElement.addEventListener('click', function () {
    var card = map.querySelector('.map__card');
    if (card) {
      card.remove();
    }
    renderCard(mapPin);
  });
  return pinElement;
};

var ads = generateAds(adsNumber);

// Отрисуйте сгенерированные DOM-элементы в блок .map__pins с помощью DocumentFragment

var renderPins = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < adsNumber; i++) {
    fragment.appendChild(createPin(ads[i]));
  }
  pinList.appendChild(fragment);
};

// На основе первого по порядку элемента из сгенерированного массива и шаблона .map__card создайте DOM-элемент объявления, заполните его данными из объекта и вставьте полученный DOM-элемент в блок .map перед блоком.map__filters-container

// Добавляем фотографии

var addPhotos = function (photos, photoArray) {
  var photo = photos.querySelector('.popup__photo');
  photo.src = photoArray[0];
  photos.appendChild(photo);
  for (var i = 1; i < photoArray.length; i++) {
    var newPhoto = photo.cloneNode(true);
    newPhoto.src = photoArray[i];
    photos.appendChild(newPhoto);
  }
};

// Добавляем список доступных удобств

var removeChildren = function (parent) {
  parent.innerHTML = '';
};

var addFeatures = function (featuresParent, featuresArray) {
  removeChildren(featuresParent);
  for (var i = 0; i < featuresArray.length; i++) {
    var li = document.createElement('li');
    li.classList.add('popup__feature');
    var classString = 'popup__feature--' + featuresArray[i];
    li.classList.add(classString);
    featuresParent.appendChild(li);
  }
};

var adTemplate = document.querySelector('template').content.querySelector('.map__card');
var filters = map.querySelector('.map__filters-container');

var renderCard = function (advert) {
  var adElement = adTemplate.cloneNode(true);
  adElement.querySelector('.popup__title').textContent = advert.offer.title;
  adElement.querySelector('.popup__text--address').textContent = advert.offer.address;
  adElement.querySelector('.popup__text--price').textContent = advert.offer.price + '₽/ночь';
  adElement.querySelector('.popup__type').textContent = titleByType[advert.offer.type];
  adElement.querySelector('.popup__text--capacity').textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
  addFeatures(adElement.querySelector('.popup__features'), advert.offer.features);
  adElement.querySelector('.popup__description').textContent = advert.offer.description;
  addPhotos(adElement.querySelector('.popup__photos'), advert.offer.photos);
  adElement.querySelector('.popup__avatar').src = advert.author.avatar;

  map.insertBefore(adElement, filters);

  // Закрываем попап
  var closeButton = adElement.querySelector('.popup__close');
  closeButton.addEventListener('click', function () {
    adElement.classList.add('hidden');
  });
  return adElement;
};

// Функция для активации страницы
var activatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

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
    activatePage();
    renderPins();
    fillAddress(mainPinX, mainPinYPointed);
  }
});

// ========= ДОВЕРЯЙ НО ПРОВЕРЯЙ ==============

// Зависимость минимального значения поля «Цена за ночь» от типа жилья
var typeOfAccommodation = adForm.querySelector('#type');
var priceInput = adForm.querySelector('#price');

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

typeOfAccommodation.addEventListener('change', accomodationChangeHandler);

// Синхронизированы поля «Время заезда» и «Время выезда»
var checkinSelect = adForm.querySelector('#timein');
var checkoutSelect = adForm.querySelector('#timeout');

var changeTime = function (check, index) {
  check.selectedIndex = index;
};

var checkinChangeHandler = function () {
  changeTime(checkoutSelect, checkinSelect.selectedIndex);
};

var checkoutChangeHandler = function () {
  changeTime(checkinSelect, checkoutSelect.selectedIndex);
};

checkinSelect.addEventListener('change', checkinChangeHandler);
checkoutSelect.addEventListener('change', checkoutChangeHandler);

// Поле «Количество комнат» синхронизировано с полем «Количество мест»
var roomSelect = adForm.querySelector('#room_number');
var capacitySelect = adForm.querySelector('#capacity');
var submitButton = adForm.querySelector('.ad-form__submit');

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
  } else {
    capacitySelect.setCustomValidity('');
  }
};

submitButton.addEventListener('click', function () {
  checkRoomCapacity();
});

// Нажатие на кнопку .ad-form__reset сбрасывает страницу в исходное неактивное состояние без перезагрузки
var formReset = adForm.querySelector('.ad-form__reset');

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

var resetPage = function () {
  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');

  for (var i = 0; i < adFormInput.length; i++) {
    adFormInput[i].setAttribute('disabled', true);
  }
  adForm.reset();
  removePins();
  removeAds();
  fillAddress(mainPinX, mainPinYCenter);
};

formReset.addEventListener('click', function (evt) {
  evt.preventDefault();
  resetPage();
});
