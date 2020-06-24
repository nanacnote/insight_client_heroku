import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SideBar, Selector, IncomeStatement, BalanceSheet, CashFlow, FinancialRatios } from "../../";
import {
  Typography,
  Layout,
  Space,
  Card,
  PageHeader,
  Col,
  Statistic,
  Descriptions,
  Row,
  Empty,
  Divider,
  Timeline,
  BackTop,
} from "antd";
import { companyListValue, getCompanyList } from "./equitySlice";
import {
  selectorValue_1,
  selectorValue_7,
} from "../../features/selector/selectorSlice";
import styles from "./Equity.module.css";
import {
  GlobalOutlined,
  CalendarOutlined,
  FormOutlined,
  ColumnWidthOutlined,
  CalculatorOutlined,
  MergeCellsOutlined,
  PoundCircleOutlined,
  UserOutlined,
  SettingOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Text, Paragraph } = Typography;

// declare typescript props type
type TProps = {
  user_name?: string;
};
// declare typescript state types
type TState = {
  isFetching: boolean;
  fetchStatus: number;
  d1: any;
  d2: any;
  sidebarSelected: string;
};
// ---API ROOT ADDRESS---
// const dataApiRootAddress = "https://insight-rest.herokuapp.com/data/";
const dataApiRootAddress = "http://localhost:3001/data/";

const sidebarItems:object[][] = [
  [
    {"Overview": <GlobalOutlined/>},
  ],
  [
    {"Income Statement": <CalendarOutlined/>},
    {"Balance Sheet": <FormOutlined/>},
    {"Cash Flow": <ColumnWidthOutlined/>},
  ],
  [
    {"Financial Ratios": <CalculatorOutlined/>},
    {"Discounted Cash Flow": <PoundCircleOutlined/>},
    {"Comparable Analysis": <MergeCellsOutlined/>},
  ],
  [
    {"User": <UserOutlined/>},
    {"Settings": <SettingOutlined/>},
  ]
]

