import { Spin } from "antd"
import { memo, NamedExoticComponent, useCallback, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { IRoom } from "secure-coinflip-backend/database"
import { Services } from "../../services"
import { AppContext } from "../../store"
import RoomContent from "./RoomContent"
import RoomHeader from "./RoomHeader"

const RoomDetail: NamedExoticComponent = memo(() => {
    const { id } = useParams<{ id: string }>()
    const [room, setRoom] = useState<IRoom>()
    const { state } = useContext(AppContext)

    useEffect(() => {
        async function getRoomData(id: string) {
            const room = await Services.getRoom(id)
            setRoom(room)
        }
        id && state.socket?.emit("joinRoom", id, state.userId) && getRoomData(id)

        return () => {
            state.socket?.emit("leaveRoom", id, state.userId)
        }
    }, [id, state.socket, state.userId])

    const roomJoinListener = useCallback(
        (roomId: string, userId: string) => {
            if (roomId === id) {
                room && setRoom({ ...room, players: [...room.players, userId] })
            }
        },
        [room, id]
    )

    const roomLeftListener = useCallback(
        (roomId: string, userId: string) => {
            if (roomId === id) {
                room &&
                    setRoom({
                        ...room,
                        players: room.players.filter((player) => player !== userId),
                    })
            }
        },
        [room, id]
    )

    useEffect(() => {
        state.socket?.on("joinedRoom", roomJoinListener)
        state.socket?.on("leftRoom", roomLeftListener)
        return () => {
            state.socket?.off("joinedRoom", roomJoinListener)
            state.socket?.off("leftRoom", roomLeftListener)
        }
    }, [roomJoinListener, roomLeftListener, state.socket])

    return room ? (
        <>
            <RoomHeader room={room} />
            <RoomContent room={room} />
        </>
    ) : (
        <Spin spinning={true} />
    )
})

RoomDetail.displayName = "RoomDetail"

export default RoomDetail
