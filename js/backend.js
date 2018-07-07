'use strict';

(function () {
  var SUCCESS_STATUS = 200;
  var TIMEOUT = 10000;
  var URL = {
    UPLOAD: 'https://js.dump.academy/keksobooking',
    DOWNLOAD: 'https://js.dump.academy/keksobooking/data'
  };

  var getXhr = function (successHandler, errorHandler, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
        successHandler(xhr.response);
      } else {
        errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    if (data) {
      xhr.open('POST', URL.UPLOAD);
      xhr.send(data);
    } else {
      xhr.open('GET', URL.DOWNLOAD);
      xhr.send();
    }
  };

  window.backend = {
    getXhr: getXhr
  };
})();
