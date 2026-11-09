// Кнопки в HTML викликають ці функції. Кожна змінює колір або малює на полотні.
function changeColor() {
  document.getElementById("d1").style.backgroundColor = "blue";
  document.getElementById("d2").style.backgroundColor = "orange";
}

function doRed() {
  const canvas = document.getElementById("d1");
  canvas.style.backgroundColor = "red";
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "yellow";
  context.fillRect(10, 10, 60, 60);
  context.fillRect(80, 10, 60, 60);
  context.fillStyle = "black";
  context.font = "20px Arial";
  context.fillText("Hello", 15, 45);
}

function doBlue() {
  const canvas = document.getElementById("d1");
  canvas.style.backgroundColor = "blue";
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}

function doColor() {
  document.getElementById("d2").style.backgroundColor = document.getElementById("clr").value;
}

function drawSquare() {
  const canvas = document.getElementById("d3");
  const context = canvas.getContext("2d");
  const size = Number(document.getElementById("sldr").value);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "yellow";
  context.fillRect(10, 10, size, size);
}

drawSquare();
