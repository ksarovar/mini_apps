import { Web3 } from 'web3';
import { UniswapService } from './UniswapService.js';
import dotenv from 'dotenv';
dotenv.config();

export class ContractListener {
  constructor(contractAddress, contractABI) {
    this.web3 = new Web3(process.env.RPC_URL);
    this.contract = new this.web3.eth.Contract(contractABI, contractAddress);
    this.uniswapService = new UniswapService();
  }

  // Start listening for ETH deposit events
  async startListening() {
    console.log('Starting to listen for ETH deposits...');
    
    // Verify Web3 is connected
    try {
      await this.web3.eth.net.isListening();
      console.log('Successfully connected to the network');
    } catch (error) {
      console.error('Error connecting to network:', error);
      return;
    }

    // Log all available events for debugging
    try {
      console.log('Available events:', this.contract.events);

      // Manually check if 'ETHReceived' event is available in the contract
      if (!this.contract.events['ETHReceived(address,uint256)']) {
        console.error('ETHReceived event is not found in the contract.');
        return;
      }

      // Poll for the latest events every 10 seconds
      setInterval(async () => {
        await this.fetchEvents();
      }, 10000); // Poll every 10 seconds

    } catch (error) {
      console.error('Error accessing contract events:', error);
    }
  }

  // Fetch the latest ETHReceived events
  async fetchEvents() {
    try {
      const events = await this.contract.getPastEvents('ETHReceived', {
        fromBlock: 'latest',  // You can specify a block range if needed
        toBlock: 'latest',
      });

      if (events.length > 0) {
        events.forEach(async (event) => {
          // Decode event data
          const amount = this.web3.utils.fromWei(event.returnValues.amount, 'ether');
          const sender = event.returnValues.from;
          console.log(`Received ${amount} ETH from ${sender}`);
          
          try {
            await this.uniswapService.convertEthToUsdc(amount);
            console.log(`Successfully converted ${amount} ETH to USDC`);
          } catch (error) {
            console.error('Error converting to USDC:', error);
          }
        });
      } else {
        console.log('No new ETHReceived events found.');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }
}
