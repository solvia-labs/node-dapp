//import {PublicKey} from "@solana/web3.js";

/**
 * NodeData Type
 */
export class NodeData {
    constructor(rewardaddress, nodetype, totalpaid, state){
        this.RewardAddress = rewardaddress;
        this.NodeType = nodetype;
        this.TotalPaid = totalpaid;
        this.state = state;
    }
}

/**
 * Grant Type
 */
export class Grant {
    constructor(rewardaddress, nodetype, totalpaid, state){
        this.RewardAddress = rewardaddress;
        this.NodeType = nodetype;
        this.TotalPaid = totalpaid;
        this.state = state;
    }
}