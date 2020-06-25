import React from 'react';
import LayoutDesign from './layoutDesign/LayoutDesign';
import { useBreakPoint } from './hooks';
import styles from './App.module.css';


function App() {
  return (
    <div className={styles.root}>
      <LayoutDesign
        breakPoint= {useBreakPoint()}
      />
    </div>
  );
}

export default App;
