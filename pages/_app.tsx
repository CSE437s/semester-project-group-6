import type { AppProps } from "next/app";
import Head from "next/head";
import { AuthUserProvider } from "../firebase/auth";
import "../styles/globals.css";
import MapLoader from "../components/mapLoader";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <MapLoader apiKey={"AIzaSyBffWM5IfZJ35qk-UNXUydS8RQTJpeM9x0"}>
        <AuthUserProvider>
          <Head>
            <title>Tripify</title>
          </Head>
          <Component {...pageProps} />
        </AuthUserProvider>
      </MapLoader>
    </>
  );
}

export default MyApp;
