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

    // This is where you update the audience with the new data
    // such as the recipients etc...

    const result = await addRecipientsToAudience({
        audienceId: id,
        emailsWithNames: [],
    })

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
