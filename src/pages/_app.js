import { Provider } from "react-redux";
import { store } from "../app/store";
import "../styles/globals.css";
import { Provider as AuthProvider } from "next-auth/client";
import ProgressBar from "@badrap/bar-of-progress";
import { Router } from "next/dist/client/router";

// implementing progress bar
const progress = new ProgressBar({
  size: 4,
  color: "#F59E0B",
  className: "z-50",
  delay: 100,
});

//Router has various event , for each event we we want to do the following
//When a route is clciked , it triggers routeChange start , on that we want the progressbar to start
Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

const MyApp = ({ Component, pageProps }) => {
  return (
    // wrap the entire app with AuthProvider . Pass pageProps.session as session. this will give access to our authenticated session to the entire app
    <AuthProvider session={pageProps.session}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </AuthProvider>
  );
};

export default MyApp;
