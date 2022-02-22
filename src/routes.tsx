import { HashRouter, Route, Switch } from "react-router-dom";
import React, { useMemo } from "react";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { ConnectionProvider } from "./contexts/connection";
import { AccountsProvider } from "./contexts/accounts";
import { MarketProvider } from "./contexts/market";
import { AppLayout } from "./components/Layout";

import {CreateNodeView, FaucetView, GrantsView, HomeView} from "./views";
import {AllNodesView} from "./views/allnodes/index"
import {
  getSolletWallet
} from "@solana/wallet-adapter-wallets";
export function Routes() {
  const wallets = useMemo(
    () => [
      getSolletWallet(),
    ],
    []
  );
  // hack fix solvia icon
  var wallets_solvia = wallets;
  wallets_solvia.forEach(item => item.icon='https://raw.githubusercontent.com/solvia-labs/solvia-icons/main/solvia_logo_color.svg');
  return (
    <HashRouter basename={"/"}>
      <ConnectionProvider>
        <WalletProvider wallets={wallets_solvia} autoConnect>
          <AccountsProvider>
            <MarketProvider>
              <AppLayout>
                <Switch>
                  <Route exact path="/" component={() => <HomeView />} />
                  <Route exact path="/faucet" children={<FaucetView />} />
                  <Route exact path="/createnode" children={<CreateNodeView />} />
                  <Route exact path="/viewnodes" children={<AllNodesView />} />
                  <Route exact path="/grants" children={<GrantsView />} />
                </Switch>
              </AppLayout>
            </MarketProvider>
          </AccountsProvider>
        </WalletProvider>
      </ConnectionProvider>
    </HashRouter>
  );
}
