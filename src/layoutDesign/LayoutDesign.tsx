import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Home, Equity } from "../views";
import { Layout, Menu, Input, Typography, Switch as ASwitch } from "antd";
import { HomeOutlined } from "@ant-design/icons";
// import 'antd/dist/antd.dark.css';
// import 'antd/dist/antd.css';
import styles from "./LayoutDesign.module.css";

const { Header, Footer, Content } = Layout;
const { Search } = Input;
const { Text } = Typography;

type TProps = {
  breakPoint: string | undefined;
};

type TState = {
  theme: boolean;
};

export default class LayoutDesign extends Component<TProps, TState> {
  constructor(props: TProps) {
    super(props);
    this.state = {
      theme: true,
    };
  }

  // function for light and dark theme switch handling, appends and removes style sheet to head
  themeSelector = () => {
    if (this.state.theme) {
      const theme = document.createElement("link");
      theme.setAttribute("id", "dark-theme");
      theme.setAttribute("type", "text/css");
      theme.setAttribute("rel", "stylesheet");
      theme.setAttribute("href", "theme/antd.dark.min.css");
      document.head.appendChild(theme);
      const current = document.getElementById("light-theme");
      current?.remove();
    } else {
      const theme = document.createElement("link");
      theme.setAttribute("id", "light-theme");
      theme.setAttribute("type", "text/css");
      theme.setAttribute("rel", "stylesheet");
      theme.setAttribute("href", "theme/antd.min.css");
      document.head.appendChild(theme);
      const current = document.getElementById("dark-theme");
      current?.remove();
    }
  };

  componentDidUpdate() {
    // theme switch toggle monitor
    this.themeSelector();
  }

  render() {
    return (
      <div className={styles.root}>
        <Router>
          <Layout className="layout">
            <Header className={styles.header}>
              <Menu mode="horizontal">
                <Text
                  strong
                  style={{ paddingLeft: "1rem", paddingRight: "2rem" }}
                >
                  Insight
                </Text>
                {this.props.breakPoint === "lg" ||
                this.props.breakPoint === "md" ? (
                  <Menu.Item
                    className={styles.disabled}
                    disabled
                    style={{ width: "60%" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <div>
                        <Search
                          placeholder="input search text"
                          onSearch={(value) => null}
                          style={{ width: "200px", marginRight: "2rem" }}
                        />
                      </div>
                      <div>
                        <ASwitch
                          checkedChildren={<Text strong>dark</Text>}
                          unCheckedChildren={<Text strong>light</Text>}
                          defaultChecked
                          onChange={() =>
                            this.setState({ theme: !this.state.theme })
                          }
                        />
                      </div>
                    </div>
                  </Menu.Item>
                ) : (
                  <Menu.Item className={styles.disabled} disabled>
                    <ASwitch
                      checkedChildren={<Text strong>dark</Text>}
                      unCheckedChildren={<Text strong>light</Text>}
                      defaultChecked
                      onChange={() =>
                        this.setState({ theme: !this.state.theme })
                      }
                    />
                  </Menu.Item>
                )}
                <Menu.Item key="home">
                  <Link to="/">
                    <HomeOutlined className={styles.menuIcons} />
                  </Link>
                </Menu.Item>
                <Menu.Item key="equity research">
                  <Link to="/EquityResearch">Equity Research</Link>
                </Menu.Item>
                <Menu.Item key="portfolio analysis">
                  <Link to="/PortfolioAnalysis">Portfolio Analysis</Link>
                </Menu.Item>
                <Menu.Item key="sentiment analysis">
                  <Link to="/SentimentAnalysis">Sentiment Analysis</Link>
                </Menu.Item>
              </Menu>
            </Header>

            <Layout>
              <Switch>
                <Content>
                  {/* HOME SECTION  */}
                  <Route exact path="/">
                    <Home />
                  </Route>

                  {/* EQUITY RESEARCH SECTION */}
                  <Route path="/EquityResearch">
                    <Equity breakpoint={this.props.breakPoint} />
                  </Route>

                  {/* PORTFOLIO ANALYSIS */}
                  <Route path="/PortfolioAnalysis">
                    <Layout>
                      <Content>Will be available in second release</Content>
                    </Layout>
                  </Route>

                  {/* SENTIMENT ANALYSIS */}
                  <Route path="/SentimentAnalysis">
                    <Layout>
                      <Content>Will be available in third release</Content>
                    </Layout>
                  </Route>
                </Content>
              </Switch>
            </Layout>

            <Footer style={{ textAlign: "center" }}>
              Insight ©{new Date(Date.now()).getFullYear()} | A visual approach
              to financial research
            </Footer>
          </Layout>
        </Router>
      </div>
    );
  }
}
