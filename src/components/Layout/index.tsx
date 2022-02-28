import React from "react";
import "./../../App.less";
import { Layout } from "antd";
import { WalletModalProvider } from "@solana/wallet-adapter-ant-design";

import { LABELS } from "../../constants";
import { AppBar } from "../AppBar";
import {SiderDemo} from "../SideBar/sidebar";
const { Header, Content } = Layout;
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
