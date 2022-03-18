import React, {useContext} from "react";

export interface NodeData {
    RewardAddress: string;
    NodeType: string;
    TotalPaid: string;
    state: string;
    NodeHash: string;
}

export interface GrantData {
    GrantHash: string;
    GrantID: string;
    ReceivingAddress: string;
    Amount: string;
    VoteWeight: string;
    PayStartEpoch: string;
    VoteCount: string;
}