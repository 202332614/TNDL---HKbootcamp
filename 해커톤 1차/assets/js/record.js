let currentDate = new Date();
let selectedTime = "";
let selectedType = "";

let spendingRecords = JSON.parse(localStorage.getItem("spendingRecords")) || [];

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "." + month + "." + day;
}

function renderDate() {
  document.getElementById("today-date").textContent = formatDate(currentDate);
}

function renderPreview() {
  const previewList = document.getElementById("preview-list");
  previewList.innerHTML = "";

  if (spendingRecords.length === 0) {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>저장된 소비 기록이 없습니다.</span>
    `;
    previewList.appendChild(li);
    return;
  }

  for (let i = spendingRecords.length - 1; i >= 0; i--) {
    const item = spendingRecords[i];
    const li = document.createElement("li");

    li.innerHTML = `
      <span>${item.date}</span>
      <span>${item.time}</span>
      <span class="preview-amount">${Number(item.amount).toLocaleString()}원</span>
      <span class="preview-type">${item.type} 소비</span>
    `;

    previewList.appendChild(li);
  }
}

document.getElementById("prev-date-btn").onclick = function () {
  currentDate.setDate(currentDate.getDate() - 1);
  renderDate();
};

document.getElementById("next-date-btn").onclick = function () {
  currentDate.setDate(currentDate.getDate() + 1);
  renderDate();
};

const timeButtons = document.querySelectorAll(".time-btn");

timeButtons.forEach(function (button) {
  button.onclick = function () {
    timeButtons.forEach(function (item) {
      item.classList.remove("active");
    });

    button.classList.add("active");
    selectedTime = button.dataset.time;
  };
});

const typeButtons = document.querySelectorAll(".type-btn");

typeButtons.forEach(function (button) {
  button.onclick = function () {
    typeButtons.forEach(function (item) {
      item.classList.remove("active");
    });

    button.classList.add("active");
    selectedType = button.dataset.type;
  };
});

document.getElementById("save-btn").onclick = function () {
  const moneyInput = document.getElementById("money-input");
  const amount = moneyInput.value;

  if (amount === "") {
    alert("금액을 입력해 주세요.");
    moneyInput.focus();
    return;
  }

  if (Number(amount) <= 0) {
    alert("0원보다 큰 금액을 입력해 주세요.");
    moneyInput.focus();
    return;
  }

  if (selectedTime === "") {
    alert("사용 시간을 선택해 주세요.");
    return;
  }

  if (selectedType === "") {
    alert("사용 유형을 선택해 주세요.");
    return;
  }

  const newRecord = {
    date: formatDate(currentDate),
    amount: Number(amount),
    time: selectedTime,
    type: selectedType,
    isImpulse: selectedType === "충동"
  };

  spendingRecords.push(newRecord);

  localStorage.setItem("spendingRecords", JSON.stringify(spendingRecords));

  renderPreview();

  moneyInput.value = "";
  selectedTime = "";
  selectedType = "";

  timeButtons.forEach(function (item) {
    item.classList.remove("active");
  });

  typeButtons.forEach(function (item) {
    item.classList.remove("active");
  });

  alert("소비 기록이 저장되었습니다.");
};

document.getElementById("delete-btn").onclick = function () {
  const check = confirm("모든 소비 기록을 삭제하시겠습니까?");

  if (check) {
    localStorage.removeItem("spendingRecords");
    spendingRecords = [];
    renderPreview();

    document.getElementById("money-input").value = "";
    selectedTime = "";
    selectedType = "";

    timeButtons.forEach(function (item) {
      item.classList.remove("active");
    });

    typeButtons.forEach(function (item) {
      item.classList.remove("active");
    });

    alert("모든 소비 기록이 삭제되었습니다.");
  }
};

renderDate();
renderPreview();