import { createContext, Dispatch } from "react"
import { AppActions, IAppState } from "./store.d"

export const appState: IAppState = { socket: undefined, userId: undefined }

export const appReducer = (state = appState, action: AppActions): IAppState => {
    switch (action.type) {
        case "SET_USER_ID":
            return { ...state, userId: action.data }
        case "SET_SOCKET":
            return { ...state, socket: action.data }
        default:
            return state
    }
}

interface IAppContext {
    state: IAppState
    dispatch: Dispatch<AppActions>
}

const initialContext: IAppContext = { state: appState, dispatch: () => null }

export const AppContext = createContext(initialContext)
