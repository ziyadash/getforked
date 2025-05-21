import { useEffect, useState } from "react";
import StyledBackground from "../components/background/StyledBackground";
import VoterCode from "../components/containers/VoterCode";
import OrganiserList from "../components/containers/OrganiserList";
interface OrganiserInput {
  name: string,
}

export default function OrganiserPage({ name }: OrganiserInput) {
  const [loading, setLoading] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0); // number of voters in the session

  useEffect(() => {
    setLoading(false) // once correct information has been loaded, change to false
    setCount(1) // "there is 1 voter in this session." <- ideal text
    setCount(2) // there are 2 voters in this session.
  }, []);

  return (
    <>
      {loading ? <StyledBackground className='main flex justify-center items-center'>
        <div className="text-4xl mb-20 text-[#F1E9E9]"> Starting Vote: {name}... </div>
      </StyledBackground> :
        <StyledBackground className="main">
          <div className="flex self-center text-2xl mt-10 text-[#F1E9E9]"> Started Voting Session: {name}... </div>
          <div className="grid grid-cols-2 gap-2 mt-8">
            <VoterCode />
            <OrganiserList num={count.toString()} />
          </div>
        </StyledBackground>}
    </>
  )
}
