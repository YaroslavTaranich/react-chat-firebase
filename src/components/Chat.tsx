import { Button, Container, Grid, TextField } from '@mui/material'
import { query, addDoc, serverTimestamp, orderBy } from 'firebase/firestore'
import { useState, useContext, FormEvent } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { Context, createCollection } from '../context/Context'
import { IMessage } from '../models/message'

import Messages from './Messages'
import Spinner from './Spinner'

function Chat() {
  const [value, setValue] = useState('')
  const { auth } = useContext(Context)
  const [user] = useAuthState(auth)

  const messagesRef = createCollection<IMessage>('messages')
  const q = query<IMessage>(messagesRef, orderBy('createdAt'))
  const [messages, loading] = useCollectionData<IMessage>(q)
  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (user) {
      addDoc<IMessage>(messagesRef, {
        uid: user.uid,
        displayName: user.displayName,
        photoUrl: user.photoURL,
        text: value,
        createdAt: serverTimestamp(),
      })
      setValue('')
    }
  }
  if (loading) return <Spinner />

  return (
    <Container>
      <Grid justifyContent="center">
        {messages && user && <Messages messages={messages} uid={user.uid} />}

        <form onSubmit={(e) => sendMessage(e)} className="message-form">
          <div>
            <TextField
              variant="outlined"
              fullWidth
              maxRows={2}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <Button variant="contained" type="submit" color="secondary">
            SEND
          </Button>
        </form>
      </Grid>
    </Container>
  )

  return <h1>CHAT</h1>
}

export default Chat
