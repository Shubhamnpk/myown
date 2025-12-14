"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck, Fingerprint, Activity, Bell, Smartphone, AlertTriangle, CheckCircle, Clock, MapPin, Monitor, Trash2, Download, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { getCurrentUser, updateCurrentUser, checkUser } from "@/utils/userManagement"

interface SecuritySettingsProps {
  onNotification: (notification: { type: "success" | "error"; message: string }) => void
}

interface SecurityEvent {
  id: string
  type: 'login' | 'logout' | 'password_change' | 'failed_login' | 'security_change'
  description: string
  timestamp: Date
  location?: string
  device: string
  ip?: string
}

interface ActiveSession {
  id: string
  device: string
  location: string
  lastActivity: Date
  current: boolean
}

export function SecuritySettings({ onNotification }: SecuritySettingsProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: "30",
    deviceManagement: true,
    securityAlerts: true,
    dataEncryption: true,
  })

  const [passwordStrength, setPasswordStrength] = useState(0)
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([])
  const [failedLoginAttempts, setFailedLoginAttempts] = useState(0)
  const [accountLocked, setAccountLocked] = useState(false)
  const [isPasswordManagementExpanded, setIsPasswordManagementExpanded] = useState(false)

  // Initialize security data
  useEffect(() => {
    loadSecurityData()
  }, [])

  const loadSecurityData = () => {
    // Load security events
    const events = localStorage.getItem('securityEvents')
    if (events) {
      setSecurityEvents(JSON.parse(events).map((event: any) => ({
        ...event,
        timestamp: new Date(event.timestamp)
      })))
    } else {
      // Initialize with demo data
      const demoEvents: SecurityEvent[] = [
        {
          id: '1',
          type: 'login',
          description: 'Successful login',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          location: 'Current Location',
          device: navigator.userAgent.split(' ')[0],
        },
        {
          id: '2',
          type: 'security_change',
          description: 'Security preferences updated',
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          device: navigator.userAgent.split(' ')[0],
        }
      ]
      setSecurityEvents(demoEvents)
      localStorage.setItem('securityEvents', JSON.stringify(demoEvents))
    }

    // Load active sessions
    const sessions = localStorage.getItem('activeSessions')
    if (sessions) {
      setActiveSessions(JSON.parse(sessions).map((session: any) => ({
        ...session,
        lastActivity: new Date(session.lastActivity)
      })))
    } else {
      // Initialize with current session
      const currentSession: ActiveSession = {
        id: 'current-session',
        device: navigator.userAgent.split(' ')[0],
        location: 'Current Location',
        lastActivity: new Date(),
        current: true
      }
      setActiveSessions([currentSession])
      localStorage.setItem('activeSessions', JSON.stringify([currentSession]))
    }

    // Load failed login attempts
    const failedAttempts = localStorage.getItem('failedLoginAttempts')
    if (failedAttempts) {
      setFailedLoginAttempts(parseInt(failedAttempts))
    }

    // Load security settings
    const settings = localStorage.getItem('securitySettings')
    if (settings) {
      setSecuritySettings({ ...securitySettings, ...JSON.parse(settings) })
    }
  }

  const saveSecurityEvent = (event: Omit<SecurityEvent, 'id'>) => {
    const newEvent: SecurityEvent = {
      ...event,
      id: Date.now().toString(),
    }
    const updatedEvents = [newEvent, ...securityEvents].slice(0, 50) // Keep last 50 events
    setSecurityEvents(updatedEvents)
    localStorage.setItem('securityEvents', JSON.stringify(updatedEvents))
  }

  const saveSecuritySettings = (settings: typeof securitySettings) => {
    setSecuritySettings(settings)
    localStorage.setItem('securitySettings', JSON.stringify(settings))
  }

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25
    if (password.match(/\d/)) strength += 25
    if (password.match(/[^a-zA-Z\d]/)) strength += 25
    setPasswordStrength(strength)
  }

  // Handle password change
  const handleChangePassword = () => {
    if (!currentUser || currentUser.isGuest) {
      onNotification({ type: "error", message: "Password change not available for guest users" })
      return
    }

    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      onNotification({ type: "error", message: "Passwords do not match!" })
      return
    }

    if (passwordStrength < 75) {
      onNotification({ type: "error", message: "Password is too weak! Please choose a stronger password." })
      return
    }

    // Verify current password
    if (!checkUser(currentUser.username, securitySettings.currentPassword)) {
      onNotification({ type: "error", message: "Current password is incorrect!" })
      return
    }

    // Update password
    updateCurrentUser({ password: securitySettings.newPassword })
    setCurrentUser(getCurrentUser())

    // Save security event
    saveSecurityEvent({
      type: 'password_change',
      description: 'Password changed successfully',
      timestamp: new Date(),
      device: navigator.userAgent,
    })

    onNotification({ type: "success", message: "Password changed successfully!" })
    setSecuritySettings({
      ...securitySettings,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
    setPasswordStrength(0)
  }

  // Handle 2FA toggle
  const handle2FAToggle = (enabled: boolean) => {
    if (enabled) {
      onNotification({ 
        type: "error", 
        message: "Two-factor authentication setup requires QR code generation. Feature coming soon!" 
      })
      return
    }

    saveSecuritySettings({ ...securitySettings, twoFactorEnabled: enabled })
    
    saveSecurityEvent({
      type: 'security_change',
      description: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'}`,
      timestamp: new Date(),
      device: navigator.userAgent,
    })

    onNotification({ 
      type: "success", 
      message: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'}` 
    })
  }

  // Simulate failed login (for demo)
  const simulateFailedLogin = () => {
    const attempts = failedLoginAttempts + 1
    setFailedLoginAttempts(attempts)
    localStorage.setItem('failedLoginAttempts', attempts.toString())

    saveSecurityEvent({
      type: 'failed_login',
      description: 'Failed login attempt',
      timestamp: new Date(),
      location: 'Unknown',
      device: navigator.userAgent,
      ip: '192.168.1.1'
    })

    if (attempts >= 5) {
      setAccountLocked(true)
      onNotification({ type: "error", message: "Account temporarily locked due to multiple failed attempts!" })
    } else {
      onNotification({ type: "error", message: `Failed login attempt ${attempts}/5` })
    }
  }

  // Clear failed attempts
  const clearFailedAttempts = () => {
    setFailedLoginAttempts(0)
    setAccountLocked(false)
    localStorage.removeItem('failedLoginAttempts')
    onNotification({ type: "success", message: "Failed attempts cleared" })
  }

  // End all sessions except current
  const endAllSessions = () => {
    const currentSessionId = 'current-session'
    const filteredSessions = activeSessions.filter(session => session.current)
    setActiveSessions(filteredSessions)
    localStorage.setItem('activeSessions', JSON.stringify(filteredSessions))
    
    saveSecurityEvent({
      type: 'security_change',
      description: 'All other sessions terminated',
      timestamp: new Date(),
      device: navigator.userAgent,
    })

    onNotification({ type: "success", message: "All other sessions ended" })
  }

  // Export security data
  const exportSecurityData = () => {
    const data = {
      securityEvents,
      securitySettings,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `security-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    onNotification({ type: "success", message: "Security data exported successfully" })
  }

  // Reset all security settings
  const resetSecuritySettings = () => {
    const defaults = {
      twoFactorEnabled: false,
      loginNotifications: true,
      sessionTimeout: "30",
      deviceManagement: true,
      securityAlerts: true,
      dataEncryption: true,
    }
    
    saveSecuritySettings({ ...securitySettings, ...defaults })
    
    saveSecurityEvent({
      type: 'security_change',
      description: 'Security settings reset to defaults',
      timestamp: new Date(),
      device: navigator.userAgent,
    })

    onNotification({ type: "success", message: "Security settings reset to defaults" })
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "bg-red-500"
    if (passwordStrength < 50) return "bg-orange-500"
    if (passwordStrength < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Very Weak"
    if (passwordStrength < 50) return "Weak"
    if (passwordStrength < 75) return "Fair"
    return "Strong"
  }

  return (
    <div className="space-y-6">
      {/* Security Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Security Status
          </CardTitle>
          <CardDescription>Overview of your account security</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{activeSessions.length}</div>
              <div className="text-sm text-muted-foreground">Active Sessions</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{securityEvents.length}</div>
              <div className="text-sm text-muted-foreground">Security Events</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{failedLoginAttempts}</div>
              <div className="text-sm text-muted-foreground">Failed Attempts</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className={`text-2xl font-bold ${accountLocked ? 'text-red-600' : 'text-green-600'}`}>
                {accountLocked ? 'Locked' : 'Secure'}
              </div>
              <div className="text-sm text-muted-foreground">Account Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg"
          onClick={() => setIsPasswordManagementExpanded(!isPasswordManagementExpanded)}
        >
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Password Management
            </div>
            {isPasswordManagementExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        {isPasswordManagementExpanded && (
          <CardContent className="space-y-4">
            {currentUser?.isGuest && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">Password change not available for guest users</span>
                </div>
              </div>
            )}

            {!currentUser?.isGuest && (
              <>
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
                      onChange={(e) => {
                        setSecuritySettings({ ...securitySettings, newPassword: e.target.value })
                        checkPasswordStrength(e.target.value)
                      }}
                      className="pl-10"
                      placeholder="Enter new password"
                    />
                  </div>
                  {securitySettings.newPassword && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Password Strength</span>
                        <span className={passwordStrength >= 75 ? 'text-green-600' : 'text-orange-600'}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <Progress value={passwordStrength} className="h-2" />
                    </div>
                  )}
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
                <Button
                  onClick={handleChangePassword}
                  className="w-full gap-2"
                  disabled={!securitySettings.currentPassword || !securitySettings.newPassword || !securitySettings.confirmPassword}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Update Password
                </Button>
              </>
            )}
          </CardContent>
        )}
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
              onCheckedChange={handle2FAToggle}
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

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Active Sessions
          </CardTitle>
          <CardDescription>Manage your active sessions across devices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeSessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active sessions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{session.device}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {session.location}
                        <Clock className="h-3 w-3 ml-2" />
                        {session.lastActivity.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.current && (
                      <Badge variant="secondary">Current</Badge>
                    )}
                    {!session.current && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updatedSessions = activeSessions.filter(s => s.id !== session.id)
                          setActiveSessions(updatedSessions)
                          localStorage.setItem('activeSessions', JSON.stringify(updatedSessions))
                          onNotification({ type: "success", message: "Session terminated" })
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={endAllSessions} className="flex-1">
              End All Other Sessions
            </Button>
            <Button variant="outline" onClick={() => {
              const newSession: ActiveSession = {
                id: Date.now().toString(),
                device: navigator.userAgent.split(' ')[0],
                location: 'Current Location',
                lastActivity: new Date(),
                current: true
              }
              const updatedSessions = [...activeSessions.filter(s => !s.current), newSession]
              setActiveSessions(updatedSessions)
              localStorage.setItem('activeSessions', JSON.stringify(updatedSessions))
              onNotification({ type: "success", message: "Current session refreshed" })
            }}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Events Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Security Activity Log
          </CardTitle>
          <CardDescription>Recent security-related activities on your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {securityEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No security events recorded</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {securityEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    {event.type === 'login' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {event.type === 'logout' && <CheckCircle className="h-4 w-4 text-blue-500" />}
                    {event.type === 'password_change' && <Lock className="h-4 w-4 text-orange-500" />}
                    {event.type === 'failed_login' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    {event.type === 'security_change' && <ShieldCheck className="h-4 w-4 text-purple-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{event.description}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {event.timestamp.toLocaleString()}
                      <MapPin className="h-3 w-3" />
                      {event.location || 'Unknown'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportSecurityData} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Export Security Data
            </Button>
            <Button variant="outline" onClick={() => {
              setSecurityEvents([])
              localStorage.removeItem('securityEvents')
              onNotification({ type: "success", message: "Security log cleared" })
            }}>
              Clear Log
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Security Preferences
          </CardTitle>
          <CardDescription>Configure your security settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label>Login Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified of new sign-ins to your account</p>
            </div>
            <Switch
              checked={securitySettings.loginNotifications}
              onCheckedChange={(checked) => saveSecuritySettings({ ...securitySettings, loginNotifications: checked })}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label>Security Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive alerts for suspicious activity</p>
            </div>
            <Switch
              checked={securitySettings.securityAlerts}
              onCheckedChange={(checked) => saveSecuritySettings({ ...securitySettings, securityAlerts: checked })}
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label>Data Encryption</Label>
              <p className="text-sm text-muted-foreground">Encrypt sensitive data stored locally</p>
            </div>
            <Switch
              checked={securitySettings.dataEncryption}
              onCheckedChange={(checked) => saveSecuritySettings({ ...securitySettings, dataEncryption: checked })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout</Label>
            <Select
              value={securitySettings.sessionTimeout}
              onValueChange={(value) => saveSecuritySettings({ ...securitySettings, sessionTimeout: value })}
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
        </CardContent>
      </Card>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Security Actions
          </CardTitle>
          <CardDescription>Advanced security actions and troubleshooting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <Button variant="outline" onClick={simulateFailedLogin} className="justify-start">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Simulate Failed Login (Demo)
            </Button>
            <Button variant="outline" onClick={clearFailedAttempts} className="justify-start">
              <CheckCircle className="h-4 w-4 mr-2" />
              Clear Failed Attempts ({failedLoginAttempts})
            </Button>
            <Button variant="outline" onClick={resetSecuritySettings} className="justify-start">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Security Settings
            </Button>
          </div>
          
          {accountLocked && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800 mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Account Temporarily Locked</span>
              </div>
              <p className="text-sm text-red-700 mb-3">
                Your account is locked due to multiple failed login attempts. Please wait before trying again or clear the failed attempts.
              </p>
              <Button size="sm" onClick={clearFailedAttempts}>
                Clear Failed Attempts
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
