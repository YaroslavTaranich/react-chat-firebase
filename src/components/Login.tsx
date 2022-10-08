import { Box, Button, Container, Grid } from '@mui/material'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useContext } from 'react'

import { Context } from '../context/Context'

function Login() {
  const { auth } = useContext(Context)

  const login = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }
  return (
    <Container>
      <Grid container mt={10} alignItems="center" justifyContent="center">
        <Grid>
          <Box
            sx={{
              width: 400,
              height: 200,
              backgroundColor: '#eee',
              borderRadius: 6,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button variant="outlined" onClick={login}>
              LogIn with Google
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Login
