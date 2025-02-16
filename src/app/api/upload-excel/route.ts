import { addRecipientsToAudience } from '@/db/audience'
import { ChurchMember } from '@/types/type'
import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function POST(req: NextRequest) {
    const data = await req.formData()
    const file = data.get('file') as File
    const audienceId = data.get('audienceId') as string

    if (!audienceId) {
        console.error('Audience ID is missing')
        return
    }

    try {
        const arrayBuffer = await file.arrayBuffer()

        const workbook = XLSX.read(arrayBuffer, { type: 'array' })

        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        const jsonData: ChurchMember[] = XLSX.utils.sheet_to_json(worksheet)

        const emailsWithNames = jsonData.map(data => ({
            email: data.Email,
            name: data.Name,
        }))

        const res = await addRecipientsToAudience({
            audienceId,
            emailsWithNames,
        })

        return NextResponse.json(
            {
                success: true,
                value: res,
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
