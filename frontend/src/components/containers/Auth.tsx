// import React from "react";
import ThinButton from "../buttons/ThinButton"
import AuthInput from "../inputs/AuthInput"

export default function AuthBox() {
	return (
		<div className="flex flex-col mt-8 w-[35em] h-[30em] border-2 border-[#f1e9e9] rounded-4xl">
			<h1 className="flex justify-center mt-24 text-[#f1e9e9] text-3xl"> Please login with your zID </h1>
			<div className="">
				<AuthInput label="zID" placeholder="z1234567" marginStyle="mt-[2em]" w={"w-90"} />
				<AuthInput label="Password" placeholder="●●●●●●●●●●●●" marginStyle="mt-[1em]" w={"w-90"} />
				<ThinButton text="Continue" margin="mt-[4em]" />
			</div>
		</div>
	)
}