// src/components/layout/Header.tsx
import React from 'react';
import ConnectWalletButton from '../wallet/ConnectWalletButton';
import styles from './Header.module.css'; // We'll create this CSS
import logo from "../../../src/assets/logo.png";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="Token Portfolio Logo" className={styles.logoImage} />
        Token Portfolio
      </div>
      <ConnectWalletButton />
    </header>
  );
};

export default Header;