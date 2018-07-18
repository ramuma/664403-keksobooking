'use strict';

(function () {
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
  var sortedAds;

  var filterAds = function (field, item, key) {
    return field.value === 'any' ? true : field.value === item[key].toString();
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

  /* var sortAds = function (item) {
    return checkType(item) && checkPrice(item) && checkRooms(item) && checkGuests(item) && checkFeatures(item);
  }; */
  var sortAds = function (adData) {
    return adData.filter(function (item) {
      return checkType(item) && checkPrice(item) && checkRooms(item) && checkGuests(item) && checkFeatures(item);
    });
  };

  window.filter = {
    sortedAds: sortedAds,
    sortAds: sortAds
  };

})();
