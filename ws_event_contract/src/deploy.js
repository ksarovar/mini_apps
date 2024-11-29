import { Web3 } from 'web3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import solc from 'solc';
import dotenv from 'dotenv';
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function compile() {
  const contractPath = path.resolve(__dirname, 'contracts', 'ETHReceiver.sol');
  const source = fs.readFileSync(contractPath, 'utf8');

  const input = {
    language: 'Solidity',
    sources: {
      'ETHReceiver.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };

  // Compile the Solidity code
  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  // Check if there are any errors
  if (output.errors) {
    output.errors.forEach(error => {
      console.error(error.formattedMessage || error.message);
    });
  }

  // Check if the contract output is found
  if (!output.contracts || !output.contracts['ETHReceiver.sol']) {
    throw new Error("Compilation failed or contract not found in the output.");
  }

  // Log the compiled contract for debugging
  console.log("Compiled Contract Output: ", output.contracts['ETHReceiver.sol'].ETHReceiver);

  // Return the compiled contract
  return output.contracts['ETHReceiver.sol'].ETHReceiver;
}


async function deploy() {
  const web3 = new Web3(process.env.RPC_URL);
  const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
  web3.eth.defaultAccount = account.address;

  const contract = await compile();
  const deploy = new web3.eth.Contract(contract.abi)
    .deploy({
      data: contract.evm.bytecode.object,
    });

  const gas = await deploy.estimateGas();
  const tx = {
    from: account.address,
    gas,
    data: deploy.encodeConstructorParams(),
  };

  const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

  console.log('Contract deployed at:', receipt.contractAddress);
  return { address: receipt.contractAddress, abi: contract.abi };
}

deploy().catch(console.error);