import {Button, Col, Row, Table} from "antd";
import React, {useCallback, useEffect, useState} from "react";
import {useConnection, useConnectionConfig} from "../../contexts/connection";
import { useMarkets } from "../../contexts/market";
import { useUserBalance, useUserTotalBalance } from "../../hooks";
import { WRAPPED_SOL_MINT } from "../../utils/ids";
import { formatUSD } from "../../utils/utils";
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import * as web3 from "@solana/web3.js";
import {notify} from "../../utils/notifications";
import {NodeData} from "../../contexts/nodestate";
import {BufferReader} from "../../utils/bufferutils";
import {useWallet} from "@solana/wallet-adapter-react";

export const HomeView = () => {
  const { marketEmitter, midPriceInUSD } = useMarkets();
  const { tokenMap } = useConnectionConfig();
  //const SRM_ADDRESS = "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt";
  //const SRM = useUserBalance(SRM_ADDRESS);
  const SOL = useUserBalance(WRAPPED_SOL_MINT);
  const { balanceInUSD: totalBalanceInUSD } = useUserTotalBalance();


  const connection = useConnection();

  const { publicKey } = useWallet();
  const [totals, setTotals] = useState<NodeData[]>([{
    RewardAddress: "",
    NodeType: "",
    TotalPaid: "",
    state: "",
    NodeHash:"",
  }]);

  const handleRefresh = useCallback(async () => {
    try {
      if (!publicKey) {
        notify({
          message: "Please Connect your Wallet",
          type: "error",
        });
        return;
      }
      // await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL);
      // notify({
      //     message: LABELS.ACCOUNT_FUNDED,
      //     type: "success",
      // });
      const sysvaraccount = await connection.getAccountInfo(
          web3.SYSVAR_FNODEDATA_PUBKEY,
          'confirmed',
      );
      if (!sysvaraccount) {
        throw Error("Error");
      }
      let nodes = decodegrantdatavector(sysvaraccount.data);
      setTotals(nodes);

    } catch (error) {
      notify({
        message: "Fetch Node List Failed",
        type: "error",
      });
      console.error(error);
    }
  }, [publicKey, connection]);

  useEffect(() => {
    // fetch token files
    (async () => {
      await handleRefresh();
    })();
  }, [publicKey, connection, handleRefresh]);

  function decodegrantdatavector(byteArray: Buffer) {
    if (!publicKey) {
      let node_array = [];
      let node: NodeData = {
        RewardAddress: '',
        NodeType: '',
        TotalPaid: '',
        state: '',
        NodeHash: '',
      };
      node_array.push(node);
      return node_array;
    }
    var buffer = new BufferReader(byteArray);
    var node_count = buffer.readUInt64();
    let node_array = [];
    let rewardaddressstr,nodetypestr,totalpaidstr,statestr,nodehashstr;
    //console.log("No Of Nodes: ",Number(node_count));
    for (let i = 0; i < node_count; ++i) {
      var BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      var bs58 = require('base-x')(BASE58);
      rewardaddressstr = bs58.encode(buffer.readSlice(32));

      let nodetype = buffer.readInt8();
      if (nodetype===0) {nodetypestr = "PHOENIX";}
      else if(nodetype === 1) {nodetypestr = "NOVA";}
      else {nodetypestr = "FULGUR";}

      let totalpaid = buffer.readUInt64() / LAMPORTS_PER_SOL;
      totalpaidstr = totalpaid.toString();
      let state = buffer.readInt8();
      if(state === 0) {statestr = "Activating";}
      else {statestr = "Activated";}
      nodehashstr = toHexString(buffer.readSlice(32));
      let node: NodeData = {
        RewardAddress: rewardaddressstr,
        NodeType: nodetypestr,
        TotalPaid: totalpaidstr,
        state: statestr,
        NodeHash: nodehashstr,
      };
      //console.log(publicKey);
      if(rewardaddressstr === publicKey.toString())
        node_array.push(node);

    }
    return node_array;
  }
  function toHexString(byteArray : Buffer) {
    return Array.from(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
  }


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

  const columns = [
    {
      title: 'Reward Address',
      dataIndex: 'RewardAddress',
      key: 'RewardAddress',
    },
    {
      title: 'Node Type',
      dataIndex: 'NodeType',
      key: 'NodeType',
    },
    {
      title: 'Total Paid',
      dataIndex: 'TotalPaid',
      key: 'TotalPaid',
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'Node Hash',
      dataIndex: 'NodeHash',
      key: 'NodeHash',
    },
  ];

    return (
    <Row gutter={[16, 16]} align="middle">
      <Col span={24}>
        <h2>Your balances ({formatUSD.format(totalBalanceInUSD)}):</h2>
        <h2>
          SOLVIA: {SOL.balance/LAMPORTS_PER_SOL} ({formatUSD.format(SOL.balanceInUSD)})
        </h2>
      </Col>
      <Col span={24}>
        <div>
          <h1>Your Nodes : </h1>
        </div>
      <div>
        <Button type="primary" onClick={handleRefresh}>
          Refresh
        </Button>
      </div>
      <div className="flexColumn">
        <Table columns={columns} dataSource={totals} />
      </div>
      </Col>
      <Col span={24}>
        <div className="builton" />
      </Col>
    </Row>
  );
};
