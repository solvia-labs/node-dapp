import React from "react";
import {Layout, Menu} from "antd";
import {Link} from "react-router-dom";
import './sidebar.css';

import {
    DashboardOutlined,
    FireOutlined,
    UnorderedListOutlined,
    DollarOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
export class SiderDemo extends React.Component {
    state = {
        collapsed: false,
    };
    HomeIcon = () => {
        return (
            <img
                src='https://raw.githubusercontent.com/solvia-labs/solvia-icons/main/solvia_logo_color.svg'
                style={{ width: 35, height: 35, marginRight: 8, marginLeft: 4 }}
                alt={` icon`}
            />
        );
    };
    onCollapse = (collapsed: any) => {
        this.setState({ collapsed });
    };
    render () {
        const { collapsed } = this.state;
        const HomeIcon = this.HomeIcon;
        return <Sider
                      breakpoint="sm" collapsible collapsed={collapsed} onCollapse={this.onCollapse} className="sidebar">
            <div className="logo" > <HomeIcon/> {!collapsed && <div>Solvia Nodes</div>} </div>
                <Menu theme="dark"  mode="inline">
                    <Menu.Item key="1" icon={<DashboardOutlined style={{ fontSize: '16px' }}/>}>
                        <Link to="/">
                            Dashboard
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<FireOutlined style={{ fontSize: '16px' }}/>} >
                       <Link to="/createnode">
                            Create Node
                       </Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UnorderedListOutlined style={{ fontSize: '16px' }}/>}>
                        <Link to="/viewnodes">
                        View All Nodes
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<DollarOutlined style={{ fontSize: '16px' }}/>}>
                        <Link to="/grants">
                            View Grants
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<DollarOutlined style={{ fontSize: '16px' }}/>}>
                        <Link to="/voteongrant">
                            Vote on Grants
                        </Link>
                    </Menu.Item>
                </Menu>
            </Sider>
    }

};
