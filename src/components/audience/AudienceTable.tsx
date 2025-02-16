import { Audience } from '@prisma/client'
import React from 'react'

const AudienceTable = ({
    audienceList,
    onAudienceClick,
}: {
    audienceList: Audience[]
    onAudienceClick: (id: string) => void
}) => {
    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            {audienceList.length === 0 ? (
                <p className="text-center text-gray-500">
                    There are no audiences available.
                </p>
            ) : (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                                Audience Name
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {audienceList.map((audience, index) => (
                            <tr
                                key={index}
                                onClick={() => onAudienceClick(audience.id)}
                                className="hover:bg-gray-50 transition duration-200 cursor-pointer"
                            >
                                <td className="py-2 px-4 border-b text-sm text-gray-600">
                                    {audience.name}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default AudienceTable
