import prisma from "@/services/prisma";

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

export const checkEmailCampaignExists = async ({
  campaignId,
}: {
  campaignId: string;
}) => {
  return await prisma.audience.findUnique({
    where: {
      id: campaignId,
    },
  });
};

export const getRecipientCount = async ({
  campaignId,
}: {
  campaignId: string;
}) => {
  return await prisma.recipient.count({
    where: {
      audience: {
        emailCampaign: {
          every: {
            id: campaignId,
          },
        },
      },
    },
  });
};

export const getEmailCampaigns = async () => {
  return await prisma.emailCampaign.findMany();
};

export const fetchAudienceList = async () => {
  const audiences = await prisma.audience.findMany({
    include: {
      emailCampaign: true,
      recipients: true,
    },
  });
  return audiences;
};

export const createAudience = async ({
  audienceName,
}: {
  audienceName: string;
}) => {
  const audience = await prisma.audience.create({
    data: {
      name: audienceName,
    },
  });

  return audience;
};

export const fetchRecipientWithId = async ({
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

export const getAudienceAndRecipientCount = async ({
  emailCampaignId,
}: {
  emailCampaignId: string;
}) => {
  const result = await prisma.emailCampaign.findUnique({
    where: { id: emailCampaignId },
    include: {
      audience: {
        include: {
          recipients: true,
        },
      },
    },
  });
  return {
    audience: result && result.audience,
    recipientCount: result && result.audience.recipients.length,
  };
};

export const updateEmailCampaignAndCreateRecipients = async ({
  emailCampaignId,
  from,
  subject,
  html,
  email,
}: {
  emailCampaignId: string;
  from: string;
  subject: string;
  html: string;
  email: string;
}) => {
  const emailCampaign = await prisma.emailCampaign.update({
    where: {
      id: emailCampaignId,
    },
    data: {
      sender: from,
      subject: subject,
      html: html,
    },
  });

  const recipient = await prisma.recipient.upsert({
    where: {
      email_audienceId: { email, audienceId: emailCampaign.audienceId },
    },
    create: {
      email,
      audienceId: emailCampaign.audienceId,
    },
    update: {},
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
