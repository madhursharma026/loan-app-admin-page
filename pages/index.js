import moment from 'moment-timezone';
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import HeaderNav from "./components/Header";
import { useLazyQuery } from "@apollo/client";
import { FETCH_USERS_DETAILS } from "./api/query";
import styles from "../styles/Admin/admin.module.css";

export default function Home() {
  const [alertData, setAlertData] = useState(false);
  const [alertDataBG, setAlertDataBG] = useState('');
  const [showAlertData, setshowAlertData] = useState("");
  const [allUserDetails, setAllUserDetails] = useState([]);
  const [fetchUserDetails] = useLazyQuery(FETCH_USERS_DETAILS);

  async function getAllUserDetails() {
    await fetchUserDetails({
      context: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('loanAppAuthToken')}`
        }
      }
    }).then(res => {
      setAllUserDetails(res.data.users)
    }).catch(err => {
      setAlertData(true)
      setAlertDataBG('danger')
      setshowAlertData(err?.message)
    });
  };

  useEffect(() => {
    getAllUserDetails()
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      {alertData ?
        <div className={`alert alert-${alertDataBG} mb-0`} role="alert">
          {showAlertData}
        </div>
        :
        <></>
      }
      <HeaderNav pageName='userDetails' />
      <div className={styles.ContainerWidth}>
        <div className="m-4">
          <h1 className='text-center mb-4'><u>User's Detail</u></h1>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className='text-center'>Id</th>
                <th>Title</th>
                <th>Status</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {allUserDetails.map((allUserDetails, index) => (
                <tr>
                  <td className='text-center'><b>{index + 1}</b></td>
                  <td>{allUserDetails.mobileNumber}</td>
                  <td>{allUserDetails.status}</td>
                  <td>{moment(new Date(Number(allUserDetails.createdAt))).format('YYYY-MM-DD HH:mm:ss')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
