import prisma from '@/services/prisma'
import { Recipient } from '@prisma/client'

export const fetchRecipientWithAudienceId = async ({
    audienceId,
}: {
    audienceId: string
}) => {
    const recipients = await prisma.recipient.findMany({
        where: {
            audienceId,
        },
    })
    return recipients
}

export const fetchRecipientByEmail = async ({
    email,
}: {
    email: string
}): Promise<Recipient> => {
    const recipient = await prisma.recipient.findUnique({
        where: {
            email,
        },
    })
    if (!recipient) {
        throw new Error(`Recipient with email ${email} not found.`)
    }
    return recipient
}
