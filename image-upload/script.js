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
const canvas = document.getElementById("can");
const statusText = document.getElementById("status");

function upload() {
  const file = document.getElementById("finput").files[0];
  if (!file) {
    return;
  }

  statusText.textContent = "Завантаження…";
  currentImage = loadLocalImage(file, showImage, showError);
}

function showImage(image) {
  // Якщо вже вибрано інший файл, попередній результат не показуємо.
  if (image !== currentImage) {
    return;
  }
  drawImageOnCanvas(image, canvas);
  statusText.textContent = "Зображення завантажено.";
}

function showError(image) {
  if (image !== currentImage) {
    return;
  }
  clearImageCanvas(canvas);
  statusText.textContent = "Не вдалося прочитати зображення. Виберіть PNG або JPEG.";
}
