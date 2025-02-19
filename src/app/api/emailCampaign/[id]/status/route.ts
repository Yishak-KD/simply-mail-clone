import { getCampaignDeliveryStatusById } from '@/db/campaign'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    { params }: { params: { id: string } },
) {
    const id = params.id
    const campaignDeliveryStatus = await getCampaignDeliveryStatusById({
        emailCampaignId: id,
    })

    if (!campaignDeliveryStatus) {
        return NextResponse.json(
            {
                success: false,
                error: 'Campaign delivery status not found.',
            },
            { status: 404 },
        )
    }

    try {
        return NextResponse.json(
            {
                success: true,
                value: campaignDeliveryStatus,
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
