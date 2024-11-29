import { ContractListener } from './services/CL.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  try {
    // Get deployed contract info
    const deployedContractPath = path.join(__dirname, 'deployedContract.json');
    // if (!fs.existsSync(deployedContractPath)) {
    //   throw new Error('Please deploy the contract first using: npm run deploy');
    // }

    const { address, abi } = JSON.parse(fs.readFileSync(deployedContractPath));
    console.log('Using contract at:', address);

    // Start listening for events
    const listener = new ContractListener(address, abi);
    await listener.startListening();

    console.log('Listening for ETH deposits...');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();