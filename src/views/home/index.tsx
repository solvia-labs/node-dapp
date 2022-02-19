import { Button, Col, Row } from "antd";
import React, {FC, useEffect} from "react";
import { Link } from "react-router-dom";
import { useConnectionConfig } from "../../contexts/connection";
import { useMarkets } from "../../contexts/market";
import { useUserBalance, useUserTotalBalance } from "../../hooks";
import { WRAPPED_SOL_MINT } from "../../utils/ids";
import { formatUSD } from "../../utils/utils";

export const HomeView = () => {
  const { marketEmitter, midPriceInUSD } = useMarkets();
  const { tokenMap } = useConnectionConfig();
  //const SRM_ADDRESS = "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt";
  //const SRM = useUserBalance(SRM_ADDRESS);
  const SOL = useUserBalance(WRAPPED_SOL_MINT);
  const { balanceInUSD: totalBalanceInUSD } = useUserTotalBalance();



  useEffect(() => {
    const refreshTotal = () => {};

    const dispose = marketEmitter.onMarket(() => {
      refreshTotal();
    });

    refreshTotal();

    return () => {
      dispose();
    };
  }, [marketEmitter, midPriceInUSD, tokenMap]);

    const BurnIcon = () => {
        return (
            <img
                src='https://raw.githubusercontent.com/solvia-labs/solvia-icons/main/solvia_burn.svg'
                style={{ width: 24, height: 24, marginRight: 2, marginLeft: -8 }}
                alt={` icon`}
                />
        );
    };
  return (
    <Row gutter={[16, 16]} align="middle">
      <Col span={24}>
        <h2>Your balances ({formatUSD.format(totalBalanceInUSD)}):</h2>
        <h2>
          SOLVIA: {SOL.balance} ({formatUSD.format(SOL.balanceInUSD)})
        </h2>
      </Col>

        <Col span={8}>
                <Button type="primary" icon={<BurnIcon />}>
                    Create Node
                </Button>
        </Col>
      <Col span={8}>
        <Link to="/faucet">
          <Button type="default">
              View All Nodes
          </Button>
        </Link>
      </Col>
        <Col span={8}>
            <Button type="default">
                View Grants for Voting
            </Button>
        </Col>

      <Col span={24}>
        <div className="builton" />
      </Col>
    </Row>
  );
};
