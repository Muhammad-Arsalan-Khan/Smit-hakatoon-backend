export function customLogger(req, res, next) {
  const start = Date.now()

  res.on("finish", () => {
    const duration = Date.now() - start;

    // Color-coded status (optional, but helpful for local dev)
    const statusColor = res.statusCode >= 500
      ? "\x1b[31m" // Red
      : res.statusCode >= 400
      ? "\x1b[33m" // Yellow
      : "\x1b[32m"; // Green

    const resetColor = "\x1b[0m";

    const log = `
📥 ${req.method} ${req.originalUrl}
🔢 Status: ${statusColor}${res.statusCode}${resetColor}
🌐 IP: ${req.ip}
⏱️ Duration: ${duration}ms
🕒 Time: ${new Date().toISOString()}
---------------------------------------------------
    `.trim()

    console.log(log)
  })

  next()
}
