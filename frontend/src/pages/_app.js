import "@/styles/globals.css";
import { store } from "@/config/redux/store";
import { Provider } from "react-redux";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Synapse</title>
        <link rel="icon" href="/Synapse_favicon.png"  />
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
