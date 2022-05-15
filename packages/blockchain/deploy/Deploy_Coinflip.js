const { network } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    let subscriptionId = process.env.VRF_SUBSCRIPTION_ID

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS
    const args = [subscriptionId]

    console.log("deployer ", deployer)
    const randomNumberConsumerV2 = await deploy("CoinflipV3", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    const networkName = network.name == "hardhat" ? "localhost" : network.name
    log("----------------------------------------------------")
    log(`Deployed at ${networkName} network. Address: ${randomNumberConsumerV2.address}`)
    log("----------------------------------------------------")
}

module.exports.tags = ["all", "vrf"]
