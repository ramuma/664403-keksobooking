'use strict';

(function () {
  var PINS_NUMBER = 5;
  var filters = document.querySelector('.map__filters');
  var typeSelect = filters.querySelector('#housing-type');
  var priceSelect = filters.querySelector('#housing-price');
  var roomsSelect = filters.querySelector('#housing-rooms');
  var guestsSelect = filters.querySelector('#housing-guests');
  var featuresFieldset = filters.querySelector('#housing-features');
  var filterFields = filters.querySelectorAll('select, input');
  var ads = [];
  var sortedAds = [];
  var priceLimits = {
    low: 10000,
    high: 50000
  };

  var filterAds = function (it, item, key) {
    return it.value === 'any' ? true : it.value === item[key].toString();
  };

  var checkType = function (item) {
    return filterAds(typeSelect, item.offer, 'type');
  };

  var checkPrice = function (item) {
    switch (priceSelect.value) {
      case 'low':
        return item.offer.price < priceLimits.low;
      case 'middle':
        return item.offer.price >= priceLimits.low && item.offer.price <= priceLimits.high;
      case 'high':
        return item.offer.price > priceLimits.high;
      default:
        return true;
    }
  };

  var checkRooms = function (item) {
    return filterAds(roomsSelect, item.offer, 'rooms');
  };

  var checkGuests = function (item) {
    return filterAds(guestsSelect, item.offer, 'guests');
  };

  var checkFeatures = function (item) {
    var checkedFeatures = featuresFieldset.querySelectorAll('input:checked');
    return Array.from(checkedFeatures).every(function (element) {
      return item.offer.features.includes(element.value);
    });
  };

  var filterChangeHandler = window.debounce(function () {
    sortedAds = ads.slice(0);
    sortedAds = sortedAds.filter(checkType).filter(checkPrice).filter(checkRooms).filter(checkGuests).filter(checkFeatures);
    window.form.removePins();
    window.form.removeAds();
    window.map.renderPins(sortedAds.slice(0, PINS_NUMBER));
  });

  var activateFilter = function () {
    filterFields.forEach(function (it) {
      it.disabled = false;
    });
    filterChangeHandler();
    filters.addEventListener('change', filterChangeHandler);
  };

  var clearFilter = function () {
    filterFields.forEach(function (it) {
      it.value = 'any';
    });
    var featuresItems = featuresFieldset.querySelectorAll('input');
    featuresItems.forEach(function (feature) {
      feature.checked = false;
    });
  };

  var deactivateFilter = function () {
    filterFields.forEach(function (it) {
      it.disabled = true;
    });
    clearFilter();
    filters.removeEventListener('change', filterChangeHandler);
  };

  var activateFiltration = function (data) {
    ads = data.slice(0);
    activateFilter();
    return data.slice(0, PINS_NUMBER);
  };

  var deactivateFiltration = function () {
    deactivateFilter();
  };

  window.filter = {
    clearFilter: clearFilter,
    activateFiltration: activateFiltration,
    deactivateFiltration: deactivateFiltration
  };

})();
