import { NextResponse } from 'next/server'
import {
    createCampaignDeliveryStatus,
    updateEmailCampaign,
} from '@/db/emailCampaign'
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
        newTitle,
    }: EmailCampaignPayload = await req.json()

    try {
        if (
            !subject ||
            !bodyText ||
            !audienceId ||
            !html ||
            !from ||
            !fromName
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields: subject, bodyText, to, html, from, and fromName must all be provided',
                },
                { status: 400 },
            )
        }

        const results = []
        const failedEmails = []

        const emails: string[] =
            audienceId === KEDUS_BIBLE_FIREBASE_AUDIENCE
                ? (await fetchKBUsersFromFirebase()).map(user => user.email)
                : await fetchRecipientEmailsByAudienceId({ audienceId })

        for (const email of emails) {
            try {
                const emailCampaign = await updateEmailCampaign({
                    emailCampaignId,
                    from,
                    subject,
                    html,
                    newTitle,
                    fromName,
                })

                const result = await sendEmail({
                    to: email,
                    fromName,
                    replyTo,
                    from,
                    subject,
                    bodyText,
                    bodyHTML: html,
                })

                await createCampaignDeliveryStatus({
                    emailCampaignId: emailCampaign.id,
                    email,
                    result: Boolean(result),
                })

                if (result) {
                    results.push(email)
                } else {
                    failedEmails.push(email)
                }
            } catch (error) {
                console.warn(`Failed to send email to ${email}:`, error)
                failedEmails.push(email)
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
            { status: failureCount === emails.length ? 500 : 200 },
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
