import { KEDUS_BIBLE_FIREBASE_AUDIENCE } from '@/constants/constants'
import { Audience } from '@prisma/client'

interface EditableFieldProps {
    label: string
    placeholder: string
    value: string
    onEdit?: () => void
    editing?: boolean
    onChange: (value: string) => void
    isFileUpload?: boolean
    onSave: VoidFunction
    audienceList?: Audience[]
}

const EditableField = ({
    label,
    placeholder,
    value,
    onEdit,
    editing,
    onChange,
    isFileUpload,
    onSave,
    audienceList = [],
}: EditableFieldProps) => {
    

    const handleAudienceChange = (selectedAudience: string) => {
        if (selectedAudience === KEDUS_BIBLE_FIREBASE_AUDIENCE) {
            onChange(KEDUS_BIBLE_FIREBASE_AUDIENCE)
            return
        }

        const selected = audienceList.find(
            audience => audience.name === selectedAudience,
        )
        if (selected) {
            onChange(selected.id)
        }
    }

    const handleFileUpload = (file: File) => {
        const reader = new FileReader()
        reader.onload = e => {
            if (e.target?.result) {
                const content = e.target.result as string
                onChange(content)
            }
        }
        reader.readAsText(file)
    }

    return (
        <div className="border-b px-6 py-8">
            <p className="font-semibold">{label}</p>
            {!editing ? (
                <div className="flex justify-between items-center">
                    <p className="font-light">
                        {label === 'Audience Name' ? (
                            <>
                                {placeholder}{' '}
                                {value && (
                                    <span className="text-blue-800 font-bold">
                                        {`${value.split(', ').length} recipients`}
                                    </span>
                                )}
                            </>
                        ) : label === 'HTML Template' && value ? (
                            'HTML template loaded'
                        ) : value ? (
                            value
                        ) : (
                            placeholder
                        )}
                    </p>
                    <button
                        className="w-[20%] border-black border text-black font-semibold px-6 py-2 rounded-3xl"
                        onClick={onEdit}
                    >
                        {isFileUpload
                            ? 'Upload Template'
                            : label === 'Audience Name'
                              ? 'Edit recipients'
                              : label === 'From'
                                ? 'Edit from'
                                : label === 'Body Text'
                                  ? 'Add Body text'
                                  : 'Add subject'}
                    </button>
                </div>
            ) : (
                <div className="mt-2 w-1/4">
                    {isFileUpload ? (
                        <input
                            type="file"
                            accept=".html"
                            className="w-full p-2 border rounded"
                            onChange={e => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    handleFileUpload(file)
                                }
                            }}
                        />
                    ) : label === 'Audience Name' ? (
                        <div className="space-y-2">
                            <select
                                className="w-full p-2 border rounded"
                                value={
                                    value
                                        ? (audienceList.find(
                                              a => a.id === value,
                                          )?.name ??
                                          KEDUS_BIBLE_FIREBASE_AUDIENCE)
                                        : ''
                                }
                                onChange={e =>
                                    handleAudienceChange(e.target.value)
                                }
                            >
                                <option value="" disabled>
                                    Choose an audience
                                </option>
                                {/* <option>{KEDUS_BIBLE_FIREBASE_AUDIENCE}</option> */}
                                {audienceList
                                    .sort((a, b) =>
                                        a.name.localeCompare(b.name),
                                    )
                                    .map(audience => (
                                        <option
                                            key={audience.id}
                                            value={audience.name}
                                        >
                                            {audience.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    ) : (
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={value}
                            onChange={e => onChange(e.target.value)}
                            placeholder={placeholder}
                        />
                    )}
                    <div className="flex gap-2 mt-2">
                        <button
                            className="bg-black rounded-lg text-white px-4 py-1"
                            onClick={onSave}
                        >
                            Save
                        </button>
                        <button
                            className="border px-4 py-1 rounded"
                            onClick={onEdit}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EditableField
