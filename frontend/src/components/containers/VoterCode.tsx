import StyledContainer from "../background/StyledContainer"
import AuthInput from "../inputs/AuthInput"

export default function VoterCode() {
  return (
    <div className="w-10 h-10">
      <StyledContainer className='main border-1 border-[#F1E9E9] rounded-4xl' w='30rem' h='14rem'>
        <AuthInput w="20em" label={"Voter's code"} placeholder={"ABC123"} marginStyle={"4em"} />
      </StyledContainer>
    </div>
  )
}
