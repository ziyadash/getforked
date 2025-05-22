import OrganiserButton from "../buttons/OrganiserButton"
import SampleQRButton from "../buttons/SampleQRButton"
import AuthInput from "../inputs/AuthInput"
import "./VoterCode.css"


export default function VoterCode() {
  return (
    <>
      <div className='box-bg-style rounded-4xl w-[30rem] h-[14rem] p-12'>
        <div className="flex flex-row mb-5">
          <AuthInput w="w-70" label="Voter's code" placeholder="ABC123" marginStyle="ml-2" />
          <div className="mt-7 ml-5">  {/* note - could do a marginStyle for SampleQRButton like AuthInput */}
            <SampleQRButton /> {/* currently disabled functionality */}
          </div>
        </div>
        <OrganiserButton text="Add" width="" height="h-10" />
      </div>
    </>
  )
}