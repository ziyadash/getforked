// components/AuthBox.tsx

// added functionality so that when we enter the username and password,
// it actually sets them (using usestate), and when we click continue,
// it uses fetch to call the backend route for registration.
// notice that the data is encrypted before being sent.

import React, { useState } from "react";
import ThinButton from "./buttons/ThinButton";
import AuthInput from "./inputs/AuthInput";
import { encryptData } from "../../../shared/src/encryptionFrontend";

export default function AuthBox() {
  const [zID, setZID] = useState("");
  const [zPass, setZPass] = useState("");

  // use when we click the continue button
  const handleRegister = async () => {
	// see shared/encryption
	// encrypt data before sending it to backend
    const encryptedZID = await encryptData(zID);
    const encryptedZPass = await encryptData(zPass);

	// See backend/src/routes/authroutes and backend/src/controllers/authcontroller
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zID: encryptedZID, zPass: encryptedZPass }),
    });

	// error handling is done on the backend, here we just console log our error.
	// perhaps we should deal with this more gracefully..
    const data = await res.json();
    if (res.ok) {
      console.log("Session ID:", data.sessionId);
    } else {
      console.error("Error:", data.error);
    }
  };

  return (
    <div className="flex flex-col mt-8 w-[35em] h-[30em] border-2 border-[#f1e9e9] rounded-4xl">
      <h1 className="flex justify-center mt-24 text-[#f1e9e9] text-3xl">Please login with your zID</h1>
      <div>
        <AuthInput
          label="zID"
          placeholder="z1234567"
          value={zID}
          onChange={setZID} // set zId when we input text
          marginStyle="mt-[2em]"
        />
        <AuthInput
          label="Password"
          placeholder="●●●●●●●●●●●●"
          value={zPass}
          onChange={setZPass} // set zPass when we input text
          marginStyle="mt-[1em]"
        />
        <ThinButton
          text="Continue"
          margin="mt-[4em]"
          onClick={handleRegister} // once zId and zPass are set, handle registration
        />
      </div>
    </div>
  );
}
