import StyledBackground from "../components/background/StyledBackground";
import Banner from "../components/logo/Banner";
import AuthBox from "../components/AuthBox";

export default function ManagerPage() {
    return (
        <StyledBackground className='main'>
            <Banner />
            <AuthBox />
        </StyledBackground>
    )
}