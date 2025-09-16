"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { saveUser, setCurrentUser } from "@/utils/userManagement"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [profilePic, setProfilePic] = useState<string | null>(null)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && email && username && password) {
      const newUser = saveUser({ name, email, username, password, profilePic })
      setCurrentUser(newUser)
      router.push("/dashboard")
    } else {
      setError("Please fill in all fields")
    }
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account to access the dashboard</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5 items-center">
                <Avatar className="h-24 w-24">
                  {profilePic ? (
                    <AvatarImage src={profilePic} alt="Profile" />
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
                <Label htmlFor="profile-pic" className="cursor-pointer">
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Choose profile picture</span>
                </Label>
                <Input
                  id="profile-pic"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Choose a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full">Register</Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </CardFooter>
        </form>
        <div className="text-center mt-4 mb-4">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
