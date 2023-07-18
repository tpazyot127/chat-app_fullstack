import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  useLocalStorage,
  useUserActions,
} from '../hooks';
import { useEffect } from 'react';

const MainLayout: React.FC = ({ children }: any) => {
  const accessToken = useLocalStorage('', 'accessToken');
  const { getCurrentUser } = useUserActions();
  
 
  useEffect(() => {
    if (accessToken.length > 0) {
      getCurrentUser(accessToken);
    }
  }, [accessToken]);

  return (
    <div className="app__container">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
