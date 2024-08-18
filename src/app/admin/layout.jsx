'use client'
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname } from 'next/navigation';

const navLinks = [
    { href: '/admin/dashboard', name: 'Overview' },
    // { href: '/admin/transactions', name: 'Transactions' },
    { href: '/admin/products', name: 'Products' },
    { href: '/admin/coupons', name: 'Coupons' },
    { href: '/admin/withdrawls', name: 'Withdrawls' },
    { href: '/admin/orders', name: 'Orders' },
    { href: '/admin/investments', name: 'Investments' },
    {href:'/admin/training', name:'Trainings'}
]
export default function RootLayout({ children }) {
    const path = usePathname()

    return (
        <>
            {/* -------------------- nav section goes here ------------------------- */}
            <nav className="flex fixed bg-white z-10 justify-between w-full border-b-2 p-2">
                {/* ---------------------------- right nav section --------------------- */}
                <div className="flex p-1">
                    {
                        navLinks.map((link, index) => {
                            const isActive = path.includes(link.href)
                            return (
                                <Link key={index} href={link.href}
                                    className={`${isActive ? 'bg-gray-300' : 'bg-slate-100'} text list-none mx-[1px] px-3 py-1 flex items-center rounded-sm`}>
                                    {link.name}</Link>

                            )
                        })
                    }

                </div>
                {/* --------------------- right nav section ------------------------ */}
                <div className="flex justify-center items-center">
                    <Input className="w-420px" type="text" id="email" placeholder="Search user here ..." />
                    <Avatar className="ml-2">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>FP</AvatarFallback>
                    </Avatar>
                </div>
            </nav>
            <div className="pt-14">
                {children}
            </div>
         </>
    )
}