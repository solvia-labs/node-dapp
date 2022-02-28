import React, { useCallback } from "react";
import {useConnection} from "../../contexts/connection";
import * as web3 from "@solana/web3.js";
import { notify } from "../../utils/notifications";
import { useWallet } from "@solana/wallet-adapter-react";

import {
    Form,
    Input,
    Button,
    Select, Col,
} from 'antd';

export const VoteonGrantView = () => {
    const connection = useConnection();
    const { wallet, publicKey, signTransaction } = useWallet();

    const handleVoteonGrant = useCallback(async (values) => {
        try {
            if (!publicKey || !wallet) {
                notify({
                    message: "Please Connect your Wallet",
                    type: "error",
                });
                return;
            }
            let vote_type : boolean;
            if(values.votetype==='YES')
                vote_type=true;
            else if(values.votetype==='NO')
                vote_type=false;
            else return;
            let grant_hash : Buffer = Buffer.from(values.granthash,'hex');
            console.log(grant_hash);
            const params = {
                fromPubkey: publicKey,
                GrantHash: grant_hash,
                Vote: vote_type,
            };
            let transaction = new web3.Transaction().add(web3.SystemProgram.voteongrant(params));

            let { blockhash } = await connection.getRecentBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;
            let signed = await signTransaction(transaction);
            let txid = await connection.sendRawTransaction(signed.serialize());
            console.log("txid",txid);
            await connection.confirmTransaction(txid);
            notify({
                message: "Voted",
                type: "success",
            });
        } catch (error) {
            notify({
                message: "Error. Make sure you have active Node with same connected wallet",
                type: "error",
            });
            console.error(error);
        }
    }, [publicKey, connection, wallet, signTransaction]);

    return (
        <div className="flexColumn" style={{ flex: 1 }}>
            <div>
                <div className="deposit-input-title" style={{ margin: 10 }}>
                    This utility allows to vote on a Grant on SOLVIA network.
                </div>
            </div>
            <Form
                labelCol={{
                    span: 5,
                }}
                wrapperCol={{
                    span: 8,
                }}
                layout="horizontal"
                onFinish={(values) => {
                    console.log({ values });
                    handleVoteonGrant(values);
                }   }
                onFinishFailed={(error) => {
                    console.log({ error });
                }}
            >
                <Form.Item name="granthash" label="Grant Hash" rules={[{required:true, message:'Please Enter Grant Hash'}, {whitespace:false}]} hasFeedback>
                    <Input />
                </Form.Item>
                <Form.Item name="votetype" label="Vote" rules={[{required:true, message:'Select your Vote(yes/no)'}]} hasFeedback>
                    <Select placeholder={"Select your Vote(yes/no)"}>
                        <Select.Option value="YES">YES</Select.Option>
                        <Select.Option value="NO">NO</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item wrapperCol={{span:4, offset:4}} label="">
                    <Button block type="primary" htmlType={"submit"}>
                        Vote on Grant
                    </Button>
                </Form.Item>
            </Form>
            <Col span={24}>
                <div className="builton" />
            </Col>
        </div>

    );
};
