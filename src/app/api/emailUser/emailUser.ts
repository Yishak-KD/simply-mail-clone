import { ServerClient } from "postmark";
import { htmlToText } from "html-to-text";

interface EmailUserProps {
  subject: string;
  bodyText: string;
  to: string;
  from: string;
  html: string;
  attachmentContent?: string;
  attachmentFileName?: string;
}

const emailUser = async ({
  subject,
  bodyText,
  to,
  from,
  html,
  attachmentContent,
  attachmentFileName,
}: EmailUserProps) => {
  try {
    const content = attachmentContent
      ? htmlToText(attachmentContent).toString()
      : undefined;

    const postmarkApiToken = process.env.POSTMARK_API_TOKEN;

    if (!postmarkApiToken) {
      throw new Error("Postmark API token is missing");
    }

    const client = new ServerClient(postmarkApiToken);

    const result = await client.sendEmail({
      From: from,
      To: to,
      Subject: subject,
      TextBody: bodyText,
      MessageStream: "broadcast",
      ReplyTo: from,
      HtmlBody: html,
      Attachments: content
        ? [
            {
              Content: btoa(content),
              Name: `${attachmentFileName}.txt`,
              ContentType: "text/plain",
              ContentID: "attachment",
            },
          ]
        : undefined,
    });
    return result;
  } catch (err) {
    console.warn({ err });
    return;
  }
};

export default emailUser;