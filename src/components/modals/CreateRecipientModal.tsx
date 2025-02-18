import Modal from '@mui/material/Modal/Modal'
import Box from '@mui/material/Box/Box'
import React, { useState } from 'react'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import { isSuccessfullStatus } from '@/utils/ResponseValidation'
import axios from 'axios'

interface RecipientModalProps {
    showRecipientModal: boolean
    onCloseRecipientModal: VoidFunction
    audienceId: string
    onSuccess: () => Promise<void>
}

const CreateRecipientModal = ({
    showRecipientModal,
    onCloseRecipientModal,
    audienceId,
    onSuccess,
}: RecipientModalProps) => {
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState<boolean>(false)
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [snackbarMessage, setSnackbarMessage] = useState<string>('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        'success' | 'error'
    >('success')
    const fileInputRef = React.useRef<HTMLInputElement | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0]

        if (uploadedFile) {
            const allowedTypes = [
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ]

            if (!allowedTypes.includes(uploadedFile.type)) {
                setError('Please select a valid excel file')
                setFile(null)
                return
            } else {
                setError('')
                setFile(uploadedFile)
            }
        }
    }

    const handleUpload = async () => {
        setLoading(true)

        if (!file) {
            setError('Please select a file to upload')
            return
        }

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('audienceId', audienceId)

            const res = await axios.post(
                `/api/audience/${audienceId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )

            if (isSuccessfullStatus(res)) {
                setSnackbarMessage('File uploaded successfully!')
                setSnackbarSeverity('success')
                setFile(null)
                await onSuccess()
            }
        } catch {
            setSnackbarMessage('Upload failed. Please try again.')
            setSnackbarSeverity('error')
        } finally {
            setLoading(false)
            setOpenSnackbar(true)
            onCloseRecipientModal()
        }
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false)
    }

    return (
        <Modal
            open={showRecipientModal}
            onClose={onCloseRecipientModal}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none',
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '600px',
                    position: 'relative',
                    padding: '10px',
                    height: '25vh',
                }}
            >
                <div className="lg:w-[75%] lg:px-0 px-8 items-center mx-auto lg:text-center mt-6">
                    <div className="mb-10">
                        {/* TO BE ADDED: Support for different file extensions in the future */}
                        <h1 className="text-red-500 font-bold mb-5">
                            Upload file
                        </h1>
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="flex items-center justify-center mx-auto w-full">
                            <input
                                type="file"
                                accept=".xls,.xlsx"
                                onChange={handleFileChange}
                                className="mb-2 text-sm"
                                ref={fileInputRef}
                            />
                            <button
                                onClick={handleUpload}
                                disabled={!file}
                                className="bg-black text-white px-4 py-1 text-sm rounded disabled:bg-gray-400 w-[20%]"
                            >
                                <div className="flex items-center justify-center">
                                    {loading ? (
                                        <CircularProgress
                                            size={21}
                                            style={{
                                                color: 'white',
                                            }}
                                        />
                                    ) : (
                                        'Upload'
                                    )}
                                </div>
                            </button>
                        </div>
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
            </Box>
        </Modal>
    )
}

export default CreateRecipientModal
