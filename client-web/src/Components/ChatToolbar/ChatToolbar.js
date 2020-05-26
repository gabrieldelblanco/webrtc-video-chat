import React from "react";
import styles from "./ChatToolbar.module.css";
import { FaPhoneSlash, FaMicrophoneSlash, FaClosedCaptioning, FaExternalLinkAlt } from "react-icons/fa";

const ButtonItem = ({ Icon, title, onClick }) => {
  return (
    <div className={styles.button} onClick={onClick}>
      <div className={styles.title}>{title}</div>
      <Icon size="1.5em" />
    </div>
  );
};

const ChatToolbar = ({ onClick }) => {
  const onClickHandler = (e) => {
    onClick && onClick(e);
  };

  return (
    <div className={styles.container}>
      <ButtonItem Icon={FaPhoneSlash} title="Cortar llamada" onClick={() => onClickHandler("endCall")} />
      <ButtonItem Icon={FaMicrophoneSlash} title="Apagar micrófono" onClick={() => onClickHandler("mute")} />
      <ButtonItem Icon={FaClosedCaptioning} title="Subtítulos" onClick={() => onClickHandler("subtitles")} />
      <ButtonItem Icon={FaExternalLinkAlt} title="Picture in Picture" onClick={() => onClickHandler("pip")} />
    </div>
  );
};

export default ChatToolbar;
