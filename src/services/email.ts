import { ServerClient } from 'postmark';
import { htmlToText } from 'html-to-text';

interface EmailUserProps {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  bodyText: string;
  bodyHTML: string;
  attachmentContent?: string;
  attachmentFileName?: string;
}

const email = async ({
  from,
  to,
  replyTo,
  subject,
  bodyText,
  bodyHTML,
  attachmentContent,
  attachmentFileName,
}: EmailUserProps) => {
  try {
    const content = attachmentContent
      ? htmlToText(attachmentContent).toString()
      : undefined;

    const postmarkApiToken = process.env.POSTMARK_API_TOKEN;

    if (!postmarkApiToken) {
      throw new Error('Postmark API token is missing');
    }

    const client = new ServerClient(postmarkApiToken);

    const result = await client.sendEmail({
      From: from,
      To: to,
      Subject: subject,
      TextBody: bodyText,
      MessageStream: 'broadcast',
      ReplyTo: replyTo ?? from,
      HtmlBody: bodyHTML,
      Attachments: content
        ? [
            {
              Content: btoa(content),
              Name: `${attachmentFileName}.txt`,
              ContentType: 'text/plain',
              ContentID: 'attachment',
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

export default email;
