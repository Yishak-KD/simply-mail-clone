import { formatPercentage } from '@/utils/formatPercentage'

interface OverviewStats {
    sent: number
    bounced: number
    total: number
    html: string
}

const Overview = ({ sent, bounced, total, html }: OverviewStats) => {
    const sentRate = total > 0 ? formatPercentage((sent / total) * 100) : '0'
    const bounceRate =
        total > 0 ? formatPercentage((bounced / total) * 100) : '0'

    return (
        <div className="w-full mx-auto">
            <div className="bg-white rounded-xl border p-6 ">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Email performance</h2>
                    <p className="font-extralight text-sm">
                        Feb 18, 2025 - Feb 21, 2025.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Sent', value: sentRate },
                        { label: 'Bounced', value: bounceRate },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="border p-4 rounded-lg text-center"
                        >
                            <div className="flex items-center justify-center space-x-2 h-14">
                                <span className="text-gray-600 font-medium underline">
                                    {stat.label}
                                </span>
                            </div>
                            <p className="text-2xl font-semibold">
                                {stat.value}%
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full mt-6">
                <div className='text-center font-semibold text-2xl'>Email Content</div>
                <div dangerouslySetInnerHTML={{ __html: html }} />;
            </div>
        </div>
    )
}

export default Overview
