// import React from "react";
import { useEffect, useState } from "react";
import ThinButton from "../buttons/ThinButton"
import AuthInput from "../inputs/AuthInput"
import '../AuthBox.css'
import { Link, useLocation } from "react-router";

interface AuthBoxInput {
	user: string,
}

export default function AuthBox({ user }: AuthBoxInput) {
	const [/*input*/, setInput] = useState<string>('');
	const [navTo, setNavTo] = useState<string>('');
	const [signupLogin, setSignupLogin] = useState<'sign up' | 'login'>('login');

	const location = useLocation();
	const route = location.pathname;

	useEffect(() => {
		if (route === `/${user}/signup`) {
			setNavTo(`/${user}/login`);
			setSignupLogin('sign up');
		} else if (route === `/${user}/login`) {
			setNavTo(`/${user}/signup`);
			setSignupLogin('login');
		}
		console.log("done")
	}, [route]);

	return (
		<div className="flex flex-col mt-8 w-[35em] h-[30em] border-2 border-[#f1e9e9] rounded-4xl">
			<h1 className="flex justify-center mt-24 text-[#f1e9e9] text-3xl"> Please {signupLogin} with your zID </h1>
			<div>
				<AuthInput type="text" label="zID" placeholder="z1234567" marginStyle="mt-[2em]" setInput={setInput} w="w-[23em]" h="h-[2.5em]" />
				<AuthInput type="password" label="Password" placeholder="••••••••••••" marginStyle="mt-[1em]" setInput={setInput} w="" h="" />
				{
					route === `/${user}/login`
						? <div className="text-[#f1e9e9] ml-24 mt-3">Don't have an account? Sign up <Link className="underline" to={navTo}>here</Link></div>
						: <div className="text-[#f1e9e9] ml-24 mt-3">Already have an account? Login <Link className="underline" to={navTo}>here</Link></div>
				}
				{/* NOTE FOR PASSWORD PLACEHOLDER: Chrome uses • whereas other browsers use ● */}
				{/* https://stackoverflow.com/questions/6859727/styling-password-fields-in-css */}
				<ThinButton text="Continue" margin="mt-[1.5em]" />
			</div>
		</div>
	);
}