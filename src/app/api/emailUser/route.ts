import { NextResponse } from "next/server";
import emailUser from "./emailUser";
import {
  createCampaignDeliveryStatus,
  updateEmailCampaignAndCreateRecipients,
} from "@/db/emailCampaign";

interface EmailCampaignPayload {
  subject: string;
  bodyText: string;
  to: string[];
  html: string;
  from: string;
  emailCampaignId: string;
}

export async function POST(req: Request) {
  const {
    subject,
    bodyText,
    to,
    html,
    from,
    emailCampaignId,
  }: EmailCampaignPayload = await req.json();

  try {
    if (!to || to.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No recipients provided",
        },
        { status: 400 }
      );
    }

    const results = [];
    const failedEmails = [];

    for (const email of to) {
      try {
        const { emailCampaign, recipient } =
          await updateEmailCampaignAndCreateRecipients({
            emailCampaignId,
            from,
            subject,
            html,
            email,
          });

        const result = await emailUser({
          to: email,
          from,
          subject,
          bodyText,
          html,
        });

        await createCampaignDeliveryStatus({
          emailCampaignId: emailCampaign.id,
          recipientId: recipient.id,
          result: Boolean(result),
        });

        if (result) {
          results.push(email);
        } else {
          failedEmails.push(email);
        }
      } catch (error) {
        console.warn(`Failed to send email to ${email}:`, error);
        failedEmails.push(email);
      }
    }

    const successCount = results.length;
    const failureCount = failedEmails.length;

    return NextResponse.json(
      {
        success: successCount > 0,
        successfulEmails: results,
        failedEmails: failedEmails,
        summary: `Successfully sent ${successCount} email(s), failed to send ${failureCount} email(s)`,
      },
      { status: failureCount === to.length ? 500 : 200 }
    );
  } catch (err) {
    console.warn({ err });
    return NextResponse.json(
      {
        success: false,
        error: "Unable to send email",
      },
      { status: 500 }
    );
  }
}
