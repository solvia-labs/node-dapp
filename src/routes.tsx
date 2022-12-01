import { HashRouter, Route, Switch } from "react-router-dom";
import React, { useMemo } from "react";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { ConnectionProvider } from "./contexts/connection";
import { AccountsProvider } from "./contexts/accounts";
import { MarketProvider } from "./contexts/market";
import { AppLayout } from "./components/Layout";

import {CreateNodeView, FaucetView, GrantsView, HomeView, AllNodesView, VoteonGrantView} from "./views";

import {
  getSolletWallet
} from "@solana/wallet-adapter-wallets";

import { SolletWalletAdapterConfig } from '@solana/wallet-adapter-sollet';

export function Routes() {
  const config : SolletWalletAdapterConfig =  {provider : "https://wallet.solvia.io"};
  const wallets = useMemo(
    () => [
      getSolletWallet(config),
    ],
    [config]
  );
  // hack fix solvia icon
  let wallets_solvia = wallets;
  wallets_solvia.forEach(item => item.icon='https://raw.githubusercontent.com/solvia-labs/solvia-icons/main/solvia_logo_color.svg');
  wallets_solvia.forEach(item => item.url='https://wallet.solvia.io');
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
                  <Route exact path="/voteongrant" children={<VoteonGrantView />} />
                </Switch>
              </AppLayout>
            </MarketProvider>
          </AccountsProvider>
        </WalletProvider>
      </ConnectionProvider>
    </HashRouter>
  );
}
