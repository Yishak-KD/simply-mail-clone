import { isSuccessfullStatus } from '@/utils/ResponseValidation'
import { EmailCampaign } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import SpinningLoader from '../SpinningLoader'

const EmailItem = () => {
    const [emailCampaigns, setEmailCampaigns] = useState<
        EmailCampaign[] | null
    >(null)
    const [fetchEmailCampaigns, setFetchEmailCampaigns] =
        useState<boolean>(true)
    const router = useRouter()

    const getAllEmailCampaigns = async () => {
        setFetchEmailCampaigns(true)
        try {
            const res = await axios.get('/api/emailCampaign')

            if (isSuccessfullStatus(res)) {
                const campaigns = res.data.value
                setEmailCampaigns(campaigns as EmailCampaign[])
            }
        } catch (error) {
            console.error(error)
        }
        setFetchEmailCampaigns(false)
    }

    useEffect(() => {
        getAllEmailCampaigns().catch(err => console.error(err))
    }, [])

    if (fetchEmailCampaigns) {
        return <SpinningLoader />
    }

    return (
        <div className="w-4/5 mx-auto my-10">
            {emailCampaigns && emailCampaigns?.length > 0 && emailCampaigns ? (
                <table className="min-w-full border-collapse divide-y divide-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 text-start font-medium text-gray-700">
                                Title
                            </th>
                            <th className="py-3 px-4 text-start font-medium text-gray-700">
                                Description
                            </th>
                            <th className="py-3 px-4 text-start font-medium text-gray-700">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {emailCampaigns.map(campaign => (
                            <tr
                                key={campaign.id}
                                className="cursor-pointer hover:bg-gray-50 transition"
                                onClick={() =>
                                    router.push(
                                        `/create-campaign/${campaign.id}`,
                                    )
                                }
                            >
                                <td className="py-4 px-4 text-emerald-500 font-bold">
                                    {campaign.title}
                                </td>
                                <td className="py-4 px-4 text-gray-700"></td>
                                <td className="py-4 px-4 text-gray-500"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-3xl font-bold text-center h-[60vh] flex items-center justify-center">
                    <p>No email campaigns available</p>
                </div>
            )}
        </div>
    )
}

export default EmailItem
