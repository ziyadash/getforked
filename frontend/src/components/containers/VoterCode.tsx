import OrganiserAddButton from "../buttons/OrganiserAddButton"
import AuthInput from "../inputs/AuthInput"
import "./VoterCode.css"

export default function VoterCode() {
  return (
    <>
      <div className='box-bg-style w-[30rem] h-[14rem] p-12'>
        <div className="flex flex-row mb-5">
          <AuthInput w="w-40" label="Voter's code" placeholder="ABC123" marginStyle="m-0" />
        </div>
        <OrganiserAddButton text="Add" width="" height="h-10" />
      </div>
    </>
  )
}