import { Button, TextField } from '@mui/material'
import { FormEvent, useState } from 'react'

interface MessageInputProps {
  sendMessage: (value: string) => Promise<void>
}

function MessageInput({ sendMessage }: MessageInputProps) {
  const [value, setValue] = useState('')

  const messageHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (value.length > 0) sendMessage(value).then(() => setValue(''))
  }

  return (
    <form onSubmit={(e) => messageHandler(e)} className="message-form">
      <div>
        <TextField variant="outlined" fullWidth maxRows={2} value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
      <Button variant="contained" type="submit" color="secondary">
        SEND
      </Button>
    </form>
  )
}

export default MessageInput
