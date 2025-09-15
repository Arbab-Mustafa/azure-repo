import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Basic health check response
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0",
      hostname: process.env.WEBSITE_HOSTNAME || "localhost",
      port: process.env.PORT || 3000,
      memory: {
        used:
          Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
          100,
        total:
          Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) /
          100,
        external:
          Math.round((process.memoryUsage().external / 1024 / 1024) * 100) /
          100,
      },
      system: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
      },
    };

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Internal server error during health check",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}

// Support HEAD requests for simple health checks
export async function HEAD(request: NextRequest) {
  try {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}
