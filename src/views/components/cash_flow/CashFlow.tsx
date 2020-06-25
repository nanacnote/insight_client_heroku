import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Line, Bar } from "react-chartjs-2";
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
import styles from "./CashFlow.module.css";

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

export const CashFlow: React.FC<TProps> = ({ ...props }): JSX.Element => {
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
    current_financial_data?.statement.cash_flow
  );
  const [d2, setd2] = useState<TState["d2"]>(
    previous_year_financial_data?.statement.cash_flow
  );
  const [d3, setd3] = useState<TState["d3"]>(
    previous_two_years_financial_data?.statement.cash_flow
  );
  const [d4, setd4] = useState<TState["d4"]>(
    previous_three_years_financial_data?.statement.cash_flow
  );
  const [d5, setd5] = useState<TState["d5"]>(
    previous_four_years_financial_data?.statement.cash_flow
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
  const getBarData = (arg: Array<string>) => {
    let obj: { [key: string]: [] | {} } = {
      labels: [
        "Operating Activities",
        "Investing Activities",
        "Financing Activities",
      ],
    };

    obj["datasets"] = arg.map((e, i) => ({
      label: e,
      backgroundColor: function (context: any) {
        let index = context.dataIndex;
        let value = context.dataset.data[index];
        return value < 0 ? "#a8071a" : "#237804";
      },
      borderColor: "#ffffff",
      borderWidth: 1,
      hoverBorderWidth: 2,
      data: [
        dict[e]?.net_cash_from_operating_activities,
        dict[e]?.net_cash_from_investing_activities,
        dict[e]?.net_cash_from_financing_activities,
      ],
    }));
    return obj;
  };

  // function to assing table data row by row
  const getTableData = () => {
    let t = [
      {
        key: "0",
        item: "Net Cash From Operating Activities",
        [selector_options_list[0]]: d1?.net_cash_from_operating_activities,
        [selector_options_list[1]]: d2?.net_cash_from_operating_activities,
        [selector_options_list[2]]: d3?.net_cash_from_operating_activities,
        [selector_options_list[3]]: d4?.net_cash_from_operating_activities,
        [selector_options_list[4]]: d5?.net_cash_from_operating_activities,
      },
      {
        key: "1",
        item: <p></p>,
      },
      {
        key: "2",
        item: "Net Cash From Investing Activities",
        [selector_options_list[0]]: d1?.net_cash_from_investing_activities,
        [selector_options_list[1]]: d2?.net_cash_from_investing_activities,
        [selector_options_list[2]]: d3?.net_cash_from_investing_activities,
        [selector_options_list[3]]: d4?.net_cash_from_investing_activities,
        [selector_options_list[4]]: d5?.net_cash_from_investing_activities,
      },
      {
        key: "3",
        item: <p></p>,
      },
      {
        key: "4",
        item: "Net Cash From Financing Activities",
        [selector_options_list[0]]: d1?.net_cash_from_financing_activities,
        [selector_options_list[1]]: d2?.net_cash_from_financing_activities,
        [selector_options_list[2]]: d3?.net_cash_from_financing_activities,
        [selector_options_list[3]]: d4?.net_cash_from_financing_activities,
        [selector_options_list[4]]: d5?.net_cash_from_financing_activities,
      },
      {
        key: "5",
        item: <p></p>,
      },
      {
        key: "6",
        item: "Start of year cash balance**",
        [selector_options_list[0]]:
          d1?.cash_and_cash_equivalents_at_start_of_year,
        [selector_options_list[1]]:
          d2?.cash_and_cash_equivalents_at_start_of_year,
        [selector_options_list[2]]:
          d3?.cash_and_cash_equivalents_at_start_of_year,
        [selector_options_list[3]]:
          d4?.cash_and_cash_equivalents_at_start_of_year,
        [selector_options_list[4]]:
          d5?.cash_and_cash_equivalents_at_start_of_year,
      },
      {
        key: "7",
        item: "Increase in cash balance**",
        [selector_options_list[0]]:
          d1?.increase_decrease_in_cash_and_cash_equivalents,
        [selector_options_list[1]]:
          d2?.increase_decrease_in_cash_and_cash_equivalents,
        [selector_options_list[2]]:
          d3?.increase_decrease_in_cash_and_cash_equivalents,
        [selector_options_list[3]]:
          d4?.increase_decrease_in_cash_and_cash_equivalents,
        [selector_options_list[4]]:
          d5?.increase_decrease_in_cash_and_cash_equivalents,
      },
      {
        key: "8",
        item: <p></p>,
      },
      {
        key: "9",
        item: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            End of year cash balance**
          </Text>
        ),
        [selector_options_list[0]]: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            {d1?.cash_and_cash_equivalents_at_end_of_year}
          </Text>
        ),
        [selector_options_list[1]]: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            {d2?.cash_and_cash_equivalents_at_end_of_year}
          </Text>
        ),
        [selector_options_list[2]]: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            {d3?.cash_and_cash_equivalents_at_end_of_year}
          </Text>
        ),
        [selector_options_list[3]]: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            {d4?.cash_and_cash_equivalents_at_end_of_year}
          </Text>
        ),
        [selector_options_list[4]]: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            {d5?.cash_and_cash_equivalents_at_end_of_year}
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
    setd1(current_financial_data?.statement.cash_flow);
    setd2(previous_year_financial_data?.statement.cash_flow);
    setd3(previous_two_years_financial_data?.statement.cash_flow);
    setd4(previous_three_years_financial_data?.statement.cash_flow);
    setd5(previous_four_years_financial_data?.statement.cash_flow);
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
              Cash Flow
            </Text>,
          ]}
        >
          <Divider style={{ paddingBottom: "20px" }} />

          <Row gutter={[16, 16]}>
            {/* chart part */}
            <Col sm={24} lg={14}>
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                <Card>
                  <Bar
                    data={getBarData(tableSelectedItems)}
                    options={{
                      title: {
                        display: true,
                        text: "Cash Flow items proportions",
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
                    // redraw
                  />
                </Card>

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
                          label: "Operating Activities",
                          borderColor: "#73d13d",
                          fill: false,
                          pointBackgroundColor: "#73d13d",
                          data: [
                            d5?.net_cash_from_operating_activities,
                            d4?.net_cash_from_operating_activities,
                            d3?.net_cash_from_operating_activities,
                            d2?.net_cash_from_operating_activities,
                            d1?.net_cash_from_operating_activities,
                          ],
                        },
                        {
                          label: "Investing Activities",
                          borderColor: "#237804",
                          fill: false,
                          pointBackgroundColor: "#237804",
                          data: [
                            d5?.net_cash_from_investing_activities,
                            d4?.net_cash_from_investing_activities,
                            d3?.net_cash_from_investing_activities,
                            d2?.net_cash_from_investing_activities,
                            d1?.net_cash_from_investing_activities,
                          ],
                        },
                        {
                          label: "Financing Activities",
                          borderColor: "#ff4d4f",
                          fill: false,
                          pointBackgroundColor: "#ff4d4f",
                          data: [
                            d5?.net_cash_from_financing_activities,
                            d4?.net_cash_from_financing_activities,
                            d3?.net_cash_from_financing_activities,
                            d2?.net_cash_from_financing_activities,
                            d1?.net_cash_from_financing_activities,
                          ],
                        },
                        {
                          label: "Start of year cash balance",
                          borderColor: "#ad2102",
                          fill: false,
                          pointBackgroundColor: "#ad2102",
                          data: [
                            d5?.cash_and_cash_equivalents_at_start_of_year,
                            d4?.cash_and_cash_equivalents_at_start_of_year,
                            d3?.cash_and_cash_equivalents_at_start_of_year,
                            d2?.cash_and_cash_equivalents_at_start_of_year,
                            d1?.cash_and_cash_equivalents_at_start_of_year,
                          ],
                        },
                        {
                          label: "End of year cash balance",
                          borderColor: "#0050b3",
                          fill: false,
                          pointBackgroundColor: "#0050b3",
                          data: [
                            d5?.cash_and_cash_equivalents_at_end_of_year,
                            d4?.cash_and_cash_equivalents_at_end_of_year,
                            d3?.cash_and_cash_equivalents_at_end_of_year,
                            d2?.cash_and_cash_equivalents_at_end_of_year,
                            d1?.cash_and_cash_equivalents_at_end_of_year,
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

            {/* table part */}
            <Col sm={24} lg={10}>
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
                    <div style={{ textAlign: "right" }}>
                      <Text strong>Last 5 years Cash Flow</Text>
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
                    <div style={{ textAlign: "right" }}>
                      <Text disabled>
                        Start of year cash balance** - cash and cash equivalents
                        at start of year
                      </Text>
                      <br />
                      <Text disabled>
                        Increase in cash balance** - increase decrease in cash
                        and cash equivalents
                      </Text>
                      <br />
                      <Text disabled>
                        End of year cash balance** - cash and cash equivalents
                        at end of year
                      </Text>
                      <br />
                    </div>
                  </Space>
                </Card>
              </Space>
            </Col>
          </Row>
        </PageHeader>
      </Card>
    </div>
  );
};
