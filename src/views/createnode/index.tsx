import React, { useCallback } from "react";
import {sendTransaction, useConnection} from "../../contexts/connection";
import * as web3 from "@solana/web3.js";
import { notify } from "../../utils/notifications";
import { ConnectButton } from "./../../components/ConnectButton";
import { LABELS } from "../../constants";
import { useWallet } from "@solana/wallet-adapter-react";

import {
    Form,
    Input,
    Button,
    Select, Col, Row,
} from 'antd';
import {PublicKey} from "@solana/web3.js";

export const CreateNodeView = () => {
    const connection = useConnection();
    const { wallet, publicKey, signTransaction } = useWallet();

    const handleCreateNode = useCallback(async (values) => {
        try {
            if (!publicKey || !wallet) {
                notify({
                    message: "Please Connect your Wallet",
                    type: "error",
                });
                return;
            }

            //const from = publicKey.encode(); //web3.Keypair.fromSecretKey(secretKey);
            //console.log(from.publicKey.toBase58());
            let node_type;
            if(values.nodetype=='PHOENIX')
                node_type=0;
            else if(values.nodetype=='NOVA')
                node_type=1;
            else if(values.nodetype=='FULGUR')
                node_type=2;
            else return;
            let recadd : PublicKey = new PublicKey(values.rewardaddress);
            const params = {
                fromPubkey: publicKey,
                reward_address: recadd,
                node_type: node_type,
            };
            let transaction = new web3.Transaction().add(web3.SystemProgram.createnode(params));

            let { blockhash } = await connection.getRecentBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;
            let signed = await signTransaction(transaction);
            let txid = await connection.sendRawTransaction(signed.serialize());
            await connection.confirmTransaction(txid);
            notify({
                message: "Node Created",
                type: "success",
            });
        } catch (error) {
            notify({
                message: "Error Creating Node",
                type: "error",
            });
            console.error(error);
        }
    }, [publicKey, connection]);

    return (

        <div className="flexColumn" style={{ flex: 1 }}>
            <div>
                <div className="deposit-input-title" style={{ margin: 10 }}>
                    This utility allows to create a Disintegration Node on SOLVIA network.
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
                //console.log({ values });
                handleCreateNode(values);
            }   }
                onFinishFailed={(error) => {
                    console.log({ error });
                }}
            >
                <Form.Item name="rewardaddress" label="Reward Address" rules={[{required:true, message:'Please Enter Reward Address'}, {whitespace:false}]} hasFeedback>
                    <Input />
                </Form.Item>
                <Form.Item name="nodetype" label="Node Type" rules={[{required:true, message:'Select your NodeType'}]} hasFeedback>
                    <Select placeholder={"Select your NodeType"}>
                        <Select.Option value="PHOENIX">PHOENIX</Select.Option>
                        <Select.Option value="NOVA">NOVA</Select.Option>
                        <Select.Option value="FULGUR">FULGUR</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item wrapperCol={{span:4, offset:4}} label="">
                    <Button block type="primary" htmlType={"submit"}>
                        Create Node
                    </Button>
                </Form.Item>
            </Form>
            <Col span={24}>
                <div className="builton" />
            </Col>
        </div>

    );
};
