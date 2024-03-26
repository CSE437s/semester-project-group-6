import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Profile from '../components/profile';
import Trips from '../components/trip'
import useAuth from '../firebase/auth'
import useFirebaseAuth from '../firebase/auth';
import router from 'next/router';
import Trending from '../components/Trending'
import Chat from '../components/Chat';
import React, { useEffect, useState } from "react";
import AppAppBar from '../components/AppAppBar';
import { ActivityInfo, TripCardData } from '../CustomTypes';

export default function Dashboard() {
    const {authUser, isLoading} = useAuth();
    useEffect(() => {
        if (!isLoading && !authUser) {
            router.push('/');
        }
    })
    
    return (
        <>
        <Head>
            <title>Dashboard</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
            <AppAppBar fetchTripData={{} as (tripId: string) => Promise<void>} setTripData={{} as React.Dispatch<React.SetStateAction<TripCardData | undefined>>} curTripData={{} as TripCardData} mode={'light'} toggleColorMode={function (): void {
                    throw new Error('Function not implemented.');
            } }/>
            <Trending/>
        </main>
        </>
    )

    

}