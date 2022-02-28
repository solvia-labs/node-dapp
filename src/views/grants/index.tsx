import React, {useCallback, useEffect, useState} from "react";
import { useConnection } from "../../contexts/connection";
import * as web3 from '@solana/web3.js';
import { notify } from "../../utils/notifications";
import { LABELS } from "../../constants";
import { useWallet } from "@solana/wallet-adapter-react";
import {GrantData} from "../../contexts/nodestate";
import {Button, Table} from "antd";
import {BufferReader} from "../../utils/bufferutils";


export const GrantsView = () => {
    const connection = useConnection();
    const { publicKey } = useWallet();

    const [totals, setTotals] = useState<GrantData[]>([{
        GrantHash: '',
        GrantID: '',
        ReceivingAddress: '',
        Amount: '',
        VoteWeight: '',
        PayStartEpoch: '',
        VoteCount: ''
    }]);

    useEffect(() => {
        // fetch token files
        (async () => {
            await handleRefresh();
        })();
    }, [connection]);

    function decodegrantdatavector(byteArray: Buffer) {
        var buffer = new BufferReader(byteArray);
        var grant_count = buffer.readUInt64();
        let grants_array = [];
        let granthashstr, grantidstr, recaddstr, amountstr, voteweight, votecount, paystartepoch;
        //console.log("No Of Grants: ",Number(grant_count));
        for (let i = 0; i < grant_count; ++i) {
            var BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
            var bs58 = require('base-x')(BASE58);

            //decoding grant_data
            granthashstr = toHexString(buffer.readSlice(32));
            grantidstr = buffer.readInt16();
            recaddstr = bs58.encode(buffer.readSlice(32));
            amountstr = buffer.readUInt64();
            voteweight = buffer.readInt32();
            paystartepoch = buffer.readUInt64();
            votecount = buffer.readUInt64();
            for (let j=0;j<votecount;++j){
                console.log("Vote ", j, toHexString(buffer.readSlice(32)));
            }
            let node: GrantData = {
                GrantHash: granthashstr,
                GrantID: grantidstr,
                ReceivingAddress: recaddstr,
                Amount: amountstr,
                VoteWeight: voteweight,
                PayStartEpoch: paystartepoch,
                VoteCount: votecount
            };
            //console.log(node);
            grants_array.push(node);

        }
        return grants_array;
    }

    function toHexString(byteArray : Buffer) {
        return Array.from(byteArray, function(byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('')
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
                web3.GRANT_DATA_PUBKEY,
                'confirmed',
            );
            if (!sysvaraccount) {
                throw Error("Error");
            }
            let grants = decodegrantdatavector(sysvaraccount.data)
            setTotals(grants);

        } catch (error) {
            notify({
                message: "Fetch Grants List Failed",
                type: "error",
            });
            console.error(error);
        }
    }, [connection]);

    const columns = [
        {
            title: 'Grant Hash',
            dataIndex: 'GrantHash',
            key: 'GrantHash',
        },
        {
            title: 'GrantID',
            dataIndex: 'GrantID',
            key: 'Grant ID',
        },
        {
            title: 'Receiving Address',
            dataIndex: 'ReceivingAddress',
            key: 'ReceivingAddress',
        },
        {
            title: 'Amount',
            dataIndex: 'Amount',
            key: 'Amount',
        },
        {
            title: 'Vote Weight',
            dataIndex: 'VoteWeight',
            key: 'VoteWeight',
        },
        {
            title: 'Vote Count',
            dataIndex: 'VoteCount',
            key: 'VoteCount',
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
