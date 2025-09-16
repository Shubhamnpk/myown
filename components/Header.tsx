"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logout, getCurrentUser, isGuest } from "@/utils/userManagement"
import { SettingsModal } from "./SettingsModal"
import { AccountModal } from "./AccountModal"
import { User, Settings, LogOut } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"

interface UserDetails {
  name: string
  email: string
  username: string
}

export function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const router = useRouter()
  const user = getCurrentUser()
  const [profilePic, setProfilePic] = useState<string | null>(null)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)

  useEffect(() => {
    if (user) {
      setProfilePic(user.profilePic)
      setUserDetails({
        name: user.name,
        email: user.email,
        username: user.username,
      })
    }
  }, [user])

  const handleLogout = () => {
    if (isGuest()) {
      setIsLogoutDialogOpen(true)
    } else {
      logout()
      router.push("/login")
    }
  }

  const handleGuestLogout = (createAccount: boolean) => {
    setIsLogoutDialogOpen(false)
    if (createAccount) {
      router.push("/register")
    } else {
      logout()
      router.push("/")
    }
  }

  const handleAccountUpdate = (updatedDetails: UserDetails) => {
    setUserDetails(updatedDetails)
    // Update the current user in the user management system
    if (user) {
      Object.assign(user, updatedDetails)
    }
  }

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          className="rounded-lg bg-primary/5 p-2 cursor-pointer"
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 0px 8px rgba(0,0,0,0.1)",
            backgroundColor: "rgba(var(--primary), 0.1)",
          }}
          transition={{
            type: "tween",
            ease: "easeInOut",
            duration: 0.3,
          }}
        >
          <h1 className="text-2xl font-bold text-gradient">myown</h1>
        </motion.div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  {profilePic ? (
                    <AvatarImage src={profilePic} alt={userDetails?.name || user?.name || ""} />
                  ) : (
                    <AvatarFallback>
                      {userDetails?.name
                        ? userDetails.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userDetails?.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userDetails?.email || "email@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsAccountModalOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        userDetails={userDetails}
        onUpdate={handleAccountUpdate}
      />
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logging out as Guest</DialogTitle>
            <DialogDescription>
              You are about to log out as a guest user. Would you like to create an account to save your data?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleGuestLogout(false)}>
              Erase Data and Logout
            </Button>
            <Button onClick={() => handleGuestLogout(true)}>Create Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}
