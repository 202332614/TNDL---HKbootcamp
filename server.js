
const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// 핵심: static 폴더 안에 있는 파일들을 "/" 경로로 바로 접근할 수 있게 해줍니다.
// 이렇게 하면 HTML에서 "/logo.png"라고만 써도 static 폴더를 찾아갑니다.
app.use(express.static(path.join(__dirname, "static")));

// 페이지 라우팅
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "home.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "home.html"));
});

app.get("/record", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "record.html"));
});

app.get("/insight", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "insight.html"));
});

// 이미지용 app.get("/card.png"...) 등등은 모두 삭제하세요! 위에서 이미 처리되었습니다.

app.listen(PORT, function () {
  console.log("==============================================");
  console.log("소비 행동 분석 대시보드 배포 완료!");
  console.log("접속 URL: http://localhost:" + PORT);
  console.log("==============================================");
});
