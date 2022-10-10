import {
  Avatar,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material'
import { Edit } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu'
import { addDoc, deleteDoc, doc, FieldValue, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { useContext, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { Context, createCollection } from '../context/Context'

import Spinner from './Spinner'
import ChatControls from './ChatControls'
import RoomControlModal from './roomEditModal'

interface IRoom {
  ownerUid: string
  name: string
  ownerName: string | null
  ownerPhotoUrl: string | null
  createdAt: FieldValue
}

interface RoomsProps {
  selectRoom: (id: string) => void
  selectedRoom: string
  clearChat: () => Promise<void>
}

function Rooms({ selectRoom, clearChat, selectedRoom }: RoomsProps) {
  const [editing, setEditing] = useState(false)
  const [editingRoom, setEditingRoom] = useState('')
  const [showRooms, setShowRooms] = useState(true)

  const { auth, firestore } = useContext(Context)
  const [user] = useAuthState(auth)

  const roomRef = createCollection<IRoom>('rooms')
  const q = query<IRoom>(roomRef, orderBy('createdAt'))
  const [rooms, loading, error, snapshot] = useCollectionData<IRoom>(q)

  const createRoom = async (value: string) => {
    if (user && value.length > 0) {
      addDoc<IRoom>(roomRef, {
        ownerUid: user.uid,
        ownerName: user.displayName,
        ownerPhotoUrl: user.photoURL,
        name: value,
        createdAt: serverTimestamp(),
      }).then((docRef) => selectRoom(docRef.id))
    }
  }

  const deleteRoom = async () => {
    await clearChat()
      .then(() => deleteDoc(doc(firestore, 'rooms', selectedRoom)))
      .then(() => selectRoom(''))
  }

  const editRoom = async (name: string) => {
    await updateDoc(doc(firestore, 'rooms', selectedRoom), { name })
  }

  const startEditing = (name: string, id: string) => {
    setEditing(true)
    setEditingRoom(name)
    selectRoom(id)
  }

  const stopEditing = () => {
    setEditing(false)
    setEditingRoom('')
  }

  if (loading) return <Spinner />
  if (error) return <div>{JSON.stringify(error)}</div>
  return (
    <Grid
      container
      direction="column"
      sx={{
        background: '#efefef',
        height: showRooms ? '80vh' : '5vh',
        position: 'relative',
        pb: 10,
        flexWrap: 'nowrap',
        transition: 'all .4s',
      }}
    >
      <div className="mobile-only">
        <IconButton
          sx={{ color: '#FFF', position: 'absolute', top: 15, left: 10 }}
          onClick={() => setShowRooms((s) => !s)}
        >
          <MenuIcon />
        </IconButton>
      </div>
      <Typography
        sx={{ p: 2, background: '#9c27b0', borderRadius: '0 0 10px 10px', textAlign: 'center' }}
        variant="h6"
        component="h6"
        color="white"
      >
        Select a room to chat
      </Typography>
      <List sx={{ width: '100%', p: 0, overflowY: showRooms ? 'auto' : 'hidden', height: showRooms ? 'auto' : 0 }}>
        {rooms &&
          snapshot &&
          rooms.map((room, i) => (
            <ListItem
              key={`${snapshot.docs[i].id}`}
              sx={{
                borderBottom: '1px solid gray',
                backgroundColor: snapshot.docs[i].id === selectedRoom ? '#ac7fb598' : '#ddd',
              }}
              secondaryAction={
                user && user.uid === room.ownerUid ? (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => startEditing(room.name, snapshot.docs[i].id)}
                  >
                    <Edit />
                  </IconButton>
                ) : undefined
              }
            >
              <ListItemAvatar>
                <Avatar
                  src={
                    room.ownerPhotoUrl
                      ? room.ownerPhotoUrl
                      : 'https://play-lh.googleusercontent.com/uKpnKy_wsfI8ZjL-UNK5LpqE9N0xPJnHTlFrhG1a4juepKYL8de8gb52ZMUNqW5XPYU=s128-h480'
                  }
                />
              </ListItemAvatar>

              <ListItemText
                primary={<Button onClick={() => selectRoom(snapshot.docs[i].id)}>{room.name}</Button>}
                secondary={`Owner: ${room.ownerName}`}
              />
            </ListItem>
          ))}
      </List>
      {showRooms && (
        <ChatControls
          clearChat={clearChat}
          createRoom={createRoom}
          isRoomSelected={Boolean(selectedRoom)}
          isRooms={Boolean(rooms?.length)}
        />
      )}
      <RoomControlModal
        currentName={editingRoom}
        isOpen={editing}
        close={stopEditing}
        deleteRoom={deleteRoom}
        editRoom={editRoom}
      />
    </Grid>
  )
}

export default Rooms
