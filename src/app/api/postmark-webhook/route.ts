/* eslint-disable no-console */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Postmark webhook payload schema
const PostmarkWebhookSchema = z.object({
  RecordType: z.string(),
  MessageID: z.string(),
  MessageStream: z.string(),
  Recipient: z.string().email(),
  Tag: z.string().optional(),
  DeliveryStatus: z.string(),
  Details: z.string(),
  Timestamp: z.string(),
  Type: z.string(),
  ServerID: z.number(),
})

export async function POST(req: NextRequest) {
  try {
    // Parse and validate the webhook payload
    const payload = await req.json()
    const validatedPayload = PostmarkWebhookSchema.parse(payload)

    // Log each field individually with descriptive labels
    console.log('=== Postmark Webhook Data ===')
    console.log('Record Type:', validatedPayload.RecordType)
    console.log('Message ID:', validatedPayload.MessageID)
    console.log('Message Stream:', validatedPayload.MessageStream)
    console.log('Recipient:', validatedPayload.Recipient)
    console.log('Tag:', validatedPayload.Tag || 'No tag')
    console.log('Delivery Status:', validatedPayload.DeliveryStatus)
    console.log('Details:', validatedPayload.Details)
    console.log('Timestamp:', validatedPayload.Timestamp)
    console.log('Type:', validatedPayload.Type)
    console.log('Server ID:', validatedPayload.ServerID)
    console.log('========================')

    // Log the entire payload as well
    console.log('Raw webhook payload:', JSON.stringify(payload, null, 2))

    return NextResponse.json(
      { message: 'Webhook received and logged successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Postmark webhook error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid webhook payload', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}