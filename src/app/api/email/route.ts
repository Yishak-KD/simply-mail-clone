import { NextResponse } from 'next/server'
import { createCampaignDeliveryStatus } from '@/db/emailCampaign'
import sendEmail from '@/services/email'
import { KEDUS_BIBLE_FIREBASE_AUDIENCE } from '@/constants/constants'
import { fetchRecipientEmailsByAudienceId } from '@/db/audience'
import { fetchKBUsersFromFirebase } from '@/services/firebase'

interface EmailCampaignPayload {
    subject: string
    bodyText: string
    audienceId: string
    replyTo?: string
    html: string
    from: string
    fromName: string
    emailCampaignId: string
    newTitle: string
}

export async function POST(req: Request) {
    const {
        subject,
        bodyText,
        audienceId,
        replyTo,
        html,
        from,
        fromName,
        emailCampaignId,
    }: EmailCampaignPayload = await req.json()

    try {
        const results: string[] = []
        const failedEmails: string[] = []
        let updatedHtml: string = html

        const recipients: { userName?: string | null; userEmail: string }[] =
            audienceId === KEDUS_BIBLE_FIREBASE_AUDIENCE
                ? (await fetchKBUsersFromFirebase()).map(user => {
                      return { userName: user.name, userEmail: user.email }
                  })
                : await fetchRecipientEmailsByAudienceId({ audienceId })

        for (const recipient of recipients) {
            try {
                if (recipient.userName) {
                    updatedHtml = html.replace(
                        'Kedus Bible User',
                        recipient.userName,
                    )
                }

                const result = await sendEmail({
                    to: recipient.userEmail,
                    fromName,
                    replyTo,
                    from,
                    subject,
                    bodyText,
                    bodyHTML: updatedHtml,
                    tag: emailCampaignId
                })

                await createCampaignDeliveryStatus({
                    emailCampaignId,
                    email: recipient.userEmail,
                    result: Boolean(result),
                })

                if (result) {
                    results.push(recipient.userEmail)
                } else {
                    failedEmails.push(recipient.userEmail)
                }
            } catch (error) {
                console.warn(
                    `Failed to send email to ${recipient.userEmail}:`,
                    error,
                )
                failedEmails.push(recipient.userEmail)
            }
        }

        const successCount = results.length
        const failureCount = failedEmails.length

        return NextResponse.json(
            {
                success: successCount > 0,
                successfulEmails: results,
                failedEmails: failedEmails,
                summary: `Successfully sent ${successCount} email(s), failed to send ${failureCount} email(s)`,
            },
            { status: failureCount === recipients.length ? 500 : 200 },
        )
    } catch (err) {
        console.warn({ err })
        return NextResponse.json(
            {
                success: false,
                error: 'Unable to send email',
            },
            { status: 500 },
        )
    }
}
