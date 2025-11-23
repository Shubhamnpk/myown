"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck, Fingerprint, Activity, Bell, Smartphone } from "lucide-react"

interface SecuritySettingsProps {
  onNotification: (notification: { type: "success" | "error"; message: string }) => void
}

export function SecuritySettings({ onNotification }: SecuritySettingsProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: "30",
    deviceManagement: true,
  })

  const handleChangePassword = () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      onNotification({ type: "error", message: "Passwords do not match!" })
      return
    }
    if (securitySettings.newPassword.length < 8) {
      onNotification({ type: "error", message: "Password must be at least 8 characters!" })
      return
    }
    // Update password logic here
    onNotification({ type: "success", message: "Password changed successfully!" })
    setSecuritySettings({ ...securitySettings, currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  return (
    <div className="space-y-6">
      {/* Password Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password Management
          </CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                value={securitySettings.currentPassword}
                onChange={(e) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
                className="pl-10"
                placeholder="Enter current password"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={securitySettings.newPassword}
                onChange={(e) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
                className="pl-10"
                placeholder="Enter new password"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={securitySettings.confirmPassword}
                onChange={(e) => setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })}
                className="pl-10"
                placeholder="Confirm new password"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <Button onClick={handleChangePassword} className="w-full gap-2">
            <ShieldCheck className="h-4 w-4" />
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label>Enable 2FA</Label>
              <p className="text-sm text-muted-foreground">Require a verification code when signing in</p>
            </div>
            <Switch
              checked={securitySettings.twoFactorEnabled}
              onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorEnabled: checked })}
            />
          </div>
          {securitySettings.twoFactorEnabled && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm">
                Two-factor authentication is enabled. You'll need to enter a verification code from your authenticator
                app when signing in.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Login & Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Login & Sessions
          </CardTitle>
          <CardDescription>Manage your active sessions and login preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Login Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Get notified of new sign-ins to your account</p>
            </div>
            <Switch
              checked={securitySettings.loginNotifications}
              onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, loginNotifications: checked })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout</Label>
            <Select
              value={securitySettings.sessionTimeout}
              onValueChange={(value) => setSecuritySettings({ ...securitySettings, sessionTimeout: value })}
            >
              <SelectTrigger id="sessionTimeout">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="240">4 hours</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="w-full bg-transparent">
            <Smartphone className="h-4 w-4 mr-2" />
            View Active Sessions
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
