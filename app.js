// Масиви для зображень
export const S1 = [
  -1, -1, 1, 1, 1, -1, 1, -1, -1, 1, -1, -1, 1, 1, 1, -1, 1, -1, -1, 1, 1, -1,
  -1, -1, 1,
];
export const S2 = [
  1, -1, -1, -1, 1, 1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 1, 1, -1,
  -1, -1, 1,
];
export const S3 = [
  -1, 1, 1, 1, -1, 1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 1, 1, -1, -1,
  -1, 1,
];

// Функція для навчання мережі Хопфілда
function trainHopfieldNetwork(patterns) {
  const n = patterns[0].length;
  let W = Array.from({ length: n }, () => Array(n).fill(0));

  patterns.forEach((pattern) => {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          W[i][j] += pattern[i] * pattern[j];
        }
      }
    }
  });

  return W;
}

// Функція для обчислення вихідних сигналів на основі порогів
function calculateOutputSignals(W, thresholds, input) {
  const n = W.length;
  let output = [];

  for (let i = 0; i < n; i++) {
    const signal = W[i].reduce((acc, weight, j) => acc + weight * input[j], 0);
    output[i] = signal >= thresholds[i] ? 1 : -1;
  }

  return output;
}

// Розрахунок порогів
function calculateThresholds(W) {
  let thresholds = W.map((row, i) => {
    const sum = row.reduce(
      (acc, weight, j) => (i !== j ? acc + weight : acc),
      0
    );
    return sum / 2; // Поріг для нейрону i
  });

  return thresholds;
}

// Функція для формування таблиць з результатами
function generateTableData(trainingData, W, thresholds) {
  let tableData = [];

  trainingData.forEach((sample) => {
    const output = calculateOutputSignals(W, thresholds, sample);

    sample.forEach((val, i) => {
      tableData.push({
        neuron: i + 1,
        sampleValue: val,
        inputSignal: W[i].reduce(
          (acc, weight, j) => acc + weight * sample[j],
          0
        ),
        threshold: thresholds[i],
        outputSignal: output[i],
      });
    });
  });

  return tableData;
}

// Навчання нейронної мережі
const W = trainHopfieldNetwork([S1, S2, S3]);

// Розрахунок порогів
const thresholds = calculateThresholds(W);

// Генерація таблиць
const tableDataS1 = generateTableData([S1], W, thresholds);
const tableDataS2 = generateTableData([S2], W, thresholds);
const tableDataS3 = generateTableData([S3], W, thresholds);

// Збереження початкових таблиць ваг в окремих змінних
const initialW_S1 = trainHopfieldNetwork([S1]);
const initialW_S2 = trainHopfieldNetwork([S2]);
const initialW_S3 = trainHopfieldNetwork([S3]);

// Виведення початкових значень таблиць ваг
console.log("Початкові таблиці ваг для кожної букви (S1, S2, S3):");
console.log("Таблиця ваг для S1:");
console.table(initialW_S1);

console.log("Таблиця ваг для S2:");
console.table(initialW_S2);

console.log("Таблиця ваг для S3:");
console.table(initialW_S3);

// Виведення порогових значень
console.log("\nПорогові значення для нейронів:");
console.log(thresholds);

// Виведення таблиць для кожної букви
console.log("\nТаблиця для букви 'Я' (S1):");
console.table(tableDataS1);

console.log("\nТаблиця для букви 'Н' (S2):");
console.table(tableDataS2);

console.log("\nТаблиця для букви 'А' (S3):");
console.table(tableDataS3);

// Масив для спотвореного зображення S1
export const S4 = [
  -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, -1, 1, 1, 1, -1, 1, -1, -1, 1, 1, -1,
  -1, -1, 1,
];

// Функція для розрахунку вхідних та вихідних сигналів на кожному такті
function calculateSignalsForDistortedImage(W, thresholds, input) {
  let signals = [];
  let currentInput = input;

  // Обчислюємо сигнали для t=1 та t=2
  for (let t = 1; t <= 2; t++) {
    const output = calculateOutputSignals(W, thresholds, currentInput);
    const inputSignals = currentInput.map((_, i) =>
      W[i].reduce((acc, weight, j) => acc + weight * currentInput[j], 0)
    );
    signals.push({ t, inputSignals, output });
    currentInput = output; // Перехід до наступного такту
  }

  return signals;
}

// Генерація таблиці для спотвореного зображення
function generateDistortedTableData(S4, W, thresholds) {
  const tableData = [];

  // Обчислюємо сигнали для кожного такту (t=1, t=2)
  const signals = calculateSignalsForDistortedImage(W, thresholds, S4);

  // Створюємо таблицю
  for (let i = 0; i < S4.length; i++) {
    tableData.push({
      neuron: i + 1,
      sampleValue: S4[i],
      t1_inputSignal: signals[0].inputSignals[i],
      t2_inputSignal: signals[1].inputSignals[i],
      t1_outputSignal: signals[0].output[i],
      t2_outputSignal: signals[1].output[i],
    });
  }

  return tableData;
}

// Генерація таблиці для спотвореного зображення S4
const tableDataS4 = generateDistortedTableData(S4, W, thresholds);

// Виведення таблиці для спотвореного зображення S4
console.log("\nТаблиця для спотвореного зображення букви 'Я' (S4):");
console.table(tableDataS4);

function calculateDifference(S1, S4) {
  let differenceCount = 0;

  // Перевіряємо кожен елемент обох масивів
  for (let i = 0; i < S1.length; i++) {
    if (S1[i] !== S4[i]) {
      differenceCount++;
    }
  }

  return differenceCount;
}

// Виведення повідомлення на основі порогу
function displayRecognitionMessage(S1, S4) {
  const threshold = 3; // Поріг у 3
  const differenceCount = calculateDifference(S1, S4);

  if (differenceCount > threshold) {
    console.log("Зображення не розпізнано.");
  } else {
    console.log("Зображення розпізнано!");
  }
}

// Виклик функції для виведення повідомлення
displayRecognitionMessage(S1, S4);
