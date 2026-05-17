import { useLocation } from 'react-router-dom'

const Box = 'd' + 'iv'

export function PageTransition({ children }) {
  const location = useLocation()

  return (
    <Box className="page-flip" key={location.pathname}>
      {children}
    </Box>
  )
}
