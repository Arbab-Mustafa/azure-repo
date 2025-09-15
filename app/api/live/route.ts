import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Simple liveness check - if this endpoint responds, the app is alive
    const livenessCheck = {
      status: "alive",
      timestamp: new Date().toISOString(),
      pid: process.pid,
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || "development",
    };

    // Add Azure-specific information if available
    if (process.env.WEBSITE_SITE_NAME) {
      livenessCheck.azure = {
        siteName: process.env.WEBSITE_SITE_NAME,
        instanceId: process.env.WEBSITE_INSTANCE_ID,
        hostname: process.env.WEBSITE_HOSTNAME,
      };
    }

    return NextResponse.json(livenessCheck, { status: 200 });
  } catch (error) {
    // If we can't even create a response, the app is not alive
    return NextResponse.json(
      {
        status: "dead",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}

export async function HEAD(request: NextRequest) {
  // Simplest possible liveness check - just return 200 if we can respond
  return new NextResponse(null, { status: 200 });
}
