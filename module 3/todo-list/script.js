function createTask(text) {
  const item = document.createElement("li");

  // Створюємо три кнопки для кожної справи.
  const doneButton = document.createElement("button");
  doneButton.type = "button";
  doneButton.className = "done";
  doneButton.textContent = "✓";
  doneButton.setAttribute("aria-label", "Позначити виконаною");
  doneButton.onclick = function () {
    markDone(item);
  };

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "remove";
  removeButton.textContent = "✕";
  removeButton.setAttribute("aria-label", "Видалити виконану справу");
  removeButton.onclick = function () {
    removeTask(item);
  };

  const importantButton = document.createElement("button");
  importantButton.type = "button";
  importantButton.className = "important";
  importantButton.textContent = "!";
  importantButton.setAttribute("aria-label", "Позначити важливою");
  importantButton.onclick = function () {
    important(item);
  };

  item.appendChild(doneButton);
  item.appendChild(removeButton);
  item.appendChild(importantButton);
  // Текст справи додаємо як текст, щоб HTML-теги не ставали елементами.
  item.appendChild(document.createTextNode(" " + text));
  document.getElementById("tasks").appendChild(item);
}

function addTask() {
  const input = document.getElementById("input");
  const text = input.value.trim();

  if (text === "") {
    document.getElementById("status").textContent = "Введіть текст справи.";
    return;
  }

  createTask(text);
  input.value = "";
  input.placeholder = "Додайте наступну справу…";
  input.focus();
  document.getElementById("status").textContent = "Справу додано.";
}

function markDone(item) {
  item.classList.add("finished");
}

function important(item) {
  item.classList.add("important");
}

function removeTask(item) {
  if (item.classList.contains("finished")) {
    item.remove();
    document.getElementById("status").textContent = "Справу видалено.";
  } else {
    document.getElementById("status").textContent = "Спочатку позначте справу виконаною.";
  }
}

function doAbout() {
  const about = document.getElementById("divabout");
  about.textContent = "Автор — Борис Мельничук";
  about.className = "aboutcolor";
}

function clearAbout() {
  const about = document.getElementById("divabout");
  about.textContent = "";
  about.className = "";
}

// Форма викликає цю функцію і при натисканні кнопки, і при натисканні Enter.
function submitTask(event) {
  event.preventDefault();
  addTask();
}

document.getElementById("taskForm").addEventListener("submit", submitTask);
createTask("Попрактикувати HTML та CSS");
