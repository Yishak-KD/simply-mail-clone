import { createAudience, fetchAudienceList } from "@/db/audience";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const audiences = await fetchAudienceList();

  try {
    return NextResponse.json(
      {
        success: true,
        value: audiences,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error processing file:", err);
    return NextResponse.json(
      {
        success: false,
        error: err,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { audienceName } = await req.json();

  if (!audienceName) {
    return NextResponse.json(
      {
        success: false,
        error: "Audience name is required.",
      },
      { status: 400 }
    );
  }

  const result = await createAudience({
    audienceName,
  });

  try {
    return NextResponse.json(
      {
        success: true,
        value: result,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error processing file:", err);
    return NextResponse.json(
      {
        success: false,
        error: err,
      },
      { status: 500 }
    );
  }
}
