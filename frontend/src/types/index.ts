export interface User {
  id: number
  username: string
  name: string
}

export interface Space {
  id: number
  userId: number
  name: string
  location: string
  description?: string
  createdAt: string
}

export interface Item {
  id: number
  spaceId: number
  name: string
  quantity: number
  description?: string
  photo?: string
  tags: string
  layer?: string
  expiryDate?: string
  createdAt: string
}

export interface FamilyMember {
  id: number
  userId: number
  memberId: number
  memberName: string
  relation: string
  createdAt: string
}
