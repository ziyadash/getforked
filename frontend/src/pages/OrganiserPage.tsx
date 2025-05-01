import { useEffect, useState } from "react";
import StyledBackground from "../components/background/StyledBackground";
import Banner from "../components/logo/Banner";

interface OrganiserInput {
  name: string,
}

export default function OrganiserPage({ name }: OrganiserInput) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => { // once correct information has been loaded
    // setLoading(false)
  }, []);

  return (
    <StyledBackground className='main flex justify-center items-center'>
      <div className="">
        {
          loading
            ? <div className="text-4xl"> Starting Vote: {name}... </div>
            : <></>
        }
      </div>

    </StyledBackground>
  )
}
