interface TabProps {
    label: string
    isActive: boolean
    onclick: () => void
}

const Tab = ({ label, isActive, onclick }: TabProps) => {
    return (
        <div
            className={`cursor-pointer h-fit relative inline-block ${
                isActive ? 'font-semibold text-[#0A090B]' : 'text-[#70707C]'
            }`}
            onClick={onclick}
        >
            {label}
            {isActive && (
                <span
                    className={`absolute left-[-10%] md:bottom-[-16px] bottom-0 w-[120%] h-[2px] bg-[#0A090B]`}
                />
            )}
        </div>
    )
}

export default Tab