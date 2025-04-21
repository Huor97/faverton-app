export interface Profile {
  profile: ProfileClass
}

export interface ProfileClass {
  id: string
  updated_at: Date
  username: string
  avatar_url: string
  email: null
}
