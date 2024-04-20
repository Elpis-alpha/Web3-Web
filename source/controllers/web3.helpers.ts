import * as web3 from '@solana/web3.js'
import * as token from '@solana/spl-token'

type focatatt = {
  payer: web3.PublicKey, mint: token.Mint
}
export const findOrCreateAssociatedTokenAccountTransaction = async ({ payer, mint }: focatatt) => {
  const associatedTokenAddress = await token.getAssociatedTokenAddress(mint.address, payer, false);

  const transaction = new web3.Transaction().add(
    token.createAssociatedTokenAccountInstruction(
      payer,
      associatedTokenAddress,
      payer,
      mint.address
    )
  )

  return { transaction, associatedTokenAddress: associatedTokenAddress }
}

type focatatfot = {
  payer: web3.PublicKey, mint: token.Mint, owner: web3.PublicKey
}
export const findOrCreateAssociatedTokenAccountForOthersTransaction = async ({ payer, mint, owner }: focatatfot) => {
  const associatedTokenAddress = await token.getAssociatedTokenAddress(mint.address, owner, false);

  const transaction = new web3.Transaction().add(
    token.createAssociatedTokenAccountInstruction(
      payer,
      associatedTokenAddress,
      owner,
      mint.address
    )
  )

  return { transaction, associatedTokenAddress: associatedTokenAddress }
}

type cftawm = {
  connection: web3.Connection, publicAddress: web3.PublicKey, mint: token.Mint
}
export const getTokenAccountWithMint = async ({ connection, publicAddress, mint }: cftawm) => {
  const associatedTokenAddress = await token.getAssociatedTokenAddress(mint.address, publicAddress, false);
  const accountInfo = await connection.getAccountInfo(associatedTokenAddress);
  return { accountInfo, associatedTokenAddress }
}

type mintTokensType = {
  mint: web3.PublicKey, destination: web3.PublicKey, authority: web3.PublicKey, amount: number
}
export const mintTokens = async ({ mint, destination, authority, amount }: mintTokensType) => {
  const transaction = new web3.Transaction().add(
    token.createMintToInstruction(
      mint,
      destination,
      authority,
      amount
    )
  )

  return transaction
}

export const getAcountTokensBalance = async ({ connection, publicKey }: { connection: web3.Connection, publicKey: web3.PublicKey }) => {
  const tokenAccount = await connection.getTokenAccountBalance(publicKey)
  return tokenAccount.value
}