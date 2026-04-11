import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function Auth() {
    const router = useRouter();
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [userLoginCard, setUserLoginCard] = useState(false);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    useEffect(() => {
        if (authState.loggedIn) {
            router.push("/dashboard");
        }
    }, [authState.loggedIn]);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            router.push("/dashboard");
        }
    }, []);


    useEffect(() => {
        dispatch(emptyMessage());
    }, [userLoginCard]);

    const handleRegister = () => {
        dispatch(registerUser({ name, username, email, password }));
    }

    const handleLogin = () => {
        dispatch(loginUser({ loginEmail, loginPassword }));
    }

    return (
        <>
            <div className="min-h-screen bg-zinc-100 pb-10">
                <div className="logo cursor-pointer py-4 px-6 md:px-20 lg:px-50 flex justify-center md:justify-start" onClick={() => { router.push("/") }}>
                    <img className="h-12 md:h-16" src="/Synapse_logo.png" alt="logo" />
                </div>
                <div className="flex flex-col items-center px-4 mt-4" >
                    <h1 className='text-2xl md:text-3xl font-medium mb-6 text-center'>
                        {userLoginCard === false ? "Join Synapse now — it's free!" : "Sign In"}
                    </h1>
                    {userLoginCard === false ?
                        <div className="flex flex-col items-center py-8 bg-white w-full max-w-[450px] h-auto min-h-[400px] rounded-xl p-6 md:p-10 shadow-md">
                            <div className='text-sm text-blue-500 mb-3 text-center' >{authState.message.message}</div>
                            <div className='w-full flex flex-col'>
                                <div className='flex flex-col w-full mb-4'>
                                    <label className='text-md' htmlFor="name">Name</label>
                                    <input className='border h-10 rounded-md px-3' type='text' placeholder='Enter your Name' id='name' value={name} onChange={(e) => { setName(e.target.value) }} />
                                </div>
                                <div className='flex flex-col w-full mb-4'>
                                    <label className='text-md' htmlFor="username">Username</label>
                                    <input className='border h-10 rounded-md px-3' type='text' placeholder='Enter Username' id='username' value={username} onChange={(e) => { setUsername(e.target.value) }} />
                                </div>
                                <div className='flex flex-col w-full mb-4'>
                                    <label className='text-md' htmlFor="email">Email</label>
                                    <input className='border h-10 rounded-md px-3' type='email' placeholder='Enter Your Email' id='email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
                                </div>
                                <div className='flex flex-col w-full mb-6'>
                                    <label className='text-md' htmlFor="password">Password</label>
                                    <input className='border h-10 rounded-md px-3' type='password' placeholder='Enter Password' id='password' value={password} onChange={(e) => { setPassword(e.target.value) }} />
                                </div>
                                <p className='text-xs text-gray-500 text-center mb-4'>By clicking Agree & Join or Continue, you agree to the Synapse User Agreement, Privacy Policy, and Cookie Policy.</p>
                                <div className="bg-blue-500 hover:bg-blue-600 text-white py-3 text-center rounded-full cursor-pointer transition-all" onClick={handleRegister}>
                                    Agree & Join
                                </div>
                                <p className='mt-6 text-center text-sm'>Already on Synapse? <span className='text-purple-600 cursor-pointer hover:underline' onClick={() => { setUserLoginCard(true) }} >Sign in</span></p>
                            </div>
                        </div> :

                        <div className="flex flex-col items-center py-8 bg-white w-full max-w-[400px] h-auto min-h-[400px] rounded-xl p-6 md:p-10 shadow-md">
                            <div className='text-sm text-blue-500 mb-3 text-center' >{authState.message.message}</div>
                            <div className='w-full flex flex-col'>
                                <div className='flex flex-col w-full mb-4'>
                                    <label className='text-md' htmlFor="email">Email</label>
                                    <input className='border h-10 rounded-md px-3' type='email' placeholder='Enter Your Email' id='email' value={loginEmail} onChange={(e) => { setLoginEmail(e.target.value) }} />
                                </div>
                                <div className='flex flex-col w-full mb-6'>
                                    <label className='text-md' htmlFor="password">Password</label>
                                    <input className='border h-10 rounded-md px-3' type='password' placeholder='Enter Password' id='password' value={loginPassword} onChange={(e) => { setLoginPassword(e.target.value) }} />
                                </div>
                                <p className='text-xs text-gray-500 text-center mb-4'>By clicking sign in, you agree to Synapse's User Agreement, Privacy Policy, and Cookie Policy.</p>
                                <div className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full transition-all text-center px-10 my-2 cursor-pointer" onClick={handleLogin}>
                                    Sign in
                                </div>
                                <p className='mt-4 text-center text-sm'>New to Synapse? <span className='text-purple-600 cursor-pointer hover:underline' onClick={() => { setUserLoginCard(false) }} >Join now</span></p>
                            </div>
                        </div>

                    }

                </div>
            </div>
        </>
    )
}

export default Auth;