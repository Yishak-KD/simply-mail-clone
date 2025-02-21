'use client'

import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import EditableField from './EditableField'
import { isSuccessfullStatus } from '@/utils/ResponseValidation'
import { DEFAULT_FROM_EMAIL } from '@/constants/constants'
import { Audience, EmailCampaign, StatusType } from '@prisma/client'
import { CampaignDeliveryStatusWithRecipient } from '@/types/type'
import SpinningLoader from '../SpinningLoader'
import CampaignStatusCard from './CampaignStatus/CampaignStatus'
import ActivityTab from './CampaignStatus/ActivityTab'

interface EmailData {
    from: string
    subject: string
    fromName: string
    bodyText: string
    html: string
    newTitle: string
}

const EmailEditor = () => {
    const router = useRouter()
    const param = useParams()
    const campaignId = param.id as string
    const inputRef = useRef<HTMLInputElement | null>(null)

    const [audienceId, setAudienceId] = useState<string>('')
    const [emailData, setEmailData] = useState<EmailData>({
        from: DEFAULT_FROM_EMAIL,
        subject: '',
        fromName: '',
        bodyText: '',
        html: '',
        newTitle: '',
    })

    const [editStates, setEditStates] = useState({
        audienceId: false,
        from: false,
        fromName: false,
        subject: false,
        bodyText: false,
        html: false,
    })

    const [fetchCampaignStatus, setFetchCampaignStatus] =
        useState<boolean>(true)
    const [editNameClicked, setEditNameClicked] = useState<boolean>(false)
    const [isEmailLoading, setIsEmailLoading] = useState<boolean>(false)
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [snackbarMessage, setSnackbarMessage] = useState<string>('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        'success' | 'error'
    >('success')
    const [campaignRecipientsStatus, setCampaignRecipientsStatus] = useState<
        CampaignDeliveryStatusWithRecipient[]
    >([])
    const [statusFilter, setStatusFilter] = useState<StatusType | 'all'>('all')
    const [audienceList, setAudienceList] = useState<Audience[]>([])
    const sentEmailCount = campaignRecipientsStatus.filter(
        status => status.status === 'sent',
    ).length
    const bouncedEmailCount = campaignRecipientsStatus.filter(
        status => status.status === 'bounced',
    ).length
    const total = campaignRecipientsStatus.length
    const subject = campaignRecipientsStatus[0]?.emailCampaign.subject ?? ''

    const filteredRecipients = campaignRecipientsStatus.filter(status =>
        statusFilter === 'all' ? true : status.status === statusFilter,
    )

    const fetchEmailCampaignStatus = async () => {
        setFetchCampaignStatus(true)
        try {
            const res = await axios.get(
                `/api/emailCampaign/${campaignId}/status`,
            )

            if (isSuccessfullStatus(res)) {
                setCampaignRecipientsStatus(
                    res.data.value as CampaignDeliveryStatusWithRecipient[],
                )
            }
        } catch (error) {
            console.error('Error fetching email campaign status:', error)
        }
        setFetchCampaignStatus(false)
    }

    const fetchEmailCampaign = async () => {
        try {
            const res = await axios.get(
                `/api/emailCampaign/${param.id as string}`,
            )

            if (isSuccessfullStatus(res)) {
                const campaignData: EmailCampaign = res.data.value
                setEmailData({
                    from: campaignData.from || DEFAULT_FROM_EMAIL,
                    subject: campaignData.subject || '',
                    fromName: campaignData.fromName || '',
                    bodyText: campaignData.bodyText || '',
                    html: campaignData.html || '',
                    newTitle: campaignData.title || '',
                })
                setAudienceId(campaignData.audienceId || '')
            }
        } catch (error) {
            console.error('Error fetching campaign title:', error)
        }
    }

    const fetchAudienceLists = async () => {
        try {
            const response = await axios.get('/api/audience')

            if (isSuccessfullStatus(response)) {
                setAudienceList(response.data.value as Audience[])
            }
        } catch (error) {
            console.error('Error fetching audience lists:', error)
        }
    }

    useEffect(() => {
        fetchEmailCampaignStatus().catch(error => {
            console.error('Error fetching email campaign status:', error)
        })
        fetchEmailCampaign().catch(error => {
            console.error('Error fetching email campaign:', error)
        })
        fetchAudienceLists().catch(error => {
            console.error('Error fetching audience lists:', error)
        })
    }, [])

    const saveEmailData = async (data: EmailData) => {
        try {
            await axios.post(`/api/emailCampaign/${campaignId}`, data)
        } catch (error) {
            console.error('Error saving email data:', error)
        }
    }

    const handleEmailDataChange =
        (field: keyof EmailData) => (value: string) => {
            const newData = { ...emailData, [field]: value }
            setEmailData(newData)
        }

    const handleSaveField = async (field: keyof typeof editStates) => {
        if (field === 'audienceId') {
            try {
                await axios.post(`/api/emailCampaign/${campaignId}`, {
                    audienceId: audienceId,
                })
            } catch (error) {
                console.error('Error saving audience:', error)
            }
        } else {
            await saveEmailData(emailData)
        }
        toggleEdit(field)
    }

    const handleAudienceIdChange = (selectedAudience: string) => {
        const selected = audienceList.find(
            audience => audience.name === selectedAudience,
        )
        if (selected) {
            setAudienceId(selected.id)
        }
    }

    const toggleEdit = (field: keyof typeof editStates) => {
        setEditStates(prev => ({ ...prev, [field]: !prev[field] }))
    }

    const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            await saveEmailData(emailData)
            inputRef.current?.blur()
            setEditNameClicked(false)
        }
    }

    const handleRenameClick = () => {
        inputRef?.current?.focus()
        setEditNameClicked(true)
    }

    const handleSendEmail = async () => {
        const {
            subject,
            bodyText,
            newTitle,
            from,
            fromName,
            html: htmlContent,
        } = emailData

        if (!audienceId || !from || !subject || !htmlContent || !newTitle) {
            setSnackbarMessage(
                'Please fill in all required fields before sending the email.',
            )
            setSnackbarSeverity('error')
            setOpenSnackbar(true)
            return
        }

        setIsEmailLoading(true)
        try {
            await axios.post('/api/email', {
                subject,
                bodyText,
                fromName,
                audienceId,
                from,
                html: htmlContent,
                newTitle,
                emailCampaignId: param.id,
            })

            setSnackbarMessage('Email sent successfully')
            setSnackbarSeverity('success')
            setOpenSnackbar(true)

            setTimeout(() => {
                router.push('/campaigns')
            }, 1000)
        } catch (error) {
            setSnackbarMessage('Error sending email')
            setSnackbarSeverity('error')
            console.warn(error)
        } finally {
            setIsEmailLoading(false)
        }
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false)
    }

    if (fetchCampaignStatus) {
        return <SpinningLoader />
    }

    return (
        <div className="w-4/5 mx-auto bg-white rounded-lg relative">
            {campaignRecipientsStatus.length > 0 ? (
                <div>
                    <CampaignStatusCard
                        subject={subject}
                        recipientsCount={campaignRecipientsStatus.length}
                        bouncedCount={bouncedEmailCount.toString()}
                        sentCount={sentEmailCount.toString()}
                    />
                    <ActivityTab
                        statusFilter={statusFilter}
                        onFilterChange={value => setStatusFilter(value)}
                        filteredRecipients={filteredRecipients}
                        sent={sentEmailCount.toString()}
                        bounced={bouncedEmailCount.toString()}
                        total={total.toString()}
                    />
                </div>
            ) : (
                <>
                    <button
                        className="absolute top-4 right-4 bg-black text-white px-6 py-2 rounded-3xl w-[10%]"
                        onClick={handleSendEmail}
                    >
                        <div className="flex items-center justify-center mx-auto outline-none">
                            {isEmailLoading ? (
                                <CircularProgress
                                    size={21}
                                    style={{
                                        color: 'white',
                                    }}
                                />
                            ) : (
                                'Send'
                            )}
                        </div>
                    </button>
                    <div className="space-y-2 mt-8 w-full mx-auto">
                        <div className="flex flex-col items-start space-y-2">
                            <input
                                ref={inputRef}
                                value={emailData.newTitle}
                                onChange={e =>
                                    handleEmailDataChange('newTitle')(
                                        e.target.value,
                                    )
                                }
                                onKeyDown={handleKeyDown}
                                className="font-light text-3xl"
                            />
                            {!editNameClicked ? (
                                <button
                                    onClick={handleRenameClick}
                                    className="font-bold text-xs"
                                >
                                    Edit name
                                </button>
                            ) : (
                                <div className="flex space-x-2 w-[15%]">
                                    <button
                                        onClick={() => {
                                            setEditNameClicked(false)
                                        }}
                                        className="font-bold text-xs bg-black text-white px-6 py-2 w-full rounded-3xl"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditNameClicked(false)
                                            inputRef.current?.blur()
                                        }}
                                        className="font-bold text-xs text-black border border-black px-6 w-full py-2 rounded-3xl"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-12 border rounded-lg">
                        <EditableField
                            label="Audience Name"
                            placeholder="Who are you sending this email to?"
                            value={audienceId}
                            onEdit={() => toggleEdit('audienceId')}
                            editing={editStates.audienceId}
                            onChange={handleAudienceIdChange}
                            onSave={() => handleSaveField('audienceId')}
                            audienceList={audienceList}
                        />
                        <EditableField
                            label="From"
                            placeholder="Enter from name"
                            value={emailData.fromName}
                            onEdit={() => toggleEdit('fromName')}
                            editing={editStates.fromName}
                            onChange={handleEmailDataChange('fromName')}
                            onSave={() => handleSaveField('fromName')}
                        />
                        <EditableField
                            label="From"
                            placeholder="Enter sender email"
                            value={emailData.from}
                            onEdit={() => toggleEdit('from')}
                            editing={editStates.from}
                            onChange={handleEmailDataChange('from')}
                            onSave={() => handleSaveField('from')}
                        />
                        <EditableField
                            label="Subject"
                            placeholder="What's the subject line for this email?"
                            value={emailData.subject}
                            onEdit={() => toggleEdit('subject')}
                            editing={editStates.subject}
                            onChange={handleEmailDataChange('subject')}
                            onSave={() => handleSaveField('subject')}
                        />
                        <EditableField
                            label="Body Text"
                            placeholder="Enter the body text for your email"
                            value={emailData.bodyText}
                            onEdit={() => toggleEdit('bodyText')}
                            editing={editStates.bodyText}
                            onChange={handleEmailDataChange('bodyText')}
                            onSave={() => handleSaveField('bodyText')}
                        />
                        <EditableField
                            label="HTML Template"
                            placeholder="Upload an HTML template for your email"
                            value={emailData.html}
                            onEdit={() => toggleEdit('html')}
                            editing={editStates.html}
                            onChange={handleEmailDataChange('html')}
                            isFileUpload={true}
                            onSave={() => handleSaveField('html')}
                        />
                    </div>
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={3000}
                        onClose={handleCloseSnackbar}
                        message={snackbarMessage}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        <Alert
                            onClose={handleCloseSnackbar}
                            severity={snackbarSeverity}
                            sx={{
                                width: 'fit',
                            }}
                        >
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </>
            )}
        </div>
    )
}

export default EmailEditor
