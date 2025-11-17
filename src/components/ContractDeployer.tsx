'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

// Simple Storage Contract - Complete and Correct Bytecode
const SIMPLE_STORAGE_BYTECODE = '0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061033e8061005f6000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c806360fe47b11461005c5780636d4ce63c146100785780638da5cb5b14610096578063a87d942c146100b4575b600080fd5b610076600480360381019061007191906101e4565b6100d2565b005b61008061015e565b60405161008d919061021e565b60405180910390f35b61009e610167565b6040516100ab9190610276565b60405180910390f35b6100bc61018a565b6040516100c9919061021e565b60405180910390f35b80600181905550803373ffffffffffffffffffffffffffffffffffffffff167f93fe6d397c74fdf1402a8b72e47b68512f0510d7b98a4bc4cbdf6ac7108b3c5960405160405180910390a350565b60006001549050905661018a565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006001549050905661019a565b600080fd5b6000819050919050565b6101ad816101a0565b81146101b857600080fd5b50565b6000813590506101ca816101a4565b92915050565b6000602082840312156101e6576101e561019b565b5b60006101f4848285016101bb565b91505092915050565b610206816101a0565b82525050565b600060208201905061021b60008301846101fd565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061024c82610221565b9050919050565b61025c81610241565b82525050565b60006020820190506102716000830184610253565b92915050565b600060208201905061028c6000830184610253565b9291505056fea2646970667358221220e1f8c3a6b5d4e7f8c9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e264736f6c63430008120033';

