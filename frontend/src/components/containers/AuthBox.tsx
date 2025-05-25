// import React from "react";
import { useEffect, useRef, useState } from "react";
import ThinGradientButton from "../buttons/ThinGradientButton";
import AuthInput from "../inputs/AuthInput"
import '../AuthBox.css'
import { Link, useLocation, useNavigate } from "react-router";

interface AuthBoxInput {
	user: string,
}


export default function AuthBox({ user }: AuthBoxInput) {
	const [navTo, setNavTo] = useState<string>('');
	const [signupLogin, setSignupLogin] = useState<'Sign up' | 'Login'>('Login');

	const location = useLocation();
	const route = location.pathname;


	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');



	useEffect(() => {
		if (route === `/${user}/signup`) {
			setNavTo(`/${user}/login`);
			setSignupLogin('Sign up');
		} else if (route === `/${user}/login`) {
			setNavTo(`/${user}/signup`);
			setSignupLogin('Login');
		}
	}, [route]);

	const navigate = useNavigate();
	const goBack = () => {
		navigate('/');
	}

	async function login() {
		const API_URL = import.meta.env.VITE_BACKEND_URL;

		const res = await fetch(`${API_URL}/api/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(
				{
					zId: username,
					zPass: password
				}),
		});
		const data = await res.json();
		// if (!res.ok) throw new Error(data.error || 'Login failed');
		return data; // { sessionId: ... }
	}

	async function register() {
		const API_URL = import.meta.env.VITE_BACKEND_URL;

		const res = await fetch(`${API_URL}/api/auth/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(
				{
					zId: username,
					zPass: password
				}),
		});
		const data = await res.json();
		// if (!res.ok) throw new Error(data.error || 'Login failed');
		return data; // { sessionId: ... }
	}



	const debounceRef = useRef<boolean>(false);

	/**
	 * This is what happens when we get a session ID
	 * Handle storing it as a cookie and redirecting
	 * @param sessionId 
	 */
	function HandleFoundSessionid(sessionId: string) {
		console.log("HANDLING SESSION ID");
		console.log(sessionId)
		localStorage.setItem('user-session-id', sessionId); // session id stored in local storage
	}

	const submit = async () => {
		if (debounceRef.current) return;

		debounceRef.current = true;

		setTimeout(() => {
			debounceRef.current = false;
		}, 1000);

		try {
			console.table([username, password]);

			const res2 = await login();
			console.log("LOGIN RES", res2);

			if (res2.error) {
				console.log("ERROR")
				console.log(res2.error)

				if (res2.error === "User not registered") {
					console.log("ERROR HERE")

					const res3 = await register()

					console.log("REGISTER RES");
					console.log(res3)

					if (res3.sessionId) {
						HandleFoundSessionid(res3.sessionId)
					}
				}
			} else {
				if (res2.sessionId) {
					HandleFoundSessionid(res2.sessionId)
				}
			}

			if (route.includes('creator')) {
				navigate(`/creator/view-voting-sessions`);
			} else if (route.includes('voter')) {
				navigate('/voter/join');
			}

		} catch (err) {
			console.error("Login failed:", err);
		}
	};


	return (
		<div className="flex flex-col mt-8 w-[35em] h-[32em] border-2 border-[#f1e9e9] rounded-4xl">
			<button className="text-white p-4 text-2xl flex justify-start pt-10 pl-10 hover:cursor-pointer" onClick={goBack}>
				←
			</button>

			<h1 className="flex justify-center mt-1 text-[#f1e9e9] text-3xl"> {signupLogin} with your zID </h1>
			<div>
				<AuthInput type="text" label="zID" placeholder="z1234567" marginStyle="mt-[2em]" setInput={setUsername} w="w-[23em]" h="h-[2.5em]" />
				<AuthInput type="password" label="Password" placeholder="••••••••••••" marginStyle="mt-[1em]" setInput={setPassword} w="" h="" />
				{
					route === `/${user}/login`
						? <div className="text-[#f1e9e9] ml-24 mt-5 text-sm">Don't have an account? Sign up <Link className="underline" to={navTo}>here</Link></div>
						: <div className="text-[#f1e9e9] ml-24 mt-5 text-sm">Already have an account? Login <Link className="underline" to={navTo}>here</Link></div>
				}
				{/* NOTE FOR PASSWORD PLACEHOLDER: Chrome uses • whereas other browsers use ● */}
				{/* https://stackoverflow.com/questions/6859727/styling-password-fields-in-css */}
				<ThinGradientButton text="Continue" margin="mt-10" w="w-[23em]" onClick={submit} />
			</div>
		</div>
	);
}