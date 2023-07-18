
//importing styles
import "../styles/index.css";
import React from "react";
import "../styles/bootstrap.min.css";
//importing utils
import { useStore } from "../redux";
import type { AppProps } from "next/app";
//importing components
import MainLayout from "../layouts/MainLayout";
import { Container } from "react-bootstrap";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function MyApp({ Component, pageProps }: AppProps) {
  const initialState = {
    ...pageProps.initialReduxState,
  };
  const store = useStore(initialState);

  return (
    <Provider store={store}>
      <MainLayout>
        <Container>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <Component {...pageProps} />
        </Container>
      </MainLayout>
    </Provider>
  );
}

export default MyApp;
