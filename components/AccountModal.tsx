"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Lock, Camera } from "lucide-react"

interface UserDetails {
  name: string
  email: string
  username: string
  profilePic: string | null
}

interface AccountModalProps {
  isOpen: boolean
  onClose: () => void
  userDetails: UserDetails | null
  onUpdate: (updatedDetails: UserDetails) => void
}

export function AccountModal({ isOpen, onClose, userDetails, onUpdate }: AccountModalProps) {
  const [name, setName] = useState(userDetails?.name || "")
  const [email, setEmail] = useState(userDetails?.email || "")
  const [username, setUsername] = useState(userDetails?.username || "")
  const [password, setPassword] = useState("")
  const [profilePic, setProfilePic] = useState<string | null>(userDetails?.profilePic || null)

  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name)
      setEmail(userDetails.email)
      setUsername(userDetails.username)
      setProfilePic(userDetails.profilePic)
    }
  }, [userDetails])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({ name, email, username, profilePic })
    onClose()
  }

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setProfilePic(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {profilePic ? (
                  <AvatarImage src={profilePic} alt={name} />
                ) : (
                  <AvatarFallback>
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <Label
                htmlFor="profile-pic"
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer"
              >
                <Camera className="h-4 w-4" />
                <Input
                  id="profile-pic"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <div className="relative">
              <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="pl-8" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="pl-8" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-right">
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
