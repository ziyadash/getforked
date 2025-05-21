// import StyledContainer from "../background/StyledContainer";
import OrganiserButton from "../buttons/OrganiserButton";
import ZidContainers from "./ZidContainers";

interface OrganiserListInput {
  num: string,
}

export default function OrganiserList({ num }: OrganiserListInput) {
  return (
    // <StyledContainer className='main text-2xl text-white border-1 border-[#F1E9E9] rounded-4xl' w='35rem' h='37rem'>
    <div className="box-bg-style w-[35rem] h-[37rem] p-12 text-center flex flex-col items-center text-2xl text-white border-1 border-[#F1E9E9] rounded-4xl">

      There are {num} voters in this session.
      {/* a good idea would be to remove the "w-100" from below when thinking about mobile responsiveness */}
      <div className="w-100 h-100 bg-red-800 overflow-scroll m-8">
        <ZidContainers width="" height="h-10" zid="z8349572" />
        <ZidContainers width="" height="h-10" zid="z8349572" />
        <ZidContainers width="" height="h-10" zid="z8349572" />
        <ZidContainers width="" height="h-10" zid="z8349572" />

        {/* <div className="w-50 h-20 bg-black">
          hello
        </div>
        <div className="w-50 h-20 bg-black">
          hello
        </div>
        <div className="w-50 h-20 bg-black">
          hello
        </div>
        <div className="w-50 h-20 bg-black">
          hello
        </div>
        <div className="w-50 h-20 bg-black">
          hello
        </div>
        <div className="w-50 h-20 bg-black">
          hello
        </div>
        <div className="w-50 h-20 bg-black">
          bye
        </div>
        <div className="w-50 h-20 bg-black">
          bye2
        </div> */}
      </div>
      <OrganiserButton text="Confirm" width="w-55" height="h-12" />
    </div>
    // </StyledContainer>
  )
}
