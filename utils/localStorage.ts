export interface User {
  username: string
  password: string
}

export const getUsers = (): User[] => {
  const users = localStorage.getItem("users")
  return users ? JSON.parse(users) : []
}

export const saveUser = (user: User) => {
  const users = getUsers()
  users.push(user)
  localStorage.setItem("users", JSON.stringify(users))
}

export const checkUser = (username: string, password: string): boolean => {
  const users = getUsers()
  return users.some((user) => user.username === username && user.password === password)
}

export const setLoggedInUser = (username: string) => {
  localStorage.setItem("loggedInUser", username)
}

export const getLoggedInUser = (): string | null => {
  return localStorage.getItem("loggedInUser")
}

export const logout = () => {
  localStorage.removeItem("loggedInUser")
}
