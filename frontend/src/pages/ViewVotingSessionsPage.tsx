import StyledBackground from "../components/background/StyledBackground";
import Banner from "../components/logo/Banner";
import WideButton from "../components/buttons/WideButton";

export default function ViewVotingSessionsPage() {
    return (
        <StyledBackground className='main'>
            <Banner />
            {/* 
            header
            list
                wideButtons
                    edit button
                    start button
            wideButton with plus
            */}
            <WideButton text="Hi" margin="mt-[4em]"/>
        </StyledBackground>
    )
}