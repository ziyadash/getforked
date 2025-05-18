import StyledBackground from "../components/background/StyledBackground";
import WideButton from "../components/buttons/WideButton";
import Heading from "../components/buttons/Heading";
import SmallButton from "../components/buttons/SmallButton";
import WideAddButton from "../components/buttons/WideAddButton";

export default function ViewVotingSessionsPage() {
    const buttons = ['start']
    const votingSessions = [
        'DevSoc AGM 2025', 
        'CSESoc AGM 2025', 
        'DevSoc AGM 2024',
        'CSESoc AGM 2024'
    ]

    return (
        <StyledBackground className='main'>
            {/* Add logout button */}

            <div className="
                flex flex-col overflow-y-auto no-scrollbar gap-[1.5em] 
                h-[100vh]
                ml-[2rem] mr-[2rem]
            ">
                <Heading text="Your Voting Sessions"/>
                {votingSessions.map((name) => (
                    <div className="flex flex-row justify-center items-center gap-[2vw]">
                        <WideButton text={name} margin="mt-[0]">
                            <div className="flex flex-row">
                                {buttons.map((type) => (
                                    <SmallButton buttonType={type} />
                                ))}
                            </div>
                        </WideButton>
                        <SmallButton buttonType="bin"/>
                    </div>
                ))}
                <WideAddButton></WideAddButton>
            </div>
        </StyledBackground>
    )
}