import { ArrowLeftOutlined } from "@ant-design/icons"
import { Typography, Button } from "antd"
import React from "react"
import { useNavigate } from "react-router-dom"
import { RoomProps } from "../room-detail"

const RoomHeader: React.FunctionComponent<RoomProps> = ({ room }) => {
    const navigator = useNavigate()

    return (
        <Typography.Title level={4}>
            <Button type="link" onClick={() => navigator(-1)}>
                <ArrowLeftOutlined size={32} />
            </Button>
            Room ID: {room?.id}
        </Typography.Title>
    )
}

export default RoomHeader
