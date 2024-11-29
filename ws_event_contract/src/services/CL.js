import { Web3 } from 'web3';
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
        console.log('No new ETHReceived events found......');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }
}

export class UniswapService {
  constructor() {
    this.web3 = new Web3(process.env.RPC_URL);
    this.UNISWAP_ROUTER = '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD'; // Uniswap V2 Router address
    this.USDC_ADDRESS = '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8'; // USDC token address on Sepolia
    this.WETH_ADDRESS = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'; // WETH address on Sepolia
    
    // Set the default account
    this.account = this.web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    this.web3.eth.defaultAccount = this.account.address;
  }

  // Convert ETH to USDC
  async convertEthToUsdc(ethAmount) {
    const router = new this.web3.eth.Contract(this.getRouterABI(), this.UNISWAP_ROUTER);
    const ethAmountWei = this.web3.utils.toWei(ethAmount.toString(), 'ether');

    try {
      // Build the swap transaction
      const tx = await this.buildSwapTransaction(router, ethAmountWei);
  
      // Execute the transaction
      return await this.executeTransaction(tx);
    } catch (error) {
      console.error(`Error during conversion from ETH to USDC:`, error);
      throw error;  // Rethrow to propagate the error
    }
  }

  // Build the swap transaction
  async buildSwapTransaction(router, ethAmountWei) {
    try {
      const path = [this.WETH_ADDRESS, this.USDC_ADDRESS];  // Define the path for the swap (ETH -> USDC)
      const to = this.account.address;
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes deadline
  
      // Calculate the expected output (amount of USDC) for the given ETH amount
    //   const amountsOut = await router.methods.getAmountsOut(ethAmountWei, path).call();
      const amountOutMin = 10 // Set amountOutMin to the expected output (second element in the array)
  
      // Encode the transaction data for Uniswap swapExactETHForTokens
      const data = router.methods.swapExactETHForTokens(
        amountOutMin,
        path,
        to,
        deadline
      ).encodeABI();
  
      // Estimate gas for the transaction
      const gasEstimate = await this.web3.eth.estimateGas({
        from: this.account.address,
        to: this.UNISWAP_ROUTER,
        value: ethAmountWei,
        data: data
      });
  
      // Get the current gas price for legacy transactions
      const gasPrice = await this.web3.eth.getGasPrice();
  
      // Get chainId to check if it's Sepolia (Chain ID 11155111)
      const chainId = await this.web3.eth.getChainId();
  
      // Build the transaction object
      let tx = {
        from: this.account.address,
        to: this.UNISWAP_ROUTER,
        value: ethAmountWei,
        data: data,
        gas: gasEstimate, // Use the estimated gas
      };
  
      // For Sepolia (Chain ID 11155111), use EIP-1559 gas parameters
      if (chainId === 11155111) {
        const maxPriorityFeePerGas = await this.web3.eth.getMaxPriorityFeePerGas();
        const maxFeePerGas = await this.web3.eth.getMaxFeePerGas();
        tx.maxPriorityFeePerGas = maxPriorityFeePerGas;
        tx.maxFeePerGas = maxFeePerGas;
      } else {
        // For other networks, fallback to legacy gasPrice
        tx.gasPrice = gasPrice;
      }

      // Log the transaction data for debugging
      console.log('Transaction Data:', tx);
  
      return tx;
    } catch (error) {
      console.error('Error building swap transaction:', error);
      throw error;  // Rethrow to propagate the error
    }
  }

  // Execute the signed transaction
  async executeTransaction(tx) {
    try {
      // Sign the transaction with the private key
      const signedTx = await this.web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);

      // Send the signed transaction
      const receipt = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      console.log(`Swap successful! Hash: ${receipt.transactionHash}`);
      return receipt;
    } catch (error) {
      console.error('Swap failed during transaction execution:', error);
      throw error;  // Rethrow to propagate the error
    }
  }

  // Get the ABI for the Uniswap Router contract
  getRouterABI() {
    return [
      {
        inputs: [
          { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
          { internalType: 'address[]', name: 'path', type: 'address[]' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' }
        ],
        name: 'swapExactETHForTokens',
        outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
        stateMutability: 'payable',
        type: 'function'
      }
    ];
  }
}

