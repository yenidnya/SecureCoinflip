import { memo, NamedExoticComponent, useContext } from "react"
import { Services } from "../../services"
import { AppContext } from "../../store"
import { IRoom } from "secure-coinflip-backend/database"
import RoomCard from "../RoomCard"
import { useNavigate } from "react-router-dom"
import { Button, Row } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { Typography } from "antd"

const { Title } = Typography

const Rooms: NamedExoticComponent<{ rooms: IRoom[] }> = memo(({ rooms }) => {
    const { state } = useContext(AppContext)
    const navigate = useNavigate()

    const createRoom = async () => {
        if (state.userId) {
            const newRoom = await Services.createRoom(state.userId)
            navigate(`/room/${newRoom.id}`)
        } else alert("You must be logged in to create a room")
    }

    return (
        <div>
            <Row justify="space-between">
                <Title>Rooms</Title>
                <Button size="large" onClick={createRoom}>
                    <PlusOutlined /> Create Room
                </Button>
            </Row>
            {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
            ))}
        </div>
    )
})

Rooms.displayName = "Rooms"

export default Rooms
