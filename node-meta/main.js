const express = require('express');
const app = express();

app.use(express.json());

// Đối tượng lưu request count theo IP
const requestCounts = {};
const MAX_REQUESTS_LIMIT = process.env["MAX_REQUESTS_LIMIT"]; // Giới hạn request
const TIME_WINDOW = 1000; // Thời gian reset (1 giây)

// Middleware kiểm tra số request từ IP
app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;

  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 1, timestamp: Date.now() };
  } else {
    const timeDiff = Date.now() - requestCounts[ip].timestamp;

    if (timeDiff < TIME_WINDOW) {
      requestCounts[ip].count++;

      // Nếu quá 20 request trong 1 giây => Crash server
      if (requestCounts[ip].count > MAX_REQUESTS_LIMIT) {
        console.error(`🚨 Server Crashed! IP ${ip} gửi quá nhiều request: ${requestCounts[ip].count} req/s`);
        // process.exit(1); // Crash server
      }
    } else {
      // Reset bộ đếm sau 1 giây
      requestCounts[ip] = { count: 1, timestamp: Date.now() };
    }
  }

  next();
});
let count = 0
let count_log = 0
setInterval(() => {
  console.log("Total request incoming:",count);
  if (count != 0) {
    count_log ++
  }
  if (count_log === 20) {
    console.log("Reset count request incoming");
    count = 0
    count_log =0
  }
},3000)
// API endpoint
app.post('/api/v1/user', (req, res) => {
  console.log("Request received");
  count ++
  res.json({ message: `This is meta server ${process.env["SERVER_NAME"]}, response success` });
});

// Start server
const PORT = process.env["PORT"];
app.listen(PORT, () => {
  console.log(`🚀 Node meta running on http://localhost:${PORT}`);
});
