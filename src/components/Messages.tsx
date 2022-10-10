import { FC, useEffect, useRef } from 'react'
import { Avatar, Grid } from '@mui/material'

import { IMessage } from '../models/message'

interface MessagesProps {
  messages: IMessage[]
  uid: string
  roomId: string
}

const Messages: FC<MessagesProps> = ({ messages, uid, roomId }) => {
  const messageBox = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messageBox.current) messageBox.current.scrollTo(0, messageBox.current.scrollHeight)
  }, [messages])

  const fitredMessages = messages.filter((m) => m.roomId === roomId)

  return (
    <div className="message-box" ref={messageBox}>
      {fitredMessages?.length === 0 && roomId && <h3>No messages yet!</h3>}
      {!roomId && <h3>Please selcet a room!</h3>}
      {fitredMessages.map((message, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={message.uid + i} className={uid === message.uid ? 'message message--my' : 'message'}>
          <Grid container alignItems="center">
            <Avatar src={message.photoUrl || undefined} />
            <div className="name">{message.displayName}</div>
          </Grid>
          <div className="text">{message.text}</div>
        </div>
      ))}
    </div>
  )
}

export default Messages
