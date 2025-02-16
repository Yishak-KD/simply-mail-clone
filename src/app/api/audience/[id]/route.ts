import { addRecipientsToAudience, fetchAudienceWithId } from '@/db/audience'
import { NextRequest, NextResponse } from 'next/server'

export async function GET({ params }: { params: { id: string } }) {
    const id = params.id
    const audience = await fetchAudienceWithId(id)

    if (!audience) {
        return NextResponse.json(
            {
                success: false,
                error: 'Audience not found.',
            },
            { status: 404 },
        )
    }

    try {
        return NextResponse.json(
            {
                success: true,
                value: audience,
            },
            { status: 200 },
        )
    } catch (err) {
        console.error('Error processing file:', err)
        return NextResponse.json(
            {
                success: false,
                error: err,
            },
            { status: 500 },
        )
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const id = params.id

    const {
        recipients,
    }: {
        recipients: { email: string; name?: string }[]
        audienceName: string
    } = await req.json()

    // This is where you update the audience with the new data
    // such as recipients etc...
    // updating audience name

    const result = await addRecipientsToAudience({
        audienceId: id,
        emailsWithNames: recipients,
    })

    if (!result) {
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to add recipients to audience.',
            },
            { status: 500 },
        )
    }

    try {
        return NextResponse.json(
            {
                success: true,
                value: result,
            },
            { status: 200 },
        )
    } catch (err) {
        console.error('Error processing file:', err)
        return NextResponse.json(
            {
                success: false,
                error: err,
            },
            { status: 500 },
        )
    }
}
