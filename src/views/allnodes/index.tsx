import React, {useCallback, useState} from "react";
import { useConnection } from "../../contexts/connection";
import * as web3 from '@solana/web3.js';
import { notify } from "../../utils/notifications";
import { LABELS } from "../../constants";
import { useWallet } from "@solana/wallet-adapter-react";
import {NodeData} from "../../contexts/nodestate";
import {Button, Table} from "antd";
import {BufferReader} from "../../utils/bufferutils";


export const AllNodesView = () => {
    const connection = useConnection();
    const { publicKey } = useWallet();

    const [totals, setTotals] = useState<NodeData[]>([{
        RewardAddress: "",
        NodeType: "",
        TotalPaid: "",
        state: "",
    }]);

    function decodegrantdatavector(byteArray: Buffer) {
        var buffer = new BufferReader(byteArray);
        var node_count = buffer.readUInt64();
        let node_array = [];
        let rewardaddressstr,nodetypestr,totalpaidstr,statestr;
        console.log("No Of Nodes: ",Number(node_count));
        for (let i = 0; i < node_count; ++i) {
            var BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
            var bs58 = require('base-x')(BASE58);
            rewardaddressstr = bs58.encode(buffer.readSlice(32));

            let nodetype = buffer.readInt8();
            if (nodetype===0) {nodetypestr = "PHOENIX";}
            else if(nodetype === 1) {nodetypestr = "NOUA";}
            else {nodetypestr = "FULGUR";}

            totalpaidstr = buffer.readUInt64();

            let state = buffer.readInt8();
            if(state === 0) {statestr = "Activating";}
            else {statestr = "Activated";}

            let node: NodeData = {
                RewardAddress: rewardaddressstr,
                NodeType: nodetypestr,
                TotalPaid: totalpaidstr,
                state: statestr,
            };
            node_array.push(node);

        }
        return node_array;
    }

    const handleRefresh = useCallback(async () => {
        try {
            // if (!publicKey) {
            //     return;
            // }
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
            let nodes = decodegrantdatavector(sysvaraccount.data)
            setTotals(nodes);

        } catch (error) {
            notify({
                message: LABELS.AIRDROP_FAIL,
                type: "error",
            });
            console.error(error);
        }
    }, [connection]);

    const columns = [
        {
            title: 'RewardAddress',
            dataIndex: 'RewardAddress',
            key: 'RewardAddress',
        },
        {
            title: 'NodeType',
            dataIndex: 'NodeType',
            key: 'NodeType',
        },
        {
            title: 'TotalPaid',
            dataIndex: 'TotalPaid',
            key: 'TotalPaid',
        },
        {
            title: 'State',
            dataIndex: 'state',
            key: 'state',
        },
    ];

    return (
        <div className="flexColumn" style={{ flex: 1 }}>
            <div>
                <Button type="primary" onClick={handleRefresh}>
                    Refresh
                </Button>
            </div>
            <div className="flexColumn">
                <Table columns={columns} dataSource={totals} />
            </div>
        </div>

    );
};
