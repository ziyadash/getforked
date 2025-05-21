import { BrowserRouter, Route, Routes } from 'react-router'
import MainPage from '../pages/MainPage'
import VoterPage from '../pages/VoterPage'
import ManagerPage from '../pages/ManagerPage'
import ViewVotingSessionsPage from '../pages/ViewVotingSessionsPage'
import AddPositionsPage from '../pages/AddPositionsPage'
import VoterVotingPage from '../pages/VoterVotingPage'
import VotingFinishPage from '../pages/VotingFinishPage'


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/voter" element={<VoterPage />} />
                <Route path="/voter/voting" element={<VoterVotingPage />} />
                <Route path="/voter/finish" element={<VotingFinishPage />} />


                <Route path="/manager" element={<ManagerPage />}/>
                <Route path="/manager/viewVotingSessions" element={<ViewVotingSessionsPage />} />
                <Route path="/manager/addPositions" element={<AddPositionsPage />} />
            </Routes>
        </BrowserRouter>
    )
}
