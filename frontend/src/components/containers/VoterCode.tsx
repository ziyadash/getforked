import OrganiserButton from "../buttons/OrganiserButton"
import AuthInput from "../inputs/AuthInput"
import "./VoterCode.css"

export default function VoterCode() {
  return (
    <>
      <div className='box-bg-style rounded-4xl w-[30rem] h-[14rem] p-12'>
        <div className="flex flex-row mb-5">
          <AuthInput w="w-70" label="Voter's code" placeholder="ABC123" marginStyle="m-0" />
        </div>
        <OrganiserButton text="Add" width="" height="h-10" />
      </div>
    </>
  )
}