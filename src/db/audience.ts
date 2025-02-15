import prisma from "@/services/prisma";

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