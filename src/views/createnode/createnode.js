import * as web3 from '@solana/web3.js';

async function create_node() {
    // Connect to cluster
    var connection = new web3.Connection(
        'http://127.0.0.1:8899',
        'confirmed',
    );

    const secretKey = Buffer.from(
        'mdqVWeFekT7pqy5T49+tV12jO0m+ESW7ki4zSU9JiCgbL0kJbj5dvQ/PqcDAzZLZqzshVEs01d1KZdmLh4uZIg==',
        'base64',
    );
    const from = web3.Keypair.fromSecretKey(secretKey);
    console.log(from.publicKey.toBase58());

    const params = {
        fromPubkey: from.publicKey,
        SysvarFNDataPubkey: web3.SYSVAR_FNODEDATA_PUBKEY,
        reward_address: web3.Keypair.generate().publicKey,
        node_type: 0,
    };

    var transaction = new web3.Transaction().add(web3.SystemProgram.createnode(params));

    //console.log(dectx);
    //console.log(decodedtx);
    // get account info
    // account data is bytecode that needs to be deserialized
    // serialization and deserialization is program specic
    //let account = await connection.getAccountInfo(wallet.publicKey);
    //console.log(account);
    // Sign transaction, broadcast, and confirm
    var signature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [from],
    );
    //console.log('privkey', from.secretKey);
}