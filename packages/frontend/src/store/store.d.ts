import { Socket } from "socket.io-client"

export interface IAppState {
    userId?: string
    socket?: Socket
}

export type AppActionTypes = "SET_USER_ID" | "SET_SOCKET"

export type AppActions = { type: AppActionTypes; data: any }
