import { useState } from "react";
import StyledBackground from "../components/background/StyledBackground";
import AuthInput from "../components/inputs/AuthInput";
import ThinGradientButton from "../components/buttons/ThinGradientButton";
import logoutIcon from "../assets/svg/logout.svg";
import { useNavigate } from "react-router";

export default function VoterJoinSessionPage() { // once voter has logged in
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  }

  const [input, setInput] = useState<string>('');
  const onClick = () => {
      if (input.trim()) {
        const checkElectionID= async () => {
            const electionId = JSON.stringify(input);
            if (electionId) {
                const API_URL = import.meta.env.VITE_BACKEND_URL;
                const response = await fetch(`${API_URL}/api/auth/checkSession`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify(
                        {
                            electionId: electionId,
                        }),
                });
                if (response.ok) {
                    navigate(`/voter/voting/${input.trim()}`);
                    return;
                }
            }
        };
        checkElectionID();
      } 
  }





  return (
    <StyledBackground className="main justify-center">
      <button className="p-4 absolute top-2 right-4 z-10 hover:cursor-pointer" onClick={handleLogout}>
        <img className="h-[40px]" src={logoutIcon}></img>
      </button>
      <div className="flex flex-col justify-center w-[30em] h-[12em] bg-linear-140 from-transparent to-white/40 mb-60 border-2 border-[#f1e9e9] rounded-4xl">
        <div className="flex flex-row justify-center">
          <AuthInput type="text" label="Join a Voting Session" placeholder="Input Session ID here" marginStyle="" setInput={setInput} w="w-[16em]" h="h-[2.5em]" />
          <ThinGradientButton text={"Join"} margin={"mt-9 ml-5"} w={"w-20"} onClick={onClick} />
        </div>
      </div>
    </StyledBackground >
  );
}