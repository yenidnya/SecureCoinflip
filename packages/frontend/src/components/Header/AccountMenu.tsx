import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Space } from "antd"
import { memo, NamedExoticComponent, useContext } from "react"
import { io } from "socket.io-client"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { AppContext } from "../../store"

const AccountMenu: NamedExoticComponent = memo(() => {
    const { state, dispatch } = useContext(AppContext)

    const onConnect = (id: string) => {
        const socket = io("http://localhost:3001", { query: { user: id } })
        dispatch({ type: "SET_USER_ID", data: id })
        dispatch({ type: "SET_SOCKET", data: socket })
    }

    const onDisconnect = () => {
        dispatch({ type: "SET_USER_ID", data: undefined })
        state.socket?.disconnect()
        dispatch({ type: "SET_SOCKET", data: undefined })
    }

    const { data } = useAccount({
        onSuccess(data) {
            data?.address && onConnect(data?.address)
        },
    })
    const { connect } = useConnect({
        connector: new InjectedConnector(),
        onConnect(data) {
            onConnect(data.account)
        },
    })
    const { disconnect } = useDisconnect({
        onSuccess(data) {
            onDisconnect()
        },
    })

    return (
        <>
            {data ? (
                <Space>
                    {state.userId}
                    <Button
                        onClick={() => disconnect()}
                        size="large"
                        type="text"
                        icon={<CloseOutlined />}
                    >
                        Disconnect
                    </Button>
                </Space>
            ) : (
                <Button onClick={() => connect()} size="large" type="text" icon={<PlusOutlined />}>
                    Connect
                </Button>
            )}
        </>
    )
})

AccountMenu.displayName = "AccountMenu"

export default AccountMenu
