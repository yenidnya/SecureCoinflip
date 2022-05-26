import { useCallback, useEffect, useReducer, useState } from "react"
import { appReducer, appState, AppContext } from "./store"
import Layout, { Content, Footer } from "antd/lib/layout/layout"
import Header from "./components/Header"
import React, { memo, NamedExoticComponent } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Rooms from "./components/Rooms"
import RoomDetail from "./components/RoomDetail"
import { IRoom } from "secure-coinflip-backend/database"
import { Services } from "./services"

const App: NamedExoticComponent = memo(() => {
    const [state, dispatch] = useReducer(appReducer, appState)
    const [rooms, setRooms] = useState<IRoom[]>([])
    const newRoomListener = useCallback(
        (newRoom: IRoom) => {
            setRooms([...rooms, newRoom])
        },
        [rooms]
    )

    const roomJoinListener = useCallback(
        (roomId: string, userId: string) => {
            setRooms(
                rooms.map((room) =>
                    room.id === roomId ? { ...room, players: [...room.players, userId] } : room
                )
            )
        },
        [rooms]
    )

    const roomLeftListener = useCallback(
        (roomId: string, userId: string) => {
            setRooms(
                rooms.map((room) =>
                    room.id === roomId
                        ? { ...room, players: room.players.filter((player) => player !== userId) }
                        : room
                )
            )
        },
        [rooms]
    )

    const roomRemovedListener = useCallback(
        (roomId: string) => {
            setRooms(rooms.filter((room) => room.id !== roomId))
        },
        [rooms]
    )

    useEffect(() => {
        state.socket?.on("roomCreated", newRoomListener)
        state.socket?.on("joinedRoom", roomJoinListener)
        state.socket?.on("leftRoom", roomLeftListener)
        state.socket?.on("roomRemoved", roomRemovedListener)
        return () => {
            state.socket?.off("roomCreated", newRoomListener)
            state.socket?.off("joinedRoom", roomJoinListener)
            state.socket?.off("leftRoom", roomLeftListener)
            state.socket?.off("roomRemoved", roomRemovedListener)
        }
    }, [newRoomListener, roomJoinListener, roomLeftListener, roomRemovedListener, state.socket])

    useEffect(() => {
        async function fetchRooms() {
            const rooms = await Services.getRooms()
            setRooms(rooms)
        }
        fetchRooms()
    }, [])

    useEffect(() => {
        return () => {
            state.socket?.disconnect()
        }
    }, [state.socket])

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            <Layout
                style={{
                    height: "100vh",
                }}
            >
                <Header />
                <Content style={{ padding: "0 50px" }}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Rooms rooms={rooms} />} />
                            <Route path="room/:id" element={<RoomDetail />} />
                        </Routes>
                    </BrowserRouter>
                </Content>
                <Footer style={{ textAlign: "center" }}>Istinye University 2022</Footer>
            </Layout>
        </AppContext.Provider>
    )
})

App.displayName = "App"

export default App
