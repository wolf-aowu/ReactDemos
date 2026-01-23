import { useContext } from "react";
import MessageContext from "@/components/common/MessageContext";

// 使用 useContext 钩子是为了不用通过 props 将参数向一个个下级组件传递，而是在需要用到的下级组件可以直接使用
// 使用 useContext 获取 context 就不再需要对消费组件使用 MessageContext.Consumer 进行包裹了。
export const useMessageContext = () => useContext(MessageContext);
