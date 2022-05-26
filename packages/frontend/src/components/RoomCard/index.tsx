import { PlusCircleOutlined } from "@ant-design/icons"
import { Button, Card, Row, Col, Spin, Typography } from "antd"
import React, { memo, NamedExoticComponent, useContext } from "react"
import { Link } from "react-router-dom"
import { IRoom } from "secure-coinflip-backend/database"
import { AppContext } from "../../store"
import UserCard from "../UserCard"

const { Text } = Typography

const RoomCard: NamedExoticComponent<{ room: IRoom }> = memo(({ room }) => {
    const { state } = useContext(AppContext)

    return (
        <Card
            actions={[
                <Button size="middle" ghost disabled={room.creator === state.userId}>
                    <Link to={`/room/${room.id}`} key="join">
                        Join <PlusCircleOutlined />
                    </Link>
                </Button>,
            ]}
        >
            <Row justify="space-around" align="middle">
                <Col>
                    <UserCard playerName={room.players[0]} />
                </Col>
                <Col>
                    {room.players.length === 1 ? (
                        <Text style={{ fontSize: "1.5rem" }}>Waiting...</Text>
                    ) : (
                        <Text style={{ fontSize: "1.5rem" }}>Playing...</Text>
                    )}
                </Col>
                <Col>
                    <Spin spinning={!room.players[1]}>
                        <UserCard playerName={room.players[1]} />
                    </Spin>
                </Col>
            </Row>
        </Card>
    )
})

RoomCard.displayName = "RoomCard"

export default RoomCard
