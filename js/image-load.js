'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var adForm = document.querySelector('.ad-form');
  var avatarPreview = adForm.querySelector('.ad-form-header__preview img');
  var avatarInput = adForm.querySelector('#avatar');
  var photoContainer = adForm.querySelector('.ad-form__photo-container');
  var photoPreview = adForm.querySelector('.ad-form__photo');
  var photoInput = adForm.querySelector('#images');

  var previewImages = function (input, preview) {
    var file = input.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });

      reader.readAsDataURL(file);

    }
  };

  var createPhotoPreview = function () {
    var img = document.createElement('img');
    var container = photoPreview.cloneNode(true);
    container.classList.remove('visually-hidden');
    photoContainer.appendChild(container);
    img.classList.add('ad-form__photo-image');
    img.alt = 'Фотография жилья';
    img.width = 70;
    img.height = 70;
    previewImages(photoInput, img);
    container.appendChild(img);
  };

  avatarInput.addEventListener('change', function () {
    previewImages(avatarInput, avatarPreview);
  });

  photoInput.addEventListener('change', function () {
    photoPreview.classList.add('visually-hidden');
    createPhotoPreview();
  });
  window.imageLoad = {
    photoContainer: photoContainer,
    avatarPreview: avatarPreview
  };
})();
