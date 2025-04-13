import StyledBackground from "../components/background/StyledBackground";
import WideButton from "../components/buttons/WideButton";
import Heading from "../components/buttons/Heading";
import SmallButton from "../components/buttons/SmallButton";
import ManageVotePanel from "../components/buttons/ManageVotePanel";

export default function ViewVotingSessionsPage() {
    return (
        <StyledBackground className='main'>
            {/* <SecondaryBanner /> */}
            {/* 
            header
            list
                wideButtons
                    edit button
                    start button
            wideButton with plus
            */}
            <Heading text="Your Voting Sessions"/>
            <ManageVotePanel text="DevSoc" page="votingSessions"/>
        </StyledBackground>
    )
}