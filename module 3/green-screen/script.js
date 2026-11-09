// Зображення завантажується не одразу. Коли воно готове, викликаємо onLoad.
function loadLocalImage(file, onLoad, onError) {
  const image = new Image();
  const fileUrl = URL.createObjectURL(file);

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

// Робимо полотно такого самого розміру, як завантажене зображення.
function drawImageOnCanvas(image, canvas) {
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
}

function clearImageCanvas(canvas) {
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
}

var fgImage = null;
var bgImage = null;
var loadingForeground = null;
var loadingBackground = null;
var foregroundCanvas = document.getElementById("can1");
var backgroundCanvas = document.getElementById("can2");
var composeButton = document.getElementById("compose");
var statusText = document.getElementById("status");

function updateButton() {
  composeButton.disabled = !fgImage || !bgImage;
}

function showReadyStatus() {
  if (fgImage && bgImage) {
    statusText.textContent = "Зображення завантажені. Натисни «Компонувати».";
  } else {
    statusText.textContent = "Завантаж друге зображення.";
  }
}

function loadForegroundImage() {
  var file = document.getElementById("fgfile").files[0];
  if (!file) {
    return;
  }

  fgImage = null;
  updateButton();
  statusText.textContent = "Завантаження переднього плану…";
  loadingForeground = loadLocalImage(file, showForeground, foregroundError);
}

function showForeground(image) {
  if (image !== loadingForeground) {
    return;
  }

  fgImage = image;
  drawImageOnCanvas(fgImage, foregroundCanvas);
  if (bgImage) {
    drawImageOnCanvas(bgImage, backgroundCanvas);
  }
  updateButton();
  showReadyStatus();
}

function foregroundError(image) {
  if (image !== loadingForeground) {
    return;
  }
  clearImageCanvas(foregroundCanvas);
  statusText.textContent = "Не вдалося прочитати передній план. Вибери інше зображення.";
}

function loadBackgroundImage() {
  var file = document.getElementById("bgfile").files[0];
  if (!file) {
    return;
  }

  bgImage = null;
  updateButton();
  statusText.textContent = "Завантаження заднього плану…";
  loadingBackground = loadLocalImage(file, showBackground, backgroundError);
}

function showBackground(image) {
  if (image !== loadingBackground) {
    return;
  }

  bgImage = image;
  drawImageOnCanvas(bgImage, backgroundCanvas);
  updateButton();
  showReadyStatus();
}

function backgroundError(image) {
  if (image !== loadingBackground) {
    return;
  }
  clearImageCanvas(backgroundCanvas);
  statusText.textContent = "Не вдалося прочитати задній план. Вибери інше зображення.";
}

function clearCanvas() {
  fgImage = null;
  bgImage = null;
  loadingForeground = null;
  loadingBackground = null;
  clearImageCanvas(foregroundCanvas);
  clearImageCanvas(backgroundCanvas);
  document.getElementById("fgfile").value = "";
  document.getElementById("bgfile").value = "";
  updateButton();
  statusText.textContent = "Полотна очищено.";
}

function doGreenScreen() {
  if (fgImage === null || !fgImage.complete || fgImage.naturalWidth === 0) {
    statusText.textContent = "Спочатку завантаж передній план.";
    return;
  }
  if (bgImage === null || !bgImage.complete || bgImage.naturalWidth === 0) {
    statusText.textContent = "Спочатку завантаж задній план.";
    return;
  }
  if (fgImage.naturalWidth !== bgImage.naturalWidth || fgImage.naturalHeight !== bgImage.naturalHeight) {
    statusText.textContent = "Помилка: зображення мають бути однакового розміру. Вибери інший файл.";
    return;
  }

  var width = fgImage.naturalWidth;
  var height = fgImage.naturalHeight;
  drawImageOnCanvas(fgImage, foregroundCanvas);
  drawImageOnCanvas(bgImage, backgroundCanvas);

  var foregroundContext = foregroundCanvas.getContext("2d");
  var backgroundContext = backgroundCanvas.getContext("2d");
  var foreground = foregroundContext.getImageData(0, 0, width, height);
  var background = backgroundContext.getImageData(0, 0, width, height);
  var output = backgroundContext.createImageData(width, height);

  for (var i = 0; i < foreground.data.length; i = i + 4) {
    var red = foreground.data[i];
    var green = foreground.data[i + 1];
    var blue = foreground.data[i + 2];

    if (green > 80 && green > red * 1.5 && green > blue * 1.5) {
      output.data[i] = background.data[i];
      output.data[i + 1] = background.data[i + 1];
      output.data[i + 2] = background.data[i + 2];
      output.data[i + 3] = background.data[i + 3];
    } else {
      output.data[i] = foreground.data[i];
      output.data[i + 1] = foreground.data[i + 1];
      output.data[i + 2] = foreground.data[i + 2];
      output.data[i + 3] = foreground.data[i + 3];
    }
  }

  backgroundContext.putImageData(output, 0, 0);
  statusText.textContent = "Готово! Результат на правому полотні.";
}
