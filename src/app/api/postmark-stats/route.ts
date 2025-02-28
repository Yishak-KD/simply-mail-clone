import axios from 'axios'
import { NextResponse } from 'next/server'

const POSTMARK_API_KEY = process.env.POSTMARK_API_TOKEN
const BASE_URL = 'https://api.postmarkapp.com'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const tag = searchParams.get('tag')
    
    try {
        // Fetch messages with the specific tag
        const response = await axios.get(`${BASE_URL}/messages/outbound`, {
            params: {
                tag,
                count: 500,
                offset: 0,
                status: searchParams.get('status') || undefined
            },
            headers: {
                'X-Postmark-Server-Token': POSTMARK_API_KEY!,
                'Accept': 'application/json',
            },
        })

        return NextResponse.json(
            {
                success: true,
                value: response.data.Messages
            },
            { status: 200 }
        )
    } catch (err) {
        console.error('Error fetching Postmark messages:', err)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch recipient data'
            },
            { status: 500 }
        )
    }
}