import { useState } from "react";
import HeaderNav from "./components/Header";
import styles from '../styles/Admin/admin.module.css';

export default function CallDetails() {
    const [alertData, setAlertData] = useState(false);
    const [alertDataBG, setAlertDataBG] = useState('');
    const [showAlertData, setshowAlertData] = useState("");

    return (
        <div style={{ minHeight: '100vh' }}>
            {alertData ?
                <div className={`alert alert-${alertDataBG} mb-0`} role="alert">
                    {showAlertData}
                </div>
                :
                <></>
            }
            <HeaderNav pageName='callDetails' />
            <div className={styles.ContainerWidth}>
                <div className="m-4">
                    <h1>Call Details</h1>
                </div>
            </div>
        </div>
    );
}
