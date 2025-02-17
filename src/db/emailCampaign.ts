import prisma from '@/services/prisma'
import { getAudiencesWithRecipients } from './audience'
import { CampaignDeliveryStatus, EmailCampaign } from '@prisma/client'
import { fetchRecipientByEmail } from './recipient'

export const createEmailCampaign = async (): Promise<
    EmailCampaign | null | undefined
> => {
    const audiences = await getAudiencesWithRecipients()

    const firstAudience = audiences?.length ? audiences[0] : undefined
    if (!firstAudience) {
        throw new Error('No audience exists. Cannot create email campaign.')
    }

    return await prisma.emailCampaign.create({
        data: {
            title: 'untitled',
            audience: {
                connect: {
                    id: firstAudience.id,
                },
            },
        },
    })
}

export const getEmailCampaigns = async (): Promise<EmailCampaign[]> => {
    return await prisma.emailCampaign.findMany()
}

export const getEmailCampaignTitleById = async ({
    emailCampaignId,
}: {
    emailCampaignId: string
}): Promise<{ title: string | null } | null> => {
    return await prisma.emailCampaign.findUnique({
        where: {
            id: emailCampaignId,
        },
        select: {
            title: true,
        },
    })
}

export const updateEmailCampaignTitle = async ({
    emailCampaignId,
    newTitle,
}: {
    emailCampaignId: string
    newTitle: string
}): Promise<EmailCampaign> => {
    return await prisma.emailCampaign.update({
        where: {
            id: emailCampaignId,
        },
        data: {
            title: newTitle,
        },
    })
}

export const updateEmailCampaign = async ({
    emailCampaignId,
    from,
    subject,
    html,
    bodyText,
    newTitle,
    fromName,
    replyTo,
}: {
    emailCampaignId: string
    from: string
    subject: string
    html: string
    bodyText?: string
    newTitle: string
    fromName?: string
    replyTo?: string
}): Promise<EmailCampaign> => {
    return await prisma.emailCampaign.update({
        where: { id: emailCampaignId },
        data: {
            title: newTitle,
            subject,
            html,
            bodyText,
            from,
            fromName,
            replyTo,
        },
    })
}

export const createCampaignDeliveryStatus = async ({
    emailCampaignId,
    email,
    result,
}: {
    emailCampaignId: string
    email: string
    result: boolean
}): Promise<CampaignDeliveryStatus> => {
    const recipient = await fetchRecipientByEmail({ email })
    return await prisma.campaignDeliveryStatus.create({
        data: {
            status: result ? 'sent' : 'bounced',
            emailCampaignId,
            recipientId: recipient?.id,
        },
    })
}
