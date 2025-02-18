'use client'

import { useParams } from 'next/navigation'
import RecipientTable from './RecipientTable'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Recipient } from '@prisma/client'
import { isSuccessfullStatus } from '@/utils/ResponseValidation'
import CreateRecipientModal from '@/components/modals/CreateRecipientModal'

const ContactDetail = () => {
    const param = useParams()
    const audienceId = param.id as string
    const [recipients, setRecipients] = useState<Recipient[]>([])
    const [openRecipientModal, setOpenRecipientModal] = useState<boolean>(false)

    const handleRecipientModal = () => {
        setOpenRecipientModal(true)
    }

    const fetchRecipient = async () => {
        const res = await axios.get(`/api/audience/${param.id as string}`)

        if (isSuccessfullStatus(res)) {
            setRecipients(res.data.value.recipients as Recipient[])
        }
    }

    useEffect(() => {
        fetchRecipient().catch(err => console.error(err))
    }, [])

    return (
        <div className="">
            <div className="border-b">
                <div className="flex w-4/5 mx-auto justify-between mb-2">
                    <h2 className="mb-4 text-center text-3xl font-bold">
                        Contacts
                    </h2>
                    <button
                        onClick={handleRecipientModal}
                        className="bg-black text-white px-8 py-0 rounded-3xl h-10"
                    >
                        Add contacts
                    </button>
                </div>
            </div>
            <RecipientTable recipient={recipients} />
            <CreateRecipientModal
                showRecipientModal={openRecipientModal}
                onCloseRecipientModal={() => setOpenRecipientModal(false)}
                audienceId={audienceId}
                onSuccess={fetchRecipient}
            />
        </div>
    )
}

export default ContactDetail
