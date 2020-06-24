import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Select } from "antd";
import styles from "./Selector.module.css";
import {
  getCompanyData_1,
  getCompanyData_2,
  getCompanyData_3,
  getCompanyData_4,
  getCompanyData_5,
  getCompanyData_6,
  getCompanyData_7,
} from "./selectorSlice";

const { Option } = Select;

const company_lse_url_dictionary: { [key: string]: string } = {
  ezj:
    "https://www.londonstockexchange.com/stock/EZJ/easyjet-plc/company-page",
  "hl.":
    "https://www.londonstockexchange.com/stock/HL./hargreaves-lansdown-plc/company-page",
  brby:
    "https://www.londonstockexchange.com/stock/BRBY/burberry-group-plc/company-page",
  adm:
    "https://www.londonstockexchange.com/stock/ADM/admiral-group-plc/company-page",
};

// declare typescript props type
type TProps = {
  api_root_address: string;
  placeholder?: string;
  options_list: object;
  default_value?: string;
  mode?: "multiple" | "tags" | undefined;
  fetchCycle: Function;
};
// declare typescript state types
type TState = {
  fetchStatus: number;
};

export const Selector: React.FC<TProps> = ({ ...props }): JSX.Element => {
  // instantiate data dispatcher to reducer and assign to dispatch variable for simplicity
  const dispatch = useDispatch();

  // implementation of all useState hook
  const [fetchStatus, setfetchStatus] = useState<TState["fetchStatus"]>(0);

  // fetch function
  const apiFetch = async (route: string, ticker: string, periodIndex: number)=>{
    // current year helper
    let currentYear = new Date(Date.now()).getFullYear();

    // dictionary to identify which path to fetch data from on api and which dispatcher activate to 
    // set redux store value, the dispatcher is identified by the period index and its mainly 
    // for financial report data, index 1 for current year data and concurrently for up to 5 years
    const dict: {
      [key: string] : {
        [key: string]: any, 
      }
    } = {
      company_overview: { url: `${props.api_root_address}${route}?ticker=${ticker}`, dispatcher: {1: (arg: {})=> getCompanyData_1(arg)} },
      all_statements: {url: `${props.api_root_address}${route}?period=${currentYear - periodIndex}&ticker=${ticker}`, dispatcher: {
        1: (arg: {})=> getCompanyData_2(arg),
        2: (arg: {})=> getCompanyData_3(arg),
        3: (arg: {})=> getCompanyData_4(arg),
        4: (arg: {})=> getCompanyData_5(arg),
        5: (arg: {})=> getCompanyData_6(arg),
      }},
      company_current_quote: { url: `${props.api_root_address}${route}?url=${company_lse_url_dictionary[ticker]}`, dispatcher: {1: (arg: {})=> getCompanyData_7(arg)} },
      
      // get quote from lse api instead of scraping
      company_current_quote_alt: { url: `https://cors-anywhere.herokuapp.com/https://api.londonstockexchange.com/api/gw/lse/instruments/alldata/${ticker.toUpperCase()}`, dispatcher: {1: (arg: {})=> getCompanyData_7(arg)} },
    }
    await fetch(dict[route].url)
      .then((res) => res.json())
      .then(
        (result) => {
          dispatch(dict[route].dispatcher[String(periodIndex)](result));
        },
        (error) => {
          //_________________TAKE OUT BEFORE DEPLOYMENT_______________
          throw new Error(`${error} | FETCH STACK ERROR @ ${route} FUNCTION` );
        }
      )
    return
  }


  // **function to send fetch request to api for all needed data on company selection
  const onChange = async (value: string) => {
    // visual aid for loading in data (spinner in selector bar)
    setfetchStatus(1);
    await apiFetch("company_overview", value, 1);
    await apiFetch("all_statements", value, 1);
    await apiFetch("all_statements", value, 2);
    await apiFetch("all_statements", value, 3);
    await apiFetch("all_statements", value, 4);
    await apiFetch("all_statements", value, 5);
    // await apiFetch("company_current_quote", value, 1);
    await apiFetch("company_current_quote_alt", value, 1);
    setfetchStatus(2);
  };

  // implementation of useEffect hook
  const { fetchCycle } = props;
  useEffect(() => {
    // passes up the fetch status to the equity component to control skeleton
    fetchCycle(fetchStatus);
    return () => {
      "insert side effect action here";
    };
  }, [fetchCycle, fetchStatus]);

  return (
    <div className={styles.root}>
      <Select
        loading={fetchStatus === 1 ? true : false}
        disabled={fetchStatus === 1 ? true : false}
        defaultValue={props.default_value || ""}
        mode={props.mode}
        style={{ width: "100%" }}
        placeholder={props.placeholder}
        onChange={onChange}
        optionLabelProp="label"
      >
        {Object.entries(props.options_list).map((e) => {
          return (
            <Option key={e[1]} value={e[0]} label={e[1]?.toUpperCase()}>
              <div className="option-label-item">{e[1].toUpperCase()}</div>
            </Option>
          );
        })}
      </Select>
    </div>
  );
};
