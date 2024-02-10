import Link from 'next/link';
import { Nav } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { isAuthenticated } from '../AuthCheck/auth';
import styles from '.././../styles/Header/Header.module.css';

function HeaderNav(props) {
    const router = useRouter();
    const [userLogin, setUserLogin] = useState(false)

    function logoutUser() {
        router.push('/login');
    }
    useEffect(() => {
        if (isAuthenticated()) {
            setUserLogin(true)
        }
    })

    return (
        <div className={`${styles.HeaderStyle} py-4 px-3`}>
            <div className={`${styles.ContainerWidth} px-4`}>
                <Navbar expand="lg">
                    <h3 className='text-white'>Loan App</h3>
                    {(userLogin) ?
                        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ background: 'white' }} />
                        :
                        <></>
                    }
                    <Navbar.Collapse className="justify-content-end">
                        <Nav className={styles.navOptionsBeforeLGScrn}>
                            {(userLogin) ?
                                <>
                                    <Link href='/' className={`${props.pageName === 'userDetails' ? styles.activeLink : styles.unActiveLink} text-white mx-2`}>User Details</Link>
                                    <Link href='/callDetails' className={`${props.pageName === 'callDetails' ? styles.activeLink : styles.unActiveLink} text-white mx-2`}>Call Details</Link>
                                    <span onClick={() => logoutUser()} style={{ cursor: 'pointer' }} className={`${props.pageName === 'Logout' ? styles.activeLink : styles.unActiveLink} text-white mx-2`}>Logout</span>
                                </>
                                :
                                <></>
                            }
                        </Nav>
                        <Nav className={styles.navOptionsAfterLGScrn}>
                            {(userLogin) ?
                                <>
                                    <Link href='/' className={`${props.pageName === 'userDetails' ? styles.activeLink : styles.unActiveLink} text-white mx-2 py-2 mt-3`} style={{ display: 'block' }}>User Details</Link>
                                    <Link href='/callDetails' className={`${props.pageName === 'callDetails' ? styles.activeLink : styles.unActiveLink} text-white mx-2 py-2`} style={{ display: 'block' }}>Call Details</Link>
                                    <span onClick={() => logoutUser()} style={{ cursor: 'pointer' }} className={`${props.pageName === 'Logout' ? styles.activeLink : styles.unActiveLink} text-white mx-2`}>Logout</span>
                                </>
                                :
                                <></>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        </div>
    );
}

export default HeaderNav;

