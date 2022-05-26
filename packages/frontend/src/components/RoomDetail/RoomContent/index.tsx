import { Row, Col, Button } from "antd"
import React, { useContext, useState } from "react"
import { useSigner, useContractEvent, useContractRead, useContractWrite } from "wagmi"
import { AppContext } from "../../../store"
import Coin from "../../Coin"
import UserCard from "../../UserCard"
import { RoomProps } from "../room-detail"
import CoinflipContract from "secure-coinflip-blockchain/deployments/rinkeby/CoinflipV3.json"
import { BigNumber } from "ethers"

const RoomContent: React.FunctionComponent<RoomProps> = ({ room }) => {
    const { state } = useContext(AppContext)
    const [reqId, setReqId] = useState<BigNumber>()
    const { data: signer } = useSigner()

    useContractEvent(
        {
            addressOrName: CoinflipContract.address,
            contractInterface: CoinflipContract.abi,
        },
        "RandomNumberRequested",
        (event) => {
            const id = `${event[0]._hex}`
            setReqId(BigNumber.from(id))
            console.log("requested", id)
            console.log("waiting true")
        }
    )

    useContractEvent(
        {
            addressOrName: CoinflipContract.address,
            contractInterface: CoinflipContract.abi,
        },
        "RandomNumberFulfilled",
        (event) => {
            console.log("fulfilled", event)
            console.log("waiting false")
            log.refetch()
        }
    )

    const log = useContractRead(
        {
            addressOrName: CoinflipContract.address,
            contractInterface: CoinflipContract.abi,
        },
        "log",
        {
            args: reqId,
        }
    )

    const { write } = useContractWrite(
        {
            addressOrName: CoinflipContract.address,
            contractInterface: CoinflipContract.abi,
            signerOrProvider: signer,
        },
        "requestRandomWords",
        {
            onSettled(e) {
                console.log("settled", e)
            },
        }
    )

    return (
        <>
            <Row justify="space-around" style={{ height: "100%" }}>
                <Col span={3}>
                    <UserCard playerName={room?.players[0]} />
                </Col>
                <Col span={6} style={{ textAlign: "center" }}>
                    <div style={{ display: "grid", height: "85%" }}>
                        <Coin />
                        <Button
                            disabled={room?.players.length !== 2 || state?.userId !== room?.creator}
                            onClick={() => write()}
                        >
                            Flip
                        </Button>
                        <div style={{ overflowWrap: "anywhere" }}>ReqId: {`${reqId}`}</div>
                        <div style={{ overflowWrap: "anywhere" }}>{JSON.stringify(log)}</div>
                    </div>
                </Col>
                <Col span={3}>
                    <UserCard playerName={room?.players[1]} />
                </Col>
            </Row>
        </>
    )
}

export default RoomContent
