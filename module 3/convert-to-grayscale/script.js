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

let currentImage = null;
let originalImage = null;
let grayImage = null;
const originalCanvas = document.getElementById("can1");
const grayCanvas = document.getElementById("can2");
const grayButton = document.getElementById("grayscale");
const statusText = document.getElementById("status");

function upload() {
  const file = document.getElementById("finput").files[0];
  if (!file) {
    return;
  }

  originalImage = null;
  grayImage = null;
  grayButton.disabled = true;
  statusText.textContent = "Завантаження…";
  currentImage = loadLocalImage(file, showImage, showError);
}

function showImage(image) {
  if (image !== currentImage) {
    return;
  }
  originalImage = image;
  drawImageOnCanvas(image, originalCanvas);
  drawImageOnCanvas(image, grayCanvas);
  const context = grayCanvas.getContext("2d");
  grayImage = context.getImageData(0, 0, grayCanvas.width, grayCanvas.height);
  grayButton.disabled = false;
  statusText.textContent = "Зображення завантажено.";
}

function showError(image) {
  if (image !== currentImage) {
    return;
  }
  clearImageCanvas(originalCanvas);
  clearImageCanvas(grayCanvas);
  statusText.textContent = "Не вдалося прочитати зображення. Виберіть PNG або JPEG.";
}

function makeGray() {
  if (!originalImage || !grayImage) {
    return;
  }

  const context = grayCanvas.getContext("2d");

  // Кожен піксель займає 4 числа: червоний, зелений, синій і прозорість.
  for (let i = 0; i < grayImage.data.length; i = i + 4) {
    const red = grayImage.data[i];
    const green = grayImage.data[i + 1];
    const blue = grayImage.data[i + 2];
    const average = Math.round((red + green + blue) / 3);

    grayImage.data[i] = average;
    grayImage.data[i + 1] = average;
    grayImage.data[i + 2] = average;
    // Четверте число не змінюємо, щоб зберегти прозорість.
  }

  context.putImageData(grayImage, 0, 0);
  statusText.textContent = "Перетворення завершено.";
}
