import React from 'react'
import './MainPage.css'
import MainButton from '../components/buttons/MainButton'
import StyledBackground from '../components/background/StyledBackground'

export default function MainPage() {
    return (
        <StyledBackground className='main'>
            <h1 className="title">Electus</h1>
            <div className="button-container">
                <MainButton action="Create Vote"/>
                <MainButton action="Join Vote"/>
            </div>
        </StyledBackground>
    )
}
