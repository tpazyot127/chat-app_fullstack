import React from 'react';
import { homeConfig } from '../utils/config';
import { NextPage } from 'next';
//importing components
import SEO from '../components/SEO';
import Dashboard from '../components/Dashboard';

const HomePage: NextPage = () => {
  return (
    <>
      <SEO {...homeConfig} />
      <main className="wrapper py-5">
        <Dashboard />
      </main>
    </>
  );
};

export default HomePage;
