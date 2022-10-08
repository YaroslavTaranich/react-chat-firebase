import { FieldValue } from 'firebase/firestore'

export interface IMessage {
  uid: string
  displayName: string | null
  photoUrl: string | null
  text: string
  createdAt: FieldValue
}
