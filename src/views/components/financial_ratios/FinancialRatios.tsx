import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import { useChartjsZoom } from "../../../hooks";
import {
  Space,
  Card,
  PageHeader,
  Typography,
  Divider,
  Row,
  Col,
  Select,
  Switch,
  Statistic,
} from "antd";
import { LineChartOutlined, PercentageOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import {
  selectorValue_2,
  selectorValue_3,
  selectorValue_4,
  selectorValue_5,
  selectorValue_6,
} from "../../features/selector/selectorSlice";
import styles from "./FinancialRatios.module.css";

const { Text, Title } = Typography;

// declare typescript props type
type TProps = {};
// declare typescript state types
type TState = {
  selectedItems: Array<string>;
  d1: { [key: string]: number };
  d2: { [key: string]: number };
  d3: { [key: string]: number };
  d4: { [key: string]: number };
  d5: { [key: string]: number };
  chartState: Array<string | undefined>;
};

// options to pass to selector
const selector_options_list = [
  `${new Date(Date.now()).getFullYear() - 1}`,
  `${new Date(Date.now()).getFullYear() - 2}`,
  `${new Date(Date.now()).getFullYear() - 3}`,
  `${new Date(Date.now()).getFullYear() - 4}`,
  `${new Date(Date.now()).getFullYear() - 5}`,
];

export const FinancialRatios: React.FC<TProps> = ({
  ...props
}): JSX.Element => {
  // ---initialise redux store state values for slectors--
  // gets multiple state data from the selector's reducer
  const current_financial_data: any = useSelector(selectorValue_2);
  const previous_year_financial_data: any = useSelector(selectorValue_3);
  const previous_two_years_financial_data: any = useSelector(selectorValue_4);
  const previous_three_years_financial_data: any = useSelector(selectorValue_5);
  const previous_four_years_financial_data: any = useSelector(selectorValue_6);

  // initialise all states below
  // api data from redux store
  const [d1, setd1] = useState<TState["d1"]>(current_financial_data?.ratios);
  const [d2, setd2] = useState<TState["d2"]>(
    previous_year_financial_data?.ratios
  );
  const [d3, setd3] = useState<TState["d3"]>(
    previous_two_years_financial_data?.ratios
  );
  const [d4, setd4] = useState<TState["d4"]>(
    previous_three_years_financial_data?.ratios
  );
  const [d5, setd5] = useState<TState["d5"]>(
    previous_four_years_financial_data?.ratios
  );
  // chart toggle state
  const [chartState, setchartState] = useState<TState["chartState"]>([]);
  // table selector state
  const [selectedItems, setselectedItems] = useState<TState["selectedItems"]>([
    selector_options_list[0],
    selector_options_list[1],
    selector_options_list[2],
    selector_options_list[3],
    selector_options_list[4],
  ]);

  // function to filter the selector item out of the options
  const filteredOptions = selector_options_list.filter(
    (e) => !selectedItems.includes(e)
  );

  // callback function when option is selected
  const onSelectorChange = (value: Array<string>) => {
    setselectedItems(value);
  };

  // switch toggle handler
  const onSwitch = (c: boolean, e: Event) => {
    let cn = (e.currentTarget as Element).className;
    if (c) {
      setchartState((prevArray) => [...prevArray, String(cn.match(/\d.?/g))]);
    } else {
      setchartState(
        chartState.filter((el) => el !== String(cn.match(/\d.?/g)))
      );
    }
  };

  // dictionary to map period to dataset
  const dict = {
    [selector_options_list[0]]: d1,
    [selector_options_list[1]]: d2,
    [selector_options_list[2]]: d3,
    [selector_options_list[3]]: d4,
    [selector_options_list[4]]: d5,
  };

  //array of ratios category and slice location in object entries data
  const ratiosCategory = [
    ["Liquidity Ratios", 8, 11],
    ["Leverage Financial Ratios", 11, 15],
    ["Efficiency Ratios", 15, 16],
    ["Profitability Ratios", 16, 20],
  ];

  //   function to help iterate over data coming in from store
  const dataIterator = (arg1: object): Array<[string, number]> => {
    return arg1 ? Object.entries(arg1) : [["null", null]];
  };

  // function to calculate bench mark performance
  const getBenchmark = (arg1: string, arg2: number): number => {
    let t: number;
    switch (arg1) {
      case "current_ratio":
        t = 1.55 - arg2;
        break;

      case "cash_ratio":
        t = 0.4 - arg2;
        break;

      case "operating_cash_flow_ratio":
        t = 1 - arg2;
        break;

      case "debt_ratio":
        t = 0.63 - arg2;
        break;

      case "debt_to_equity_ratio":
        t = 1.01 - arg2;
        break;

      case "net_interest_coverage_ratio":
        t = 1.94 - arg2;
        break;

      case "debt_service_coverage_ratio":
        t = 1.2 - arg2;
        break;

      // no benchmark
      case "asset_turnover_ratio":
        t = arg2;
        break;

      case "gross_margin_ratio":
        t = 0.4 - arg2;
        break;

      case "operating_margin_ratio":
        t = 0.08 - arg2;
        break;

      case "return_on_assets_ratio":
        t = 0.02 - arg2;
        break;

      case "return_on_equity_ratio":
        t = 0.03 - arg2;
        break;

      default:
        t = arg2;
        break;
    }
    return Math.round((t + Number.EPSILON) * 100) / 100;
  };

  // function to hadle barchart data distribution
  const getBarData = (arg1: Array<string>, arg2: any) => {
    let obj: { [key: string]: [] | {} } = {};

    obj["labels"] = Object.keys(d1)
      ?.slice(+arg2[1], +arg2[2])
      .map((e, i) => e.replace(/_/g, " ").toLocaleUpperCase());

    obj["datasets"] = arg1.map((period) => ({
      label: period,
      backgroundColor: function (context: any) {
        let index = context.dataIndex;
        let value = context.dataset.data[index];
        // return getColor(value);
        return value < 0 ? "#a8071a" : "#237804";
      },
      borderColor: "#ffffff",
      borderWidth: 1,
      hoverBorderWidth: 2,
      data: dataIterator(dict[period])
        ?.slice(+arg2[1], +arg2[2])
        ?.map((e) => getBenchmark(e[0], e[1])),
    }));
    return obj;
  };

  // zoom plugin for bar chart
  const zoom = useChartjsZoom()

  useEffect(() => {
    // pull in api data and set state
    setd1(current_financial_data?.ratios);
    setd2(previous_year_financial_data?.ratios);
    setd3(previous_two_years_financial_data?.ratios);
    setd4(previous_three_years_financial_data?.ratios);
    setd5(previous_four_years_financial_data?.ratios);
    return () => {
      "insert side effect action here";
    };
  }, [
    current_financial_data,
    previous_year_financial_data,
    previous_two_years_financial_data,
    previous_three_years_financial_data,
    previous_four_years_financial_data,
  ]);

  return (
    <div className={styles.root}>
      <Card>
        <PageHeader
          title={null}
          subTitle={null}
          extra={[
            <Text key={1} strong style={{ fontSize: "1.25rem" }}>
              Financial Ratios
            </Text>,
          ]}
        >
          <Divider style={{ paddingBottom: "20px" }} />
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <Select
                mode="multiple"
                placeholder="select year"
                value={selectedItems}
                onChange={onSelectorChange}
                style={{ width: "100%" }}
              >
                {filteredOptions.map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </div>

            {/* liquidity ratio part  */}
            {ratiosCategory.map((E, I) => (
              <Card key={E[0]}>
                <Row gutter={[8, 8]}>
                  <Col xs={24} lg={4}>
                    <Switch
                      checkedChildren={<PercentageOutlined />}
                      unCheckedChildren={<LineChartOutlined />}
                      className={String(E[2])}
                      onChange={onSwitch}
                    />
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Title level={4} type="secondary" style={{marginBottom: "25px"}}>
                        {E[0]}
                      </Title>
                      <br />
                    </div>
                  </Col>

                  <Col xs={24} lg={20}>
                    {!chartState.includes(String(E[2])) ? (
                      <Row gutter={[16, 16]} justify="center">
                        {selectedItems.map((e) => (
                          <Col md={4} key={e}>
                            <div>
                              <Title
                                level={4}
                                type="warning"
                                style={{ marginBottom: "50px" }}
                              >
                                {e}
                              </Title>
                            </div>

                            {dataIterator(dict[e])
                              ?.slice(+E[1], +E[2])
                              ?.map((e, i) => (
                                <div key={String(e[0])}>
                                  <Statistic
                                    title={e[0]
                                      .replace(/_/g, " ")
                                      .toLocaleUpperCase()}
                                    value={e[1]}
                                    precision={2}
                                    suffix={
                                    getBenchmark(e[0], e[1]) > 0?
                                    <span style={{color: "green"}}><ArrowUpOutlined /></span> :
                                    <span style={{color: "red"}}><ArrowDownOutlined /></span>
                                    }
                                  />
                                  <Divider />
                                </div>
                              ))}
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <div>
                        <Row gutter={[16, 16]} justify="center">
                          <Col span={18}>
                            <Bar
                              data={getBarData(selectedItems, E)}
                              options={{
                                title: {
                                  display: true,
                                  text:
                                    "Yearly performance pegged to All Industries average benchmark GREEN indicates Over-performance / RED indicates Under-performance",
                                },
                                scales: {
                                  yAxes: [
                                    {
                                      scaleLabel: {
                                        display: true,
                                        labelString: "ratio",
                                      },
                                    },
                                  ],
                                },
                                tooltips: {
                                  titleSpacing: 6,
                                  bodySpacing: 6,
                                  bodyFontSize: 14,
                                  xPadding: 12,
                                  yPadding: 12,
                                },
                                plugins: { zoom },
                              }}
                            //   redraw
                            />
                          </Col>
                        </Row>
                      </div>
                    )}
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>
        </PageHeader>
      </Card>
    </div>
  );
};
