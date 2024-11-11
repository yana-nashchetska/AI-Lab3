import { S1, S2, S3, S4 } from "./app.js";
// Функція для візуалізації масиву як сітки
function renderGrid(array, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // Очищення контейнера

  array.forEach((value) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.classList.add(value === 1 ? "dark" : "light");
    container.appendChild(cell);
  });
}

renderGrid(S1, "gridS1");
renderGrid(S2, "gridS2");
renderGrid(S3, "gridS3");
renderGrid(S4, "gridS4");