export const Equity: React.FC<TProps> = ({ ...props }): JSX.Element => {
  // ---initialise redux store state values for slectors--
  // gets multiple state data from the selector's reducer
  const company_overview_data = useSelector(selectorValue_1);
  const company_current_stock_data = useSelector(selectorValue_7);

  // gets state data from the equity reducer and passes it to the selector
  // as props to display as list of companies when clicked
  const company_list = useSelector(companyListValue);

  // ---initialise redux store dispatcher and assign to dispatch variable for simplicity---
  const dispatch = useDispatch();

  // ---implementation of all useState hook---
  const [fetchStatus, setfetchStatus] = useState<TState["fetchStatus"]>();
  const [sidebarSelected, setsidebarSelected] = useState<TState["sidebarSelected"]>();
  // api data from redux store
  const [d1, setd1] = useState<TState["d1"]>(company_overview_data);
  const [d2, setd2] = useState<TState["d2"]>(company_current_stock_data);

  //---implementation of all useRef hooks---
  const overviewRef = useRef<HTMLDivElement>(null);
  const incomeStatementRef = useRef<HTMLDivElement>(null);
  const balanceSheetRef = useRef<HTMLDivElement>(null);
  const cashFlowRef = useRef<HTMLDivElement>(null);
  const financialRatiosRef = useRef<HTMLDivElement>(null);

  //sidebar ref dictionary mapping link name to its element ref (using useRef hook)
  const sidebarItemsRef: { [key: string]: any } = {
    "Overview": overviewRef,
    "Income Statement": incomeStatementRef,
    "Balance Sheet": balanceSheetRef,
    "Cash Flow": cashFlowRef,
    "Financial Ratios": financialRatiosRef,
  };

  // control what section is scrolled into view when a menu item is clicked on sidebar
  // it has a dictionary of "menu item value as key" : "and useRef to required section as value"
  const sideBarItemOnClick = (arg: { [key: string]: any }) => {
    sidebarItemsRef[`${arg?.key}`]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
    setsidebarSelected(undefined)
  };

  // function to determine the structure of the data coming in for the overview numbers
  // the numbers can be fetched from a scraper or the lse site api 
  // both returned objects are structured differently and this function parses the data to 
  // determine how to handle the object
  const $D = (arg1: string | number | React.ReactNode, arg2: string | number | React.ReactNode): any =>{
    return d2.data ? arg1 : arg2;
  }
  // implementation of useEffect hook
  // fetch company list data from api and dispatch results to redux store onn component mount
  useEffect(() => {
    let currentYearEnded = new Date(Date.now()).getFullYear() - 1;
    fetch(`${dataApiRootAddress}all_companies?period=${currentYearEnded}`)
      .then((res) => res.json())
      .then(
        (result) => {
          dispatch(getCompanyList(result));
        },
        (error) => {
          // catch fetch error here;
        }
      );
  }, [dispatch]);

  useEffect(() => {
    // pull api data and set state
    setd1(company_overview_data);
    setd2(company_current_stock_data);
    return () => {
      "insert side effect action here";
    };
  }, [
    company_overview_data,
    company_current_stock_data,
  ]);

  return (
    <div className={styles.root}>
      <BackTop />
      <Layout>
        {/* pull in sidebar feature from views features */}
        <SideBar
          items={sidebarItems}
          selected={sidebarSelected}
          clickHandler={sideBarItemOnClick}
        />
        <Content className={styles.content_section}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* pulls in selector feature which is used to select company search query */}
            <div className={styles.selector_feature}>
              <Selector
                api_root_address={dataApiRootAddress}
                placeholder="select a company"
                options_list={company_list}
                fetchCycle={(arg: number) => {
                  setfetchStatus(arg);
                }}
              />
            </div>

            {/* this section shows empty stage on load and if a company 
            selected it shows the overview information of the company
            it also shows a card loading animation while fetching*/}
            {fetchStatus === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>
                    <Text disabled>
                      Select a company to start |
                      <a href="/"> Quick tour of the dashboard</a>
                    </Text>
                  </span>
                }
              />
            ) : null}
            {fetchStatus === 1 ? <Card loading={true} /> : null}
            {fetchStatus === 2 ? (
              <React.Fragment>

                <div id="Overview" className={styles.overview_1} ref={overviewRef}>
                  <Card>
                    <PageHeader
                      title={d1.company_name?.toUpperCase()}
                      subTitle={$D(d2.data?.ticker_description, d2.name)}
                      extra={[
                        <Text key={1}>LON: {$D(d2.data?.ticker_name, d2?.tidm)}</Text>,
                        <span key={2}>
                          <Text>
                            {$D 
                            (
                              <React.Fragment>
                                <Text mark key={2_1}>
                                £ {d2.data?.market_cap} million 
                                </Text>| market cap
                              </React.Fragment>
                            , 
                              <React.Fragment>
                                <Text mark key={2_1}>
                                £ {d2.marketcapitalization?.toLocaleString()}
                                </Text> | market cap
                              </React.Fragment>
                            )
                            }
                          </Text>
                        </span>,
                      ]}
                    >
                      <Divider />
                      <Row gutter={[16, 16]}>
                        {/* price main quote */}
                        <Col sm={24} lg={8}>
                          <Statistic
                            title="Last Price"
                            value={$D(d2.data?.last_price, d2.lastprice)}
                            precision={2}
                            prefix="£"
                            suffix=""
                          />
                          <Statistic
                            title="Change"
                            value={$D(d2.data?.price_change, d2.percentualchange)}
                            precision={2}
                            valueStyle={{
                              color:
                              String($D(d2.data?.price_change, d2.percentualchange))?.charAt(0) === "-"
                                  ? "#cf1322"
                                  : "#3f8600",
                            }}
                            prefix={
                              String($D(d2.data?.price_change, d2.percentualchange))?.charAt(0) === "-" ? (
                                <ArrowDownOutlined />
                              ) : (
                                <ArrowUpOutlined />
                              )
                            }
                            suffix={
                              String($D(d2.data?.price_change, d2.percentualchange))?.charAt($D(d2.data?.price_change, d2.percentualchange).length - 1) === "%" ? null : "%"
                            }
                          />
                          <Statistic
                            title="Volume"
                            value={$D(d2.data?.volume, d2.volume)}
                          />
                        </Col>

                        {/* price other quotes */}
                        <Col sm={24} lg={16} >
                          <Descriptions layout="vertical" size="middle" style={{textAlign: "left"}}>
                            <Descriptions.Item label="Turnover">
                              {$D(d2.data?.turnover, d2?.turnover?.toLocaleString())}
                            </Descriptions.Item>
                            <Descriptions.Item label="Last Close Price">
                              {$D(d2.data?.last_close_price, d2.lastprice?.toLocaleString())}
                            </Descriptions.Item>
                            <Descriptions.Item label="Open Price">
                              {$D(d2.data?.open_price, d2.openingprice?.toLocaleString())}
                            </Descriptions.Item>
                            <Descriptions.Item label="High">
                              {$D(d2.data?.high_price, d2.high?.toLocaleString())}
                            </Descriptions.Item>
                            <Descriptions.Item label="Low">
                              {$D(d2.data?.low_price, d2.low?.toLocaleString())}
                            </Descriptions.Item>
                            <Descriptions.Item label="Bid">
                              {$D(d2.data?.bid_price, d2.bid?.toLocaleString())}
                            </Descriptions.Item>
                            <Descriptions.Item label="Offer">
                              {$D(d2.data?.offer_price, d2.offer?.toLocaleString())}
                            </Descriptions.Item>
                            <Descriptions.Item label="52 Week High">
                              {$D(d2.data?.high_52_week, "-")}
                            </Descriptions.Item>
                            <Descriptions.Item label="52 Week Low">
                              {$D(d2.data?.low_52_week, "-")}
                            </Descriptions.Item>
                            <Descriptions.Item label="1 Year Return">
                              {$D(d2.data?.one_year_return, "-")}
                            </Descriptions.Item>
                            <Descriptions.Item label="YTD">
                              {$D(d2.data?.ytd, "-")}
                            </Descriptions.Item>
                          </Descriptions>
                        </Col>
                      </Row>
                    </PageHeader>
                  </Card>
                </div>

                <div className={styles.overview_2}>
                  <Card>
                    <PageHeader
                      title={null}
                      subTitle={null}
                      extra={[
                        <Text key={1} strong style={{ fontSize: "1.25rem" }}>
                          Company Overview
                        </Text>,
                      ]}
                    >
                      <Divider style={{ paddingBottom: "20px" }} />
                      <Row gutter={[16, 16]}>
                        <Col sm={24} lg={8}>
                          <div style={{ textAlign: "right", paddingBottom: "20px" }}>
                            {`${Object.values(d1)[3]}`
                              .split("|")
                              .map((e, i) => {
                                return <Paragraph key={i}>{e}</Paragraph>;
                              })}
                          </div>
                        </Col>

                        <Col sm={24} lg={16}>
                          <div>
                            <Timeline mode="left">
                              <Timeline.Item
                                color="blue"
                                label={
                                  <Text strong style={{ fontSize: "1rem" }}>
                                    GICS Classification
                                  </Text>
                                }
                              >
                                <div>
                                  <Paragraph
                                    ellipsis={{
                                      rows: 4,
                                      expandable: true,
                                      symbol: "more",
                                    }}
                                  >
                                    {`${Object.values(d1)[4]}`
                                      .split("|")
                                      .map((e, i) => {
                                        return i === 0 ? e : ` > ${e}`;
                                      })}
                                  </Paragraph>
                                </div>
                              </Timeline.Item>
                              <Timeline.Item
                                color="red"
                                label={
                                  <Text strong style={{ fontSize: "1rem" }}>
                                    Revenue Center
                                  </Text>
                                }
                              >
                                <div>
                                  <ul>
                                    {`${Object.values(d1)[6]}`
                                      .split("|")
                                      .map((e, i) => {
                                        return <li key={i}>{e}</li>;
                                      })}
                                  </ul>
                                </div>
                              </Timeline.Item>
                              <Timeline.Item
                                color="green"
                                label={
                                  <Text strong style={{ fontSize: "1rem" }}>
                                    Region of Operation
                                  </Text>
                                }
                              >
                                <div>
                                  <ul>
                                    {`${Object.values(d1)[5]}`
                                      .split("|")
                                      .map((e, i) => {
                                        return <li key={i}>{e}</li>;
                                      })}
                                  </ul>
                                </div>
                              </Timeline.Item>
                              <Timeline.Item
                                color="grey"
                                label={
                                  <Text strong style={{ fontSize: "1rem" }}>
                                    Company Leardership
                                  </Text>
                                }
                              >
                                <div>
                                  <ul>
                                    {`${Object.values(d1)[8]}`
                                      .split("|")
                                      .map((e, i) => {
                                        return (
                                          <li key={i}>
                                            {e.replace(":", " - ")}
                                          </li>
                                        );
                                      })}
                                  </ul>
                                </div>
                              </Timeline.Item>
                              <Timeline.Item
                                color="blue"
                                label={
                                  <Text strong style={{ fontSize: "1rem" }}>
                                    Major Shareholders
                                  </Text>
                                }
                              >
                                <div>
                                  <ul>
                                    {`${Object.values(d1)[9]}`
                                      .split("|")
                                      .map((e, i) => {
                                        return (
                                          <li key={i}>
                                            {e.replace(":", " - ")}
                                          </li>
                                        );
                                      })}
                                  </ul>
                                </div>
                              </Timeline.Item>
                              <Timeline.Item
                                color="red"
                                label={
                                  <Text strong style={{ fontSize: "1rem" }}>
                                    Competitors
                                  </Text>
                                }
                              >
                                <div>
                                  <Paragraph
                                    ellipsis={{
                                      rows: 4,
                                      expandable: true,
                                      symbol: "more",
                                    }}
                                  >
                                    {`${Object.values(d1)[7]}`
                                      .split("|")
                                      .map((e, i) => {
                                        return i === 0 ? e : ` | ${e}`;
                                      })}
                                  </Paragraph>
                                </div>
                              </Timeline.Item>
                            </Timeline>
                          </div>
                        </Col>
                      </Row>
                    </PageHeader>
                  </Card>
                </div>
                
                {/* this section shows the income statement feature when a company is selected */}
                <div
                  id="Income_Statement"
                  className={styles.income_statement_feature}
                  ref={incomeStatementRef}
                >
                  <IncomeStatement/>
                </div>

                {/* this section shows the balance sheet feature when a company is selected */}
                <div
                  id="Balance_Sheet"
                  className={styles.balance_sheet_feature}
                  ref={balanceSheetRef}
                >
                  <BalanceSheet/>
                </div>

                {/* this section shows the cash flow feature when a company is selected */}
                <div
                  id="Cash_Flow"
                  className={styles.cash_flow}
                  ref={cashFlowRef}
                >
                  <CashFlow/>
                </div>

                {/* this section shows the financial ratios feature when a company is selected */}
                <div
                  id="Financial_Ratios"
                  className={styles.financial_ratios}
                  ref={financialRatiosRef}
                >
                  <FinancialRatios/>
                </div>
                
              </React.Fragment>
            ) : null}
          </Space>
        </Content>
      </Layout>
    </div>
  );
};

// declare default values for props that are not explicitly declared
Equity.defaultProps = {
  user_name: "Guest User",
};
