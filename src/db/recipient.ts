import prisma from "@/services/prisma";

export const fetchRecipientWithAudienceId = async ({
    audienceId,
  }: {
    audienceId: string;
  }) => {
    const recipients = await prisma.recipient.findMany({
      where: {
        audienceId,
      },
    });
    return recipients;
  };