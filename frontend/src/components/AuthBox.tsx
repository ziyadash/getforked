// import React from "react";
import ThinButton from "./buttons/ThinButton"
import AuthInput from "./inputs/AuthInput"
import "./AuthBox.css"

export default function AuthBox() {
	return (
		<div className="flex flex-col mt-8 w-[35em] h-[30em] border-2 border-[#f1e9e9] rounded-4xl">
			<h1 className="flex justify-center mt-24 text-[#f1e9e9] text-3xl"> Please login with your zID </h1>
			<div className="">
				<AuthInput type="text" label="zID" placeholder="z1234567" marginStyle="mt-[2em]" />
				<AuthInput type="password" label="Password" placeholder="••••••••••••" marginStyle="mt-[1em]" />
				{/* NOTE FOR PASSWORD PLACEHOLDER: Chrome uses • whereas other browsers use ● */}
				{/* https://stackoverflow.com/questions/6859727/styling-password-fields-in-css */}
				<ThinButton text="Continue" margin="mt-[4em]" />
			</div>
		</div>
	)
}