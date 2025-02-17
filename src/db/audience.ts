import prisma from '@/services/prisma'
import { Audience, Recipient } from '@prisma/client'

export interface AudienceWithRecipents extends Audience {
    recipients: Recipient[]
}

export const fetchAudienceWithId = async (
    audienceId: string,
): Promise<AudienceWithRecipents | null> => {
    const audience = await prisma.audience.findUnique({
        where: {
            id: audienceId,
        },
        include: {
            recipients: true,
        },
    })
    return audience
}

export const getAudiencesWithRecipients = async (): Promise<
    AudienceWithRecipents[] | null
> => {
    return await prisma.audience.findMany({
        include: {
            recipients: true,
        },
    })
}

export const createAudience = async ({
    audienceName,
}: {
    audienceName: string
}): Promise<Audience | null> => {
    return await prisma.audience.create({
        data: {
            name: audienceName,
        },
    })
}

export const addRecipientsToAudience = async ({
    audienceId,
    emailsWithNames,
}: {
    audienceId: string
    emailsWithNames: { email: string; name?: string }[]
}): Promise<Recipient[] | undefined> => {
    // Create recipient entries
    await prisma.recipient.createMany({
        data: emailsWithNames.map(({ email, name }) => ({
            email,
            ...(name && { name }),
        })),
        skipDuplicates: true,
    })

    // Connect those recipients to the audience
    await prisma.audience.update({
        where: { id: audienceId },
        data: {
            recipients: {
                connect: emailsWithNames.map(({ email }) => ({ email })),
            },
        },
    })

    // Return the updated list of recipients
    const updatedAudience = await prisma.audience.findUnique({
        where: { id: audienceId },
        include: { recipients: true },
    })

    return updatedAudience?.recipients
}
