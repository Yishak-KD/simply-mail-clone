import { EmailCampaign, StatusType } from '@prisma/client'

export interface ChurchMember {
    Church?: string
    Role?: string
    Name: string
    Email: string
    Website?: string
    Address?: string
}

export type CampaignDeliveryStatusWithRecipient = {
    id: string
    status: StatusType
    recipient: {
        email: string
        name: string
    }
    emailCampaign: EmailCampaign
    createdAt: Date
}

export type AudienceWithRecipientCount = {
    id: string
    name: string
    recipientCount: number
}
