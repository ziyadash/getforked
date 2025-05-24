import { useEffect, useState } from "react";
import StyledBackground from "../components/background/StyledBackground";
import ListVoters from "../components/containers/ListVoters";
import { useNavigate } from "react-router";

interface OrganiserInput {
  name: string,
}

export default function VoteSessionPage({ name }: OrganiserInput) {
  const [loading, setLoading] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0); // number of voters in the session

  const navigate = useNavigate();

  // for session ids?
  // const [zidList, setZidList] = useState<string[]>([]); // [userSessionID2, userSessionID1]

  // zidList is for DISPLAYING in the view/list.
  const [zidList, setZidList] = useState<string[]>([]); // [z1234567, z2345678]

  useEffect(() => {
    setLoading(false) // once correct information has been loaded, change to false
  }, [zidList]);

  useEffect(() => {
    // TODO: "there is 1 voter in this session." <- ideal text
    setCount(zidList.length) // there are 2 voters in this session.
  }, [zidList]);

  const goBack = () => {
    // exit voting session & navigate back to all voting sessions
    navigate('/creator/view-voting-sessions');
  }

  return (
    <>
      {loading ? <StyledBackground className='main flex justify-center items-center'>
        <div className="text-4xl mb-20 text-[#F1E9E9]"> Starting Vote: {name}... </div>
      </StyledBackground> :
        <StyledBackground className="main">
          <button className="hover:cursor-pointer text-white p-4 text-2xl absolute top-2 left-4 z-10" onClick={goBack}>
            ←
          </button>
          <div className="flex self-center text-2xl mt-10 text-[#F1E9E9]"> Started Voting Session: {name}... </div>
          <div className="mt-8">
            <ListVoters zidList={zidList} num={count.toString()} setZidList={setZidList} />
          </div>
        </StyledBackground>}
    </>
  )
}
