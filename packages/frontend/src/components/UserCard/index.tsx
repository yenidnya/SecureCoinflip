import { Space, Avatar } from "antd"
import React from "react"
import { Typography } from "antd"
const { Text } = Typography

const UserCard: React.FunctionComponent<{ playerName?: string }> = ({ playerName }) => {
    return (
        <Space direction="vertical" align="center">
            <Avatar src={`https://robohash.org/${playerName ?? "SecureCoinflip"}.png`} />
            <Text>{playerName?.substring(0, 12) ?? "Waiting for user..."}</Text>
        </Space>
    )
}

UserCard.displayName = "UserCard"

export default UserCard
