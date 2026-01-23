import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

import { TOAST_CONFIG } from "@/configs/ToastConfig";
import { useMessageContext } from "@/hooks/useMessageContext";
import styles from "./Toast.module.css";

function Toast({ messageObject }) {
    const {
        id: messageId,
        type: messageType,
        content,
        duration,
    } = messageObject;
    const messageTypeConfig = TOAST_CONFIG[messageType];
    const { removeMessage } = useMessageContext();

    const [animationState, setAnimationState] = useState("enter");

    const exitDuration = 200;

    useEffect(() => {
        // 等待 duration 后，播放退出动画
        if (duration > 0 && animationState === "enter") {
            const timer = setTimeout(() => {
                setAnimationState("exit");
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [messageId, animationState, duration]);

    useEffect(() => {
        // 等待退出动画时长后，移除该条数据
        if (animationState === "exit") {
            const timer = setTimeout(() => {
                removeMessage(messageId);
            }, exitDuration);

            return () => clearTimeout(timer);
        }
    }, [messageId, animationState, removeMessage]);

    function handleClick() {
        setAnimationState("exit");
    }

    return (
        <div
            className={`${styles.toastItem} ${styles[messageTypeConfig.className]} ${animationState === "enter" ? styles.toastEnter : animationState === "exit" ? styles.toastExit : ""}`}
            data-id={messageId}
            onClick={handleClick}
        >
            <div className={styles.messageIcon}>
                <FontAwesomeIcon icon={`fas ${messageTypeConfig.iconName}`} />
            </div>
            <div className={styles.messageContent}>{content}</div>
        </div>
    );
}

export default Toast;
