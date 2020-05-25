import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Loading from "./Components/Loading";

import "./App.css";

const Home = lazy(() => import("./Screens/Home/Home"));
const Chat = lazy(() => import("./Screens/Chat/Chat"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/chat/:id">
            <Chat />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
