import { useMessageContext } from "@/hooks/useMessageContext";
import styles from "./Button.module.css";

function Button({ messageType, content, children }) {
    const { addMessage } = useMessageContext();

    function handleClick() {
        addMessage({ type: messageType, content: content });
    }

    return (
        <button
            className={`${styles.btn} ${styles[`${messageType}Btn`]}`}
            onClick={handleClick}
        >
            {children}
        </button>
    );
}
export default Button;
