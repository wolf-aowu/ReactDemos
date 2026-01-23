import Button from "@/components/Button";
import { ToastProvider } from "@/components/common/ToastProvider";
import ToastList from "./components/common/ToastList";
import styles from "./APP.module.css";

function App() {
    return (
        <ToastProvider>
            <div className={styles.backgroundContainer}>
                <div className={styles.container}>
                    <div className={styles.buttonRow}>
                        <Button
                            messageType="loading"
                            content="This is loading."
                        >
                            loading
                        </Button>
                        <Button
                            messageType="success"
                            content="This is success."
                        >
                            success
                        </Button>
                    </div>
                    <div className={styles.buttonRow}>
                        <Button messageType="info" content="This is info.">
                            info
                        </Button>
                        <Button
                            messageType="warning"
                            content="This is warning."
                        >
                            warning
                        </Button>
                        <Button messageType="error" content="This is error.">
                            error
                        </Button>
                    </div>
                </div>
            </div>
            <ToastList />
        </ToastProvider>
    );
}

export default App;
