import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Space,
  Card,
  PageHeader,
  Typography,
  Divider,
  Row,
  Col,
  Select,
  Table,
} from "antd";
import {
  selectorValue_2,
  selectorValue_3,
  selectorValue_4,
  selectorValue_5,
  selectorValue_6,
} from "../../features/selector/selectorSlice";
import styles from "./BalanceSheet.module.css";

const { Text } = Typography;

// declare typescript props type
type TProps = {};
// declare typescript state types
type TState = {
  tableSelectedItems: Array<string>;
  d1: { [key: string]: number };
  d2: { [key: string]: number };
  d3: { [key: string]: number };
  d4: { [key: string]: number };
  d5: { [key: string]: number };
};

// options to pass to selector
const selector_options_list = [
  `${new Date(Date.now()).getFullYear() - 1}`,
  `${new Date(Date.now()).getFullYear() - 2}`,
  `${new Date(Date.now()).getFullYear() - 3}`,
  `${new Date(Date.now()).getFullYear() - 4}`,
  `${new Date(Date.now()).getFullYear() - 5}`,
];

export const BalanceSheet: React.FC<TProps> = ({ ...props }): JSX.Element => {
  // ---initialise redux store state values for slectors--
  // gets multiple state data from the selector's reducer
  const current_financial_data: any = useSelector(selectorValue_2);
  const previous_year_financial_data: any = useSelector(selectorValue_3);
  const previous_two_years_financial_data: any = useSelector(selectorValue_4);
  const previous_three_years_financial_data: any = useSelector(selectorValue_5);
  const previous_four_years_financial_data: any = useSelector(selectorValue_6);

  // initialise all states below
  // api data from redux store
  const [d1, setd1] = useState<TState["d1"]>(
    current_financial_data?.statement.balance_sheet
  );
  const [d2, setd2] = useState<TState["d2"]>(
    previous_year_financial_data?.statement.balance_sheet
  );
  const [d3, setd3] = useState<TState["d3"]>(
    previous_two_years_financial_data?.statement.balance_sheet
  );
  const [d4, setd4] = useState<TState["d4"]>(
    previous_three_years_financial_data?.statement.balance_sheet
  );
  const [d5, setd5] = useState<TState["d5"]>(
    previous_four_years_financial_data?.statement.balance_sheet
  );
  // table selector state
  const [tableSelectedItems, settableSelectedItems] = useState<
    TState["tableSelectedItems"]
  >([selector_options_list[0]]);

  // function to filter the selector item out of the options
  const filteredOptions = selector_options_list.filter(
    (e) => !tableSelectedItems.includes(e)
  );

  // callback function when option is selected
  const onTableSelectorChange = (value: Array<string>) => {
    settableSelectedItems(value);
  };

  // dictionary to map period to dataset
  const dict = {
    [selector_options_list[0]]: d1,
    [selector_options_list[1]]: d2,
    [selector_options_list[2]]: d3,
    [selector_options_list[3]]: d4,
    [selector_options_list[4]]: d5,
  };

  // function to get bar data by maping ove selected period optio
  const getDoughnutData = (arg: Array<string>) => {
    let obj: { [key: string]: [] | {} } = {
      labels: ["Assets", "Liabilites", "Equity"],
    };

    obj["datasets"] = arg.map((e, i) => ({
      label: e,
      backgroundColor: ["#237804", "#a8071a", "#0050b3"],
      borderColor: "#ffffff",
      borderWidth: 1,
      hoverBorderWidth: 4,
      data: [
        dict[e]?.non_current_assets + dict[e]?.current_assets,
        dict[e]?.non_current_liabilities + dict[e]?.current_liabilities,
        dict[e]?.total_equity,
      ],
    }));
    return obj;
  };

  // function to assing table data row by row
  const getTableData = () => {
    let t = [
      {
        key: "0",
        item: "Non Current Assets",
        [selector_options_list[0]]: d1?.non_current_assets,
        [selector_options_list[1]]: d2?.non_current_assets,
        [selector_options_list[2]]: d3?.non_current_assets,
        [selector_options_list[3]]: d4?.non_current_assets,
        [selector_options_list[4]]: d5?.non_current_assets,
      },
      {
        key: "1",
        item: "Current Assets",
        [selector_options_list[0]]: d1?.current_assets,
        [selector_options_list[1]]: d2?.current_assets,
        [selector_options_list[2]]: d3?.current_assets,
        [selector_options_list[3]]: d4?.current_assets,
        [selector_options_list[4]]: d5?.current_assets,
      },
      {
        key: "2",
        item: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            Total Assets
          </Text>
        ),
        [selector_options_list[0]]: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            {d1?.non_current_assets + d1?.current_assets}
          </Text>
        ),
        [selector_options_list[1]]: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            {d2?.non_current_assets + d2?.current_assets}
          </Text>
        ),
        [selector_options_list[2]]: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            {d3?.non_current_assets + d3?.current_assets}
          </Text>
        ),
        [selector_options_list[3]]: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            {d4?.non_current_assets + d4?.current_assets}
          </Text>
        ),
        [selector_options_list[4]]: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            {d5?.non_current_assets + d5?.current_assets}
          </Text>
        ),
      },
      {
        key: "3",
        item: <p></p>,
      },
      {
        key: "4",
        item: "Non Current Liabilities",
        [selector_options_list[0]]: d1?.non_current_liabilities,
        [selector_options_list[1]]: d2?.non_current_liabilities,
        [selector_options_list[2]]: d3?.non_current_liabilities,
        [selector_options_list[3]]: d4?.non_current_liabilities,
        [selector_options_list[4]]: d5?.non_current_liabilities,
      },
      {
        key: "5",
        item: "Current Liabilities",
        [selector_options_list[0]]: d1?.current_liabilities,
        [selector_options_list[1]]: d2?.current_liabilities,
        [selector_options_list[2]]: d3?.current_liabilities,
        [selector_options_list[3]]: d4?.current_liabilities,
        [selector_options_list[4]]: d5?.current_liabilities,
      },
      {
        key: "6",
        item: <Text style={{ fontSize: "1.25rem" }}>Total Liabilities</Text>,
        [selector_options_list[0]]: (
          <Text>{d1?.non_current_liabilities + d1?.current_liabilities}</Text>
        ),
        [selector_options_list[1]]: (
          <Text>{d2?.non_current_liabilities + d2?.current_liabilities}</Text>
        ),
        [selector_options_list[2]]: (
          <Text>{d3?.non_current_liabilities + d3?.current_liabilities}</Text>
        ),
        [selector_options_list[3]]: (
          <Text>{d4?.non_current_liabilities + d4?.current_liabilities}</Text>
        ),
        [selector_options_list[4]]: (
          <Text>{d5?.non_current_liabilities + d5?.current_liabilities}</Text>
        ),
      },
      {
        key: "7",
        item: <p></p>,
      },
      {
        key: "8",
        item: <Text style={{ fontSize: "1.25rem" }}>Total Equity</Text>,
        [selector_options_list[0]]: <Text>{d1?.total_equity}</Text>,
        [selector_options_list[1]]: <Text>{d2?.total_equity}</Text>,
        [selector_options_list[2]]: <Text>{d3?.total_equity}</Text>,
        [selector_options_list[3]]: <Text>{d4?.total_equity}</Text>,
        [selector_options_list[4]]: <Text>{d5?.total_equity}</Text>,
      },
      {
        key: "9",
        item: <p></p>,
      },
      {
        key: "10",
        item: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            Total Liabilities & Equity
          </Text>
        ),
        [selector_options_list[0]]: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            {d1?.non_current_liabilities +
              d1?.current_liabilities +
              d1?.total_equity}
          </Text>
        ),
        [selector_options_list[1]]: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            {d2?.non_current_liabilities +
              d2?.current_liabilities +
              d2?.total_equity}
          </Text>
        ),
        [selector_options_list[2]]: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            {d3?.non_current_liabilities +
              d3?.current_liabilities +
              d3?.total_equity}
          </Text>
        ),
        [selector_options_list[3]]: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            {d4?.non_current_liabilities +
              d4?.current_liabilities +
              d4?.total_equity}
          </Text>
        ),
        [selector_options_list[4]]: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            {d5?.non_current_liabilities +
              d5?.current_liabilities +
              d5?.total_equity}
          </Text>
        ),
      },
    ];
    return t;
  };

  // function to assign table data column
  const getColumns = (arg: Array<string>) => {
    let t = [
      {
        title: "",
        dataIndex: "item",
        key: "item",
      },
    ];

    arg.map((e) =>
      t.push({
        title: e,
        dataIndex: e,
        key: e,
      })
    );
    return t;
  };

  useEffect(() => {
    // pull in api data and set state
    setd1(current_financial_data?.statement.balance_sheet);
    setd2(previous_year_financial_data?.statement.balance_sheet);
    setd3(previous_two_years_financial_data?.statement.balance_sheet);
    setd4(previous_three_years_financial_data?.statement.balance_sheet);
    setd5(previous_four_years_financial_data?.statement.balance_sheet);
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
              Balance Sheet
            </Text>,
          ]}
        >
          <Divider style={{ paddingBottom: "20px" }} />

          <Row gutter={[16, 16]}>
            {/* table part */}
            <Col sm={24} lg={12}>
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                <div>
                  <Select
                    mode="multiple"
                    placeholder="select year"
                    value={tableSelectedItems}
                    onChange={onTableSelectorChange}
                    style={{ width: "100%" }}
                  >
                    {filteredOptions.map((item) => (
                      <Select.Option key={item} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                <Card>
                  <Space
                    direction="vertical"
                    size="large"
                    style={{ width: "100%" }}
                  >
                    <div style={{ textAlign: "left" }}>
                      <Text strong>Last 5 years Balance Sheet</Text>
                      <br />
                      <Text disabled>amounts in £ millions</Text>
                    </div>
                    <div style={{ overflow: "scroll" }}>
                      <Table
                        size="small"
                        pagination={false}
                        dataSource={getTableData()}
                        columns={getColumns(tableSelectedItems)}
                      />
                    </div>
                  </Space>
                </Card>
              </Space>
            </Col>

            {/* doughnut part */}
            <Col sm={24} lg={12}>
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                <Card>
                  <Doughnut
                    data={getDoughnutData(tableSelectedItems)}
                    options={{
                      title: {
                        display: true,
                        text: "Assets, liabilities & equity proportions",
                      },
                      legend: {
                        position: "bottom",
                      },
                      tooltips: {
                        titleSpacing: 6,
                        bodySpacing: 6,
                        bodyFontSize: 16,
                        xPadding: 12,
                        yPadding: 12,
                        callbacks: {
                          label: function (item: any, data: any) {
                            return (
                              data.datasets[item.datasetIndex].label +
                              "  " +
                              data.labels[item.index] +
                              ": " +
                              data.datasets[item.datasetIndex].data[item.index]
                            );
                          },
                        },
                      },
                    }}
                    // redraw
                  />
                </Card>

                {/* line chart part */}
                <Card>
                  <Line
                    data={{
                      labels: [
                        selector_options_list[4],
                        selector_options_list[3],
                        selector_options_list[2],
                        selector_options_list[1],
                        selector_options_list[0],
                      ],
                      datasets: [
                        {
                          label: "Non Current Assets",
                          borderColor: "#73d13d",
                          fill: false,
                          pointBackgroundColor: "#73d13d",
                          data: [
                            d5?.non_current_assets,
                            d4?.non_current_assets,
                            d3?.non_current_assets,
                            d2?.non_current_assets,
                            d1?.non_current_assets,
                          ],
                        },
                        {
                          label: "Current Assets",
                          borderColor: "#237804",
                          fill: false,
                          pointBackgroundColor: "#237804",
                          data: [
                            d5?.current_assets,
                            d4?.current_assets,
                            d3?.current_assets,
                            d2?.current_assets,
                            d1?.current_assets,
                          ],
                        },
                        {
                          label: "Non Current Liabilities",
                          borderColor: "#ff4d4f",
                          fill: false,
                          pointBackgroundColor: "#ff4d4f",
                          data: [
                            d5?.non_current_liabilities,
                            d4?.non_current_liabilities,
                            d3?.non_current_liabilities,
                            d2?.non_current_liabilities,
                            d1?.non_current_liabilities,
                          ],
                        },
                        {
                          label: "Current Liabilities",
                          borderColor: "#ad2102",
                          fill: false,
                          pointBackgroundColor: "#ad2102",
                          data: [
                            d5?.current_liabilities,
                            d4?.current_liabilities,
                            d3?.current_liabilities,
                            d2?.current_liabilities,
                            d1?.current_liabilities,
                          ],
                        },
                        {
                          label: "Total Equity",
                          borderColor: "#0050b3",
                          fill: false,
                          pointBackgroundColor: "#0050b3",
                          data: [
                            d5?.total_equity,
                            d4?.total_equity,
                            d3?.total_equity,
                            d2?.total_equity,
                            d1?.total_equity,
                          ],
                        },
                      ],
                    }}
                    options={{
                      title: {
                        display: true,
                        text: "Line by line items timeseries trend",
                      },
                      scales: {
                        yAxes: [
                          {
                            scaleLabel: {
                              display: true,
                              labelString: "£ million",
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
                    }}
                  />
                </Card>
              </Space>
            </Col>
          </Row>
        </PageHeader>
      </Card>
    </div>
  );
};
