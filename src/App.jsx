import { useRoutes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeSettings } from './theme/Theme';
import RTL from './layouts/full/shared/customizer/RTL';
import ScrollToTop from './components/shared/ScrollToTop';
import Router from './routes/Router';
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { authenticateUserOnLoad, logout } from './store/auth/login/LoginSlice';
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from 'framer-motion';
import img1 from 'src/assets/images/backgrounds/logo-overlay.jpg';
import { useNavigate } from 'react-router-dom';
import StandaloneAttendance from './views/pages/attendance-module/manualAttendance/StandaloneAttendance';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const token = localStorage.getItem('Exergy HRMToken');
  const user = JSON.parse(localStorage.getItem('Exergy HRMData'));
  const { isAuthenticated } = useSelector((state) => state.loginReducer);

  const routing = useRoutes(Router(isAuthenticated));
  const theme = ThemeSettings();
  const customizer = useSelector((state) => state.customizer);
  const [showOverlay, setShowOverlay] = useState(false)
  
  if (token) {
    const decoded = jwtDecode(token);

    if (decoded.exp * 1000 < new Date().getTime()) {
      dispatch(logout())
      localStorage.clear();
    }
  }

  useEffect(() => {
    if (token && user) {
      dispatch(authenticateUserOnLoad({
        isAuthenticated: true,
        user: user
      }))
    }
  }, [token])

  useEffect(() => {
    setTimeout(() => {
      setShowOverlay(false)
    }, 2000)
  }, [])

  return (
    <Box sx={{}} className='tabular-nums'>
      <AnimatePresence mode='wait'>
        {showOverlay ? <motion.div key='overlay' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Box className="fixed top-0 left-0 bottom-0 right-0 z-[1000] h-screen w-screen">
            <img src={img1} className='object-cover w-full h-full' alt="" />
          </Box>
        </motion.div> :
          <motion.div key='app' initial={{ opacity: 0 }} animate={{ opacity: 1 }} >
            <ThemeProvider theme={theme} >
              <RTL direction={customizer.activeDir}>
                <CssBaseline />
                <>
                  <ScrollToTop>{routing}</ScrollToTop>
                </>
              </RTL>
            </ThemeProvider>
          </motion.div>
        }
      </AnimatePresence>
    </Box>
  );
}

export default App