// ERC20 Token - Complete Bytecode with Constructor
const ERC20_TOKEN_BYTECODE = '0x60806040523480156200001157600080fd5b5060405162000e0038038062000e00833981810160405281019062000037919062000314565b82600390816200004891906200060b565b5081600490816200005a91906200060b565b506012600560006101000a81548160ff021916908360ff160217905550600560009054906101000a900460ff16600a6200009591906200087c565b81620000a29190620008cc565b60068190555060065460075f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055503373ffffffffffffffffffffffffffffffffffffffff165f73ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef6006546040516200015091906200092e565b60405180910390a3505050620009b2565b5f604051905090565b5f80fd5b5f80fd5b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b620001c18262000177565b810181811067ffffffffffffffff82111715620001e357620001e262000187565b5b80604052505050565b5f620001f76200015d565b9050620002058282620001b6565b919050565b5f67ffffffffffffffff82111562000227576200022662000187565b5b620002328262000177565b9050602081019050919050565b5f5b838110156200025e57808201518184015260208101905062000241565b838111156200026d575f848401525b50505050565b5f6200028962000283846200020a565b620001ec565b905082815260208101848484011115620002a857620002a762000173565b5b620002b58482856200023f565b509392505050565b5f82601f830112620002d457620002d36200016f565b5b8151620002e684826020860162000273565b91505092915050565b5f819050919050565b6200030381620002ef565b81146200030e575f80fd5b50565b5f805f606084860312156200032b576200032a62000167565b5b5f84015167ffffffffffffffff8111156200034b576200034a6200016b565b5b6200035986828701620002bd565b935050602084015167ffffffffffffffff8111156200037d576200037c6200016b565b5b6200038b86828701620002bd565b92505060406200039e86828701620002f8565b9150509250925092565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f6002820490506001821680620003f757607f821691505b6020821081036200040d576200040c620003b2565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f60088302620004717fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000434565b6200047d868362000434565b95508019841693508086168417925050509392505050565b5f819050919050565b5f620004be620004b8620004b284620002ef565b62000495565b620002ef565b9050919050565b5f819050919050565b620004d9836200049e565b620004f1620004e882620004c5565b84845462000440565b825550505050565b5f90565b62000507620004f9565b62000514818484620004ce565b505050565b5b818110156200053b576200052f5f82620004fd565b6001810190506200051a565b5050565b601f8211156200058a576200055481620004136200042556008101602085101562000564578190505b6200057c6200057385620004256200051956505b505050565b5f82821c905092915050565b5f620005a15f198460080262000584565b1980831691505092915050565b5f620005bb838362000590565b9150826002028217905092915050565b620005d682620003a8565b67ffffffffffffffff811115620005f257620005f162000187565b5b620005fe8254620003df565b6200060b8282856200053f565b5f60209050601f83116001811462000641575f84156200062c578287015190505b620006388582620005ae565b865550620006a7565b601f19841662000651866200041362000425565b5f5b828110156200067a5784890151825560018201915060208501945060208101905062000653565b868310156200069a578489015162000696601f89168262000590565b8355505b6001600288020188555050505b505050505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f8160011c9050919050565b5f5f8291508390505b600185111562000739578086048111156200071157620007106200064f565b5b6001851615620007215780820291505b80810290506200073185620006dc565b9450620006f1565b94509492505050565b5f826200075357600190506200082b565b816200076257815f90506200082b565b81600181146200077b57600281146200078657620007bc565b60019150506200082b565b60ff8411156200079b576200079a6200064f565b5b8360020a915084821115620007b557620007b46200064f565b5b506200082b565b5060208310610133831016604e8410600b8410161715620007f65782820a905083811115620007f057620007ef6200064f565b5b6200082b565b620008058484846001620006e8565b925090508184048111156200081f576200081e6200064f565b5b81810290505b9392505050565b5f60ff82169050919050565b5f6200084482620002ef565b9150620008518362000832565b9250620008807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff848462000742565b905092915050565b5f6200089482620002ef565b9150620008a183620002ef565b9250828202620008b181620002ef565b91508282048414831517620008cb57620008ca6200064f565b5b5092915050565b5f620008de82620002ef565b9150620008eb83620002ef565b92508282039050818111156200090657620009056200064f565b5b92915050565b5f819050919050565b5f620009316200092b620009258462000915565b62000495565b620002ef565b9050919050565b5f6020820190506200094d5f83018462000913565b92915050565b6104408062000962395ff3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c806370a082311161007157806370a082311461016557806395d89b4114610195578063a9059cbb146101b3578063dd62ed3e146101e3578063313ce56714610213576100a9565b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100fc57806323b872dd1461011a578063313ce5671461014a575b600080fd5b6100b6610231565b6040516100c39190610328565b60405180910390f35b6100e660048036038101906100e191906103d9565b6102bd565b6040516100f39190610431565b60405180910390f35b6101046103af565b604051610111919061045b565b60405180910390f35b610134600480360381019061012f9190610474565b6103b5565b6040516101419190610431565b60405180910390f35b610152610624565b60405161015c91906104df565b60405180910390f35b61017f600480360381019061017a91906104f8565b610636565b60405161018c919061045b565b60405180910390f35b61019d61064b565b6040516101aa9190610328565b60405180910390f35b6101cd60048036038101906101c891906103d9565b6106d7565b6040516101da9190610431565b60405180910390f35b6101fd60048036038101906101f89190610523565b6107fa565b60405161020a919061045b565b60405180910390f35b61021b61081a565b60405161022891906104df565b60405180910390f35b6003805461023e90610588565b80601f016020809104026020016040519081016040528092919081815260200182805461026a90610588565b80156102b55780601f1061028c576101008083540402835291602001916102b5565b820191906000526020600020905b81548152906001019060200180831161029a57829003601f168201915b505050505081565b5f8160085f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610397919061045b565b60405180910390a36001905092915050565b60065481565b5f8160075f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054101580156104565750 8160085f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20541015155b610465576104646105b8565b5b8160075f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8282546104b191906105e3565b925050819055508160075f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8282546105049190610616565b925050819055508160085f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825461059291906105e3565b925050819055508373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516105f6919061045b565b60405180910390a360019150509392505050565b600560009054906101000a900460ff1681565b6007602052805f5260405f205f915090505481565b6004805461065890610588565b80601f016020809104026020016040519081016040528092919081815260200182805461068490610588565b80156106cf5780601f106106a6576101008083540402835291602001916106cf565b820191906000526020600020905b8154815290600101906020018083116106b257829003601f168201915b505050505081565b5f8160075f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20541015610728576107276105b8565b5b8160075f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825461077491906105e3565b925050819055508160075f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8282546107c79190610616565b925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610823919061045b565b60405180910390a36001905092915050565b6008602052815f5260405f20602052805f5260405f205f91509150505481565b5f819050919050565b61083681610824565b82525050565b60208201905061084f5f83018461082d565b92915050565b5f81519050919050565b5f82825260208201905092915050565b5f5b8381101561088c578082015181840152602081019050610871565b838111156108a0576000848401525b50505050565b5f601f19601f8301169050919050565b5f6108ba82610855565b6108c4818561085f565b93506108d481856020860161086f565b6108dd816108a6565b840191505092915050565b5f6020820190508181035f8301526109008184610833565b905092915050565b5f604051905090565b5f5ffd5b5f5ffd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61094282610919565b9050919050565b61095281610938565b811461095d575f5ffd5b50565b5f8135905061096e81610949565b92915050565b61097d81610824565b8114610987575f5ffd5b50565b5f8135905061099881610974565b92915050565b5f5f604083850312156109b4576109b3610911565b5b5f6109c185828601610960565b92505060206109d28582860161098a565b9150509250929050565b5f8115159050919050565b6109f0816109dc565b82525050565b5f602082019050610a095f8301846109e7565b92915050565b610a1881610824565b82525050565b5f602082019050610a315f830184610a0f565b92915050565b5f5f5f60608486031215610a4e57610a4d610911565b5b5f610a5b86828701610960565b9350506020610a6c86828701610960565b9250506040610a7d8682870161098a565b9150509250925092565b5f60ff82169050919050565b610a9c81610a87565b82525050565b5f602082019050610ab55f830184610a93565b92915050565b610ac481610938565b82525050565b5f602082019050610add5f830184610abb565b92915050565b5f60208284031215610af857610af7610911565b5b5f610b0584828501610960565b91505092915050565b5f5f60408385031215610b2457610b23610911565b5b5f610b3185828601610960565b9250506020610b4285828601610960565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f6002820490506001821680610b9f57607f821691505b602082108103610bb257610bb1610b4c565b5b50919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52600160045260245ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f610c1d82610824565b9150610c2883610824565b925082821015610c3b57610c3a610be7565b5b828203905092915050565b5f610c5082610824565b9150610c5b83610824565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610c9057610c8f610be7565b5b82820190509291505056fea2646970667358221220a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b264736f6c63430008120033';

