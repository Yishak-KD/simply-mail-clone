import { addRecipientsToAudience, fetchAudienceWithId } from '@/db/audience'
import { parseExcelToJson } from '@/utils/parseExcelToJson'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    req: Request,
    { params }: { params: { id: string } },
) {
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

    const data = await req.formData()
    const file = data.get('file') as File

    const arrayBuffer = await file.arrayBuffer()

    const emailsWithNames = parseExcelToJson(arrayBuffer)

    const result = await addRecipientsToAudience({
        audienceId: id,
        emailsWithNames,
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
