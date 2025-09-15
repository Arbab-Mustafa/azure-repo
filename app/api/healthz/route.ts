import { NextRequest, NextResponse } from "next/server";

interface HealthCheckResult {
  status: "healthy" | "unhealthy" | "degraded";
  timestamp: string;
  checks: {
    [key: string]: {
      status: "pass" | "fail" | "warn";
      time: string;
      output?: string;
      details?: any;
    };
  };
  info?: {
    [key: string]: any;
  };
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const result: HealthCheckResult = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    checks: {},
    info: {
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      uptime: Math.floor(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
    },
  };

  // System memory check
  try {
    const memUsage = process.memoryUsage();
    const memUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const memTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
    const memUsagePercent = Math.round(
      (memUsage.heapUsed / memUsage.heapTotal) * 100
    );

    result.checks.memory = {
      status:
        memUsagePercent > 90 ? "fail" : memUsagePercent > 70 ? "warn" : "pass",
      time: new Date().toISOString(),
      output: `Memory usage: ${memUsedMB}MB / ${memTotalMB}MB (${memUsagePercent}%)`,
      details: {
        used: memUsedMB,
        total: memTotalMB,
        percentage: memUsagePercent,
        external: Math.round(memUsage.external / 1024 / 1024),
        rss: Math.round(memUsage.rss / 1024 / 1024),
      },
    };
  } catch (error) {
    result.checks.memory = {
      status: "fail",
      time: new Date().toISOString(),
      output: "Failed to check memory usage",
      details: {
        error: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }

  // Process uptime check
  try {
    const uptime = Math.floor(process.uptime());
    result.checks.uptime = {
      status: "pass",
      time: new Date().toISOString(),
      output: `Process uptime: ${uptime} seconds`,
      details: { seconds: uptime, formatted: formatUptime(uptime) },
    };
  } catch (error) {
    result.checks.uptime = {
      status: "fail",
      time: new Date().toISOString(),
      output: "Failed to check uptime",
    };
  }

  // Azure environment check
  if (process.env.WEBSITE_SITE_NAME) {
    try {
      result.checks.azure = {
        status: "pass",
        time: new Date().toISOString(),
        output: "Running on Azure App Service",
        details: {
          siteName: process.env.WEBSITE_SITE_NAME,
          resourceGroup: process.env.WEBSITE_RESOURCE_GROUP,
          subscriptionId: process.env.WEBSITE_OWNER_NAME,
          hostname: process.env.WEBSITE_HOSTNAME,
          instanceId: process.env.WEBSITE_INSTANCE_ID,
          sku: process.env.WEBSITE_SKU,
          slot: process.env.WEBSITE_SLOT_NAME || "production",
        },
      };

      result.info.azure = {
        siteName: process.env.WEBSITE_SITE_NAME,
        hostname: process.env.WEBSITE_HOSTNAME,
        slot: process.env.WEBSITE_SLOT_NAME || "production",
      };
    } catch (error) {
      result.checks.azure = {
        status: "warn",
        time: new Date().toISOString(),
        output: "Azure environment check failed",
      };
    }
  }

  // Response time check
  const responseTime = Date.now() - startTime;
  result.checks.responseTime = {
    status: responseTime > 1000 ? "fail" : responseTime > 500 ? "warn" : "pass",
    time: new Date().toISOString(),
    output: `Response time: ${responseTime}ms`,
    details: { milliseconds: responseTime },
  };

  // Determine overall status
  const checkStatuses = Object.values(result.checks).map(
    (check) => check.status
  );
  if (checkStatuses.includes("fail")) {
    result.status = "unhealthy";
  } else if (checkStatuses.includes("warn")) {
    result.status = "degraded";
  }

  // Return appropriate HTTP status code
  const httpStatus =
    result.status === "healthy"
      ? 200
      : result.status === "degraded"
      ? 200
      : 503;

  return NextResponse.json(result, { status: httpStatus });
}

// Support HEAD requests for basic health checks
export async function HEAD(request: NextRequest) {
  try {
    // Quick health check without detailed information
    const memUsage = process.memoryUsage();
    const memUsagePercent = Math.round(
      (memUsage.heapUsed / memUsage.heapTotal) * 100
    );

    // Return 503 if memory usage is critically high
    if (memUsagePercent > 95) {
      return new NextResponse(null, { status: 503 });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(" ");
}
