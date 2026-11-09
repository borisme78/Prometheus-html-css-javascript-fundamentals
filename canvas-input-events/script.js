// Читаємо значення полів і перемальовуємо квадрати після кожної зміни.
function changeColor() {
  document.getElementById("c1").style.backgroundColor = document.getElementById("cl").value;
}

function drawSquares() {
  const canvas = document.getElementById("c1");
  const size = Number(document.getElementById("sldr").value);
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = document.getElementById("col1").value;
  context.fillRect(10, 10, size, size);
  context.fillStyle = document.getElementById("col2").value;
  context.fillRect(30 + size, 10, size, size);
}

changeColor();
drawSquares();
