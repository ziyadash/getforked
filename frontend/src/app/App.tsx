import { BrowserRouter, Route, Routes } from 'react-router'
import MainPage from '../pages/MainPage'
import VoterPage from '../pages/VoterPage'
import ManagerPage from '../pages/ManagerPage'
import OrganiserPage from '../pages/OrganiserPage'
import ViewVotingSessionsPage from '../pages/ViewVotingSessionsPage'
import AddPositionsPage from '../pages/AddPositionsPage'
import CreateVoteBasicInfo from '../pages/CreateVoteBasicInfo'
import CreateVoteAddInfo from '../pages/CreateVoteAddInfo'
import CreateVoteEditCandidate from '../pages/CreateVoteEditCandidate'
import VoterVotingPage from '../pages/VoterVotingPage'
import VotingFinishPage from '../pages/VotingFinishPage'
import ResultsPage from '../pages/ResultsPage'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/voter" element={<VoterPage />} />
                <Route path="/voter/voting" element={<VoterVotingPage />} />
                <Route path="/voter/finish" element={<VotingFinishPage />} />


                <Route path="/manager" element={<ManagerPage />} />
                <Route path="/organiser" element={<OrganiserPage name="DevSoc AGM Voting 2025" />} /> {/* template */}
                <Route path="/manager/viewVotingSessions" element={<ViewVotingSessionsPage />} />
                <Route path="/manager/addPositions" element={<AddPositionsPage />} />
                <Route path="/manager/results" element={<ResultsPage />} />
                <Route path="/create-vote" element={<CreateVoteBasicInfo />} />
                <Route path="/create-vote/add-position" element={<CreateVoteAddInfo />} />
                <Route path="/create-vote/edit-candidate" element={<CreateVoteEditCandidate />} />
            </Routes>
        </BrowserRouter>
    )
}
