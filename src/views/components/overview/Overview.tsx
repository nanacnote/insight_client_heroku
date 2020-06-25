import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  selectorValue_1,
  selectorValue_7,
} from "../../features/selector/selectorSlice";
import {
  Typography,
  Card,
  PageHeader,
  Col,
  Statistic,
  Descriptions,
  Row,
  Divider,
  Timeline,
  Space,
} from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

import styles from "./Overview.module.css";

const { Text, Paragraph } = Typography;

// declare typescript props type
type TProps = {
    breakpoint: string | undefined
};
// declare typescript state types
type TState = {
  d1: any;
  d2: any;
};

export const Overview: React.FC<TProps> = ({ ...props }): JSX.Element => {
  // ---initialise redux store state values for slectors--
  // gets multiple state data from the selector's reducer
  const company_overview_data = useSelector(selectorValue_1);
  const company_current_stock_data = useSelector(selectorValue_7);

  // api data from redux store
  const [d1, setd1] = useState<TState["d1"]>(company_overview_data);
  const [d2, setd2] = useState<TState["d2"]>(company_current_stock_data);

  // function to determine the structure of the data coming in for the overview numbers
  // the numbers can be fetched from a scraper or the lse site api
  // both returned objects are structured differently and this function parses the data to
  // determine how to handle the object
  const $D = (
    arg1: string | number | React.ReactNode,
    arg2: string | number | React.ReactNode
  ): any => {
    return d2.data ? arg1 : arg2;
  };

  useEffect(() => {
    // pull api data and set state
    setd1(company_overview_data);
    setd2(company_current_stock_data);
    return () => {
      "insert side effect action here";
    };
  }, [company_overview_data, company_current_stock_data]);

  return (
    <div className={styles.root}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div className={styles.overview_1}>
        <Card>
          <PageHeader
            title={d1.company_name?.toUpperCase()}
            subTitle={$D(d2.data?.ticker_description, d2.name)}
            extra={[
              <Text key={1}>LON: {$D(d2.data?.ticker_name, d2?.tidm)}</Text>,
              <span key={2}>
                <Text>
                  {$D(
                    <React.Fragment>
                      <Text mark key={2_1}>
                        £ {d2.data?.market_cap} million
                      </Text>
                      | market cap
                    </React.Fragment>,
                    <React.Fragment>
                      <Text mark key={2_1}>
                        £ {d2.marketcapitalization?.toLocaleString()}
                      </Text>{" "}
                      | market cap
                    </React.Fragment>
                  )}
                </Text>
              </span>,
            ]}
          >
            <Divider />
            <Row gutter={[16, 16]}>
              {/* price main quote */}
              <Col lg={8}>
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
                      String(
                        $D(d2.data?.price_change, d2.percentualchange)
                      )?.charAt(0) === "-"
                        ? "#cf1322"
                        : "#3f8600",
                  }}
                  prefix={
                    String(
                      $D(d2.data?.price_change, d2.percentualchange)
                    )?.charAt(0) === "-" ? (
                      <ArrowDownOutlined />
                    ) : (
                      <ArrowUpOutlined />
                    )
                  }
                  suffix={
                    String(
                      $D(d2.data?.price_change, d2.percentualchange)
                    )?.charAt(
                      $D(d2.data?.price_change, d2.percentualchange)?.length - 1
                    ) === "%"
                      ? null
                      : "%"
                  }
                />
                <Statistic
                  title="Volume"
                  value={$D(d2.data?.volume, d2.volume)}
                />
              </Col>

              {/* price other quotes */}
              <Col lg={16}>
                <Descriptions
                  layout="vertical"
                  size="middle"
                  style={{ textAlign: "left" }}
                >
                  <Descriptions.Item label="Turnover">
                    {$D(d2.data?.turnover, d2?.turnover?.toLocaleString())}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Close Price">
                    {$D(
                      d2.data?.last_close_price,
                      d2.lastprice?.toLocaleString()
                    )}
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
              <Col lg={8}>
                <div 
                  style={{
                    textAlign: props.breakpoint === "lg" || props.breakpoint === "md" ? "right": "left",
                    paddingBottom: "20px",
                  }}
                >
                  {`${Object.values(d1)[3]}`.split("|").map((e, i) => {
                    return <Paragraph key={i}>{e}</Paragraph>;
                  })}
                </div>
              </Col>

              <Col lg={16}>
                <div>
                { props.breakpoint === "lg" || props.breakpoint === "md" ?
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
                          {`${Object.values(d1)[4]}`.split("|").map((e, i) => {
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
                          {`${Object.values(d1)[6]}`.split("|").map((e, i) => {
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
                          {`${Object.values(d1)[5]}`.split("|").map((e, i) => {
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
                          {`${Object.values(d1)[8]}`.split("|").map((e, i) => {
                            return <li key={i}>{e.replace(":", " - ")}</li>;
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
                          {`${Object.values(d1)[9]}`.split("|").map((e, i) => {
                            return <li key={i}>{e.replace(":", " - ")}</li>;
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
                          {`${Object.values(d1)[7]}`.split("|").map((e, i) => {
                            return i === 0 ? e : ` | ${e}`;
                          })}
                        </Paragraph>
                      </div>
                    </Timeline.Item>
                  </Timeline>
                  
                  :

                  <Timeline>
                    <Timeline.Item
                      color="blue"
                    >
                      <div>
                        <Text strong style={{ fontSize: "1rem" }}>
                          GICS Classification
                        </Text>
                        <Paragraph
                          ellipsis={{
                            rows: 4,
                            expandable: true,
                            symbol: "more",
                          }}
                        >
                          {`${Object.values(d1)[4]}`.split("|").map((e, i) => {
                            return i === 0 ? e : ` > ${e}`;
                          })}
                        </Paragraph>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      color="red"
                    >
                      <div>
                        <Text strong style={{ fontSize: "1rem" }}>
                          Revenue Center
                        </Text>
                        <ul>
                          {`${Object.values(d1)[6]}`.split("|").map((e, i) => {
                            return <li key={i}>{e}</li>;
                          })}
                        </ul>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      color="green"
                    >
                      <div>
                        <Text strong style={{ fontSize: "1rem" }}>
                          Region of Operation
                        </Text>
                        <ul>
                          {`${Object.values(d1)[5]}`.split("|").map((e, i) => {
                            return <li key={i}>{e}</li>;
                          })}
                        </ul>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      color="grey"
                    >
                      <div>
                        <Text strong style={{ fontSize: "1rem" }}>
                          Company Leardership
                        </Text>
                        <ul>
                          {`${Object.values(d1)[8]}`.split("|").map((e, i) => {
                            return <li key={i}>{e.replace(":", " - ")}</li>;
                          })}
                        </ul>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      color="blue"
                    >
                      <div>
                        <Text strong style={{ fontSize: "1rem" }}>
                          Major Shareholders
                        </Text>
                        <ul>
                          {`${Object.values(d1)[9]}`.split("|").map((e, i) => {
                            return <li key={i}>{e.replace(":", " - ")}</li>;
                          })}
                        </ul>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      color="red"
                    >
                      <div>
                        <Text strong style={{ fontSize: "1rem" }}>
                          Competitors
                        </Text>
                        <Paragraph
                          ellipsis={{
                            rows: 4,
                            expandable: true,
                            symbol: "more",
                          }}
                        >
                          {`${Object.values(d1)[7]}`.split("|").map((e, i) => {
                            return i === 0 ? e : ` | ${e}`;
                          })}
                        </Paragraph>
                      </div>
                    </Timeline.Item>
                  </Timeline>
                  }
                </div>
              </Col>
            </Row>
          </PageHeader>
        </Card>
      </div>
      </Space>
    </div>
  );
};
