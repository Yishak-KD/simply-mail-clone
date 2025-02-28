/* eslint-disable no-console */
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        console.log('Received Webhook Data:', body)

        // Extract important fields
        const { RecordType, MessageID, Recipient, DeliveredAt, Description } =
            body

        console.log('-------------------Message Id------------------')
        console.log({ MessageID })
        console.log('-------------------Message Id------------------')

        switch (RecordType) {
            case 'Delivery':
                console.log(
                    `✅ Email delivered to ${Recipient} at ${DeliveredAt}`,
                )
                break
            case 'Bounce':
                console.log(
                    `⚠️ Email to ${Recipient} bounced! Reason: ${Description}`,
                )
                break
            case 'SpamComplaint':
                console.log(`🚨 Spam complaint from ${Recipient}`)
                break
            default:
                console.log(`ℹ️ Unhandled event type: ${RecordType}`)
        }

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error('Webhook processing error:', error)
        return NextResponse.json(
            { success: false, error: 'Invalid request' },
            { status: 400 },
        )
    }
}
