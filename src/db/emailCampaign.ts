import prisma from '@/services/prisma'
import { fetchAllAudiences } from './audience'
import { CampaignDeliveryStatus, EmailCampaign } from '@prisma/client'
import { fetchRecipientByEmail } from './recipient'

export const createEmailCampaign = async (): Promise<
    EmailCampaign | null | undefined
> => {
    const audiences = await fetchAllAudiences()

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
    return await prisma.emailCampaign.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    })
}

export const fetchEmailCampaignById = async ({
    emailCampaignId,
}: {
    emailCampaignId: string
}) => {
    return await prisma.emailCampaign.findUnique({
        where: {
            id: emailCampaignId,
        },
        select: {
            title: true,
            from: true,
            fromName: true,
            subject: true,
            bodyText: true,
            html: true,
            audienceId: true,
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
    audienceId,
}: {
    emailCampaignId: string
    from: string
    subject: string
    html: string
    bodyText: string
    newTitle: string
    fromName: string
    replyTo?: string
    audienceId: string
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
            audienceId,
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
