import { Splash } from './pages/Splash';
import { Onboarding } from './pages/Onboarding';
import { Login } from './pages/Login';
import { OTPVerification } from './pages/OTPVerification';
import { Home } from './pages/Home';
import { TempleList } from './pages/TempleList';
import { TempleDetail } from './pages/TempleDetail';
import { SevaBooking } from './pages/SevaBooking';
import { Payment } from './pages/Payment';
import { BookingConfirmation } from './pages/BookingConfirmation';
import { LiveDarshan } from './pages/LiveDarshan';
import { Classes } from './pages/Classes';
import { Prasadam } from './pages/Prasadam';
import { PujasHomas } from './pages/PujasHomas';
import { PrasadamTracking } from './pages/PrasadamTracking';
import { MyBookings } from './pages/MyBookings';
import { Profile } from './pages/Profile';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { OfflineIndicator } from './components/OfflineIndicator';
import { UpdateNotification } from './components/UpdateNotification';
import { ProfileDetails } from './pages/ProfileDetails';
import { Gallery } from './pages/gallery';
import {FamilyDetails} from './pages/FamilyDetails';
// import { Navigate, Route, Routes } from 'react-router-dom';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { setAppNavigator } from './utils/navigation';

import ProtectedRoute from "./auth/ProtectedRoute";
import RequirePhoneNumber from "./auth/RequirePhoneNumber";
import { ContactDetails } from './pages/ContactDetails';
import { SpecialPujaBooking } from './pages/SpecialPujaBooking';
import { AddressDetails } from './pages/AddressDetails';
import { Settings } from './pages/Settings';
import { ScrollToTop } from './components/ScrollToTop';

export type Page = 
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'otp'
  | 'home'
  | 'temples'
  | 'temple-detail'
  | 'seva-list'
  | 'seva-booking'
  | 'payment'
  | 'booking-confirmation'
  | 'live-darshan'
  | 'classes'
  | 'prasadam'
  | 'pujas-homas'
  | 'prasadam-tracking'
  | 'my-bookings'
  | 'profile'
  | 'profileDetails'
  | 'gallery'
  | 'settings'
  | 'familyDetails';

export default function App() {
    const navigate = useNavigate();

  // Register the SPA navigator so modules outside the React tree
  // (the axios 401 interceptor in api/client.ts) can navigate to /login
  // via React Router instead of a hard `window.location.href` reload,
  // which used to blow away the entire browser history stack.
  useEffect(() => {
    setAppNavigator(navigate);
  }, [navigate]);


  return (
    <div className="min-h-dvh w-full text-foreground">
            <ScrollToTop />

      {/* <IOSInstallBanner /> */}
      <OfflineIndicator />
      <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/home" element={<Home />} />
      <Route path="/temples" element={<TempleList />} />
      <Route path="/temple/:templeId" element={<TempleDetail />}/>
      <Route path="/seva/:sevaId/book" element={<SevaBooking />} />
      <Route path='/gallery' element={<Gallery />} />
      <Route path='/classes' element={<Classes />} />
      <Route path='/pujas-homas' element={<PujasHomas />} />
      <Route path='/prasadam' element={<Prasadam />} />
      <Route path='/prasadam-tracking' element={<PrasadamTracking />} />
      <Route path='/live-darshan' element={<LiveDarshan />} />
      <Route path='/login' element={<Login />} />
      <Route path='/contact' element={<ContactDetails />} />
      <Route path='/settings' element={<Settings />} />
      <Route path="/special-puja/:specialPujaId/book" element={<SpecialPujaBooking />} />
      <Route path='otp' element={
        <RequirePhoneNumber>
          <OTPVerification />
        </RequirePhoneNumber>
      } />

      <Route element={<ProtectedRoute />}>
      <Route path="/payment" element={<Payment />}/>
      <Route path="/booking-confirmation" element={<BookingConfirmation />}/>
      <Route path="/my-bookings" element={<MyBookings />}/>
      <Route path='/profile' element={<Profile />} />
      <Route path='/profileDetails' element={<ProfileDetails />} />
      <Route path='/familyDetails' element={<FamilyDetails />} />
      <Route path='/addressDetails' element={<AddressDetails />} />
      </Route>

      <Route path="*" element={<Navigate to="/home" replace />} />

    </Routes>

      <PWAInstallPrompt />
      <UpdateNotification />
    </div>
  );
}