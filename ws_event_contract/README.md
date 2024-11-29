# Automatic ETH to USDC Converter

This system automatically converts received ETH to USDC on the Sepolia testnet using Uniswap V3.

## Features

- Smart contract to receive ETH payments
- Automatic conversion to USDC using Uniswap V3
- Event monitoring for deposits
- Modular architecture for easy maintenance

## Setup

1. Create a `.env` file with your credentials:
   ```
   PRIVATE_KEY=your_private_key_here
   RPC_URL=your_sepolia_rpc_url_here
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Deploy the contract:
   ```bash
   npm run deploy
   ```

4. Start the listener:
   ```bash
   npm start
   ```

## How it Works

1. Users send ETH to the deployed contract address
2. The contract emits an event for each received payment
3. The listener detects the event and triggers the conversion
4. ETH is automatically swapped to USDC using Uniswap V3

## Important Notes

- Make sure you have test ETH in your Sepolia wallet
- Keep your private key secure
- In production, implement proper slippage protection
- Monitor gas prices for optimal conversion timing