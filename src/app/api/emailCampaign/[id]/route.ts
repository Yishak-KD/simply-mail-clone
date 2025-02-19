import { fetchEmailCampaignById, updateEmailCampaign } from '@/db/emailCampaign'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    { params }: { params: { id: string } },
) {
    const emailCampaignId = params?.id

    try {
        if (!emailCampaignId) {
            return NextResponse.json(
                {
                    sucess: false,
                    value: 'Email Campaign Id is missing.',
                },
                { status: 400 },
            )
        }

        const res = await fetchEmailCampaignById({
            emailCampaignId,
        })

        return NextResponse.json(
            {
                success: true,
                value: res,
            },
            {
                status: 200,
            },
        )
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('Error occurred:', err.message)
        } else {
            console.error('An unknown error occurred:', err)
        }

        return NextResponse.json(
            {
                success: false,
                value: 'Failed to get email campaign',
            },
            { status: 500 },
        )
    }
}

export async function POST(
    req: Request,
    { params }: { params: { id: string } },
) {
    const emailCampaignId = params?.id
    const { newTitle, from, html, subject, bodyText, fromName } =
        await req.json()

    try {
        if (!emailCampaignId) {
            return NextResponse.json(
                {
                    success: false,
                    value: 'Email Campaign Id is missing.',
                },
                { status: 400 },
            )
        }

        await updateEmailCampaign({
            emailCampaignId,
            fromName,
            from,
            bodyText,
            html,
            newTitle,
            subject,
        })

        return NextResponse.json(
            {
                success: true,
                value: 'ok',
            },
            { status: 200 },
        )
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('Error occurred:', err.message)
        } else {
            console.error('An unknown error occurred:', err)
        }

        return NextResponse.json(
            {
                success: false,
                value: 'Failed to update email campaign details',
            },
            { status: 500 },
        )
    }
}
