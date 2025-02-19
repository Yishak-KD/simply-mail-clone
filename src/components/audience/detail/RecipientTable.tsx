import SlidingLoader from '@/components/SlidingLoader'
import { Recipient } from '@prisma/client'

interface RecipientTableProps {
    recipient: Recipient[]
    fetchingRecipients: boolean
}

const RecipientTable = ({
    recipient,
    fetchingRecipients,
}: RecipientTableProps) => {
    if (fetchingRecipients) {
        return <SlidingLoader />
    }
    
    return (
        <div className="overflow-x-auto w-4/5 mx-auto">
            <div className="max-h-[80vh] overflow-y-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="sticky top-0">
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">Email</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {recipient && recipient.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={2}
                                    className="py-3 px-6 text-center"
                                >
                                    No recipients available
                                </td>
                            </tr>
                        ) : (
                            recipient.map((member, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-300 hover:bg-gray-100"
                                >
                                    <td className="py-3 px-6">{member.name}</td>
                                    <td className="py-3 px-6">
                                        {member.email}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RecipientTable
