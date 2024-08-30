export const tokenCookieName = "web3-user-token";

const rpcOptions = ["localnet", "devnet", "testnet", "mainnet"] as const;
type RpcType = (typeof rpcOptions)[number];
const uRpcType = (process.env.NEXT_PUBLIC_RPC_TYPE || "localnet") as RpcType;

export const rpcType: RpcType = rpcOptions.includes(uRpcType)
  ? uRpcType
  : "devnet";
