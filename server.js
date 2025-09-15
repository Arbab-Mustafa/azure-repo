const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.WEBSITE_HOSTNAME || "localhost";
const port = process.env.PORT || 3000;

// When using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      // Health check endpoint for Azure load balancer
      if (pathname === "/health" || pathname === "/api/health") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        const healthData = {
          status: "healthy",
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: process.env.NODE_ENV || "development",
          hostname: hostname,
          port: port,
          memory: {
            used:
              Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
              100,
            total:
              Math.round(
                (process.memoryUsage().heapTotal / 1024 / 1024) * 100
              ) / 100,
          },
        };

        res.end(JSON.stringify(healthData));
        return;
      }

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
