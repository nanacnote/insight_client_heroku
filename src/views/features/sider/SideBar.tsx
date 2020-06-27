import React, { useState } from 'react';
import { Layout, Menu, Divider, Affix } from 'antd';
import styles from './SideBar.module.css';

const { Sider } = Layout;

type TProps = {
    items: Array<object[]>
    selected?: string,
    clickHandler: Function,
};

export const SideBar: React.FC<TProps> = ({...props}): JSX.Element => {

    const [ collapsed, setCollapsed ] = useState<boolean>(true)

    const collapsedHandler = () => {
        setCollapsed( !collapsed )
    }

    return (
        <div className={styles.root}>
            <Affix>
                <Sider collapsible collapsed={ collapsed } onCollapse={ collapsedHandler } style={{ height: "100vh", overflow: "auto"}}>
                    <Menu selectedKeys={[props.selected as string]} style={{height: "100%", border: "0px"}}>
                    {props.items.map((e, i) => {return(
                        <Menu mode="inline" onClick={(arg)=> props.clickHandler(arg)} style={{border: "0px", paddingBottom: `${i === props.items.length - 1? "48px" : "default" }`}}>
                            <Divider style={{marginTop: `${ i === 0? "0" : "default" }`}}/>
                            {e.map(e=>
                                Object.entries(e).map((e, i)=>
                                    <Menu.Item key={e[0]} icon={e[1]}>
                                        {e[0]}
                                    </Menu.Item>
                                )
                            )}
                            { i === props.items.length - 1 ? <Divider style={{marginBottom: "0px"}}/> : null }
                        </Menu>
                    )})}
                    </Menu>
                </Sider>
            </Affix>
        </div>
    )
}
