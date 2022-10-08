import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { ReactElement, useContext } from 'react'
import { User } from 'firebase/auth'

import { Context } from '../context/Context'
import { privateRoutes, publicRoutes } from '../routes'
import { CHAT_ROUTE, LOGIN_ROUTE } from '../utils/constants'

import Spinner from './Spinner'

interface IRouteProps {
  user: User | null | undefined
  children: ReactElement
}

function PublicRoute({ user, children }: IRouteProps) {
  if (user) return <Navigate to={CHAT_ROUTE} replace />
  return children
}

function PrivateRoute({ user, children }: IRouteProps) {
  if (!user) return <Navigate to={LOGIN_ROUTE} replace />
  return children
}

function AppRouter() {
  const { auth } = useContext(Context)
  const [user, loading] = useAuthState(auth)

  if (loading) return <Spinner />

  return (
    <Routes>
      {privateRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute user={user}>
              <Component />
            </PrivateRoute>
          }
        />
      ))}
      {publicRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <PublicRoute user={user}>
              <Component />
            </PublicRoute>
          }
        />
      ))}
      {/* <Route path="*" element={<Navigate to={LOGIN_ROUTE} />} /> */}
    </Routes>
  )

  // return user ? (
  //   <Routes>
  //     ({' '}
  //     {privateRoutes.map((r) => (
  //       <Route key={r.path} path={r.path} element={r.Component()} />
  //     ))}
  //     )
  //     <Route path="*" element={<Navigate to={CHAT_ROUTE} />} />
  //   </Routes>
  // ) : (
  //   <Routes>
  //     ({' '}
  //     {publicRoutes.map((r) => (
  //       <Route key={r.path} path={r.path} element={r.Component()} />
  //     ))}
  //     )
  //     <Route path="*" element={<Navigate to={LOGIN_ROUTE} />} />
  //   </Routes>
  // )
}

export default AppRouter
