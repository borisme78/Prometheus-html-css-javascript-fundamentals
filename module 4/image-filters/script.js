var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var statusText = document.getElementById("status");
var originalImage = null;
var loadingImage = null;

function loadImage() {
  var file = document.getElementById("fileInput").files[0];
  if (!file) {
    return;
  }

  originalImage = null;
  context.clearRect(0, 0, canvas.width, canvas.height);
  statusText.textContent = "Завантаження…";
  var image = new Image();
  loadingImage = image;
  var fileUrl = URL.createObjectURL(file);

  image.onload = function () {
    URL.revokeObjectURL(fileUrl);
    if (image !== loadingImage) {
      return;
    }
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    context.drawImage(image, 0, 0);
    originalImage = context.getImageData(0, 0, canvas.width, canvas.height);
    statusText.textContent = "Зображення завантажено. Обери фільтр.";
  };

  image.onerror = function () {
    URL.revokeObjectURL(fileUrl);
    if (image !== loadingImage) {
      return;
    }
    statusText.textContent = "Не вдалося прочитати зображення. Вибери інший файл.";
  };

  image.src = fileUrl;
}

function imageIsLoaded(image) {
  if (image === null) {
    statusText.textContent = "Спочатку дочекайся завантаження зображення.";
    return false;
  }
  return true;
}

function copyOriginal() {
  context.putImageData(originalImage, 0, 0);
  return context.getImageData(0, 0, canvas.width, canvas.height);
}

function showResult(image, message) {
  context.putImageData(image, 0, 0);
  statusText.textContent = message;
}

function makeGray(image) {
  for (var i = 0; i < image.data.length; i = i + 4) {
    var average = Math.round((image.data[i] + image.data[i + 1] + image.data[i + 2]) / 3);
    image.data[i] = average;
    image.data[i + 1] = average;
    image.data[i + 2] = average;
  }
}

function doGray() {
  if (imageIsLoaded(originalImage)) {
    var image = copyOriginal();
    makeGray(image);
    showResult(image, "Застосовано відтінки сірого.");
  }
}

function makeRed(image) {
  for (var i = 0; i < image.data.length; i = i + 4) {
    var average = (image.data[i] + image.data[i + 1] + image.data[i + 2]) / 3;
    if (average < 128) {
      image.data[i] = Math.round(average * 2);
      image.data[i + 1] = 0;
      image.data[i + 2] = 0;
    } else {
      image.data[i] = 255;
      image.data[i + 1] = Math.round(average * 2 - 255);
      image.data[i + 2] = Math.round(average * 2 - 255);
    }
  }
}

function doRed() {
  if (imageIsLoaded(originalImage)) {
    var image = copyOriginal();
    makeRed(image);
    showResult(image, "Застосовано червоний фільтр.");
  }
}

function makeCustom(image) {
  var stripeWidth = Math.max(1, Math.ceil(image.width / 8));
  var middle = Math.floor(image.width / 2);
  var lineWidth = Math.max(1, Math.floor(image.width / 150));

  for (var i = 0; i < image.data.length; i = i + 4) {
    var x = (i / 4) % image.width;
    var average = (image.data[i] + image.data[i + 1] + image.data[i + 2]) / 3;
    var stripe = Math.floor(x / stripeWidth);
    var extraGreen = 20;

    if (stripe % 2 === 0) {
      extraGreen = 50;
    }

    image.data[i] = Math.round(average * 0.45);
    image.data[i + 1] = Math.min(255, Math.round(average + extraGreen));
    image.data[i + 2] = Math.round(average * 0.3);

    if (Math.abs(x - middle) < lineWidth) {
      image.data[i] = 255;
      image.data[i + 1] = 255;
      image.data[i + 2] = 255;
    }
  }
}

function doCustom() {
  if (imageIsLoaded(originalImage)) {
    var image = copyOriginal();
    makeCustom(image);
    showResult(image, "Застосовано мій фільтр «Футбольні смуги».");
  }
}

function colorValue(average, color) {
  if (average < 128) {
    return Math.round(color / 127.5 * average);
  }
  return Math.round((2 - color / 127.5) * average + 2 * color - 255);
}

function makeRainbow(image) {
  var colors = [
    [255, 0, 0],
    [255, 102, 0],
    [255, 255, 0],
    [0, 255, 0],
    [0, 0, 255],
    [102, 0, 255],
    [204, 0, 204]
  ];

  for (var i = 0; i < image.data.length; i = i + 4) {
    var y = Math.floor(i / 4 / image.width);
    var stripe = Math.floor(y * 7 / image.height);
    var average = (image.data[i] + image.data[i + 1] + image.data[i + 2]) / 3;

    image.data[i] = colorValue(average, colors[stripe][0]);
    image.data[i + 1] = colorValue(average, colors[stripe][1]);
    image.data[i + 2] = colorValue(average, colors[stripe][2]);
  }
}

function doRainbow() {
  if (imageIsLoaded(originalImage)) {
    var image = copyOriginal();
    makeRainbow(image);
    showResult(image, "Застосовано сім горизонтальних смуг веселки.");
  }
}

function nearbyCoordinate(position, limit) {
  var offset = Math.floor(Math.random() * 21) - 10;
  var result = position + offset;
  return Math.max(0, Math.min(limit - 1, result));
}

function makeBlur(image) {
  var output = context.createImageData(image.width, image.height);

  for (var i = 0; i < image.data.length; i = i + 4) {
    var x = (i / 4) % image.width;
    var y = Math.floor(i / 4 / image.width);
    var newX = x;
    var newY = y;

    if (Math.random() >= 0.5) {
      newX = nearbyCoordinate(x, image.width);
      newY = nearbyCoordinate(y, image.height);
    }

    var source = (newY * image.width + newX) * 4;
    output.data[i] = image.data[source];
    output.data[i + 1] = image.data[source + 1];
    output.data[i + 2] = image.data[source + 2];
    output.data[i + 3] = image.data[source + 3];
  }

  return output;
}

function doBlur() {
  if (imageIsLoaded(originalImage)) {
    var image = copyOriginal();
    var result = makeBlur(image);
    showResult(result, "Застосовано випадкове розмиття.");
  }
}

function resetImage() {
  if (imageIsLoaded(originalImage)) {
    showResult(originalImage, "Початкове зображення відновлено.");
  }
}
