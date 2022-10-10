import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Slide,
  TextField,
} from '@mui/material'
import { Add, Delete } from '@mui/icons-material'
import { FC, forwardRef, useState } from 'react'
import { TransitionProps } from '@mui/material/transitions'

interface ChatControlsProps {
  clearChat: () => Promise<void>
  createRoom: (value: string) => Promise<void>
  isRoomSelected: boolean
  isRooms: boolean
}

export const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement<any, any>
    },
    ref: React.Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...props} />
)

const ChatControls: FC<ChatControlsProps> = ({ clearChat, createRoom, isRoomSelected, isRooms }) => {
  const [delModal, setDelModal] = useState(false)
  const [newModal, setNewModal] = useState(false)
  const [value, setValue] = useState('')

  const deleteHandler = () => {
    clearChat().then(() => setDelModal(false))
  }

  const createRoomHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createRoom(value).then(() => {
      setNewModal(false)
      setValue('')
    })
  }

  return (
    <>
      <Fab
        color="secondary"
        aria-label="add"
        sx={
          isRooms
            ? { position: 'absolute', bottom: '2%', right: '80%', transition: 'all .4s' }
            : { position: 'absolute', bottom: '70%', right: '50%', transform: 'translateX(50%)', transition: 'all .4s' }
        }
        onClick={() => {
          setNewModal(true)
        }}
      >
        <Add />
      </Fab>
      {isRoomSelected && (
        <Fab
          color="secondary"
          aria-label="delete"
          sx={{ position: 'absolute', bottom: '2%', left: '80%' }}
          onClick={() => setDelModal(true)}
        >
          <Delete />
        </Fab>
      )}
      <Dialog
        open={newModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setNewModal(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Create a new room!</DialogTitle>
        <form onSubmit={(e) => createRoomHandler(e)}>
          <DialogContent sx={{ width: 600 }}>
            <DialogContentText id="alert-dialog-slide-description">Enter the name of a new room.</DialogContentText>

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
            <Button variant="outlined" type="submit">
              Create a room
            </Button>
            <Button variant="outlined" color="error" onClick={() => setNewModal(false)}>
              Close
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={delModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setDelModal(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            All messages in this <b>room</b> will be deleted! It will be impossible to restore them! Are you sure you
            want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setDelModal(false)}>
            Close
          </Button>
          <Button variant="outlined" color="error" onClick={deleteHandler}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ChatControls
