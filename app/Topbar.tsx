'use client'

import { type PropsWithChildren } from 'react'
import HealthCheck from '@/components/HealthCheck'
import {
  NavigationMenu,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import { NavigationMenuLink } from '@radix-ui/react-navigation-menu'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  {
    label: 'Gallery',
    href: '/',
    buttonColor: 'bg-sky-500/75 dark:bg-sky-700/75',
    bgColor: 'bg-sky-950',
  },
  {
    label: 'Image Search',
    href: '/image',
    buttonColor: 'bg-rose-500/75 dark:bg-rose-700/75',
    bgColor: 'bg-rose-950',
  },
]

export default function Topbar({ children }: PropsWithChildren<unknown>) {
  const pathname = usePathname()
  return (
    <main className="flex w-full flex-col gap-8 px-8 py-4">
      <HealthCheck />
      <h1 className="text-6xl font-extralight">
        Imagin_<span className="font-semibold">AI</span>
      </h1>
      <NavigationMenu className="flex list-none gap-4">
        {menuItems.map(({ label, href, buttonColor }) => (
          <Link href={href} legacyBehavior passHref key={href}>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                href === pathname ? buttonColor : '',
                'text-xl font-light'
              )}
            >
              {label}
            </NavigationMenuLink>
          </Link>
        ))}
      </NavigationMenu>
      {children}
    </main>
  )
}
