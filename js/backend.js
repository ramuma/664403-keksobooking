'use strict';

(function () {
  var SUCCESS_STATUS = 200;
  var TIMEOUT = 10000;
  var Url = {
    UPLOAD: 'https://js.dump.academy/keksobooking',
    DOWNLOAD: 'https://js.dump.academy/keksobooking/data'
  };

  var getXhr = function (method, url, successHandler, errorHandler) {
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

    xhr.open(method, url);
    return xhr;
  };

  var upload = function (successHandler, errorHandler, data) {
    getXhr('POST', Url.UPLOAD, successHandler, errorHandler).send(data);
  };

  var download = function (successHandler, errorHandler) {
    getXhr('GET', Url.DOWNLOAD, successHandler, errorHandler).send();
  };

  window.backend = {
    upload: upload,
    download: download
  };
})();
