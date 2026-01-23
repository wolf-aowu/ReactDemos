import { createPortal } from "react-dom";

import { useMessageContext } from "@/hooks/useMessageContext";
import Toast from "./Toast";
import styles from "./ToastList.module.css";

function ToastList() {
    const { messageQueue } = useMessageContext();

    return createPortal(
        <div className={styles.toastContainer}>
            {messageQueue.map((message) => (
                <Toast key={message.id} messageObject={message}></Toast>
            ))}
        </div>,
        document.body,
    );
}

export default ToastList;
