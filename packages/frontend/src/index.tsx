import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { Provider, createClient } from "wagmi"
import { providers } from "ethers"
import "antd/dist/antd.css"

const client = createClient({
    autoConnect: true,
    provider(config) {
        return new providers.InfuraProvider("rinkeby", "8e87d06fe0074b82a453121d67bd587b")
    },
})

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
    <Provider client={client}>
        <App />
    </Provider>
)
