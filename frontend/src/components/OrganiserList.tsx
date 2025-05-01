import { useEffect, useState } from "react";
import StyledBackground from "../components/background/StyledBackground";
import Banner from "../components/logo/Banner";

interface OrganiserInput {
  name: string,
}

export default function OrganiserList({ name }: OrganiserInput) {
  return (
    <StyledBackground className='main'>
      Started Voting Session: {name}
    </StyledBackground>
  )
}
