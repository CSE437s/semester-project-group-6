import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import PurpleImage from '../public/purple.png';
import HomeImage from '../public/Home.jpg';
import { useLoadScript } from "@react-google-maps/api";
import Map from "./map";
import styles from './Home.module.css';

import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, CircularProgress, Container, Dialog, Typography } from '@mui/material';
import { useAuth } from '../firebase/auth';
import { auth } from '../firebase/firebase';

export default function Home() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBffWM5IfZJ35qk-UNXUydS8RQTJpeM9x0",
    libraries: ["places"],
  });

  const { authUser, isLoading } = useAuth();
  const router = useRouter();
  const [login, setLogin] = useState(false);

  useEffect(() => {
    if (!isLoading && authUser) {
      router.push('/dashboard');
    }
  }, [authUser, isLoading]);

  const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: '/dashboard',
    signInOptions: [
      EmailAuthProvider.PROVIDER_ID,
      GoogleAuthProvider.PROVIDER_ID
    ]
  };
  
  return(
    
    <>
        <Head>
          <title>Tripify</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
     
      <main>
        {/* Hero section */}
        <div className={styles.container}>
          <div className={styles.overlapImage}>
            <Image
              src={PurpleImage}
              alt="purpleDot"
              width={300} 
              height={300}
              layout="fixed"
            />
          </div>
          <div className={styles.textContainer}>
            <h1>&quot;Tripify&quot;</h1>
            <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: "25px", fontWeight: "400" }}>don’t let your plans die in the chat</p>
            <div className={styles.buttons}>
              <Button onClick = {() => setLogin(true)} variant="contained" size="large"> Login</Button>
            </div>
          </div>
          <div className={styles.container}>
            <Image
              src={HomeImage}
              alt="Person with a bag"
              width={567} 
              height={750}
              layout="fixed"
            />
          </div>
        </div>

        <Dialog onClose={() => setLogin(false)} open={login}>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}/>
        </Dialog>
      </main>
    </>
  );
}
