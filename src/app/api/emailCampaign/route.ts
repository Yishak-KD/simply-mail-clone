import { createEmailCampaign, getEmailCampaigns } from "@/db/emailCampaign";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await getEmailCampaigns();

  try {
    return NextResponse.json(
      {
        success: true,
        value: res,
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

export async function POST() {
  try {
    const result = await createEmailCampaign();

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