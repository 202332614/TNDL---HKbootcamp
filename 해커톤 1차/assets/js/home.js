let currentDate = new Date();
let homeBarChart;

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

function renderHome() {
  const records = getRecords();
  const today = formatDate(currentDate);

  let todayRecords = [];

  records.forEach(function (item) {
    if (item.date === today) {
      todayRecords.push(item);
    }
  });

  let totalAmount = 0;

  let morningTotal = 0;
  let lunchTotal = 0;
  let eveningTotal = 0;
  let nightTotal = 0;

  let impulseAmount = 0;

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
      impulseAmount += Number(item.amount);
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

  const timeIcon = document.getElementById("time-icon");

  if (topTime === "아침") {
    timeIcon.src = "/static/sun.png";
    timeIcon.style.width = "80px";
  } else if (topTime === "점심") {
    timeIcon.src = "/static/cloud.png";
    timeIcon.style.width = "100px";
  } else if (topTime === "저녁") {
    timeIcon.src = "/static/moon.png";
    timeIcon.style.width = "80px";
  } else if (topTime === "야간") {
    timeIcon.src = "/static/star.png";
    timeIcon.style.width = "90px";
  } else {
    timeIcon.src = "/static/sun.png";
    timeIcon.style.width = "80px";
  }

  let ratio = 0;

  if (totalAmount > 0) {
    ratio = Math.round((impulseAmount / totalAmount) * 100);
  }

  document.getElementById("impulse-ratio").textContent = ratio + "%";

  const recentList = document.getElementById("recent-list");
  recentList.innerHTML = "";

  if (todayRecords.length === 0) {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>-</span>
      <span>해당 날짜의 소비 기록이 없습니다</span>
      <span class="amount">-</span>
    `;
    recentList.appendChild(li);
  } else {
    for (let i = todayRecords.length - 1; i >= 0; i--) {
      const item = todayRecords[i];

      if (todayRecords.length - 1 - i >= 7) {
        break;
      }

      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item.time}</span>
        <span>${item.type} 소비</span>
        <span class="amount">${formatMoney(item.amount)}</span>
      `;
      recentList.appendChild(li);
    }
  }

  let yesterdayDate = new Date(currentDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  let yesterday = formatDate(yesterdayDate);

  let yesterdayTotal = 0;

  records.forEach(function (item) {
    if (item.date === yesterday) {
      yesterdayTotal += Number(item.amount);
    }
  });

  document.getElementById("bottom-total-amount").textContent = formatMoney(totalAmount);

  const trendText = document.getElementById("trend-text");
  const trendIcon = document.getElementById("trend-icon");

  if (totalAmount > yesterdayTotal) {
    trendText.textContent = "+ 어제보다 " + formatMoney(totalAmount - yesterdayTotal) + " 더 소비했어요!";
    trendIcon.src = "/static/up.png";
  } else if (totalAmount < yesterdayTotal) {
    trendText.textContent = "- 어제보다 " + formatMoney(yesterdayTotal - totalAmount) + " 덜 소비했어요!";
    trendIcon.src = "/static/down.png";
  } else {
    trendText.textContent = "어제와 동일한 소비예요!";
    trendIcon.src = "/static/up.png";
  }

  homeBarChart.data.datasets[0].data = [
    morningTotal,
    lunchTotal,
    eveningTotal,
    nightTotal
  ];

  homeBarChart.data.datasets[1].data = [
    0,
    0,
    0,
    0
  ];

  todayRecords.forEach(function (item) {
    if (item.isImpulse === true) {
      if (item.time === "아침") {
        homeBarChart.data.datasets[1].data[0] += Number(item.amount);
      }

      if (item.time === "점심") {
        homeBarChart.data.datasets[1].data[1] += Number(item.amount);
      }

      if (item.time === "저녁") {
        homeBarChart.data.datasets[1].data[2] += Number(item.amount);
      }

      if (item.time === "야간") {
        homeBarChart.data.datasets[1].data[3] += Number(item.amount);
      }
    }
  });

  homeBarChart.update();
}

function createHomeBarChart() {
  const ctx = document.getElementById("timeBarChart").getContext("2d");

  homeBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["아침", "점심", "저녁", "야간"],
      datasets: [
        {
          label: "총 소비",
          data: [0, 0, 0, 0],
          backgroundColor: "#dfe5ef",
          borderRadius: 10
        },
        {
          label: "충동 소비",
          data: [0, 0, 0, 0],
          backgroundColor: "#5b7cfa",
          borderRadius: 10
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

document.getElementById("prev-date-btn").onclick = function () {
  currentDate.setDate(currentDate.getDate() - 1);
  renderDate();
  renderHome();
};

document.getElementById("next-date-btn").onclick = function () {
  currentDate.setDate(currentDate.getDate() + 1);
  renderDate();
  renderHome();
};

renderDate();
createHomeBarChart();
renderHome();