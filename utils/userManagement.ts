interface User {
  id: string
  name: string
  email: string
  username: string
  password: string
  profilePic: string | null
  theme?: 'light' | 'dark' | 'system'
  accentColor?: string
  isGuest: boolean
  securitySettings?: {
    twoFactorEnabled: boolean
    loginNotifications: boolean
    sessionTimeout: string
    deviceManagement: boolean
    securityAlerts: boolean
    dataEncryption: boolean
    stayLoggedIn: boolean
  }
}

let currentUser: User | null = null

export function saveUser(user: Omit<User, "id" | "isGuest">): User {
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    isGuest: false,
  }
  const users = getUsers()
  users.push(newUser)
  if (typeof window !== 'undefined') {
    localStorage.setItem("users", JSON.stringify(users))
  }
  return newUser
}

export function getUsers(): User[] {
  if (typeof window === 'undefined') return []
  const users = localStorage.getItem("users")
  return users ? JSON.parse(users) : []
}

export function checkUser(username: string, password: string): User | null {
  const users = getUsers()
  return users.find((user) => user.username === username && user.password === password) || null
}

export function setCurrentUser(user: User | null) {
  currentUser = user
  if (typeof window !== 'undefined') {
    if (user && user.securitySettings?.stayLoggedIn !== false) {
      localStorage.setItem("currentUser", JSON.stringify(user))
    } else {
      localStorage.removeItem("currentUser")
    }
  }
}

export function getCurrentUser(): User | null {
  if (currentUser) return currentUser
  if (typeof window === 'undefined') return null
  const storedUser = localStorage.getItem("currentUser")
  if (storedUser) {
    currentUser = JSON.parse(storedUser)
    return currentUser
  }
  return null
}

export function updateCurrentUser(updates: Partial<User>) {
  if (currentUser) {
    Object.assign(currentUser, updates)
    setCurrentUser(currentUser)

    if (!currentUser.isGuest && typeof window !== 'undefined') {
      // Update user in the users array
      const users = getUsers()
      const index = users.findIndex((u) => u.id === currentUser!.id)
      if (index !== -1) {
        users[index] = currentUser
        localStorage.setItem("users", JSON.stringify(users))
      }
    }
  }
}

export function logout() {
  setCurrentUser(null)
}

export function createGuestUser(): User {
  const guestUser: User = {
    id: `guest-${Date.now()}`,
    name: "Guest User",
    email: "guest@example.com",
    username: `guest-${Date.now()}`,
    password: "",
    profilePic: null,
    theme: 'system',
    accentColor: 'blue',
    isGuest: true,
  }
  setCurrentUser(guestUser)
  return guestUser
}

export function isGuest(): boolean {
  const user = getCurrentUser()
  return user ? user.isGuest : false
}
