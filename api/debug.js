export default function handler(req, res) {
  res.status(200).json({
    message: "Debug endpoint working!",
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
}
