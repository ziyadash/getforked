import { useState } from "react";
import StyledBackground from "../components/background/StyledBackground";
import AuthInput from "../components/inputs/AuthInput";

export default function VoterJoinSessionPage() { // once voter has logged in
  const [input, setInput] = useState<string>('');
  return (
    <StyledBackground className="main">
      <AuthInput type="text" label="Join a Voting Session" placeholder="Input Session ID here" marginStyle="mt-[2em]" setInput={setInput} w="w-[23em]" h="h-[2.5em]" />
    </StyledBackground>
  );
}