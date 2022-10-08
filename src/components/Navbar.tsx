import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { Grid, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

import { LOGIN_ROUTE } from '../utils/constants'
import { Context } from '../context/Context'

function Navbar() {
  const { auth } = useContext(Context)
  const [user, loading] = useAuthState(auth)
  const navigate = useNavigate()
  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        {!loading && (
          <Grid container justifyContent="flex-end">
            {user ? (
              <Button onClick={() => auth.signOut()} variant="contained">
                Log Out
              </Button>
            ) : (
              <Button variant="contained" onClick={() => navigate(LOGIN_ROUTE)}>
                Login
              </Button>
            )}
          </Grid>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
