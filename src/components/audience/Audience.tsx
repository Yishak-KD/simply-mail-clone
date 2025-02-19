'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import CreateAudienceModal from '../modals/CreateAudienceModal'
import { isSuccessfullStatus } from '@/utils/ResponseValidation'
import AudienceTable from './AudienceTable'
import type { Audience } from '@prisma/client'
import { useRouter } from 'next/navigation'

const Audience = () => {
    const router = useRouter()
    const [audienceName, setAudienceName] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [openAudienceModal, setOpenAudienceModal] = useState<boolean>(false)
    const [audiences, setAudiences] = useState<Audience[]>([])
    const [fetchingAudiences, setFetchingAudiences] = useState<boolean>(true)

    const fetchAudienceLists = async () => {
        setFetchingAudiences(true)
        try {
            const response = await axios.get('/api/audience', {})

            if (isSuccessfullStatus(response)) {
                setAudiences(response.data.value as Audience[])
            }
        } catch (error) {
            console.error('Error fetching audience lists:', error)
        }
        setFetchingAudiences(false)
    }

    const handleCreateAudience = async () => {
        setLoading(true)
        try {
            const res = await axios.post('/api/audience', {
                audienceName,
            })

            if (isSuccessfullStatus(res)) {
                setOpenAudienceModal(false)
                await fetchAudienceLists()
                setAudienceName('')
            }
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }

    const handleAudienceSelection = (id: string) => {
        router.push(`/audience/contacts/${id}`)
    }

    useEffect(() => {
        fetchAudienceLists().catch(error => console.error(error))
    }, [])

    return (
        <div className="mt-20">
            <div className="border-b">
                <div className="flex w-4/5 mx-auto justify-between mb-2">
                    <h2 className="mb-4 text-center text-3xl font-bold">
                        Manage audiences
                    </h2>
                    <button
                        onClick={() => setOpenAudienceModal(true)}
                        className="bg-black text-white px-8 py-0 rounded-3xl h-10"
                    >
                        Create audience
                    </button>
                </div>
            </div>

            <div>
                <AudienceTable
                    audienceList={audiences}
                    onAudienceClick={handleAudienceSelection}
                    fetchingAudiences={fetchingAudiences}
                />
            </div>

            <CreateAudienceModal
                showAudienceModal={openAudienceModal}
                onCloseAudienceModal={() => {
                    setOpenAudienceModal(false)
                    setAudienceName(null)
                }}
                onAudienceNameChange={name => setAudienceName(name)}
                handleCreateAudience={handleCreateAudience}
                loading={loading}
            />
        </div>
    )
}

export default Audience
