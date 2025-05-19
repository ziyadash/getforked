import StyledContainer from "./background/StyledContainer";

interface OrganiserListInput {
  num: string,
}

export default function OrganiserList({ num }: OrganiserListInput) {
  return (
    <StyledContainer className='main border-1 border-[#F1E9E9] rounded-4xl' w='35rem' h='37rem'>
      There are {num} voters in this session.
    </StyledContainer>
  )
}
