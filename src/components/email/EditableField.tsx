import { KEDUS_BIBLE_FIREBASE_AUDIENCE } from '@/constants/constants';
import { AudienceWithRecipient } from '@/types/type';
import { isSuccessfullStatus } from '@/util/ResponseValidation';
import { Audience } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface EditableFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onEdit: () => void;
  editing: boolean;
  onChange: (value: string) => void;
  options?: Audience[];
  isFileUpload?: boolean;
}

const EditableField = ({
  label,
  placeholder,
  value,
  onEdit,
  editing,
  onChange,
  isFileUpload,
}: EditableFieldProps) => {
  const [audienceList, setAudienceList] = useState<AudienceWithRecipient[]>([]);

  const fetchAudienceLists = async () => {
    try {
      const response = await axios.get('/api/audience');

      if (isSuccessfullStatus(response)) {
        setAudienceList(response.data.value as AudienceWithRecipient[]);
      }
    } catch (error) {
      console.error('Error fetching audience lists:', error);
    }
  };

  useEffect(() => {
    fetchAudienceLists().catch((err) => console.error(err));
  }, []);

  const handleAudienceChange = (selectedAudience: string) => {
    const selected = audienceList.find(
      (audience) => audience.name === selectedAudience
    );
    if (selected) {
      const recipients = selected.recipients
        .map((recipient) => recipient.email)
        .join(', ');
      onChange(recipients);
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const content = e.target.result as string;
        onChange(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className='border-b px-6 py-8'>
      <p className='font-semibold'>{label}</p>
      {!editing ? (
        <div className='flex justify-between items-center'>
          <p className='font-light'>
            {label === 'To' ? (
              <>
                {placeholder}{' '}
                {value && (
                  <span className='text-blue-800 font-bold'>
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
            className='w-[20%] border-black border text-black font-semibold px-6 py-2 rounded-3xl'
            onClick={onEdit}
          >
            {isFileUpload
              ? 'Upload Template'
              : label === 'To'
                ? 'Edit recipients'
                : label === 'From'
                  ? 'Edit from'
                  : label === 'Body Text'
                    ? 'Add Body text'
                    : 'Add subject'}
          </button>
        </div>
      ) : (
        <div className='mt-2 w-1/4'>
          {isFileUpload ? (
            <input
              type='file'
              accept='.html'
              className='w-full p-2 border rounded'
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file);
                }
              }}
            />
          ) : label === 'To' ? (
            <div className='space-y-2'>
              <select
                className='w-full p-2 border rounded'
                value={
                  audienceList.find(
                    (a) => a.recipients.map((r) => r.email).join(', ') === value
                  )?.name || ''
                }
                onChange={(e) => handleAudienceChange(e.target.value)}
              >
                <option value='' disabled>
                  Choose an audience
                </option>
                <option>{KEDUS_BIBLE_FIREBASE_AUDIENCE}</option>
                {audienceList
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((audience) => (
                    <option key={audience.id} value={audience.name}>
                      {audience.name}
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            <input
              type='text'
              className='w-full p-2 border rounded'
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
            />
          )}
          <div className='flex gap-2 mt-2'>
            <button
              className='bg-black rounded-lg text-white px-4 py-1'
              onClick={onEdit}
            >
              Save
            </button>
            <button className='border px-4 py-1 rounded' onClick={onEdit}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableField;
