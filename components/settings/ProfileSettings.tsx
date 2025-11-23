"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Camera, Mail, Globe, Save } from "lucide-react"
import { getCurrentUser, updateCurrentUser, isGuest } from "@/utils/userManagement"
import { useRouter } from "next/navigation"

interface ProfileSettingsProps {
  onNotification: (notification: { type: "success" | "error"; message: string }) => void
}

export function ProfileSettings({ onNotification }: ProfileSettingsProps) {
  const router = useRouter()
  const [user, setUser] = useState(getCurrentUser())
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
    bio: "",
    location: "",
    website: "",
    profilePic: user?.profilePic || null,
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setProfileData({
        name: currentUser.name,
        email: currentUser.email,
        username: currentUser.username,
        bio: "",
        location: "",
        website: "",
        profilePic: currentUser.profilePic,
      })
    }
  }, [])

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setProfileData({ ...profileData, profilePic: base64String })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    updateCurrentUser({
      name: profileData.name,
      email: profileData.email,
      username: profileData.username,
      profilePic: profileData.profilePic,
    })
    onNotification({ type: "success", message: "Profile updated successfully!" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
        <CardDescription>Manage your public profile and personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              {profileData.profilePic ? (
                <AvatarImage src={profileData.profilePic || "/placeholder.svg"} alt={profileData.name} />
              ) : (
                <AvatarFallback className="text-2xl">
                  {profileData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <Label
              htmlFor="profile-pic"
              className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
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
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{profileData.name}</h3>
            <p className="text-sm text-muted-foreground">@{profileData.username}</p>
            {isGuest() && (
              <Badge variant="secondary" className="mt-2 bg-amber-500/10 text-amber-600">
                Guest Account
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Profile Fields */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profileData.username}
              onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
              placeholder="Choose a username"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="pl-10"
                placeholder="your.email@example.com"
              />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              placeholder="Tell us about yourself"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                className="pl-10"
                placeholder="City, Country"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={profileData.website}
              onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
          <Button onClick={handleSaveProfile} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
