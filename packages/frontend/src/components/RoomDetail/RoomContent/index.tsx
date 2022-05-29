import { Row, Col, Button, Modal, Spin, Space } from "antd"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { useSigner, useContractEvent, useContractRead, useContractWrite } from "wagmi"
import { AppContext } from "../../../store"
import Coin from "../../Coin"
import UserCard from "../../UserCard"
import { RoomProps } from "../room-detail"
import CoinflipContract from "secure-coinflip-blockchain/deployments/rinkeby/CoinflipV3.json"
import { BigNumber } from "ethers"
import Confetti from "react-confetti"

const RoomContent: React.FunctionComponent<RoomProps> = ({ room }) => {
    const { state } = useContext(AppContext)
    const [reqId, setReqId] = useState<BigNumber>()
    const { data: signer } = useSigner()
    const [modal, setModal] = useState<boolean>(false)
    const [modalText, setModalText] = useState<string>("")
    const [winner, setWinner] = useState<string>("")

    const p1ColRef = useRef<HTMLDivElement>(null!)
    const p2ColRef = useRef<HTMLDivElement>(null!)

    const requestedRandomWordsListener = useCallback(
        (roomId: string) => {
            if (roomId === room.id) {
                setModalText("Requesting for random number...")
                setModal(true)
            }
        },
        [room.id]
    )

    useEffect(() => {
        return () => {
            setReqId(undefined)
            setModal(false)
            setModalText("")
            setWinner("")
        }
    }, [])

    useContractEvent(
        {
            addressOrName: CoinflipContract.address,
            contractInterface: CoinflipContract.abi,
        },
        "RandomNumberRequested",
        (event) => {
            setReqId(BigNumber.from(event[0]._hex))
            setModalText("Waiting for random number...")
        }
    )

    useContractEvent(
        {
            addressOrName: CoinflipContract.address,
            contractInterface: CoinflipContract.abi,
        },
        "RandomNumberFulfilled",
        (event) => {
            setModal(false)
            refetch()
            console.log("fulfilled", event)
        }
    )

    const { data, refetch } = useContractRead(
        {
            addressOrName: CoinflipContract.address,
            contractInterface: CoinflipContract.abi,
        },
        "log",
        {
            args: reqId ? [reqId] : [BigNumber.from("0")],
            onSuccess(data) {
                const value = data?._hex
                const number = BigNumber.from(value)
                if (!number.eq(0)) {
                    if (number.mod(2).eq(0)) setWinner(room.creator)
                    else setWinner(room.players.filter((p) => p !== room.creator)[0])
                }
            },
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
            onSettled(e, error) {
                if (!error) {
                    state.socket?.emit("requestRandomWords", room.id)
                }
            },
        }
    )

    useEffect(() => {
        state?.socket?.on("requestRandomWords", requestedRandomWordsListener)
        return () => {
            state?.socket?.off("requestRandomWords", requestedRandomWordsListener)
        }
    }, [requestedRandomWordsListener, state?.socket])

    return (
        <>
            <Row justify="space-around" style={{ height: "100%" }}>
                <Col ref={p1ColRef} span={3} style={{ textAlign: "center" }}>
                    {winner === room?.players[0] && (
                        <Confetti
                            width={p1ColRef.current?.clientWidth}
                            height={p1ColRef.current?.clientHeight}
                        />
                    )}
                    <UserCard playerName={room?.players[0]} />
                </Col>
                <Col span={6} style={{ textAlign: "center" }}>
                    <div style={{ display: "grid", height: "85%" }}>
                        <Coin spinSpeed={modal ? 0.12 : undefined} />
                        <Button
                            disabled={room?.players.length !== 2 || state?.userId !== room?.creator}
                            onClick={() => write()}
                        >
                            Flip
                        </Button>
                        <Space direction="vertical" style={{ marginTop: "1rem" }}>
                            <div style={{ overflowWrap: "anywhere" }}>
                                RequestId: {`${reqId ?? "Waiting"}`}
                            </div>
                            <div style={{ overflowWrap: "anywhere" }}>Result: {data?._hex}</div>
                        </Space>
                    </div>
                </Col>
                <Col ref={p2ColRef} span={3} style={{ textAlign: "center" }}>
                    {winner === room?.players[1] && (
                        <Confetti
                            width={p2ColRef.current?.clientWidth}
                            height={p2ColRef.current?.clientHeight}
                        />
                    )}
                    <UserCard playerName={room?.players[1]} />
                </Col>
            </Row>
            <Modal centered visible={modal} closable={false} footer={null}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "1rem",
                        flexDirection: "column",
                        textAlign: "center",
                    }}
                >
                    <Spin spinning={true} />
                    {modalText}
                </div>
            </Modal>
        </>
    )
}

export default RoomContent
