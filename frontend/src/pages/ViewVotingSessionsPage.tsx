import { useState } from "react";
import { useNavigate } from 'react-router';
import StyledBackground from "../components/background/StyledBackground";
import WideButton from "../components/buttons/WideButton";
import Heading from "../components/buttons/Heading";
import SmallButton from "../components/buttons/SmallButton";
import WideAddButton from "../components/buttons/WideAddButton";
import { deleteElement } from "../helpers";
import logoutIcon from "../assets/svg/logout.svg";

export default function ViewVotingSessionsPage() {
    const navigate = useNavigate();

    const [votingSessions, setPositions] = useState([
        'DevSoc AGM 2025',
        'CSESoc AGM 2025',
        'DevSoc AGM 2024',
        'CSESoc AGM 2024'
    ]);

    const handleStart = (index: number) => {
        index = index
    }

    const handleStop = (index: number) => {
        index = index
    }

    const handleResults = () => {
        navigate('/creator/results/01')
    }

    const handleDeletion = (index: number) => {
        setPositions(deleteElement(votingSessions, index));
    }

    const handleAddSession = () => {
        navigate('/creator/create-vote');
    }

    const handleLogout = () => {
        navigate('/');
    }

    return (
        <StyledBackground className='main'>
            <div className="
                flex flex-col overflow-y-auto no-scrollbar gap-[1.5em] 
                h-[100vh]
                pt-[0rem]
                p-[6rem]
            ">
                <button className="p-4 absolute top-2 right-4 z-10 hover:cursor-pointer" onClick={handleLogout}>
                    <img className="h-[40px]" src={logoutIcon}></img>
                </button>
                <Heading text="Your Voting Sessions" />
                {votingSessions.map((name, index) => (
                    <div className="flex flex-row justify-center items-center gap-[2vw]">
                        <WideButton text={name} margin="mt-[0]">
                            <div className="buttons-container">
                                <SmallButton
                                    buttonType="start"
                                    onClick={() => handleStart(index)}
                                />
                                <SmallButton
                                    buttonType="stop"
                                    onClick={() => handleStop(index)}
                                />
                                <SmallButton
                                    buttonType="results"
                                    onClick={() => handleResults()}
                                />
                            </div>
                        </WideButton>
                        <SmallButton buttonType="bin" onClick={() => handleDeletion(index)} />
                    </div>
                ))}
                <WideAddButton onClick={() => handleAddSession()}></WideAddButton>
            </div>
        </StyledBackground>
    )
}