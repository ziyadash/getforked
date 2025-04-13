import StyledBackground from "../components/background/StyledBackground";
import WideButton from "../components/buttons/WideButton";
import Heading from "../components/buttons/Heading";
import SmallButton from "../components/buttons/SmallButton";
import WideAddButton from "../components/buttons/WideAddButton";
// import ManageVotePanel from "../components/buttons/ManageVotePanel";

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
            <Heading text="Your Voting Sessions"/>

            <div className="
                flex flex-col overflow-y-auto no-scrollbar gap-[1.5em] 
                h-[100vh]
                mt-[2rem] mb-[2rem]
            ">
                {votingSessions.map((name) => (
                    <div className="flex flex-row justify-center items-center gap-5">
                        <WideButton text={name} margin="mt-[0]">
                            <div className="flex flex-row gap-1">
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