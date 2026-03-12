let currentDate = new Date();
let groupBarChart;
let amountBarChart;
let pieChart;

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "." + month + "." + day;
}

function renderDate() {
  document.getElementById("today-date").textContent = formatDate(currentDate);
}

function getRecords() {
  return JSON.parse(localStorage.getItem("spendingRecords")) || [];
}

function formatMoney(money) {
  return Number(money).toLocaleString() + "원";
}

function renderInsight() {
  const records = getRecords();
  const today = formatDate(currentDate);

  let yesterdayDate = new Date(currentDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  let yesterday = formatDate(yesterdayDate);

  let todayRecords = [];
  let yesterdayRecords = [];

  records.forEach(function (item) {
    if (item.date === today) {
      todayRecords.push(item);
    }

    if (item.date === yesterday) {
      yesterdayRecords.push(item);
    }
  });

  let totalAmount = 0;

  let morningTotal = 0;
  let lunchTotal = 0;
  let eveningTotal = 0;
  let nightTotal = 0;

  let yesterdayMorning = 0;
  let yesterdayLunch = 0;
  let yesterdayEvening = 0;
  let yesterdayNight = 0;

  let impulseCount = 0;
  let plannedCount = 0;
  let impulseAmount = 0;
  let plannedAmount = 0;

  todayRecords.forEach(function (item) {
    totalAmount += Number(item.amount);

    if (item.time === "아침") {
      morningTotal += Number(item.amount);
    }

    if (item.time === "점심") {
      lunchTotal += Number(item.amount);
    }

    if (item.time === "저녁") {
      eveningTotal += Number(item.amount);
    }

    if (item.time === "야간") {
      nightTotal += Number(item.amount);
    }

    if (item.isImpulse === true) {
      impulseCount += 1;
      impulseAmount += Number(item.amount);
    } else {
      plannedCount += 1;
      plannedAmount += Number(item.amount);
    }
  });

  yesterdayRecords.forEach(function (item) {
    if (item.time === "아침") {
      yesterdayMorning += Number(item.amount);
    }

    if (item.time === "점심") {
      yesterdayLunch += Number(item.amount);
    }

    if (item.time === "저녁") {
      yesterdayEvening += Number(item.amount);
    }

    if (item.time === "야간") {
      yesterdayNight += Number(item.amount);
    }
  });

  let topTime = "-";
  let maxAmount = 0;

  if (morningTotal > maxAmount) {
    maxAmount = morningTotal;
    topTime = "아침";
  }

  if (lunchTotal > maxAmount) {
    maxAmount = lunchTotal;
    topTime = "점심";
  }

  if (eveningTotal > maxAmount) {
    maxAmount = eveningTotal;
    topTime = "저녁";
  }

  if (nightTotal > maxAmount) {
    maxAmount = nightTotal;
    topTime = "야간";
  }

  document.getElementById("summary-total-amount").textContent = formatMoney(totalAmount);
  document.getElementById("summary-top-time").textContent = topTime;

  document.getElementById("amount-morning").textContent = formatMoney(morningTotal);
  document.getElementById("amount-lunch").textContent = formatMoney(lunchTotal);
  document.getElementById("amount-evening").textContent = formatMoney(eveningTotal);
  document.getElementById("amount-night").textContent = formatMoney(nightTotal);

  let ratio = 0;

  if (totalAmount > 0) {
    ratio = Math.round((impulseAmount / totalAmount) * 100);
  }

  document.getElementById("impulse-ratio").textContent = ratio + "%";
  document.getElementById("impulse-count-text").textContent = "충동 소비 횟수 " + impulseCount + "회";
  document.getElementById("planned-count-text").textContent = "계획 소비 횟수 " + plannedCount + "회";
  document.getElementById("impulse-amount").textContent = formatMoney(impulseAmount);

  groupBarChart.data.datasets[0].data = [
    yesterdayMorning,
    yesterdayLunch,
    yesterdayEvening,
    yesterdayNight
  ];

  groupBarChart.data.datasets[1].data = [
    morningTotal,
    lunchTotal,
    eveningTotal,
    nightTotal
  ];

  groupBarChart.update();

  amountBarChart.data.datasets[0].data = [
    morningTotal,
    lunchTotal,
    eveningTotal,
    nightTotal
  ];

  amountBarChart.update();

  pieChart.data.datasets[0].data = [
    impulseAmount,
    plannedAmount
  ];

  pieChart.update();
}

function createGroupBarChart() {
  const ctx = document.getElementById("groupBarChart").getContext("2d");

  groupBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["아침", "점심", "저녁", "야간"],
      datasets: [
        {
          label: "어제",
          data: [0, 0, 0, 0],
          backgroundColor: "#dfe5ef",
          borderRadius: 5,
          barThickness: 25
        },
        {
          label: "오늘",
          data: [0, 0, 0, 0],
          backgroundColor: "#5e87ff",
          borderRadius: 5,
          barThickness: 25
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function createAmountBarChart() {
  const ctx = document.getElementById("amountBarChart").getContext("2d");

  amountBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["아침", "점심", "저녁", "야간"],
      datasets: [
        {
          label: "소비 금액",
          data: [0, 0, 0, 0],
          backgroundColor: ["#dfe5ef", "#cfd9ff", "#8fa8ff", "#5e87ff"],
          borderRadius: 5
        }
      ]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function createPieChart() {
  const ctx = document.getElementById("pieChart").getContext("2d");

  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["충동 소비", "계획 소비"],
      datasets: [
        {
          data: [0, 0],
          backgroundColor: ["#5e87ff", "#dfe5ef"],
          borderWidth: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

document.getElementById("prev-date-btn").onclick = function () {
  currentDate.setDate(currentDate.getDate() - 1);
  renderDate();
  renderInsight();
};

document.getElementById("next-date-btn").onclick = function () {
  currentDate.setDate(currentDate.getDate() + 1);
  renderDate();
  renderInsight();
};

renderDate();
createGroupBarChart();
createAmountBarChart();
createPieChart();
renderInsight();