'use strict';

(function () {
  var PINS_NUMBER = 5;
  var filters = document.querySelector('.map__filters');
  var typeSelect = filters.querySelector('#housing-type');
  var priceSelect = filters.querySelector('#housing-price');
  var roomsSelect = filters.querySelector('#housing-rooms');
  var guestsSelect = filters.querySelector('#housing-guests');
  var featuresFieldset = filters.querySelector('#housing-features');
  var filterItems = filters.querySelectorAll('select, input');

  var priceLimits = {
    low: 10000,
    high: 50000
  };

  var filterAds = function () {
    var checkType = function (advert) {
      return (typeSelect.value === advert.offer.type) || (typeSelect.value === 'any');
    };

    var checkPrice = function (advert) {
      switch (priceSelect.value) {
        case 'low':
          return advert.offer.price < priceLimits.low;
        case 'middle':
          return advert.offer.price > priceLimits.low && advert.offer.price < priceLimits.high;
        case 'high':
          return advert.offer.price > priceLimits.high;
        default:
          return true;
      }
    };

    var checkRooms = function (advert) {
      return (roomsSelect.value === advert.offer.rooms) || (roomsSelect.value === 'any');
    };

    var checkGuests = function (advert) {
      return (guestsSelect.value === advert.offer.guests) || (guestsSelect.value === 'any');
    };

    var checkFeatures = function (advert) {
      var checkedFeatures = featuresFieldset.querySelectorAll('input:checked');
      return Array.from(checkedFeatures).every(function (element) {
        return advert.offer.features.includes(element.value);
      });

    };

    var sortedAds = window.adverts.filter(checkType).filter(checkPrice).filter(checkRooms).filter(checkGuests).filter(checkFeatures).slice(0, PINS_NUMBER);

    var updatePins = function (ads) {
      window.form.removeAds();
      window.form.removePins(ads);
      window.map.renderPins(ads);
    };
    updatePins(sortedAds);
  };

  var filterChangeHandler = window.debounce(function () {
    filterAds();
  });

  var clearFilter = function () {
    filterItems.forEach(function (item) {
      item.value = 'any';
    });
    var featuresItems = featuresFieldset.querySelectorAll('input');
    featuresItems.forEach(function (feature) {
      feature.checked = false;
    });
  };

  typeSelect.addEventListener('change', filterChangeHandler);
  priceSelect.addEventListener('change', filterChangeHandler);
  roomsSelect.addEventListener('change', filterChangeHandler);
  guestsSelect.addEventListener('change', filterChangeHandler);
  featuresFieldset.addEventListener('change', filterChangeHandler, true);

  window.filter = {
    clearFilter: clearFilter
  };

})();
