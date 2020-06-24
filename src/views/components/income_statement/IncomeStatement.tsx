import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Line, HorizontalBar } from "react-chartjs-2";
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
import styles from "./IncomeStatement.module.css";

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

export const IncomeStatement: React.FC<TProps> = ({
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
  const [d1, setd1] = useState<TState["d1"]>(
    current_financial_data?.statement.income_statement
  );
  const [d2, setd2] = useState<TState["d2"]>(
    previous_year_financial_data?.statement.income_statement
  );
  const [d3, setd3] = useState<TState["d3"]>(
    previous_two_years_financial_data?.statement.income_statement
  );
  const [d4, setd4] = useState<TState["d4"]>(
    previous_three_years_financial_data?.statement.income_statement
  );
  const [d5, setd5] = useState<TState["d5"]>(
    previous_four_years_financial_data?.statement.income_statement
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
        "Revenue",
        "COGS",
        "Operating Expenses",
        "Depreciation & Amortization",
        "Other Operating Expenses",
        "Net Interest",
        "Net Non Operating Revenue",
        "Taxes",
      ],
    };

    obj["datasets"] = arg.map((e, i) => ({
      label: e,
      minBarLength: 5,
      backgroundColor: function (context: any) {
        let index = context.dataIndex;
        let value = context.dataset.data[index];
        return value < 0 ? "#a8071a" : "#237804";
      },
      borderColor: "#ffffff",
      borderWidth: 1,
      hoverBorderWidth: 2,
      data: [
        dict[e]?.total_revenue,
        dict[e]?.cogs * -1,
        dict[e]?.operating_expenses * -1,
        dict[e]?.depreciation_amortization * -1,
        dict[e]?.other_operating_expenses * -1,
        dict[e]?.net_interest_finance,
        dict[e]?.other_non_operating_income_expense,
        dict[e]?.taxes * -1,
      ],
    }));
    return obj;
  };

  // function to assing table data row by row
  const getTableData = () => {
    let t = [
      {
        key: "0",
        item: <span style={{ fontSize: "1rem" }}>Revenue</span>,
        [selector_options_list[0]]: (
          <span style={{ fontSize: "1rem" }}>{d1?.total_revenue}</span>
        ),
        [selector_options_list[1]]: (
          <span style={{ fontSize: "1rem" }}>{d2?.total_revenue}</span>
        ),
        [selector_options_list[2]]: (
          <span style={{ fontSize: "1rem" }}>{d3?.total_revenue}</span>
        ),
        [selector_options_list[3]]: (
          <span style={{ fontSize: "1rem" }}>{d4?.total_revenue}</span>
        ),
        [selector_options_list[4]]: (
          <span style={{ fontSize: "1rem" }}>{d5?.total_revenue}</span>
        ),
      },
      {
        key: "1",
        item: "COGS**",
        [selector_options_list[0]]: d1?.cogs * -1,
        [selector_options_list[1]]: d2?.cogs * -1,
        [selector_options_list[2]]: d3?.cogs * -1,
        [selector_options_list[3]]: d4?.cogs * -1,
        [selector_options_list[4]]: d5?.cogs * -1,
      },
      {
        key: "2",
        item: (
          <Text type="warning">
            <b>Gross Profit</b>
          </Text>
        ),
        [selector_options_list[0]]: (
          <Text type="warning">{d1?.total_revenue - d1?.cogs}</Text>
        ),
        [selector_options_list[1]]: (
          <Text type="warning">{d2?.total_revenue - d2?.cogs}</Text>
        ),
        [selector_options_list[2]]: (
          <Text type="warning">{d3?.total_revenue - d3?.cogs}</Text>
        ),
        [selector_options_list[3]]: (
          <Text type="warning">{d4?.total_revenue - d4?.cogs}</Text>
        ),
        [selector_options_list[4]]: (
          <Text type="warning">{d5?.total_revenue - d5?.cogs}</Text>
        ),
      },
      {
        key: "3",
        item: "Operating Expense",
        [selector_options_list[0]]: d1?.operating_expenses * -1,
        [selector_options_list[1]]: d2?.operating_expenses * -1,
        [selector_options_list[2]]: d3?.operating_expenses * -1,
        [selector_options_list[3]]: d4?.operating_expenses * -1,
        [selector_options_list[4]]: d5?.operating_expenses * -1,
      },
      {
        key: "4",
        item: (
          <Text type="warning">
            <b>EBITAD**</b>
          </Text>
        ),
        [selector_options_list[0]]: (
          <Text type="warning">
            {d1?.total_revenue - d1?.cogs - d1?.operating_expenses}
          </Text>
        ),
        [selector_options_list[1]]: (
          <Text type="warning">
            {d2?.total_revenue - d2?.cogs - d2?.operating_expenses}
          </Text>
        ),
        [selector_options_list[2]]: (
          <Text type="warning">
            {d3?.total_revenue - d3?.cogs - d3?.operating_expenses}
          </Text>
        ),
        [selector_options_list[3]]: (
          <Text type="warning">
            {d4?.total_revenue - d4?.cogs - d4?.operating_expenses}
          </Text>
        ),
        [selector_options_list[4]]: (
          <Text type="warning">
            {d5?.total_revenue - d5?.cogs - d5?.operating_expenses}
          </Text>
        ),
      },
      {
        key: "5",
        item: "Depreciation & Amortization",
        [selector_options_list[0]]: d1?.depreciation_amortization * -1,
        [selector_options_list[1]]: d2?.depreciation_amortization * -1,
        [selector_options_list[2]]: d3?.depreciation_amortization * -1,
        [selector_options_list[3]]: d4?.depreciation_amortization * -1,
        [selector_options_list[4]]: d5?.depreciation_amortization * -1,
      },
      {
        key: "6",
        item: "Other Operating Expenses",
        [selector_options_list[0]]: d1?.other_operating_expenses * -1,
        [selector_options_list[1]]: d2?.other_operating_expenses * -1,
        [selector_options_list[2]]: d3?.other_operating_expenses * -1,
        [selector_options_list[3]]: d4?.other_operating_expenses * -1,
        [selector_options_list[4]]: d5?.other_operating_expenses * -1,
      },
      {
        key: "7",
        item: (
          <Text type="warning">
            <b>EBIT**</b>
          </Text>
        ),
        [selector_options_list[0]]: (
          <Text type="warning">
            {d1?.total_revenue -
              d1?.cogs -
              d1?.operating_expenses -
              d1?.depreciation_amortization -
              d1?.other_operating_expenses}
          </Text>
        ),
        [selector_options_list[1]]: (
          <Text type="warning">
            {d2?.total_revenue -
              d2?.cogs -
              d2?.operating_expenses -
              d2?.depreciation_amortization -
              d2?.other_operating_expenses}
          </Text>
        ),
        [selector_options_list[2]]: (
          <Text type="warning">
            {d3?.total_revenue -
              d3?.cogs -
              d3?.operating_expenses -
              d3?.depreciation_amortization -
              d3?.other_operating_expenses}
          </Text>
        ),
        [selector_options_list[3]]: (
          <Text type="warning">
            {d4?.total_revenue -
              d4?.cogs -
              d4?.operating_expenses -
              d4?.depreciation_amortization -
              d4?.other_operating_expenses}
          </Text>
        ),
        [selector_options_list[4]]: (
          <Text type="warning">
            {d5?.total_revenue -
              d5?.cogs -
              d5?.operating_expenses -
              d5?.depreciation_amortization -
              d5?.other_operating_expenses}
          </Text>
        ),
      },
      {
        key: "8",
        item: "Net Interest",
        [selector_options_list[0]]: d1?.net_interest_finance,
        [selector_options_list[1]]: d2?.net_interest_finance,
        [selector_options_list[2]]: d3?.net_interest_finance,
        [selector_options_list[3]]: d4?.net_interest_finance,
        [selector_options_list[4]]: d5?.net_interest_finance,
      },
      {
        key: "9",
        item: "Net Non Operating Revenue",
        [selector_options_list[0]]: d1?.other_non_operating_income_expense,
        [selector_options_list[1]]: d2?.other_non_operating_income_expense,
        [selector_options_list[2]]: d3?.other_non_operating_income_expense,
        [selector_options_list[3]]: d4?.other_non_operating_income_expense,
        [selector_options_list[4]]: d5?.other_non_operating_income_expense,
      },
      {
        key: "10",
        item: (
          <Text type="warning">
            <b>PBT**</b>
          </Text>
        ),
        [selector_options_list[0]]: (
          <Text type="warning">
            {d1?.total_revenue -
              d1?.cogs -
              d1?.operating_expenses -
              d1?.depreciation_amortization -
              d1?.other_operating_expenses +
              d1?.net_interest_finance +
              d1?.other_non_operating_income_expense}
          </Text>
        ),
        [selector_options_list[1]]: (
          <Text type="warning">
            {d2?.total_revenue -
              d2?.cogs -
              d2?.operating_expenses -
              d2?.depreciation_amortization -
              d2?.other_operating_expenses +
              d2?.net_interest_finance +
              d2?.other_non_operating_income_expense}
          </Text>
        ),
        [selector_options_list[2]]: (
          <Text type="warning">
            {d3?.total_revenue -
              d3?.cogs -
              d3?.operating_expenses -
              d3?.depreciation_amortization -
              d3?.other_operating_expenses +
              d3?.net_interest_finance +
              d3?.other_non_operating_income_expense}
          </Text>
        ),
        [selector_options_list[3]]: (
          <Text type="warning">
            {d4?.total_revenue -
              d4?.cogs -
              d4?.operating_expenses -
              d4?.depreciation_amortization -
              d4?.other_operating_expenses +
              d4?.net_interest_finance +
              d4?.other_non_operating_income_expense}
          </Text>
        ),
        [selector_options_list[4]]: (
          <Text type="warning">
            {d5?.total_revenue -
              d5?.cogs -
              d5?.operating_expenses -
              d5?.depreciation_amortization -
              d5?.other_operating_expenses +
              d5?.net_interest_finance +
              d5?.other_non_operating_income_expense}
          </Text>
        ),
      },
      {
        key: "11",
        item: "Taxes",
        [selector_options_list[0]]: d1?.taxes * -1,
        [selector_options_list[1]]: d2?.taxes * -1,
        [selector_options_list[2]]: d3?.taxes * -1,
        [selector_options_list[3]]: d4?.taxes * -1,
        [selector_options_list[4]]: d5?.taxes * -1,
      },
      {
        key: "12",
        item: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            Net Profit
          </Text>
        ),
        [selector_options_list[0]]: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            {d1?.total_revenue -
              d1?.cogs -
              d1?.operating_expenses -
              d1?.depreciation_amortization -
              d1?.other_operating_expenses +
              d1?.net_interest_finance +
              d1?.other_non_operating_income_expense -
              d1?.taxes}
          </Text>
        ),
        [selector_options_list[1]]: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            {d2?.total_revenue -
              d2?.cogs -
              d2?.operating_expenses -
              d2?.depreciation_amortization -
              d2?.other_operating_expenses +
              d2?.net_interest_finance +
              d2?.other_non_operating_income_expense -
              d2?.taxes}
          </Text>
        ),
        [selector_options_list[2]]: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            {d3?.total_revenue -
              d3?.cogs -
              d3?.operating_expenses -
              d3?.depreciation_amortization -
              d3?.other_operating_expenses +
              d3?.net_interest_finance +
              d3?.other_non_operating_income_expense -
              d3?.taxes}
          </Text>
        ),
        [selector_options_list[3]]: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            {d4?.total_revenue -
              d4?.cogs -
              d4?.operating_expenses -
              d4?.depreciation_amortization -
              d4?.other_operating_expenses +
              d4?.net_interest_finance +
              d4?.other_non_operating_income_expense -
              d4?.taxes}
          </Text>
        ),
        [selector_options_list[4]]: (
          <Text type="warning" style={{ fontSize: "1.25rem" }}>
            {d5?.total_revenue -
              d5?.cogs -
              d5?.operating_expenses -
              d5?.depreciation_amortization -
              d5?.other_operating_expenses +
              d5?.net_interest_finance +
              d5?.other_non_operating_income_expense -
              d5?.taxes}
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
    setd1(current_financial_data?.statement.income_statement);
    setd2(previous_year_financial_data?.statement.income_statement);
    setd3(previous_two_years_financial_data?.statement.income_statement);
    setd4(previous_three_years_financial_data?.statement.income_statement);
    setd5(previous_four_years_financial_data?.statement.income_statement);
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
              Income Statement
            </Text>,
          ]}
        >
          <Divider style={{ paddingBottom: "20px" }} />

          <Row gutter={[16, 16]}>
            {/* chart section */}
            <Col sm={24} lg={14}>
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                {/* bar chart part */}
                <Card>
                  <HorizontalBar
                    data={getBarData(tableSelectedItems)}
                    options={{
                      title: {
                        display: true,
                        text: "Income statement items proportions",
                      },
                      scales: {
                        xAxes: [
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
                          label: "Revenue",
                          borderColor: "#9e1068",
                          fill: false,
                          pointBackgroundColor: "#9e1068",
                          data: [
                            d5?.total_revenue,
                            d4?.total_revenue,
                            d3?.total_revenue,
                            d2?.total_revenue,
                            d1?.total_revenue,
                          ],
                        },
                        {
                          label: "COGS",
                          borderColor: "#0050b3",
                          pointBackgroundColor: "#0050b3",
                          fill: false,
                          data: [
                            d5?.cogs,
                            d4?.cogs,
                            d3?.cogs,
                            d2?.cogs,
                            d1?.cogs,
                          ],
                        },
                        {
                          label: "Operating Expenses",
                          borderColor: "#5b8c00",
                          pointBackgroundColor: "#5b8c00",
                          fill: false,
                          data: [
                            d5?.other_operating_expenses,
                            d4?.other_operating_expenses,
                            d3?.other_operating_expenses,
                            d2?.other_operating_expenses,
                            d1?.other_operating_expenses,
                          ],
                        },
                        {
                          label: "EBITAD",
                          borderColor: "#ad4e00",
                          pointBackgroundColor: "#ad4e00",
                          fill: false,
                          data: [
                            d5?.total_revenue -
                              d5?.cogs -
                              d5?.operating_expenses,
                            d4?.total_revenue -
                              d4?.cogs -
                              d4?.operating_expenses,
                            d3?.total_revenue -
                              d3?.cogs -
                              d3?.operating_expenses,
                            d2?.total_revenue -
                              d2?.cogs -
                              d2?.operating_expenses,
                            d1?.total_revenue -
                              d1?.cogs -
                              d1?.operating_expenses,
                          ],
                        },
                        {
                          label: "EBIT",
                          borderColor: "#a8071a",
                          pointBackgroundColor: "#a8071a",
                          fill: false,
                          data: [
                            d5?.total_revenue -
                              d5?.cogs -
                              d5?.operating_expenses -
                              d5?.depreciation_amortization -
                              d5?.other_operating_expenses,
                            d4?.total_revenue -
                              d4?.cogs -
                              d4?.operating_expenses -
                              d4?.depreciation_amortization -
                              d4?.other_operating_expenses,
                            d3?.total_revenue -
                              d3?.cogs -
                              d3?.operating_expenses -
                              d3?.depreciation_amortization -
                              d3?.other_operating_expenses,
                            d2?.total_revenue -
                              d2?.cogs -
                              d2?.operating_expenses -
                              d2?.depreciation_amortization -
                              d2?.other_operating_expenses,
                            d1?.total_revenue -
                              d1?.cogs -
                              d1?.operating_expenses -
                              d1?.depreciation_amortization -
                              d1?.other_operating_expenses,
                          ],
                        },
                        {
                          label: "Net Profit",
                          borderColor: "#006d75",
                          pointBackgroundColor: "#006d75",
                          fill: false,
                          data: [
                            d5?.total_revenue -
                              d5?.cogs -
                              d5?.operating_expenses -
                              d5?.depreciation_amortization -
                              d5?.other_operating_expenses +
                              d5?.net_interest_finance +
                              d5?.other_non_operating_income_expense -
                              d5?.taxes,
                            d4?.total_revenue -
                              d4?.cogs -
                              d4?.operating_expenses -
                              d4?.depreciation_amortization -
                              d4?.other_operating_expenses +
                              d4?.net_interest_finance +
                              d4?.other_non_operating_income_expense -
                              d4?.taxes,
                            d3?.total_revenue -
                              d3?.cogs -
                              d3?.operating_expenses -
                              d3?.depreciation_amortization -
                              d3?.other_operating_expenses +
                              d3?.net_interest_finance +
                              d3?.other_non_operating_income_expense -
                              d3?.taxes,
                            d2?.total_revenue -
                              d2?.cogs -
                              d2?.operating_expenses -
                              d2?.depreciation_amortization -
                              d2?.other_operating_expenses +
                              d2?.net_interest_finance +
                              d2?.other_non_operating_income_expense -
                              d2?.taxes,
                            d1?.total_revenue -
                              d1?.cogs -
                              d1?.operating_expenses -
                              d1?.depreciation_amortization -
                              d1?.other_operating_expenses +
                              d1?.net_interest_finance +
                              d1?.other_non_operating_income_expense -
                              d1?.taxes,
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

            {/* table section */}
            <Col sm={24} lg={10}>
              {/* selector part */}
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

                {/* table part */}
                <Card>
                  <Space
                    direction="vertical"
                    size="large"
                    style={{ width: "100%" }}
                  >
                    <div style={{ textAlign: "right" }}>
                      <Text strong>Last 5 years Income Statement</Text>
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
                      <Text disabled>COGS** - cost of goods sold</Text>
                      <br />
                      <Text disabled>
                        EBITAD** - earnings before interest taxes amortization &
                        depreciation
                      </Text>
                      <br />
                      <Text disabled>
                        EBIT** - earnings before interest taxes
                      </Text>
                      <br />
                      <Text disabled>PBT** - profit before taxes</Text>
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
