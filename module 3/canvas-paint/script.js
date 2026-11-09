const paintcanvas = document.getElementById("canvas1");
const context = paintcanvas.getContext("2d");
const statusText = document.getElementById("status");
let color = "#000000";
let radius = 50;
let activePointer = null;
let lastPoint = null;

function isValidSize(input) {
  const size = Number(input.value);
  return input.value.trim() !== "" && Number.isInteger(size) && size >= 1 && size <= 2000;
}

function setWidth(input) {
  if (!isValidSize(input)) {
    input.value = paintcanvas.width;
    statusText.textContent = "Введіть ціле число від 1 до 2000.";
    return;
  }
  paintcanvas.width = Number(input.value);
  statusText.textContent = "Розмір змінено, малюнок очищено.";
}

function setHeight(input) {
  if (!isValidSize(input)) {
    input.value = paintcanvas.height;
    statusText.textContent = "Введіть ціле число від 1 до 2000.";
    return;
  }
  paintcanvas.height = Number(input.value);
  statusText.textContent = "Розмір змінено, малюнок очищено.";
}

function changeColor(value) {
  color = value;
}

function resizeBrush(value) {
  radius = Number(value);
  document.getElementById("sizeOutput").value = value;
}

function clearCanvas() {
  context.clearRect(0, 0, paintcanvas.width, paintcanvas.height);
}

// Переводимо координати на екрані в координати самого полотна.
// Це потрібно, коли на телефоні полотно показується у зменшеному вигляді.
function getPoint(event) {
  const rect = paintcanvas.getBoundingClientRect();
  const borderX = paintcanvas.clientLeft;
  const borderY = paintcanvas.clientTop;
  const displayWidth = rect.width - borderX * 2;
  const displayHeight = rect.height - borderY * 2;

  return {
    x: (event.clientX - rect.left - borderX) * paintcanvas.width / displayWidth,
    y: (event.clientY - rect.top - borderY) * paintcanvas.height / displayHeight
  };
}

function startPaint(event) {
  if (event.button !== 0 || activePointer !== null) {
    return;
  }

  activePointer = event.pointerId;
  // Продовжуємо отримувати події, навіть якщо вказівник вийде за край полотна.
  paintcanvas.setPointerCapture(event.pointerId);
  lastPoint = getPoint(event);
  context.beginPath();
  context.arc(lastPoint.x, lastPoint.y, radius, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
}

function continuePaint(event) {
  if (event.pointerId !== activePointer) {
    return;
  }

  const point = getPoint(event);
  context.beginPath();
  context.moveTo(lastPoint.x, lastPoint.y);
  context.lineTo(point.x, point.y);
  context.lineWidth = radius * 2;
  context.lineCap = "round";
  context.strokeStyle = color;
  context.stroke();
  lastPoint = point;
}

function endPaint(event) {
  if (event.pointerId !== activePointer) {
    return;
  }
  activePointer = null;
  lastPoint = null;
}

paintcanvas.addEventListener("pointerdown", startPaint);
paintcanvas.addEventListener("pointermove", continuePaint);
paintcanvas.addEventListener("pointerup", endPaint);
paintcanvas.addEventListener("pointercancel", endPaint);
paintcanvas.addEventListener("lostpointercapture", endPaint);
