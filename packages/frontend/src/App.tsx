import {
  useAccount,
  useConnect,
  useContractEvent,
  useContractWrite,
  useDisconnect,
  useSigner,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useContract } from "wagmi";
import CoinflipContract from "secure-coinflip-blockchain/deployments/rinkeby/CoinflipV3.json"

function App() {
  const { data } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { data: signer } = useSigner();
  const { disconnect } = useDisconnect();
  const contract = useContract({
    addressOrName: CoinflipContract.address,
    contractInterface: CoinflipContract.abi,
    signerOrProvider: signer,
  });

  useContractEvent(
    {
      addressOrName: CoinflipContract.address,
      contractInterface: CoinflipContract.abi,
    },
    "RandomNumberFulfilled",
    (event) => console.log(event)
  );

  const getValue = async () => {
    const res = await contract.getResult(0);
    console.log(res);
  };

  const getNewRandom = useContractWrite(
    {
      addressOrName: CoinflipContract.address,
      contractInterface: CoinflipContract.abi,
      signerOrProvider: signer,
    },
    "requestRandomWords",
    {
      onSettled: (res) => {
        console.log("Settled: ", res);
      },
    }
  );

  return (
    <div>
      {data ? (
        <div>
          Connected to {data.address}
          <button onClick={() => disconnect()}>Disconnect</button>
          <button onClick={getValue}>Get</button>;
          <button onClick={() => getNewRandom.write()}>Get Random </button>;
        </div>
      ) : (
        <button onClick={() => connect()}>Connect Wallet</button>
      )}
    </div>
  );
}

export default App;
