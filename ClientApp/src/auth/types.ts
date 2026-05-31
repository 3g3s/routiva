export type AuthUser = {
  id: number
  userName: string
  displayName: string
  email?: string | null
  phone?: string | null
  role: 'yukveren' | 'tasiyici' | string
}

