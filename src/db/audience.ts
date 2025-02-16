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

export const fetchAudienceList = async (): Promise<Audience[] | null> => {
    return await prisma.audience.findMany()
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
}): Promise<Recipient[] | null> => {
    await prisma.recipient.createMany({
        data: emailsWithNames.map(({ email, name }) => ({
            audienceId,
            email,
            ...(name && { name }),
        })),
        skipDuplicates: true,
    })

    return prisma.recipient.findMany({
        where: { audienceId },
    })
}
