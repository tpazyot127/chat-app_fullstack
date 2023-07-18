import React from 'react';
import { NextPage } from 'next';
import Register from '../../components/Register';
import SEO from '../../components/SEO';
import { homeConfig } from '../../utils/config';

const LoginPage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="wrapper py-5">
        <Register />
      </main>
    </>
  );
};
export default LoginPage;
