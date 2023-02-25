/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
import { TransactionCall, BlockTags, Transaction, Address } from 'web3-types';
import { decodeParameters } from 'web3-eth-abi';
import { Web3Eth } from '../../../src';
import {
	closeOpenConnection,
	createTempAccount,
	getSystemTestBackend,
	getSystemTestProvider,
} from '../../fixtures/system_test_utils';
import { SimpleRevertDeploymentData } from '../../fixtures/simple_revert';

describe('Web3Eth.call', () => {
	const expectedEncodedGreet =
		'0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000017736f6c79656e7420677265656e2069732070656f706c65000000000000000000';
	const expectedDecodedGreet = 'solyent green is people';
	const greetCallData = '0xcfae3217';
	const greeterAbiFragment = {
		inputs: [],
		name: 'greet',
		outputs: [
			{
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	};

	let web3Eth: Web3Eth;
	let greeterContractAddress: string;
	let tempAcc: { address: string; privateKey: string };

	beforeAll(async () => {
		web3Eth = new Web3Eth(getSystemTestProvider());
		const greeterContractDeploymentData =
			'0x60806040523480156200001157600080fd5b5060405162000a6a38038062000a6a8339818101604052810190620000379190620002a4565b80600090805190602001906200004f92919062000057565b505062000359565b828054620000659062000324565b90600052602060002090601f016020900481019282620000895760008555620000d5565b82601f10620000a457805160ff1916838001178555620000d5565b82800160010185558215620000d5579182015b82811115620000d4578251825591602001919060010190620000b7565b5b509050620000e49190620000e8565b5090565b5b8082111562000103576000816000905550600101620000e9565b5090565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620001708262000125565b810181811067ffffffffffffffff8211171562000192576200019162000136565b5b80604052505050565b6000620001a762000107565b9050620001b5828262000165565b919050565b600067ffffffffffffffff821115620001d857620001d762000136565b5b620001e38262000125565b9050602081019050919050565b60005b8381101562000210578082015181840152602081019050620001f3565b8381111562000220576000848401525b50505050565b60006200023d6200023784620001ba565b6200019b565b9050828152602081018484840111156200025c576200025b62000120565b5b62000269848285620001f0565b509392505050565b600082601f8301126200028957620002886200011b565b5b81516200029b84826020860162000226565b91505092915050565b600060208284031215620002bd57620002bc62000111565b5b600082015167ffffffffffffffff811115620002de57620002dd62000116565b5b620002ec8482850162000271565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200033d57607f821691505b602082108103620003535762000352620002f5565b5b50919050565b61070180620003696000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063a41368621461003b578063cfae32171461006c575b600080fd5b6100556004803603810190610050919061043f565b61008a565b60405161006392919061052b565b60405180910390f35b6100746101b0565b604051610081919061055b565b60405180910390f35b600060607f0d363f2fba46ab11b6db8da0125b0d5484787c44e265b48810735998bab12b756000846040516100c0929190610672565b60405180910390a182600090805190602001906100de929190610242565b507f7d7846723bda52976e0286c6efffee937ee9f76817a867ec70531ad29fb1fc0e600060405161010f91906106a9565b60405180910390a160016000808054610127906105ac565b80601f0160208091040260200160405190810160405280929190818152602001828054610153906105ac565b80156101a05780601f10610175576101008083540402835291602001916101a0565b820191906000526020600020905b81548152906001019060200180831161018357829003601f168201915b5050505050905091509150915091565b6060600080546101bf906105ac565b80601f01602080910402602001604051908101604052809291908181526020018280546101eb906105ac565b80156102385780601f1061020d57610100808354040283529160200191610238565b820191906000526020600020905b81548152906001019060200180831161021b57829003601f168201915b5050505050905090565b82805461024e906105ac565b90600052602060002090601f01602090048101928261027057600085556102b7565b82601f1061028957805160ff19168380011785556102b7565b828001600101855582156102b7579182015b828111156102b657825182559160200191906001019061029b565b5b5090506102c491906102c8565b5090565b5b808211156102e15760008160009055506001016102c9565b5090565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61034c82610303565b810181811067ffffffffffffffff8211171561036b5761036a610314565b5b80604052505050565b600061037e6102e5565b905061038a8282610343565b919050565b600067ffffffffffffffff8211156103aa576103a9610314565b5b6103b382610303565b9050602081019050919050565b82818337600083830152505050565b60006103e26103dd8461038f565b610374565b9050828152602081018484840111156103fe576103fd6102fe565b5b6104098482856103c0565b509392505050565b600082601f830112610426576104256102f9565b5b81356104368482602086016103cf565b91505092915050565b600060208284031215610455576104546102ef565b5b600082013567ffffffffffffffff811115610473576104726102f4565b5b61047f84828501610411565b91505092915050565b60008115159050919050565b61049d81610488565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b838110156104dd5780820151818401526020810190506104c2565b838111156104ec576000848401525b50505050565b60006104fd826104a3565b61050781856104ae565b93506105178185602086016104bf565b61052081610303565b840191505092915050565b60006040820190506105406000830185610494565b818103602083015261055281846104f2565b90509392505050565b6000602082019050818103600083015261057581846104f2565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806105c457607f821691505b6020821081036105d7576105d661057d565b5b50919050565b60008190508160005260206000209050919050565b600081546105ff816105ac565b61060981866104ae565b94506001821660008114610624576001811461063657610669565b60ff1983168652602086019350610669565b61063f856105dd565b60005b8381101561066157815481890152600182019150602081019050610642565b808801955050505b50505092915050565b6000604082019050818103600083015261068c81856105f2565b905081810360208301526106a081846104f2565b90509392505050565b600060208201905081810360008301526106c381846105f2565b90509291505056fea2646970667358221220fe0f28c9f8ef0a13a95934b974e7bc2ca6762b40a5b93ccd6ca2038f454bf52764736f6c634300080e003300000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000017736f6c79656e7420677265656e2069732070656f706c65000000000000000000';
		tempAcc = await createTempAccount();
		const transaction: Transaction = {
			from: tempAcc.address,
			data: greeterContractDeploymentData,
			gas: '0x740b8',
		};
		const response = await web3Eth.sendTransaction(transaction);
		greeterContractAddress = response.contractAddress as string;
	});
	afterAll(async () => {
		await closeOpenConnection(web3Eth);
	});

	it('should make a call to deployed Greeter contract', async () => {
		const transaction: TransactionCall = {
			from: tempAcc.address,
			to: greeterContractAddress,
			data: greetCallData,
		};
		const response = await web3Eth.call(transaction);
		expect(response).toBe(expectedEncodedGreet);
		const decodedResult = decodeParameters([...greeterAbiFragment.outputs], response)[0];
		expect(decodedResult).toBe(expectedDecodedGreet);
	});

	describe('blockNumber parameter', () => {
		it('should return no data (0x) for call to deployed Greeter contract with blockNumber = EARLIEST', async () => {
			const transaction: TransactionCall = {
				from: tempAcc.address,
				to: greeterContractAddress,
				data: greetCallData,
			};
			const response = await web3Eth.call(transaction, BlockTags.EARLIEST);
			expect(response).toBe('0x');
		});

		it('should return expectedDecodedGreet for call to deployed Greeter contract with blockNumber = LATEST', async () => {
			const transaction: TransactionCall = {
				from: tempAcc.address,
				to: greeterContractAddress,
				data: greetCallData,
			};
			const response = await web3Eth.call(transaction, BlockTags.LATEST);
			expect(response).toBe(expectedEncodedGreet);
			const decodedResult = decodeParameters([...greeterAbiFragment.outputs], response)[0];
			expect(decodedResult).toBe(expectedDecodedGreet);
		});

		// TODO - Not sure if there is a better way to test PENDING BlockTag,
		// but interacting with a contract that hasn't been mined yet doesn't make sense
		it('should return expectedDecodedGreet for call to deployed Greeter contract with blockNumber = PENDING', async () => {
			const transaction: TransactionCall = {
				from: tempAcc.address,
				to: greeterContractAddress,
				data: greetCallData,
			};
			const response = await web3Eth.call(transaction, BlockTags.PENDING);
			expect(response).toBe(expectedEncodedGreet);
			const decodedResult = decodeParameters([...greeterAbiFragment.outputs], response)[0];
			expect(decodedResult).toBe(expectedDecodedGreet);
		});

		it('should return no data (0x) for call to deployed Greeter contract with blockNumber = 0x0', async () => {
			const transaction: TransactionCall = {
				from: tempAcc.address,
				to: greeterContractAddress,
				data: greetCallData,
			};
			const response = await web3Eth.call(transaction, '0x0');
			expect(response).toBe('0x');
		});

		it('should return no data (0x) for call to deployed Greeter contract with web3Context.defaultBlock = EARLIEST', async () => {
			web3Eth.defaultBlock = BlockTags.EARLIEST;

			const transaction: TransactionCall = {
				from: tempAcc.address,
				to: greeterContractAddress,
				data: greetCallData,
			};
			const response = await web3Eth.call(transaction);
			expect(response).toBe('0x');
		});
	});

	describe('Transaction Error Scenarios', () => {
		let simpleRevertContractAddress: Address;

		beforeAll(async () => {
			const simpleRevertDeployTransaction: Transaction = {
				from: tempAcc.address,
				data: SimpleRevertDeploymentData,
			};
			simpleRevertDeployTransaction.gas = await web3Eth.estimateGas(
				simpleRevertDeployTransaction,
			);
			simpleRevertContractAddress = (
				await web3Eth.sendTransaction(simpleRevertDeployTransaction)
			).contractAddress as Address;
		});

		it('Should throw ContractExecutionError', async () => {
			const transaction: TransactionCall = {
				from: tempAcc.address,
				to: simpleRevertContractAddress,
				data: '0xba57a511000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000067265766572740000000000000000000000000000000000000000000000000000',
			};

			await expect(web3Eth.call(transaction)).rejects.toMatchObject({
				name: 'ContractExecutionError',
				code: 310,
				innerError: {
					name: 'Eip838ExecutionError',
					code: getSystemTestBackend() === 'geth' ? 3 : -32000,
					data: '0x08c379a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000155468697320697320612073656e64207265766572740000000000000000000000',
				},
			});
		});
	});
});
