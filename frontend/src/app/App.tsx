import { BrowserRouter, Route, Routes } from 'react-router'
import MainPage from '../pages/MainPage'
import VoterPage from '../pages/VoterPage'
import ManagerPage from '../pages/ManagerPage'
import OrganiserPage from '../pages/OrganiserPage'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/voter" element={<VoterPage />} />
                <Route path="/manager" element={<ManagerPage />} />
                <Route path="/organiser" element={<OrganiserPage />} /> {/* template */}
            </Routes>
        </BrowserRouter>
    )
}
