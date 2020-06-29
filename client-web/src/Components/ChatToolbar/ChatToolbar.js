import React, { useState } from "react";
import styles from "./ChatToolbar.module.css";
import { FaPhoneSlash, FaMicrophoneSlash, FaMicrophone, FaClosedCaptioning, FaExternalLinkAlt } from "react-icons/fa";

const ButtonItem = ({ Icon, title, onClick }) => {
  return (
    <div className={styles.button} onClick={onClick}>
      <div className={styles.title}>{title}</div>
      <Icon size="1.5em" />
    </div>
  );
};

const ChatToolbar = ({ onClick, isMuted }) => {
  const onClickHandler = (e, options) => {
    const parameters = { ...options, tool: e };
    onClick && onClick(parameters);
  };

  const muteTitle = isMuted ? "Unmute (not implemented yet)" : "Mute (not implemented yet)";
  const muteIcon = isMuted ? FaMicrophoneSlash : FaMicrophone;

  return (
    <div className={styles.container}>
      <ButtonItem Icon={FaPhoneSlash} title="End call" onClick={() => onClickHandler("endCall")} />
      <ButtonItem Icon={muteIcon} title={muteTitle} onClick={() => onClickHandler("mute")} />
      <ButtonItem
        Icon={FaClosedCaptioning}
        title="Captions (not implemented yet)"
        onClick={() => onClickHandler("subtitles")}
      />
      <ButtonItem
        Icon={FaExternalLinkAlt}
        title="Picture in Picture (not implemented yet)"
        onClick={() => onClickHandler("pip")}
      />
    </div>
  );
};

export default ChatToolbar;
