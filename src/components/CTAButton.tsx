import Image from 'next/image'
import CircularProgress from '@mui/material/CircularProgress/CircularProgress'

interface CTAButtonProps {
    title: string
    iconSrc?: string
    onClick?: () => void
    className?: string
    type?: 'submit' | 'reset' | 'button' | undefined
    loading?: boolean
    disabled?: boolean
}

const CTAButton = ({
    title,
    iconSrc,
    onClick,
    className,
    type,
    loading,
    disabled = false,
}: CTAButtonProps) => {
    const defaultBgClass = 'bg-[#EADDFF]'
    const buttonClassName = className?.includes('bg-')
        ? className
        : `${defaultBgClass} ${className || ''}`

    return (
        <button
            className={`space-x-2 py-3 px-6 rounded-xl flex h-[50px] justify-center text-[#0C0D29] cursor-pointer ${buttonClassName}`}
            onClick={loading ? undefined : onClick}
            type={type}
            disabled={disabled}
        >
            {iconSrc && <Image src={iconSrc} height={17} width={17} alt="" />}
            <p className="font-semibold text-center">{title}</p>
            {loading && (
                <CircularProgress
                    style={{ color: 'white', marginRight: '3px' }}
                    size={20}
                />
            )}
        </button>
    )
}

export default CTAButton