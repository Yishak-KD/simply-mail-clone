'use client'

import { useEffect, useState } from 'react'
import SideBar from '@/components/sidebar/Sidebar'

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) {
                setIsMobile(false)
                setOpen(true)
            } else {
                setIsMobile(true)
                setOpen(false)
            }
        })
    }, [])

    return (
        <div className="flex">
            {open && isMobile && (
                <div
                    className="fixed inset-0 bg-[rgb(0,0,0,0.3)] z-[8]"
                    onClick={() => setOpen(false)}
                />
            )}
            <div className="sticky top-0 h-screen">
                <SideBar open={open} />
            </div>
            <main className="flex-1 overflow-y-auto no-scrollbar h-screen">
                {children}
            </main>
        </div>
    )
}

export default LayoutWrapper