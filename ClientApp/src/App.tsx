import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AboutPage } from './pages/AboutPage'
import { CarrierOfferDetailPage } from './pages/CarrierOfferDetailPage'
import { ChatPage } from './pages/ChatPage'
import { ContactPage } from './pages/ContactPage'
import { CreateLoadPage } from './pages/CreateLoadPage'
import { CreateVehiclePage } from './pages/CreateVehiclePage'
import { FaqPage } from './pages/FaqPage'
import { HowItWorksPage } from './pages/HowItWorksPage'
import { LandingPage } from './pages/LandingPage'
import { LoadListingDetailPage } from './pages/LoadListingDetailPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/yuk-olustur" element={<CreateLoadPage />} />
        <Route path="/teklif/:slot" element={<CarrierOfferDetailPage />} />
        <Route path="/arac-ilani" element={<CreateVehiclePage />} />
        <Route path="/yuk-ilan/:slot" element={<LoadListingDetailPage />} />
        <Route path="/sohbet" element={<ChatPage />} />
        <Route path="/hakkimizda" element={<AboutPage />} />
        <Route path="/nasil-calisir" element={<HowItWorksPage />} />
        <Route path="/sss" element={<FaqPage />} />
        <Route path="/kullanim-kosullari" element={<TermsPage />} />
        <Route path="/gizlilik" element={<PrivacyPage />} />
        <Route path="/iletisim" element={<ContactPage />} />
        <Route path="/giris" element={<PlaceholderPage />} />
        <Route path="/kayit" element={<PlaceholderPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
