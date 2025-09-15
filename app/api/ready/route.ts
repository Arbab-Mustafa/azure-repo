import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check if the application is ready to serve traffic
    const readinessChecks = {
      timestamp: new Date().toISOString(),
      ready: true,
      checks: {
        server: {
          status: "ready",
          message: "Server is running",
        },
        memory: {
          status: "ready",
          message: "Memory usage within acceptable limits",
        },
      },
    };

    // Check memory usage
    const memUsage = process.memoryUsage();
    const memUsagePercent = Math.round(
      (memUsage.heapUsed / memUsage.heapTotal) * 100
    );

    if (memUsagePercent > 95) {
      readinessChecks.ready = false;
      readinessChecks.checks.memory = {
        status: "not_ready",
        message: `Memory usage too high: ${memUsagePercent}%`,
      };
    }

    // Check if we can allocate memory (basic functionality test)
    try {
      const testArray = new Array(1000).fill(0);
      testArray.length; // Access the array to ensure it's allocated
    } catch (error) {
      readinessChecks.ready = false;
      readinessChecks.checks.server = {
        status: "not_ready",
        message: "Cannot allocate memory for basic operations",
      };
    }

    const httpStatus = readinessChecks.ready ? 200 : 503;

    return NextResponse.json(readinessChecks, { status: httpStatus });
  } catch (error) {
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        ready: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}

export async function HEAD(request: NextRequest) {
  try {
    // Quick readiness check
    const memUsage = process.memoryUsage();
    const memUsagePercent = Math.round(
      (memUsage.heapUsed / memUsage.heapTotal) * 100
    );

    if (memUsagePercent > 95) {
      return new NextResponse(null, { status: 503 });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
}
