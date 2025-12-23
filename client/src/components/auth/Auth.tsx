'use client'

import React from 'react';
import styles from "./auth.module.scss";
import Link from 'next/link';
import Image from 'next/image';
import { MdLogin } from 'react-icons/md';
import HeroBackground from '@/components/svg/HeroBackground';
import { DefaultError, useMutation } from '@tanstack/react-query';
import { useSigninOptions, useSignupOptions } from '@/app/_requests/auth';
import Loader from '../elements/Loader';

interface IAuthProps {
    headTest: string;
    signin: boolean;
}

/**
 * Reference -> https://dribbble.com/shots/24671160-Fillianta-Sign-Up
 */

function Auth({ headTest, signin }: IAuthProps) {

    // Show error
    const signinMutation = useMutation<unknown, DefaultError, FormData>(useSigninOptions());
    const signupMutation = useMutation<unknown, DefaultError, FormData>(useSignupOptions());

    const handleAuth = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        if(signin){
            signinMutation.mutate(formData);
        }else{
            signupMutation.mutate(formData);
        }
    };

    // useEffect(() => {
    //     const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
    //         const [name, value] = cookie.split('=');
    //         acc[name] = value;
    //         return acc;
    //     }, {} as Record<string, string>);
    //     console.log(cookies.access_token);
        
    // }, [])

    if(signinMutation.isPending || signupMutation.isPending) return <Loader />

    return (
        <div className="d-flex w-100 h-100">
            <div className="col col-md-5 d-flex flex-column justify-content-center">
                <div className={`${styles.contentBox} shadow p-3 mb-5 bg-body-tertiary`}>
                    <Link className="navbar-brand mb-4" href="/">
                        <Image
                            height={100}
                            width={100}
                            alt="extra-detailers-logo"
                            src="/logo.png"
                            className={styles.headerLogo}
                        />
                    </Link>
                    <h2 className="mb-3">Get Started</h2>
                    <p className="mb-4">Welcome to Extradetailer - {headTest} </p>
                    <hr className="mb-4 border border-primary" />
                    <form onSubmit={handleAuth}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control border-primary" name="email" id="email" placeholder="Your Email" required />
                        </div>
                        {!signin && (<>
                            <div className="mb-3">
                                <label htmlFor="first_name" className="form-label">First Name</label>
                                <input type="text" className="form-control border-primary" name="first_name" id="first_name" placeholder="First Name" required={!signin} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="last_name" className="form-label">Last Name</label>
                                <input type="text" className="form-control border-primary" name="last_name" id="last_name" placeholder="Last Name" required={!signin} />
                            </div>
                            {/* Hidden input filed  */}
                            <input type="text" className="d-none" name="role" id="role" defaultValue="customer" required={!signin} />
                        </>)}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control border-primary" name="password" id="password" placeholder="Your Password" required />
                        </div>
                        {!signin && (
                            <div className="mb-3">
                                <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
                                <input type="password" className="form-control border-primary" name="confirm_password" id="confirm_password" placeholder="Confirm Password" required />
                            </div>
                        )}
                        {signin ? <>
                            <button type="submit" className="btn btn-primary w-100 mb-3"> Login <MdLogin /></button>
                            <p className="text-center mb-3">Don&apos;t have an account? <Link href="/signup">Register</Link></p>
                        </> : <>
                            <button type="submit" className="btn btn-primary w-100 mb-3"> Register <MdLogin /></button>
                            <p className="text-center mb-3">Already have an account? <Link href="/signin">Login</Link></p>
                        </>}
                        <p className="text-center mb-3">Password forgotten? <Link href="/forgotten-password">Reset</Link></p>
                    </form>
                </div>
            </div>
            <div className="col-md-7 d-none d-md-block position-relative" >
                <div className={`${styles.authCar} img-wrapper`} style={{ backgroundImage: "url(/imgs/auth-car.jpg)" }}>
                    <div className="position-absolute top-0 left-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ zIndex: 1 }}>
                        <h1 className={`${styles.heading} display-4 fw-bold text-start text-white  text-capitalize`}>From booking to <br /> <span className='text-primary'>a brilliant shine—your</span> <br /><span className='ms-5'>car&apos;s transformation</span> <br /> <span className='ms-5'>starts here!</span> </h1>
                    </div>
                    <div className="position-absolute top-0 left-0 w-100 h-100 overflow-hidden">
                        <HeroBackground />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth;