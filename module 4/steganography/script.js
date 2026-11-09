var coverImage = null;
var secretImage = null;
var resultImage = null;
var loadingCover = null;
var loadingSecret = null;
var coverCanvas = document.getElementById("coverCanvas");
var secretCanvas = document.getElementById("secretCanvas");
var resultCanvas = document.getElementById("resultCanvas");
var resultContext = resultCanvas.getContext("2d");
var statusText = document.getElementById("status");
var hideButton = document.getElementById("hideButton");
var saveButton = document.getElementById("saveButton");

function loadLocalImage(file, onLoad, onError) {
  var image = new Image();
  var fileUrl = URL.createObjectURL(file);

  image.onload = function () {
    URL.revokeObjectURL(fileUrl);
    onLoad(image);
  };
  image.onerror = function () {
    URL.revokeObjectURL(fileUrl);
    onError(image);
  };

  image.src = fileUrl;
  return image;
}

function drawImage(image, canvas) {
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  var context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, canvas.width, canvas.height);
}

function clearCanvas(canvas) {
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}

function clearResult() {
  resultImage = null;
  clearCanvas(resultCanvas);
  saveButton.disabled = true;
  document.getElementById("sizes").textContent = "";
  document.getElementById("pixelInfo").textContent = "";
}

function updateButton() {
  hideButton.disabled = !coverImage || !secretImage;
}

function showReadyStatus() {
  if (coverImage && secretImage) {
    statusText.textContent = "Картинки готові. Натисни «Приховати зображення».";
  } else {
    statusText.textContent = "Завантаж другу картинку.";
  }
}

function loadCover() {
  var file = document.getElementById("coverFile").files[0];
  if (!file) {
    return;
  }

  coverImage = null;
  clearResult();
  clearCanvas(coverCanvas);
  updateButton();
  statusText.textContent = "Завантаження основного зображення…";
  loadingCover = loadLocalImage(file, showCover, coverError);
}

function showCover(image) {
  if (image !== loadingCover) {
    return;
  }
  coverImage = drawImage(image, coverCanvas);
  updateButton();
  showReadyStatus();
}

function coverError(image) {
  if (image !== loadingCover) {
    return;
  }
  statusText.textContent = "Не вдалося прочитати основне зображення. Вибери інший файл.";
}

function loadSecret() {
  var file = document.getElementById("secretFile").files[0];
  if (!file) {
    return;
  }

  secretImage = null;
  clearResult();
  clearCanvas(secretCanvas);
  updateButton();
  statusText.textContent = "Завантаження прихованого зображення…";
  loadingSecret = loadLocalImage(file, showSecret, secretError);
}

function showSecret(image) {
  if (image !== loadingSecret) {
    return;
  }
  secretImage = drawImage(image, secretCanvas);
  updateButton();
  showReadyStatus();
}

function secretError(image) {
  if (image !== loadingSecret) {
    return;
  }
  statusText.textContent = "Не вдалося прочитати приховане зображення. Вибери інший файл.";
}

function crop(image, width, height) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > image.width || height > image.height) {
    throw new Error("Неправильні розміри для обрізання.");
  }

  var output = resultContext.createImageData(width, height);
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var source = (y * image.width + x) * 4;
      var target = (y * width + x) * 4;
      output.data[target] = image.data[source];
      output.data[target + 1] = image.data[source + 1];
      output.data[target + 2] = image.data[source + 2];
      output.data[target + 3] = image.data[source + 3];
    }
  }
  return output;
}

function pixchange(value) {
  return Math.floor(value / 16) * 16;
}

function chop2Hide(image) {
  var output = resultContext.createImageData(image.width, image.height);
  for (var i = 0; i < image.data.length; i = i + 4) {
    output.data[i] = pixchange(image.data[i]);
    output.data[i + 1] = pixchange(image.data[i + 1]);
    output.data[i + 2] = pixchange(image.data[i + 2]);
    output.data[i + 3] = image.data[i + 3];
  }
  return output;
}

