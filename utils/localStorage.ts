export interface User {
  username: string
  password: string
}

export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return []
  const users = localStorage.getItem("users")
  return users ? JSON.parse(users) : []
}

export const saveUser = (user: User) => {
  const users = getUsers()
  users.push(user)
  if (typeof window !== 'undefined') {
    localStorage.setItem("users", JSON.stringify(users))
  }
}

export const checkUser = (username: string, password: string): boolean => {
  const users = getUsers()
  return users.some((user) => user.username === username && user.password === password)
}

export const setLoggedInUser = (username: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem("loggedInUser", username)
  }
}

export const getLoggedInUser = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem("loggedInUser")
}

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("loggedInUser")
  }
}
