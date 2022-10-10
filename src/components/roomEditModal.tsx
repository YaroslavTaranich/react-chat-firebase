import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

import { Transition } from './ChatControls'

interface RoomControlModalProps {
  currentName: string
  isOpen: boolean
  close: () => void
  deleteRoom: () => Promise<void>
  editRoom: (value: string) => Promise<void>
}

function RoomControlModal({ currentName, isOpen, close, deleteRoom, editRoom }: RoomControlModalProps) {
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(currentName)
  }, [currentName])

  const editRoomHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    editRoom(value).then(() => close())
  }
  const deleteRoomHandler = () => {
    deleteRoom().then(() => close())
  }
  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={close}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Edit the room.</DialogTitle>
      <form onSubmit={(e) => editRoomHandler(e)}>
        <DialogContent sx={{ width: 600 }}>
          <DialogContentText id="alert-dialog-slide-description">Enter new name of a the room.</DialogContentText>

          <TextField
            required
            autoFocus
            margin="dense"
            id="room-name"
            label="Room Name"
            type="text"
            fullWidth
            variant="standard"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={deleteRoomHandler} sx={{ mr: 'auto' }}>
            Delete the room
          </Button>
          <Button variant="outlined" type="submit">
            Save
          </Button>
          <Button variant="outlined" onClick={close}>
            Close
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default RoomControlModal
