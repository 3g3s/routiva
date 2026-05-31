import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { RequireAuth, RequireRole } from './auth/RequireAuth'
import { AboutPage } from './pages/AboutPage'
import { AccountPage } from './pages/AccountPage'
import { CarrierOfferDetailPage } from './pages/CarrierOfferDetailPage'
import { CarrierHubPage } from './pages/CarrierHubPage'
import { CarrierMapPage } from './pages/CarrierMapPage'
import { ChatPage } from './pages/ChatPage'
import { ContactPage } from './pages/ContactPage'
import { CreateLoadPage } from './pages/CreateLoadPage'
import { CreateVehiclePage } from './pages/CreateVehiclePage'
import { DashboardPage } from './pages/DashboardPage'
import { FaqPage } from './pages/FaqPage'
import { HowItWorksPage } from './pages/HowItWorksPage'
import { LandingPage } from './pages/LandingPage'
import { MyRoutePage } from './pages/MyRoutePage'
import { LoadListingDetailPage } from './pages/LoadListingDetailPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/yuk-olustur"
            element={
              <RequireAuth>
                <CreateLoadPage />
              </RequireAuth>
            }
          />
          <Route path="/teklif/:slot" element={<CarrierOfferDetailPage />} />
          <Route path="/tasiyici" element={<CarrierHubPage />} />
          <Route
            path="/arac-ilani"
            element={
              <RequireAuth>
                <CreateVehiclePage />
              </RequireAuth>
            }
          />
          <Route path="/yuk-ilan/:slot" element={<LoadListingDetailPage />} />
          <Route path="/sohbet" element={<ChatPage />} />
          <Route path="/hakkimizda" element={<AboutPage />} />
          <Route path="/nasil-calisir" element={<HowItWorksPage />} />
          <Route path="/sss" element={<FaqPage />} />
          <Route path="/kullanim-kosullari" element={<TermsPage />} />
          <Route path="/gizlilik" element={<PrivacyPage />} />
          <Route path="/iletisim" element={<ContactPage />} />
          <Route path="/giris" element={<LoginPage />} />
          <Route path="/kayit" element={<RegisterPage />} />
          <Route
            path="/hesabim"
            element={
              <RequireAuth>
                <AccountPage />
              </RequireAuth>
            }
          />
          <Route
            path="/guzergahim"
            element={
              <RequireAuth>
                <MyRoutePage />
              </RequireAuth>
            }
          />
          <Route
            path="/panel"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
          <Route
            path="/tasiyici/harita"
            element={
              <RequireRole role="tasiyici">
                <CarrierMapPage />
              </RequireRole>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
