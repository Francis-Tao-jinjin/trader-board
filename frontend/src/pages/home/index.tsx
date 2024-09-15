import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { UserDashboard } from '../../components/user-dashboard';
import { DefaultLandingPage } from '../../components/default-landing-page';

const Notification = styled.div`
  background-color: #ffcc00;
  color: #333;
  padding: 1rem;
  text-align: center;
`;

interface HomeProps {
  isLoggedIn: boolean;
  loadingUserInfo: boolean;
}

const Home: React.FC<HomeProps> = ({ isLoggedIn, loadingUserInfo }) => {

  const navigator = useNavigate();

  const NoneLoginNotice =  useMemo(() => (<Notification>
    Please log in to view your stocks. <button className='hover:underline' onClick={() => {
      navigator('/login');
    }}>Login</button>
  </Notification>), [navigator]);

  if (loadingUserInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {!isLoggedIn && NoneLoginNotice}
      {isLoggedIn ? (
        <UserDashboard/>
      ) : <DefaultLandingPage/>}
    </div>
  );
};

export default Home;