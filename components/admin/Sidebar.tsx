'use client'

import { useState } from 'react'
import {
  Menu,
  X,
  Home,
  BookOpen,
  FileText,
  User,
  ChevronDown,
  ChevronRight,
  File,
  FilePlus,
} from 'lucide-react'
import Link from 'next/link'

type NavItem = {
  name: string
  href: string
  icon: React.ReactNode
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    name: 'Trang chủ',
    href: '/admin',
    icon: <Home size={18} />,
  },
  {
    name: 'Đề thi',
    href: '/admin/exams',
    icon: <BookOpen size={18} />,
    children: [
      { name: 'Tạo đề mới', href: '/admin/exams/new', icon: <FilePlus size={16} /> },
      { name: 'Danh sách đề', href: '/admin/exams', icon: <FileText size={16} /> },
    ],
  },
  // {
  //   name: 'Kết quả',
  //   href: '/dashboard/results',
  //   icon: <FileText size={18} />,
  // },
  // {
  //   name: 'Tài khoản',
  //   href: '/dashboard/account',
  //   icon: <User size={18} />,
  // },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const toggleDropdown = (href: string) => {
    setOpenDropdown((prev) => (prev === href ? null : href))
  }

  return (
    <div className={`transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} bg-white shadow-md h-screen`}>
      <div className="flex items-center justify-between p-4 border-b">
        {isOpen && <span className="font-bold text-lg">Bảng điều khiển</span>}
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="mt-4 space-y-1">
        {navItems.map((item) => (
          <div key={item.href}>
            {item.children ? (
              <>
                <div
                  onClick={() => toggleDropdown(item.href)}
                  className={`flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${
                    isOpen ? 'justify-between' : 'justify-center'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    {isOpen && <span className="text-sm">{item.name}</span>}
                  </div>
                  {isOpen && (openDropdown === item.href ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                </div>

                {openDropdown === item.href && isOpen && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link href={child.href} key={child.href}>
                        <div className="flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-gray-100 transition-colors">
                          {child.icon}
                          <span>{child.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link href={item.href}>
                <div
                  className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${
                    isOpen ? 'justify-start' : 'justify-center'
                  }`}
                >
                  {item.icon}
                  {isOpen && <span className="text-sm">{item.name}</span>}
                </div>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}
