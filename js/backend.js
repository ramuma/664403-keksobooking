'use strict';

(function () {
  var SUCCESS_STATUS = 200;
  var TIMEOUT = 10000;
  var URL = {
    UPLOAD: 'https://js.dump.academy/keksobooking',
    DOWNLOAD: 'https://js.dump.academy/keksobooking/data'
  };

  var getXhr = function (onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
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
