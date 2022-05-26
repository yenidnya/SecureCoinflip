import { PageHeader } from "antd"
import { useContext } from "react"
import { memo, NamedExoticComponent } from "react"
import { AppContext } from "../../store"
import AccountMenu from "./AccountMenu"

const Header: NamedExoticComponent = memo(() => {
    const { state } = useContext(AppContext)
    return (
        <PageHeader
            title="SecureCoinflip"
            avatar={{ src: `https://robohash.org/${state?.userId ?? "SecureCoinflip"}.png` }}
            extra={<AccountMenu />}
        />
    )
})

Header.displayName = "Header"

export default Header
