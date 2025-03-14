'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { usePathname } from 'next/navigation'

interface SidebarRoute {
    path: string
    name: string
    newWindow?: boolean
}

const mainRoutes: SidebarRoute[] = [
    {
        path: '/',
        name: 'Home',
    },
    {
        path: '/campaigns',
        name: 'All campaigns',
    },
    {
        path: '/audience',
        name: 'Audience',
    },
    // {
    //   path: "/contacts",
    //   name: "All contacts",
    // },
]

const SideBar = ({ open }: { open: boolean }) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
    const [activeRoute, setActiveRoute] = useState<string | null>(null)
    const pathname = usePathname()

    useEffect(() => {
        setActiveRoute(pathname)
    }, [pathname])

    const handleRouteClick = (path: string) => {
        setActiveRoute(path)
    }

    return (
        <div
            className={`w-[200px] h-full bg-[#F1F1F1] lg:pt-8 lg:pl-6 z-10 lg:relative absolute flex flex-col ${
                isMobile &&
                (open
                    ? 'transform translate-x-0 lg:duration-0 md:duration-75 duration-1000'
                    : 'transform -translate-x-[100%] ')
            }`}
        >
            <div>
                <List>
                    {mainRoutes.map(route => (
                        <ListItem
                            key={route.path}
                            component={Link}
                            href={route.path}
                            onClick={() => handleRouteClick(route.path)}
                            sx={{
                                backgroundColor:
                                    activeRoute === route.path
                                        ? '#E3E3E5'
                                        : 'transparent',
                                borderRadius: '12px',
                                '&:hover': {
                                    backgroundColor: '#E3E3E5',
                                    borderRadius: '12px',
                                },
                                color:
                                    activeRoute === route.path
                                        ? '#101231'
                                        : '#717576',
                                '& .MuiListItemIcon-root': {
                                    color:
                                        activeRoute === route.path
                                            ? '#101231'
                                            : '#717576',
                                    fontWeight:
                                        activeRoute === route.path
                                            ? 'bold'
                                            : 'normal',
                                },
                                '& .MuiListItemText-primary': {
                                    color:
                                        activeRoute === route.path
                                            ? '#101231'
                                            : '#717576',
                                    fontWeight:
                                        activeRoute === route.path
                                            ? 'bold'
                                            : 'normal',
                                },
                            }}
                        >
                            <ListItemText
                                primary={route.name}
                                primaryTypographyProps={{
                                    sx: {
                                        fontSize: '16px',
                                        fontWeight: 400,
                                        color: '#717576',
                                    },
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </div>
        </div>
    )
}

export default SideBar