function shift(image) {
  var output = resultContext.createImageData(image.width, image.height);
  for (var i = 0; i < image.data.length; i = i + 4) {
    output.data[i] = Math.floor(image.data[i] / 16);
    output.data[i + 1] = Math.floor(image.data[i + 1] / 16);
    output.data[i + 2] = Math.floor(image.data[i + 2] / 16);
    output.data[i + 3] = image.data[i + 3];
  }
  return output;
}

function newpv(p, q) {
  var value = p + q;
  if (value > 255) {
    throw new Error("Сума значень пікселя більша за 255.");
  }
  return value;
}

function combine(image1, image2) {
  if (image1.width !== image2.width || image1.height !== image2.height) {
    throw new Error("Зображення для об’єднання мають бути однакового розміру.");
  }

  var output = resultContext.createImageData(image1.width, image1.height);
  for (var i = 0; i < image1.data.length; i = i + 4) {
    output.data[i] = newpv(image1.data[i], image2.data[i]);
    output.data[i + 1] = newpv(image1.data[i + 1], image2.data[i + 1]);
    output.data[i + 2] = newpv(image1.data[i + 2], image2.data[i + 2]);
    output.data[i + 3] = 255;
  }
  return output;
}

function pixelRGB(image, index) {
  return image.data[index] + ", " + image.data[index + 1] + ", " + image.data[index + 2];
}

function showChecks(cover, secret, start, shifted, output) {
  document.getElementById("sizes").textContent =
    "Основне: " + coverImage.width + " × " + coverImage.height + " → " + cover.width + " × " + cover.height +
    "\nПриховане: " + secretImage.width + " × " + secretImage.height + " → " + secret.width + " × " + secret.height;

  var x = Math.min(50, output.width - 1);
  var y = Math.min(60, output.height - 1);
  var index = (y * output.width + x) * 4;
  document.getElementById("pixelInfo").textContent =
    "Піксель x = " + x + ", y = " + y +
    "\nОсновне RGB: " + pixelRGB(cover, index) +
    "\nПісля chop2Hide: " + pixelRGB(start, index) +
    "\nПриховане RGB: " + pixelRGB(secret, index) +
    "\nПісля shift: " + pixelRGB(shifted, index) +
    "\nПісля combine: " + pixelRGB(output, index) +
    "\nR: " + start.data[index] + " + " + shifted.data[index] + " = " + output.data[index] +
    "\nG: " + start.data[index + 1] + " + " + shifted.data[index + 1] + " = " + output.data[index + 1] +
    "\nB: " + start.data[index + 2] + " + " + shifted.data[index + 2] + " = " + output.data[index + 2];
}

function hideImage() {
  if (!coverImage || !secretImage) {
    statusText.textContent = "Спочатку дочекайся завантаження двох картинок.";
    return;
  }

  clearResult();
  try {
    var width = Math.min(coverImage.width, secretImage.width);
    var height = Math.min(coverImage.height, secretImage.height);
    var cover = crop(coverImage, width, height);
    var secret = crop(secretImage, width, height);
    var start = chop2Hide(cover);
    var shifted = shift(secret);
    var output = combine(start, shifted);

    resultCanvas.width = width;
    resultCanvas.height = height;
    resultContext.putImageData(output, 0, 0);
    resultImage = output;
    saveButton.disabled = false;
    showChecks(cover, secret, start, shifted, output);
    statusText.textContent = "Готово! Друга картинка прихована в першій.";
  } catch (error) {
    statusText.textContent = error.message;
  }
}

function saveImage() {
  if (!resultImage) {
    statusText.textContent = "Спочатку приховай зображення.";
    return;
  }
  var link = document.createElement("a");
  link.href = resultCanvas.toDataURL("image/png");
  link.download = "hidden-image.png";
  link.click();
}

function clearAll() {
  coverImage = null;
  secretImage = null;
  loadingCover = null;
  loadingSecret = null;
  document.getElementById("coverFile").value = "";
  document.getElementById("secretFile").value = "";
  clearCanvas(coverCanvas);
  clearCanvas(secretCanvas);
  clearResult();
  updateButton();
  statusText.textContent = "Полотна очищено. Обери дві картинки.";
}
