import { useState } from "react";
import StyledBackground from "../components/background/StyledBackground";
import WideButton from "../components/buttons/WideButton";
import Heading from "../components/buttons/Heading";
import SmallButton from "../components/buttons/SmallButton";
import WideAddButton from "../components/buttons/WideAddButton";
import { deleteElement } from "../helpers";

export default function ViewVotingSessionsPage() {
    const buttons = ['start', 'stop', 'results']

    const [votingSessions, setPositions] = useState([
        'DevSoc AGM 2025', 
        'CSESoc AGM 2025', 
        'DevSoc AGM 2024',
        'CSESoc AGM 2024'
    ]);

    const handleDeletion = (index: number) => {
        setPositions(deleteElement(votingSessions, index));
    }

    return (
        <StyledBackground className='main'>
            {/* Add logout button */}

            <div className="
                flex flex-col overflow-y-auto no-scrollbar gap-[1.5em] 
                h-[100vh]
                pt-[0rem]
                p-[6rem]
            ">
                <Heading text="Your Voting Sessions"/>
                {votingSessions.map((name, index) => (
                    <div className="flex flex-row justify-center items-center gap-[2vw]">
                        <WideButton text={name} margin="mt-[0]">
                            <div className="buttons-container">
                                {buttons.map((type) => (
                                    <SmallButton buttonType={type} />
                                ))}
                            </div>
                        </WideButton>
                        <SmallButton buttonType="bin" onClick={() => handleDeletion(index)}/>
                    </div>
                ))}
                <WideAddButton></WideAddButton>
            </div>
        </StyledBackground>
    )
}