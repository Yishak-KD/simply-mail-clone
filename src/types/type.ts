import { Audience, EmailCampaign, Recipient, StatusType } from '@prisma/client'

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

export interface AudienceAndRecipientCount {
    audience: Audience | null
    recipientCount: number
}

export interface AudienceWithRecipient {
    id: string
    name: string
    recipients: Recipient[]
}
