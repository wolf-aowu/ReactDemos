import { useState } from "react";

import { TOAST_CONFIG } from "@/configs/ToastConfig";
import MessageContext from "@/components/common/MessageContext";

export function ToastProvider({ children }) {
    const [messageQueue, setMessageQueue] = useState([]);
    const [messageId, setMessageId] = useState(0);

    const addMessage = ({ type, content, duration }) => {
        const message = {
            id: messageId,
            type,
            content,
            duration: duration === undefined ? TOAST_CONFIG.duration : duration,
        };
        setMessageId(messageId + 1);
        setMessageQueue([...messageQueue, message]);
    };

    const removeMessage = (messageId) => {
        setMessageQueue(
            messageQueue.filter(
                (messageObject) => messageObject.id != messageId,
            ),
        );
    };

    return (
        <MessageContext.Provider
            value={{
                messageQueue,
                addMessage,
                removeMessage,
            }}
        >
            {children}
        </MessageContext.Provider>
    );
}
export default ToastProvider;
