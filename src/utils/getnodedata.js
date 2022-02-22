import * as web3 from '@solana/web3.js';
import {BufferReader} from '../utils/bufferutils.js';
import {NodeData} from "../utils/types";
import bs58 from 'base-58';
export async function getnodedata() {
    var connection = new web3.Connection(
        'http://127.0.0.1:8899',
        'confirmed',
    );
    const nodedata = await connection.getAccountInfo(
        web3.SYSVAR_FNODEDATA_PUBKEY,
        'confirmed',
    );
    let node_array = decodegrantdatavector(nodedata.data);
    return (node_array);
}

function decodegrantdatavector(byteArray) {
    var buffer = new BufferReader(byteArray);
    var node_count = buffer.readUInt64();
    let node_array = Array();
    let rewardaddress,nodetypestr,totalpaid,statestr;
    console.log("No Of Nodes: ",Number(node_count));
    for (let i = 0; i < node_count; ++i) {
        rewardaddress = bs58.encode(buffer.readSlice(32));
        let nodetype = buffer.readInt8();
        if (nodetype===0) {nodetypestr = "PHOENIX";}
        else if(nodetype === 1) {nodetypestr = "NOUA";}
        else {nodetypestr = "FULGUR";}
        totalpaid = buffer.readUInt64();
        let state = buffer.readInt8();
        if(state === 0) {statestr = "Activating";}
        else {statestr = "Activated";}
        let node = new NodeData(rewardaddress,nodetypestr,totalpaid,statestr);
        node_array.push(node);
    }
    return node_array;
}



