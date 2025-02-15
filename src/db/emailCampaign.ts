import prisma from "@/services/prisma";
import { fetchAudienceList } from "./audience";

export const createEmailCampaign = async () => {
  const audiences = await fetchAudienceList();

  if (audiences.length === 0) {
    throw new Error("No audience exists. Cannot create email campaign.");
  }

  const randomAudience =
    audiences[Math.floor(Math.random() * audiences.length)];
  const emailCampaign = await prisma.emailCampaign.create({
    data: {
      title: "untitled",
      audience: {
        connect: {
          id: randomAudience.id,
        },
      },
    },
  });
  return {
    emailCampaignName: emailCampaign.title,
    emailCampaignId: emailCampaign.id,
    emailCampaignAudience: emailCampaign.audienceId,
  };
};

export const addEmailsToCampaign = async ({
  audienceId,
  emailsWithNames,
}: {
  audienceId: string;
  emailsWithNames: { email: string; name: string }[];
}) => {
  const response = await prisma.recipient.createMany({
    data: emailsWithNames.map(({ email, name }) => ({
      audienceId,
      email,
      name,
    })),
    skipDuplicates: true,
  });
  return response;
};

export const getEmailCampaigns = async () => {
  return await prisma.emailCampaign.findMany();
};

export const getEmailCampaignTitleById = async ({
  emailCampaignId,
}: {
  emailCampaignId: string;
}) => {
  return await prisma.emailCampaign.findUnique({
    where: {
      id: emailCampaignId,
    },
    select: {
      title: true,
    },
  });
};

export const updateEmailCampaignTitle = async ({
  emailCampaignId,
  newTitle,
}: {
  emailCampaignId: string;
  newTitle: string;
}) => {
  return await prisma.emailCampaign.update({
    where: {
      id: emailCampaignId,
    },
    data: {
      title: newTitle,
    },
  });
};

export const updateEmailCampaignAndCreateRecipients = async ({
  emailCampaignId,
  from,
  subject,
  html,
  email,
  newTitle
}: {
  emailCampaignId: string;
  from: string;
  subject: string;
  html: string;
  email: string;
  newTitle: string
}) => {
  const emailCampaign = await prisma.emailCampaign.update({
    where: {
      id: emailCampaignId,
    },
    data: {
      sender: from,
      subject,
      html,
      title: newTitle
    },
  });

  const recipient = await prisma.recipient.findFirst({
    where: {
      email,
      audienceId: emailCampaign.audienceId,
    },
  });

  return { emailCampaign, recipient };
};

export const createCampaignDeliveryStatus = async ({
  emailCampaignId,
  recipientId,
  result,
}: {
  emailCampaignId: string;
  recipientId: string;
  result: boolean;
}) => {
  await prisma.campaignDeliveryStatus.create({
    data: {
      status: result ? "sent" : "bounced",
      emailCampaignId,
      recipientId,
    },
  });
};
