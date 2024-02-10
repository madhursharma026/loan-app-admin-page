import Link from 'next/link';
import { useRouter } from "next/router";
import Footer from './components/Footer';
import HeaderNav from './components/Header';
import { useEffect, useState } from "react";
import { FETCH_ADMIN_DETAILS } from './api/query';
import { isAuthenticated } from "./AuthCheck/auth";
import styles from '../styles/Login/login.module.css';
import { useLazyQuery, useMutation } from "@apollo/client";
import { ADMIN_LOGIN_VERIFICATION, FIRST_STEP_ADMIN_LOGIN } from './api/mutation';

const Login = () => {
    const router = useRouter();
    const [alertData, setAlertData] = useState(false);
    const [alertDataBG, setAlertDataBG] = useState('');
    const [OTPCodeValue, setOTPCodeValue] = useState('');
    const [showAlertData, setshowAlertData] = useState("");
    const [phoneNumberValue, setPhoneNumberValue] = useState('');
    const [fetchAdminDetails] = useLazyQuery(FETCH_ADMIN_DETAILS);
    const [firstStepAdminLogin] = useMutation(FIRST_STEP_ADMIN_LOGIN);
    const [showOTPInputField, setShowOTPInputField] = useState(false);
    const [errorMessageOTPCode, setErrorMessageOTPCode] = useState(false);
    const [adminLoginVerification] = useMutation(ADMIN_LOGIN_VERIFICATION);
    const [errorMessagePhoneNumber, setErrorMessagePhoneNumber] = useState(false);

    useEffect(() => {
        if (isAuthenticated()) {
            router.push('/');
        }
    }, []);

    async function generateOTP(e) {
        e.preventDefault()
        if (phoneNumberValue.length === 10) {
            setErrorMessagePhoneNumber('')
            await firstStepAdminLogin({
                variables: {
                    firstStepLoginInput: {
                        mobileNumber: phoneNumberValue,
                    }
                }
            }).then(async (res) => {
                setAlertData(true)
                setAlertDataBG('success')
                setshowAlertData('OTP Sent Successfully!')
                setShowOTPInputField(true)
            }).catch(error => {
                setAlertData(true)
                setAlertDataBG('danger')
                setshowAlertData(error?.message)
            });
        } else {
            setErrorMessagePhoneNumber('Invalid Phone Number')
        }
    }

    async function formSubmit(e) {
        e.preventDefault()
        await adminLoginVerification({
            variables: {
                loginVerificationInput: {
                    mobileNumber: phoneNumberValue,
                    otpCode: OTPCodeValue
                }
            }
        }).then(async (res1) => {
            setAlertData(true)
            setAlertDataBG('success')
            setshowAlertData('Login Successfully!')
            localStorage.setItem('loanAppAuthToken', res1.data.adminLoginVerification.jwtToken);
            await fetchAdminDetails({
                variables: {
                    mobileNumber: phoneNumberValue
                }, context: {
                    headers: {
                        Authorization: `Bearer ${res1.data.adminLoginVerification.jwtToken}`
                    }
                }
            }).then(async (res2) => {
                console.log(res2.data.admin.id)
                console.log(res2.data.admin.status)
                localStorage.setItem('loanAppLoginUserId', String(res2.data.admin.id));
                localStorage.setItem('loanAppLoginUserUserPosition', String(res2.data.admin.status));
                router.push('/')
            }).catch(error => {
                setErrorMessageOTPCode(error?.message)
            });
        }).catch(error => {
            setErrorMessageOTPCode(error?.message)
        });
    }

    useEffect(() => {
        setTimeout(function () {
            if (alertData === true) {
                setAlertData(false)
                if (showAlertData === 'Login Successfully!') {
                    router.push('/')
                }
            }
        }, 1000);
    },)

    return (
        <div style={{ minHeight: '80vh' }}>
            {alertData ?
                <div className={`alert alert-${alertDataBG} mb-0`} role="alert">
                    {showAlertData}
                </div>
                :
                <></>
            }
            <HeaderNav />
            <div className={styles.loginBody}>
                <div className={`${styles.ContainerWidth} px-4 pt-3`}>
                    <h5>Loan App</h5>
                    <div className="row pb-5">
                        <div className="col-lg-6 mt-5 pt-lg-5">
                            <h1 className={styles.heading}>Try Loan App for free</h1>
                            <h1 className={styles.subHeading}>Loan App Provide:</h1>
                            <ul>
                                <li><h1 className={styles.liStyle}>Detailed Credit Report</h1></li>
                                <li><h1 className={styles.liStyle}>Get Improvement Tips</h1></li>
                                <li><h1 className={styles.liStyle}>100% Safe & Secure</h1></li>
                            </ul>
                        </div>
                        <div className="col-lg-6 pt-lg-5 pt-3">
                            <div className={`card mt-lg-0 mt-3 p-3 ${styles.cardStyle}`}>
                                <div className="card-body">
                                    <h4 className="text-center mb-3"><b><u>Login Details</u></b></h4>
                                    <div className="mb-3">
                                        <label for="exampleInputPhoneNumber" className="form-label">Phone Number</label>
                                        <input type="text" disabled={showOTPInputField} className="form-control" id="exampleInputPhoneNumber" required value={phoneNumberValue} onChange={(e) => setPhoneNumberValue(e.target.value)} autoComplete='off' />
                                        {errorMessagePhoneNumber != '' ?
                                            <div id="emailHelp" class="form-text text-danger">Invalid Phone Number</div>
                                            :
                                            <></>
                                        }
                                    </div>
                                    {showOTPInputField ?
                                        <>
                                            <div className="mb-3">
                                                <label for="exampleInputOTPCode1" className="form-label">OTP Code</label>
                                                <input type="password" className="form-control" id="exampleInputOTPCode1" required value={OTPCodeValue} onChange={(e) => setOTPCodeValue(e.target.value)} autoComplete='off' />
                                            </div>
                                            {errorMessageOTPCode != '' ?
                                                <div id="emailHelp" class="form-text text-danger">{errorMessageOTPCode}</div>
                                                :
                                                <></>
                                            }
                                            <div className="text-center mb-3">
                                                <Link href='/signup'>Create Account? Signup</Link>
                                            </div>
                                            <button type="button" className="btn w-100" style={{ background: '#4825B3', color: 'white' }} onClick={(e) => formSubmit(e)}>Login</button>
                                        </>
                                        :
                                        <button type="button" className="btn w-100" style={{ background: '#4825B3', color: 'white' }} onClick={(e) => generateOTP(e)}>Generate OTP</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${styles.ContainerWidth} px-4 pt-5`}>
                <div className={styles.sampleLogo}>
                    <h5>Trusted by 60,000+ businesses</h5>
                    <div className="row">
                        <div className="col-6">
                            <div className="row">
                                <div className="col-4 mt-3">
                                    <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3ka006roxfn8s9sf1rw-aramex.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                                </div>
                                <div className="col-4 mt-3">
                                    <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3jr006qoxfnwd0h023t-orderin.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                                </div>
                                <div className="col-4 mt-3">
                                    <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3je00i94dfnjxnwpox0-bridgestone.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                                </div>
                                <div className="col-4 mt-3">
                                    <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3n400ia4dfnw9wxx748-decathlon.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                                </div>
                                <div className="col-4 mt-3">
                                    <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3mb003coffn6tocuww5-pearson.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                                </div>
                                <div className="col-4 mt-3">
                                    <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3jh003boffnft190fy5-cinnamon.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                                </div>
                                <div className="col-4 mt-3">
                                    <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3ka006roxfn8s9sf1rw-aramex.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                                </div>
                                <div className="col-4 mt-3">
                                    <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3jr006qoxfnwd0h023t-orderin.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                                </div>
                                <div className="col-4 mt-3">
                                    <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3je00i94dfnjxnwpox0-bridgestone.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                                </div>
                                <div className="col-4 mt-3">
                                    <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3n400ia4dfnw9wxx748-decathlon.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                                </div>
                                <div className="col-4 mt-3">
                                    <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3mb003coffn6tocuww5-pearson.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                                </div>
                                <div className="col-4 mt-3">
                                    <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3jh003boffnft190fy5-cinnamon.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                                </div>
                            </div>
                        </div>
                        <div className="col-6"></div>
                    </div>
                </div>

                <div className={styles.sampleLogoAfterLGScrn}>
                    <div className="row text-center">
                        <h5><b>Trusted by 60,000+ businesses</b></h5>
                        <div className="col-sm-4 col-6 mt-3">
                            <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3ka006roxfn8s9sf1rw-aramex.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                        </div>
                        <div className="col-sm-4 col-6 mt-3">
                            <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3jr006qoxfnwd0h023t-orderin.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                        </div>
                        <div className="col-sm-4 col-6 mt-3">
                            <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3je00i94dfnjxnwpox0-bridgestone.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                        </div>
                        <div className="col-sm-4 col-6 mt-3">
                            <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3n400ia4dfnw9wxx748-decathlon.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                        </div>
                        <div className="col-sm-4 col-6 mt-3">
                            <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3mb003coffn6tocuww5-pearson.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                        </div>
                        <div className="col-sm-4 col-6 mt-3">
                            <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3jh003boffnft190fy5-cinnamon.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                        </div>
                        <div className="col-sm-4 col-6 mt-3">
                            <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3ka006roxfn8s9sf1rw-aramex.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                        </div>
                        <div className="col-sm-4 col-6 mt-3">
                            <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3jr006qoxfnwd0h023t-orderin.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                        </div>
                        <div className="col-sm-4 col-6 mt-3">
                            <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3je00i94dfnjxnwpox0-bridgestone.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                        </div>
                        <div className="col-sm-4 col-6 mt-3">
                            <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3n400ia4dfnw9wxx748-decathlon.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                        </div>
                        <div className="col-sm-4 col-6 mt-3">
                            <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3mb003coffn6tocuww5-pearson.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                        </div>
                        <div className="col-sm-4 col-6 mt-3">
                            <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3jh003boffnft190fy5-cinnamon.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '70px' }}>
                <Footer />
            </div>
        </div>
    );
};

export default Login;