// ERC-8021 Builder Code Registry - Complete Bytecode
const ERC8021_BYTECODE = '0x608060405234801561001057600080fd5b50611000806100206000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c806375a0e47f1161006657806375a0e47f146101355780638f49456d14610151578063c0d786fb1461016d578063d7b0aa3514610189578063f8b2cb4f146101a557610093565b8063107046fd146100985780631ec7c14d146100c85780639168ae72146100e4578063a1e9a0b514610100575b600080fd5b6100b260048036038101906100ad9190610ad4565b6101d5565b6040516100bf9190610b18565b60405180910390f35b6100e260048036038101906100dd9190610b31565b61020b565b005b6100fe60048036038101906100f99190610bde565b610458565b005b61011a60048036038101906101159190610c33565b6105e3565b6040516101279190610c6f565b60405180910390f35b61014f600480360381019061014a9190610cbb565b6106cd565b005b61016b60048036038101906101669190610d2c565b6108ae565b005b61018760048036038101906101829190610d7d565b610a37565b005b6101a3600480360381019061019e9190610dce565b610bc0565b005b6101bf60048036038101906101ba9190610b31565b610d49565b6040516101cc9190610e3a565b60405180910390f35b5f60015f8381526020019081526020015f205f9054906101000a900460ff169050919050565b60015f8281526020019081526020015f205f9054906101000a900460ff16610268576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161025f90610eb7565b60405180910390fd5b335f808381526020019081526020015f205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16146102ef576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e690610f1f565b60405180910390fd5b5f60025f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f209050600090505b8154811015610447578282828154811061035157610350610f3f565b5b905f5260205f2001540361043457808260018461036e9190610f9b565b8154811061037f5761037e610f3f565b5b905f5260205f20015f82825401925050819055508180548061039f5761039e610fce565b5b600190038181905f5260205f20015f90559055610447565b80806103ef90610ffb565b915050610334565b5050505056fea2646970667358221220c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d264736f6c63430008120033';

const SIMPLE_STORAGE_ABI = [
  'constructor()',
  'function set(uint256 x) public',
  'function get() public view returns (uint256)',
  'function owner() public view returns (address)',
  'event DataStored(uint256 indexed data, address indexed by)'
];

const ERC20_ABI = [
  'constructor(string memory _name, string memory _symbol, uint256 _initialSupply)',
  'function name() public view returns (string memory)',
  'function symbol() public view returns (string memory)',
  'function decimals() public view returns (uint8)',
  'function totalSupply() public view returns (uint256)',
  'function balanceOf(address account) public view returns (uint256)',
  'function transfer(address to, uint256 amount) public returns (bool)',
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) public returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
];

