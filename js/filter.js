'use strict';

(function () {
  // var PINS_NUMBER = 5;
  var filters = document.querySelector('.map__filters');
  var typeSelect = filters.querySelector('#housing-type');
  var priceSelect = filters.querySelector('#housing-price');
  var roomsSelect = filters.querySelector('#housing-rooms');
  var guestsSelect = filters.querySelector('#housing-guests');
  var featuresFieldset = filters.querySelector('#housing-features');
  var sortedAds = [];

  var priceLimits = {
    low: 10000,
    high: 50000
  };

  var filterAds = function () {

    var checkType = function (adParam, element) {
      return (element.value === adParam) || (element.value === 'any');
    };

    var checkPrice = function (adParam, element) {
      switch (element.value) {
        case 'low':
          return adParam.offer.price < priceLimits.low;
        case 'middle':
          return adParam.offer.price > priceLimits.low && adParam.offer.price < priceLimits.high;
        case 'high':
          return adParam.offer.price > priceLimits.high;
        default:
          return true;
      }
    };

    var checkCapacity = function (adParam, element) {
      return (+element.value === adParam) || (element.value === 'any');
    };

    var checkFeatures = function (adParam) {
      var checkedFeatures = featuresFieldset.querySelectorAll('input:checked');
      return Array.from(checkedFeatures).every(function (element) {
        return adParam.offer.features.includes(element.value);
      });
    };

    window.adverts.filter(function (advert) {
      if (checkCapacity(advert.offer.guests, guestsSelect) && checkCapacity(advert.offer.rooms, roomsSelect) && checkType(advert.offer.type, typeSelect) && checkFeatures(advert) && checkPrice(advert, priceSelect)) {
        sortedAds.push(advert);
      }
    });

    var updatePins = function (ads) {
      window.form.removeAds();
      window.form.removePins();
      window.map.renderPins(ads);
    };
    updatePins(sortedAds);
  };

  var filterChangeHandler = window.debounce(function () {
    filterAds();
  });

  filters.addEventListener('change', filterChangeHandler);

  window.filter = {
    filterAds: filterAds
  };

})();
