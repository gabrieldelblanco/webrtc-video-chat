import React from "react";
import { useHistory } from "react-router-dom";

import { createRoom } from "../../Apis/chat";

import Background from "../../Components/Backround/BackgroundParticles";
import styles from "./home.module.css";

import Loader from "react-spinners/PropagateLoader";

const Home = () => {
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  let history = useHistory();

  const onSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const response = await createRoom();
    setIsLoading(false);

    if (response.success) {
      history.push(`/chat/${response.id}`);
    } else {
      setError(response.error.message);
    }
  };

  return (
    <>
      <Background />
      <form className={styles.form}>
        <button type="submit" onClick={onSubmit} className={styles.button}>
          Comenzar llamada
        </button>
        {error && <div className={styles.error}>{error}</div>}
        {isLoading && (
          <div className={styles.loading}>
            <Loader color="#ffffff" />
          </div>
        )}
      </form>
    </>
  );
};

export default Home;
