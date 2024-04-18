import React, { useEffect } from "react";
import Head from 'next/head';
import { useRouter } from "next/router";
import useAuth from '../firebase/auth';
import AppAppBar from '../components/AppAppBar';
import { ActivityInfo, TripCardData } from '../CustomTypes';
import Trending from '../components/Trending';

export default function Dashboard() {
    const { authUser, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !authUser) {
            router.push('/');
        }
    }, [isLoading, authUser, router]);

    // Dummy fetchTripData function
    const fetchTripData = async (tripId: string) => {
        // Implementation logic for fetching trip data
    };

    // Dummy setTripData function
    const setTripData = (data: React.SetStateAction<TripCardData>) => {
        // Implementation logic for setting trip data
    };

    // Placeholder for toggleColorMode function
    const toggleColorMode = () => {
        // Implementation logic for toggling color mode
    };

    // Assuming authUser might have a profilePicURL property

    return (
        <>
            <Head>
                <title>Dashboard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <AppAppBar 
                    fetchTripData={fetchTripData}
                    setTripData={setTripData}
                    curTripData={{} as TripCardData}
                    mode="light"
                    toggleColorMode={toggleColorMode}
                />
                <Trending />
            </main>
        </>
    );
}
