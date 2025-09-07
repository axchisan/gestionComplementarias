import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Basic health check - can be extended to check database connectivity
    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "SENA Gestión Complementarias",
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Service unavailable",
      },
      { status: 503 },
    )
  }
}
