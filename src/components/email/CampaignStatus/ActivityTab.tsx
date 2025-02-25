'use client'
import { useState } from 'react'
import Tab from './Tab'
import RecipientActivity from './RecipientActivity'
import { CampaignDeliveryStatusWithRecipient } from '@/types/type'
import { StatusType } from '@prisma/client'
import Overview from './Overview'

interface ActivityTabProps {
    filteredRecipients: CampaignDeliveryStatusWithRecipient[]
    statusFilter: StatusType | 'all'
    onFilterChange: (status: StatusType | 'all') => void
    sent: string
    bounced: string
    total: string
    html: string | null
}

const ActivityTab = ({
    statusFilter,
    onFilterChange,
    filteredRecipients,
    sent,
    bounced,
    total,
    html
}: ActivityTabProps) => {
    const [activeTab, setActiveTab] = useState<string>('Overview')

    const handleTabClick = (tab: string) => {
        setActiveTab(tab)
    }

    const TABS = [
        {
            label: 'Overview',
            component: (
                <Overview
                    sent={Number(sent)}
                    bounced={Number(bounced)}
                    total={Number(total)}
                    html={html}
                />
            ),
        },
        {
            label: 'Recipient activity',
            component: (
                <RecipientActivity
                    statusFilter={statusFilter}
                    onFilterChange={onFilterChange}
                    filteredRecipients={filteredRecipients}
                />
            ),
        },
    ]

    const renderContent = () => {
        const activeTabData = TABS.find(tab => tab.label === activeTab)
        return activeTabData ? activeTabData.component : null
    }

    return (
        <div
            style={{ height: 'calc(100vh - 54px)' }}
            className="flex flex-col w-full mx-auto mt-8"
        >
            <div className="m-0 rounded-2xl w-full text-black">
                <div className="md:overflow-x-hidden overflow-x-auto  md:h-[53px] h-[60px] flex items-center space-x-32 w-full px-9 text-sm text-[#7F7D83] rounded-t-2xl border-b border-[#E9E9EA] mb-10">
                    {TABS.map((tab, id) => (
                        <Tab
                            key={id}
                            label={tab.label}
                            isActive={activeTab === tab.label}
                            onclick={() => handleTabClick(tab.label)}
                        />
                    ))}
                </div>
                <div>{renderContent()}</div>
            </div>
        </div>
    )
}

export default ActivityTab
