import {
  getEmailCampaignTitleById,
  updateEmailCampaignTitle,
} from "@/db/emailCampaign";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const emailCampaignId = params?.id;

  try {
    if (!emailCampaignId) {
      return NextResponse.json(
        {
          sucess: false,
          value: "Email Campaign Id is missing.",
        },
        { status: 400 }
      );
    }

    const res = await getEmailCampaignTitleById({
      emailCampaignId,
    });

    return NextResponse.json(
      {
        success: true,
        value: res,
      },
      {
        status: 200,
      }
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error occurred:", err.message);
    } else {
      console.error("An unknown error occurred:", err);
    }

    return NextResponse.json(
      {
        success: false,
        value: "Failed to get email campaign",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const emailCampaignId = params?.id;
  const { newTitle } = await req.json();

  try {
    if (!emailCampaignId) {
      return NextResponse.json(
        {
          success: false,
          value: "Email Campaign Id is missing.",
        },
        { status: 400 }
      );
    }

    if (!newTitle) {
      return NextResponse.json(
        {
          success: false,
          value: "New title is required.",
        },
        { status: 400 }
      );
    }

    const updatedCampaign = await updateEmailCampaignTitle({
      emailCampaignId,
      newTitle,
    });

    return NextResponse.json(
      {
        success: true,
        value: updatedCampaign,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error occurred:", err.message);
    } else {
      console.error("An unknown error occurred:", err);
    }

    return NextResponse.json(
      {
        success: false,
        value: "Failed to update email campaign title",
      },
      { status: 500 }
    );
  }
}
