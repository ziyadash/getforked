import StyledBackground from "../components/background/StyledBackground";
import WideButton from "../components/buttons/WideButton";
import Heading from "../components/buttons/Heading";

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
            <WideButton text="Hi" margin="mt-[4em]"/>
        </StyledBackground>
    )
}