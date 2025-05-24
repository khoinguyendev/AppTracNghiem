"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {  LogOut, Settings, User,ClipboardList  } from "lucide-react"
import { useUser } from "@/context/UserContext"
import { supabase } from "@/lib/supabaseClient"

export default function Header() {
  const { user, setUser } = useUser()

  const router = useRouter()


  const handleLogout = async () => {
    setUser(null);
    await supabase.auth.signOut()
    router.push("/auth")
  }

  if (!user) return null;
  const avatar = user?.user_metadata?.avatar_url;
  const name = user?.user_metadata?.name;
  const email = user?.user_metadata?.email;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="ms-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">App trắc nghiệm(KN)</span>
          </Link>
        </div>

        <div className="flex-1" />

        <nav className="flex items-center space-x-4">
          {/* Thông báo */}
          <Link href={"/review-question"} className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ClipboardList className="h-5 w-5" />
                {/* {notifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {notifications}
                  </Badge>
                )} */}
              </Button>
            </DropdownMenuTrigger>
            
          </DropdownMenu>
          </Link>

          {/* Avatar + menu người dùng */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 flex items-center gap-2 pl-2 pr-4" role="combobox">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatar} alt={name} />
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-flex">{name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Hồ sơ cá nhân</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Cài đặt</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  )
}
