import { NextResponse } from 'next/server';
import {
  createCampaignDeliveryStatus,
  updateEmailCampaignAndCreateRecipients,
} from '@/db/emailCampaign';
import sendEmail from '@/services/email';

interface EmailCampaignPayload {
  subject: string;
  bodyText: string;
  to: string[];
  replyTo?: string;
  html: string;
  from: string;
  fromName: string;
  emailCampaignId: string;
  newTitle: string;
}

export async function POST(req: Request) {
  const {
    subject,
    bodyText,
    to,
    replyTo,
    html,
    from,
    fromName,
    emailCampaignId,
    newTitle,
  }: EmailCampaignPayload = await req.json();

  try {
    if (!subject || !bodyText || !to?.length || !html || !from || !fromName) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing required fields: subject, bodyText, to, html, from, and fromName must all be provided',
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
            newTitle,
          });

        const result = await sendEmail({
          to: email,
          replyTo,
          from,
          fromName,
          subject,
          bodyText,
          bodyHTML: html,
        });

        await createCampaignDeliveryStatus({
          emailCampaignId: emailCampaign.id,
          recipientId: recipient?.id ?? '',
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
        error: 'Unable to send email',
      },
      { status: 500 }
    );
  }
}
