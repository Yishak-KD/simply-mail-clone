import { ServerClient } from 'postmark'

export interface MessageEvent {
    recipient: any
    recipientName?: string
    status: 'sent' | 'bounced' | 'opened' | 'clicked'
}

export const getMessageDetailsByTag = async (tag: string) => {
    try {
        const postmarkApiToken = process.env.POSTMARK_API_TOKEN

        if (!postmarkApiToken) {
            throw new Error('Postmark API token is missing')
        }

        const client = new ServerClient(postmarkApiToken)
        const events: MessageEvent[] = []

        const messages = await client.getOutboundMessages({
            tag,
            count: 500,
            offset: 0,
        })

        const bounces = await client.getBounces({
            tag,
            count: 500,
            offset: 0,
        })

        const opens = await client.getMessageOpens({
            tag,
            count: 500,
            offset: 0,
        })

        const clicks = await client.getMessageClicks({
            tag,
            count: 500,
            offset: 0,
        })

        messages.Messages.forEach(msg => {
            events.push({
                recipient: msg.To,
                recipientName: msg.From,
                status: 'sent',
            })
        })

        bounces.Bounces.forEach(bounce => {
            events.push({
                recipient: bounce.Email,
                status: 'bounced',
            })
        })

        opens.Opens.forEach(open => {
            events.push({
                recipient: open.Recipient,
                status: 'opened',
            })
        })

        clicks.Clicks.forEach(click => {
            events.push({
                recipient: click.Recipient,
                status: 'clicked',
            })
        })
        return events
    } catch (err) {
        console.warn('Error fetching Postmark message details:', err)
        return []
    }
}
