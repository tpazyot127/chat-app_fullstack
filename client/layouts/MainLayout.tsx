import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  useLocalStorage,
  useTypedSelector,
  useUserActions,
} from '../hooks';
import { useEffect } from 'react';

const MainLayout: React.FC = ({ children }: any) => {
  const user = useLocalStorage("", "userDatas");
  const { getCurrentUser } = useUserActions();
 
  useEffect(() => {
    if (user) {
      const data = JSON.parse(user);
      getCurrentUser(data._id);
    }
  }, [user]);

  return (
    <div className="app__container">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
