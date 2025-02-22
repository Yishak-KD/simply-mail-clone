import Close from '@mui/icons-material/Close'
import Modal from '@mui/material/Modal/Modal'
import Box from '@mui/material/Box/Box'
import CTAButton from '../CTAButton'
import { ChangeEvent, useState } from 'react'

interface AudienceModalProps {
    showAudienceModal: boolean
    onCloseAudienceModal: VoidFunction
    loading?: boolean
    onAudienceNameChange: (name: string | null) => void
    handleCreateAudience: VoidFunction
}

const CreateAudienceModal = ({
    showAudienceModal,
    onCloseAudienceModal,
    loading,
    onAudienceNameChange,
    handleCreateAudience,
}: AudienceModalProps) => {
    const [audienceInputName, setAudienceInputName] = useState<string | null>(
        null,
    )

    const handleAudienceName = (e: ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value
        setAudienceInputName(newName)
        onAudienceNameChange(newName)
    }

    const handleSubmit = () => {
        handleCreateAudience()
        setAudienceInputName('')
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
          handleSubmit();
      }
  };

    return (
        <Modal
            open={showAudienceModal}
            onClose={onCloseAudienceModal}
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
                    width: '90%',
                    maxWidth: '600px',
                    position: 'relative',
                    padding: '10px',
                    outline: 'none',
                }}
            >
                <div
                    className="absolute top-5 right-7 cursor-pointer"
                    onClick={onCloseAudienceModal}
                >
                    <Close />
                </div>
                <div className="p-4">
                    <span className="block my-4 text-xl mb-3 font-semibold text-[#1B1C29]">
                        Please type your Audience name <br />
                        <input
                            value={audienceInputName ?? ''}
                            onChange={handleAudienceName}
                            onKeyDown={handleKeyDown}
                            className="border border-gray-300 rounded-md mt-4 p-2 w-full outline-none font-normal"
                        />
                    </span>

                    <div className="flex justify-end mt-7 space-x-6">
                        <CTAButton
                            title="Cancel"
                            className="bg-white text-[#020438] border border-[#020438]"
                            onClick={onCloseAudienceModal}
                        />
                        <CTAButton
                            title="Save"
                            className="bg-black text-[#fff]"
                            onClick={handleSubmit}
                            loading={loading}
                        />
                    </div>
                </div>
            </Box>
        </Modal>
    )
}

export default CreateAudienceModal
