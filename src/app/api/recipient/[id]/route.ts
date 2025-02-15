import { fetchRecipientWithAudienceId } from "@/db/recipient";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const audienceId = params?.id;

  try {
    if (!audienceId) {
      return NextResponse.json(
        {
          sucess: false,
          value: "Audience Id is missing.",
        },
        { status: 400 }
      );
    }

    const res = await fetchRecipientWithAudienceId({ audienceId });

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
        value: "Failed to get recipient",
      },
      { status: 500 }
    );
  }
}
