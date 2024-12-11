import styles from "./LoadingSpinner.module.css";
import {PiSpinnerGapDuotone} from "react-icons/pi";

const LoadingSpinner = () => {
    return (
        <div className={`flex flex-row ${styles.container}`}>
            <div className="w-1/2 h-[50vh] m-auto">
                <PiSpinnerGapDuotone className={styles.spinner} />
            </div>
        </div>
    );
}

export default LoadingSpinner;