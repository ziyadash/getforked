import './MainPage.css'
import MainButton from '../components/buttons/MainButton'
import StyledBackground from '../components/background/StyledBackground'
import Banner from '../components/logo/Banner'

export default function MainPage() {
    return (
        <StyledBackground className='main'>
            <Banner />
            <div className="button-container">
                <MainButton action="Join Vote" />
                <MainButton action="Create Vote" />
            </div>
        </StyledBackground>
    )
}

