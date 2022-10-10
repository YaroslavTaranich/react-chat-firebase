import { Container, Grid } from '@mui/material'
import { query, addDoc, serverTimestamp, orderBy, deleteDoc } from 'firebase/firestore'
import React, { useContext, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { Context, createCollection } from '../context/Context'
import { IMessage } from '../models/message'

import MessageInput from './MesageInput'
import Messages from './Messages'
import Rooms from './Rooms'
import Spinner from './Spinner'

function Chat() {
  const [selectedRoom, setSelectedRoom] = useState('')
  const { auth } = useContext(Context)
  const [user] = useAuthState(auth)

  const messagesRef = createCollection<IMessage>('messages')
  const q = query<IMessage>(messagesRef, orderBy('createdAt'))
  const [messages, loading, error, snapshot] = useCollectionData<IMessage>(q)

  const sendMessage = async (value: string) => {
    if (user) {
      addDoc<IMessage>(messagesRef, {
        roomId: selectedRoom,
        uid: user.uid,
        displayName: user.displayName,
        photoUrl: user.photoURL,
        text: value,
        createdAt: serverTimestamp(),
      })
    }
  }
  const selectRoom = (id: string) => setSelectedRoom(id)

  const clearChat = async () => {
    if (snapshot)
      snapshot.forEach((doc) => {
        if (doc.data().roomId === selectedRoom) deleteDoc(doc.ref)
      })
  }

  if (loading) return <Spinner />
  if (error) return <div>{JSON.stringify(error)}</div>

  return (
    <Container>
      <Grid justifyContent="center" container spacing={0}>
        <Grid item md={4} sx={{ width: '100%' }}>
          <Rooms selectRoom={selectRoom} selectedRoom={selectedRoom} clearChat={clearChat} />
        </Grid>
        <Grid item md={8} sx={{ width: '100%' }}>
          {messages && user && <Messages messages={messages} uid={user.uid} roomId={selectedRoom} />}

          {selectedRoom && <MessageInput sendMessage={sendMessage} />}
        </Grid>
      </Grid>
    </Container>
  )
}

export default Chat