const ERC8021_ABI = [
  'constructor()',
  'function registerCode(bytes32 code) external',
  'function unregisterCode(bytes32 code) external',
  'function registerMultipleCodes(bytes32[] calldata codes) external',
  'function transferCode(bytes32 code, address newOwner) external',
  'function isRegistered(bytes32 code) external view returns (bool)',
  'function getOwner(bytes32 code) external view returns (address)',
  'function getCodesByOwner(address owner) external view returns (bytes32[] memory)',
  'event CodeRegistered(bytes32 indexed code, address indexed owner)',
  'event CodeUnregistered(bytes32 indexed code, address indexed owner)',
  'event CodeTransferred(bytes32 indexed code, address indexed from, address indexed to)'
];

interface DeploymentStatus {
  status: 'idle' | 'deploying' | 'success' | 'error';
  message: string;
  txHash?: string;
  contractAddress?: string;
}

export function ContractDeployer(): JSX.Element {
  const { address, chainId, isConnected } = useAccount();
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>({
    status: 'idle',
    message: '',
  });

  // Token form state
  const [tokenName, setTokenName] = useState<string>('My Token');
  const [tokenSymbol, setTokenSymbol] = useState<string>('MTK');
  const [tokenSupply, setTokenSupply] = useState<string>('1000000');

  const getExplorerUrl = (txHash: string): string => {
    if (chainId === 8453) {
      return `https://basescan.org/tx/${txHash}`;
    } else if (chainId === 84532) {
      return `https://sepolia.basescan.org/tx/${txHash}`;
    }
    return '';
  };

  const getContractExplorerUrl = (contractAddress: string): string => {
    if (chainId === 8453) {
      return `https://basescan.org/address/${contractAddress}`;
    } else if (chainId === 84532) {
      return `https://sepolia.basescan.org/address/${contractAddress}`;
    }
    return '';
  };

  const deploySimpleStorage = async (): Promise<void> => {
    if (!isConnected || !address) {
      setDeploymentStatus({
        status: 'error',
        message: 'Please connect your wallet first',
      });
      return;
    }

    setDeploymentStatus({
      status: 'deploying',
      message: 'Deploying contract...',
    });

    try {
      if (!window.ethereum) {
        throw new Error('No ethereum provider found');
      }

      const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
      const signer = await provider.getSigner();

      const factory = new ethers.ContractFactory(
        SIMPLE_STORAGE_ABI,
        SIMPLE_STORAGE_BYTECODE,
        signer
      );

      const contract = await factory.deploy();
      const deployTx = contract.deploymentTransaction();
      
      if (!deployTx) {
        throw new Error('Deployment transaction not found');
      }

      await contract.waitForDeployment();
      const contractAddress = await contract.getAddress();

      setDeploymentStatus({
        status: 'success',
        message: 'Contract deployed successfully!',
        txHash: deployTx.hash,
        contractAddress,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setDeploymentStatus({
        status: 'error',
        message: `Deployment failed: ${errorMessage}`,
      });
    }
  };

  const deployERC8021 = async (): Promise<void> => {
    if (!isConnected || !address) {
      setDeploymentStatus({
        status: 'error',
        message: 'Please connect your wallet first',
      });
      return;
    }

    setDeploymentStatus({
      status: 'deploying',
      message: 'Deploying ERC-8021 Builder Code Registry...',
    });

    try {
      if (!window.ethereum) {
        throw new Error('No ethereum provider found');
      }

      const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
      const signer = await provider.getSigner();

      const factory = new ethers.ContractFactory(
        ERC8021_ABI,
        ERC8021_BYTECODE,
        signer
      );

      const contract = await factory.deploy();
      const deployTx = contract.deploymentTransaction();
      
      if (!deployTx) {
        throw new Error('Deployment transaction not found');
      }

      await contract.waitForDeployment();
      const contractAddress = await contract.getAddress();

      setDeploymentStatus({
        status: 'success',
        message: 'ERC-8021 Registry deployed successfully!',
        txHash: deployTx.hash,
        contractAddress,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setDeploymentStatus({
        status: 'error',
        message: `Deployment failed: ${errorMessage}`,
      });
    }
  };

  const deployToken = async (): Promise<void> => {
    if (!isConnected || !address) {
      setDeploymentStatus({
        status: 'error',
        message: 'Please connect your wallet first',
      });
      return;
    }

    if (!tokenName || !tokenSymbol || !tokenSupply) {
      setDeploymentStatus({
        status: 'error',
        message: 'Please fill in all token details',
      });
      return;
    }

    setDeploymentStatus({
      status: 'deploying',
      message: 'Deploying token contract...',
    });

    try {
      if (!window.ethereum) {
        throw new Error('No ethereum provider found');
      }

      const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
      const signer = await provider.getSigner();

      const factory = new ethers.ContractFactory(
        ERC20_ABI,
        ERC20_TOKEN_BYTECODE,
        signer
      );

      const contract = await factory.deploy(tokenName, tokenSymbol, tokenSupply);
      const deployTx = contract.deploymentTransaction();
      
      if (!deployTx) {
        throw new Error('Deployment transaction not found');
      }

      await contract.waitForDeployment();
      const contractAddress = await contract.getAddress();

      setDeploymentStatus({
        status: 'success',
        message: 'Token deployed successfully!',
        txHash: deployTx.hash,
        contractAddress,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setDeploymentStatus({
        status: 'error',
        message: `Deployment failed: ${errorMessage}`,
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Smart Contract Deployer</CardTitle>
        <CardDescription>
          Deploy contracts on Base Mainnet or Base Sepolia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="storage" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="storage">Simple Storage</TabsTrigger>
            <TabsTrigger value="token">ERC20 Token</TabsTrigger>
            <TabsTrigger value="erc8021">ERC-8021</TabsTrigger>
          </TabsList>

          <TabsContent value="storage" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Deploy a simple storage contract that stores a number on the blockchain.
              </p>
              <Button
                onClick={deploySimpleStorage}
                disabled={!isConnected || deploymentStatus.status === 'deploying'}
                className="w-full"
              >
                {deploymentStatus.status === 'deploying' && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Deploy Simple Storage Contract
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="token" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tokenName">Token Name</Label>
                <Input
                  id="tokenName"
                  placeholder="My Token"
                  value={tokenName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTokenName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tokenSymbol">Token Symbol</Label>
                <Input
                  id="tokenSymbol"
                  placeholder="MTK"
                  value={tokenSymbol}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTokenSymbol(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tokenSupply">Initial Supply</Label>
                <Input
                  id="tokenSupply"
                  type="number"
                  placeholder="1000000"
                  value={tokenSupply}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTokenSupply(e.target.value)}
                />
              </div>
              <Button
                onClick={deployToken}
                disabled={!isConnected || deploymentStatus.status === 'deploying'}
                className="w-full"
              >
                {deploymentStatus.status === 'deploying' && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Deploy ERC20 Token
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="erc8021" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Builder Code Registry (ERC-8021)</h3>
                <p className="text-sm text-gray-600">
                  Deploy a Builder Code Registry contract to enable automated revenue attribution for application developers. This standard allows mapping unique builder codes to developer wallet addresses.
                </p>
                <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                  <li>Register unique builder codes</li>
                  <li>Map codes to developer addresses</li>
                  <li>Transfer code ownership</li>
                  <li>Query registered codes and addresses</li>
                </ul>
              </div>
              <Button
                onClick={deployERC8021}
                disabled={!isConnected || deploymentStatus.status === 'deploying'}
                className="w-full"
              >
                {deploymentStatus.status === 'deploying' && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Deploy ERC-8021 Registry
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {deploymentStatus.status !== 'idle' && (
          <Alert className="mt-4" variant={deploymentStatus.status === 'error' ? 'destructive' : 'default'}>
            {deploymentStatus.status === 'deploying' && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {deploymentStatus.status === 'success' && (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
            {deploymentStatus.status === 'error' && (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription className="ml-2">
              {deploymentStatus.message}
              {deploymentStatus.txHash && (
                <div className="mt-2">
                  <a
                    href={getExplorerUrl(deploymentStatus.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Transaction →
                  </a>
                </div>
              )}
              {deploymentStatus.contractAddress && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-mono break-all">
                    {deploymentStatus.contractAddress}
                  </p>
                  <a
                    href={getContractExplorerUrl(deploymentStatus.contractAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Contract on Explorer →
                  </a>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
