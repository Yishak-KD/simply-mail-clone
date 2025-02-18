'use client'

import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import EditableField from './EditableField'
import { isSuccessfullStatus } from '@/utils/ResponseValidation'
import {
    clearLocalStorageItem,
    readStoredObject,
    writeStoredObject,
} from '@/utils/localstorage'
import { DEFAULT_FROM_EMAIL, EMAIL_STORAGE_KEY } from '@/constants/constants'

interface StoredEmailData {
    audienceId: string
    from: string
    subject: string
    fromName: string
    bodyText: string
    htmlContent: string
    campaignName: string
}

const EmailEditor = () => {
    const router = useRouter()
    const param = useParams()
    const campaignId = param.id
    const storageKey = `${EMAIL_STORAGE_KEY}_${campaignId}`
    const inputRef = useRef<HTMLInputElement | null>(null)

    const [emailData, setEmailData] = useState<StoredEmailData>({
        audienceId: '',
        from: DEFAULT_FROM_EMAIL,
        subject: '',
        fromName: '',
        bodyText: '',
        htmlContent: '',
        campaignName: '',
    })

    const [editStates, setEditStates] = useState({
        audienceId: false,
        from: false,
        fromName: false,
        subject: false,
        bodyText: false,
        html: false,
    })

    const [editNameClicked, setEditNameClicked] = useState<boolean>(false)
    const [isEmailLoading, setIsEmailLoading] = useState<boolean>(false)
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [snackbarMessage, setSnackbarMessage] = useState<string>('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        'success' | 'error'
    >('success')

    useEffect(() => {
        if (emailData.campaignName) {
            writeStoredObject(storageKey, emailData)
        }
    }, [emailData, storageKey])

    const fetchEmailCampaignTitle = async () => {
        try {
            const res = await axios.get(
                `/api/emailCampaign/${param.id as string}`,
            )

            if (isSuccessfullStatus(res)) {
                const emailCampaignTitle = res.data.value.title as string
                const storedData = readStoredObject<StoredEmailData>(storageKey)

                setEmailData(prev => ({
                    ...prev,
                    campaignName:
                        storedData?.campaignName || emailCampaignTitle,
                }))
            }
        } catch (error) {
            console.error('Error fetching campaign title:', error)
        }
    }

    useEffect(() => {
        const storedData = readStoredObject<StoredEmailData>(storageKey)
        if (storedData) {
            setEmailData(prev => ({
                ...prev,
                ...storedData,
            }))
        }

        if (!storedData?.campaignName) {
            fetchEmailCampaignTitle().catch(err => console.error(err))
        }
    }, [storageKey])

    const handleFieldChange =
        (field: keyof StoredEmailData) => (value: string) => {
            setEmailData(prev => ({ ...prev, [field]: value }))
        }

    const toggleEdit = (field: keyof typeof editStates) => {
        setEditStates(prev => ({ ...prev, [field]: !prev[field] }))
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
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
            audienceId,
            from,
            subject,
            htmlContent,
            campaignName,
            fromName,
            bodyText,
        } = emailData

        if (!audienceId || !from || !subject || !htmlContent || !campaignName) {
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
                html: htmlContent,
                from,
                newTitle: campaignName,
                emailCampaignId: param.id,
            })

            setSnackbarMessage('Email sent successfully')
            setSnackbarSeverity('success')
            setOpenSnackbar(true)

            clearLocalStorageItem(storageKey)
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

    return (
        <div className="w-4/5 mx-auto bg-white rounded-lg relative">
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
                        value={emailData.campaignName}
                        onChange={e =>
                            handleFieldChange('campaignName')(e.target.value)
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
                    label="audienceId"
                    placeholder="Who are you sending this email to?"
                    value={emailData.audienceId}
                    onEdit={() => toggleEdit('audienceId')}
                    editing={editStates.audienceId}
                    onChange={handleFieldChange('audienceId')}
                />
                <EditableField
                    label="From"
                    placeholder="Enter from name"
                    value={emailData.fromName}
                    onEdit={() => toggleEdit('fromName')}
                    editing={editStates.fromName}
                    onChange={handleFieldChange('fromName')}
                />
                <EditableField
                    label="From"
                    placeholder="Enter sender email"
                    value={emailData.from}
                    onEdit={() => toggleEdit('from')}
                    editing={editStates.from}
                    onChange={handleFieldChange('from')}
                />
                <EditableField
                    label="Subject"
                    placeholder="What's the subject line for this email?"
                    value={emailData.subject}
                    onEdit={() => toggleEdit('subject')}
                    editing={editStates.subject}
                    onChange={handleFieldChange('subject')}
                />
                <EditableField
                    label="Body Text"
                    placeholder="Enter the body text for your email"
                    value={emailData.bodyText}
                    onEdit={() => toggleEdit('bodyText')}
                    editing={editStates.bodyText}
                    onChange={handleFieldChange('bodyText')}
                />
                <EditableField
                    label="HTML Template"
                    placeholder="Upload an HTML template for your email"
                    value={emailData.htmlContent}
                    onEdit={() => toggleEdit('html')}
                    editing={editStates.html}
                    onChange={handleFieldChange('htmlContent')}
                    isFileUpload={true}
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
        </div>
    )
}

export default EmailEditor
