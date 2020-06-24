import React from 'react';
import { Typography } from 'antd';
import styles from './Home.module.css';

const { Title } = Typography;

// declare types of accepted props
type TProps = {
  version?: string,
};

export const Home: React.FC<TProps> = ({...props}): JSX.Element => {

  return (
    <div className={styles.root}>
      <div style={{ textAlign: "center", margin: "10% 10%" }}>
        <Title>welcome to Insight investment</Title>
        <Title>Analysis Dashboard</Title>
        <Title level={3} style={{color: "#1890ff"}}>{props.version}</Title>
      </div>
    </div>
  );
}

// declare default values for props that are not explicitly declared
Home.defaultProps = {
  version: "beta",
}