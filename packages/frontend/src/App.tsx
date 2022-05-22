import {
    useAccount,
    useConnect,
    useContractEvent,
    useContractRead,
    useContractWrite,
    useDisconnect,
    useSigner,
} from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import CoinflipContract from "secure-coinflip-blockchain/deployments/rinkeby/CoinflipV3.json"

function App() {
    const { data } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { data: signer } = useSigner()
    const { disconnect } = useDisconnect()

    useContractEvent(
        {
            addressOrName: CoinflipContract.address,
            contractInterface: CoinflipContract.abi,
        },
        "RandomNumberFulfilled",
        (event) => console.log(event)
    )

    const {
        data: readResult,
        refetch,
        isLoading,
        isFetching,
        isFetched,
        fetchStatus,
        status,
    } = useContractRead(
        {
            addressOrName: CoinflipContract.address,
            contractInterface: CoinflipContract.abi,
        },
        "log",
        {
            args: 1,
        }
    )

    const getNewRandom = useContractWrite(
        {
            addressOrName: CoinflipContract.address,
            contractInterface: CoinflipContract.abi,
            signerOrProvider: signer,
        },
        "requestRandomWords",
        {
            onSettled: (res) => {
                console.log("Settled: ", res)
            },
        }
    )

    return (
        <div>
            {data ? (
                <div>
                    Connected to {data.address}
                    <button onClick={() => disconnect()}>Disconnect</button>
                    <button onClick={() => refetch()}>Get, {JSON.stringify(readResult)}</button>;
                    <button onClick={() => getNewRandom.write()}>Get Random</button>;
                    <div>
                        isLoading {isLoading} | isFetching {isFetching} | isFetched {isFetched} |
                        fetchStatus {fetchStatus} | status {status}
                    </div>
                </div>
            ) : (
                <button onClick={() => connect()}>Connect Wallet</button>
            )}
        </div>
    )
}

export default App
