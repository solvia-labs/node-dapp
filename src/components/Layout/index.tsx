import React from "react";
import "./../../App.less";
import { Layout } from "antd";
import { Link } from "react-router-dom";
import { WalletModalProvider } from "@solana/wallet-adapter-ant-design";

import { LABELS } from "../../constants";
import { AppBar } from "../AppBar";
import {SiderDemo} from "../SideBar/sidebar";
const { Header, Content } = Layout;

const HomeIcon = () => {
  return (
      <img
          src='https://raw.githubusercontent.com/solvia-labs/solvia-icons/main/dis_nodes.svg'
          style={{ width: 4000, height: 200, marginRight: 8, marginLeft: -4 }}
          alt={` icon`}
      />
  );
};

export const AppLayout = React.memo(({ children }) => {
  return (
    <WalletModalProvider>
      <div className="App">
        <Layout title={LABELS.APP_TITLE}>
          <SiderDemo />
          <Layout>
          <Header className="App-Bar">
            <AppBar />
          </Header>
          <Content style={{ padding: "0 50px" }}>{children}</Content>
          </Layout>

        </Layout>
      </div>
    </WalletModalProvider>
  );
});
