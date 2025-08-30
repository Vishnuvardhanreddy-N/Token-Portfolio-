import React from 'react';
import Header from './components/layout/Header';
import Home from './Home';

import styles from './App.module.css';

const App: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <Header />
      <main className={styles.mainContent}>
        <Home />
      </main>
    </div>
  );
};

export default App;