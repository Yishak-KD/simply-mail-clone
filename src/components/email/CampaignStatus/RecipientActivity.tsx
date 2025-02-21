import { CampaignDeliveryStatusWithRecipient } from '@/types/type'
import { StatusType } from '@prisma/client'

interface RecipientActivityProps {
    statusFilter: StatusType | 'all'
    onFilterChange: (status: StatusType | 'all') => void
    filteredRecipients: CampaignDeliveryStatusWithRecipient[]
}

const RecipientActivity = ({
    statusFilter,
    onFilterChange: onChange,
    filteredRecipients,
}: RecipientActivityProps) => {
    return (
        <>
            <div className="my-4 flex flex-col">
                <span className="font-semibold mb-2">
                    Filter by recipient status
                </span>
                <select
                    className="p-2 border rounded-md w-1/3"
                    value={statusFilter}
                    onChange={e =>
                        onChange(e.target.value as StatusType | 'all')
                    }
                >
                    <option value="all">All</option>
                    <option value="sent">Sent</option>
                    <option value="bounced">Bounced</option>
                </select>
            </div>
            <table className="min-w-full bg-white border border-gray-300">
                <thead className="sticky top-0">
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Name</th>
                        <th className="py-3 px-6 text-left">Email</th>
                        <th className="py-3 px-6 text-left">Status</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {filteredRecipients.map((campaignStatus, index) => (
                        <tr
                            key={index}
                            className="border-b border-gray-300 hover:bg-gray-100"
                        >
                            <td className="py-3 px-6">
                                {campaignStatus.recipient.name}
                            </td>
                            <td className="py-3 px-6">
                                {campaignStatus.recipient.email}
                            </td>
                            <td className="py-3 px-6">
                                {campaignStatus.status}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default RecipientActivity
