import { createContext } from "react";

// createContext 实际返回的是一个组件，所以以大写开头的驼峰命名
const MessageContext = createContext();

export default MessageContext;
