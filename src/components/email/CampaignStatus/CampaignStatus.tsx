interface CampaignStatusCardProps {
    recipientsCount?: number
    sentCount?: string
    bouncedCount?: string
    subject?: string
    date?: string
}

const CampaignStatusCard = ({
    recipientsCount,
    subject,
    sentCount,
    bouncedCount,
    date,
}: CampaignStatusCardProps) => {
    return (
        <div className="w-full mx-auto">
            <div className="p-6 rounded-xl w-full shadow-md flex justify-between">
                <div className="space-y-1">
                    <div className="text-sm text-gray-500">Recipients</div>
                    <div className="text-sm font-medium">
                        {recipientsCount} counts
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="text-sm text-gray-500">Subject</div>
                    <div className="text-sm font-medium">{subject}</div>
                </div>
                <div className="space-y-1">
                    <div className="text-sm text-gray-500">Sent</div>
                    <div className="text-sm font-medium">{sentCount}</div>
                </div>
                <div className="space-y-1">
                    <div className="text-sm text-gray-500">Bounced</div>
                    <div className="text-sm font-medium">{bouncedCount}</div>
                </div>
                <div className="space-y-1">
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="flex justify-center items-center">
                        <span className="px-1 rounded-lg font-medium bg-green-200 text-green-800">
                            Sent
                        </span>
                        <span className="text-sm text-gray-500">{date}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CampaignStatusCard
