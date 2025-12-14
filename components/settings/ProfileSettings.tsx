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
import { User, Camera, Mail, Globe, Save, Edit3, X, Trash2, AlertTriangle } from "lucide-react"
import { getCurrentUser, updateCurrentUser, isGuest } from "@/utils/userManagement"
import { useRouter } from "next/navigation"

interface ProfileSettingsProps {
  onNotification: (notification: { type: "success" | "error"; message: string }) => void
}

export function ProfileSettings({ onNotification }: ProfileSettingsProps) {
  const router = useRouter()
  const [user, setUser] = useState(getCurrentUser())
  const [isEditing, setIsEditing] = useState(false)
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
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    // Reset to original values
    const currentUser = getCurrentUser()
    if (currentUser) {
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
    setIsEditing(false)
  }

  const handleClearAllData = () => {
    if (window.confirm("Are you sure you want to delete all app data? This action cannot be undone and will log you out.")) {
      localStorage.clear()
      onNotification({ type: "success", message: "All app data has been cleared. Redirecting..." })
      setTimeout(() => {
        window.location.href = "/"
      }, 2000)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Manage your public profile and personal information</CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture and Basic Info */}
        <div className="flex items-start gap-6">
          <div className="relative">
            <Avatar className="h-20 w-20">
              {profileData.profilePic ? (
                <AvatarImage src={profileData.profilePic || "/placeholder.svg"} alt={profileData.name} />
              ) : (
                <AvatarFallback className="text-xl">
                  {profileData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            {isEditing && (
              <Label
                htmlFor="profile-pic"
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <Camera className="h-3 w-3" />
                <Input
                  id="profile-pic"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </Label>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-xl font-semibold">{profileData.name}</h3>
              <p className="text-sm text-muted-foreground">@{profileData.username}</p>
            </div>
            {isGuest() && (
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
                Guest Account
              </Badge>
            )}
            {profileData.bio && (
              <p className="text-sm text-muted-foreground mt-2">{profileData.bio}</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Profile Details */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
              {isEditing ? (
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              ) : (
                <p className="text-sm font-medium mt-1">{profileData.name || "Not set"}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Username</Label>
              {isEditing ? (
                <Input
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                  placeholder="Choose a username"
                  className="mt-1"
                />
              ) : (
                <p className="text-sm font-medium mt-1">@{profileData.username || "Not set"}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
              {isEditing ? (
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="pl-10"
                    placeholder="your.email@example.com"
                  />
                </div>
              ) : (
                <p className="text-sm font-medium mt-1">{profileData.email || "Not set"}</p>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Bio</Label>
              {isEditing ? (
                <Input
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                  className="mt-1"
                />
              ) : (
                <p className="text-sm mt-1">{profileData.bio || "No bio added yet"}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Location</Label>
              {isEditing ? (
                <div className="relative mt-1">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="pl-10"
                    placeholder="City, Country"
                  />
                </div>
              ) : (
                <p className="text-sm mt-1">{profileData.location || "Not specified"}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Website</Label>
              {isEditing ? (
                <Input
                  value={profileData.website}
                  onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                  className="mt-1"
                />
              ) : (
                profileData.website ? (
                  <a
                    href={profileData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mt-1 block"
                  >
                    {profileData.website}
                  </a>
                ) : (
                  <p className="text-sm mt-1">Not provided</p>
                )
              )}
            </div>
          </div>
        </div>

        {!isEditing && (
          <>
            <Separator />
            {/* Data Management */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h4 className="text-lg font-semibold text-destructive">Danger Zone</h4>
              </div>
              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h5 className="font-medium">Clear All App Data</h5>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete all your data including profile, settings, and productivity records.
                        This action cannot be undone.
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleClearAllData}
                      className="gap-2 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear All Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {isEditing && (
          <>
            <Separator />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancelEdit} className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
