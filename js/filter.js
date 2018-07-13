'use strict';

(function () {
  // var PINS_NUMBER = 5;
  var filters = document.querySelector('.map__filters');
  var typeSelect = filters.querySelector('#housing-type');
  var priceSelect = filters.querySelector('#housing-price');
  var roomsSelect = filters.querySelector('#housing-rooms');
  var guestsSelect = filters.querySelector('#housing-guests');
  var featuresFieldset = filters.querySelector('#housing-features');

  var priceLimits = {
    low: 10000,
    high: 50000
  };

  var filterAds = function () {
    var sortedAds = [];

    var checkType = function (advertParam, element) {
      return (element.value === advertParam) || (element.value === 'any');
    };

    var checkPrice = function (advertParam) {
      switch (priceSelect.value) {
        case 'low':
          return advertParam < priceLimits.low;
        case 'middle':
          return advertParam > priceLimits.low && advertParam < priceLimits.high;
        case 'high':
          return advertParam > priceLimits.high;
        default:
          return true;
      }
    };

    var checkCapacity = function (advertParam, element) {
      return (+element.value === advertParam) || (element.value === 'any');
    };

    var checkFeatures = function (advertParam) {
      var checkedFeatures = featuresFieldset.querySelectorAll('input:checked');
      return Array.from(checkedFeatures).every(function (element) {
        return advertParam.includes(element.value);
      });
    };

    window.adverts.filter(function (advert) {
      if (checkType(advert.offer.type, typeSelect) && checkPrice(advert.offer.price) && checkCapacity(advert.offer.guests, guestsSelect) && checkCapacity(advert.offer.rooms, roomsSelect) && checkFeatures(advert.offer.features)) {
        sortedAds.push(advert);
      }
    });
    return sortedAds;
  };

  /* var updatePins = function (ads) {
    window.form.removeAds();
    window.form.removePins(ads);
    window.map.renderPins(ads);
  };
  updatePins(sortedAds);
}); */

  /* var filterChangeHandler = window.debounce(function () {
    filterAds();
  });

  typeSelect.addEventListener('change', filterChangeHandler);
  priceSelect.addEventListener('change', filterChangeHandler);
  roomsSelect.addEventListener('change', filterChangeHandler);
  guestsSelect.addEventListener('change', filterChangeHandler);
  featuresFieldset.addEventListener('change', filterChangeHandler, true); */

  window.filterAds = filterAds;

})();
