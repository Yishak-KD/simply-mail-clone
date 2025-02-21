import prisma from '@/services/prisma'
import { CampaignDeliveryStatusWithRecipient } from '@/types/type'

export const getCampaignDeliveryStatusById = async ({
    emailCampaignId,
}: {
    emailCampaignId: string
}) => {
    const campaignDeliveryStatus = await prisma.campaignDeliveryStatus.findMany(
        {
            where: {
                emailCampaignId,
            },
            select: {
                id: true,
                status: true,
                recipient: {
                    select: {
                        email: true,
                        name: true,
                    },
                },
                emailCampaign: true,
                createdAt: true,
            },
        },
    )

    return campaignDeliveryStatus
}
