'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileChooser = document.querySelector('.ad-form-header__input');
  var preview = document.querySelector('.ad-form-header__preview img');

  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function (evt) {
        preview.src = evt.target.result;
      });
      reader.readAsDataURL(file);
    }
  });
})();
