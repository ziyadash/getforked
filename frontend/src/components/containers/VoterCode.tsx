import StyledContainer from "../background/StyledContainer"
import SmallButton from "../buttons/SmallButton"
import WideAddButton from "../buttons/WideAddButton"
import AuthInput from "../inputs/AuthInput"
import "./VoterCode.css"

export default function VoterCode() {
  return (
    <div className="w-10 h-10">
      <div className='box-bg-style border-1 border-[#F1E9E9] rounded-4xl w-[30rem] h-[14rem] p-12'>
        <AuthInput w="20em" label={"Voter's code"} placeholder={"ABC123"} marginStyle={"4em"} />
      </div>
    </div>
  )
}