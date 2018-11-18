import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Box, Flex } from 'rebass'
import { Bar, Button, Heading } from 'components/UI'
import ArrowRight from 'components/Icon/ArrowRight'
import { WalletSettingsFormLocal, WalletSettingsFormRemote, WalletHeader } from '.'

class WalletLauncher extends React.Component {
  static propTypes = {
    wallets: PropTypes.array.isRequired,
    walletId: PropTypes.string.isRequired,
    deleteWallet: PropTypes.func.isRequired,
    startLnd: PropTypes.func.isRequired,
    lightningGrpcActive: PropTypes.bool.isRequired,
    walletUnlockerGrpcActive: PropTypes.bool.isRequired,
    stopLnd: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    })
  }

  componentDidMount() {
    const { stopLnd } = this.props
    stopLnd()
  }

  /**
   * Redirect to the login page when we establish a connection to lnd.
   */
  componentDidUpdate(prevProps) {
    const { history, lightningGrpcActive, walletUnlockerGrpcActive, walletId } = this.props

    // If the wallet unlocker became active, switch to the login screen
    if (walletUnlockerGrpcActive && !prevProps.walletUnlockerGrpcActive) {
      history.push(`/home/wallet/${walletId}/unlock`)
    }

    // If an active wallet connection has been established, switch to the app.
    if (lightningGrpcActive && !prevProps.lightningGrpcActive) {
      if (this.getWallet().type === 'local') {
        history.push('/syncing')
      } else {
        history.push('/app')
      }
    }
  }

  getWallet = () => {
    const { wallets, walletId } = this.props
    return wallets.find(wallet => wallet.id == walletId)
  }

  walletName = wallet => {
    if (wallet.type === 'local') {
      return wallet.alias || `Wallet #${wallet.id}`
    }
    return wallet.host.split(':')[0]
  }

  handleDelete = () => {
    const { deleteWallet } = this.props
    const wallet = this.getWallet()
    deleteWallet(wallet.id)
  }

  render() {
    const { startLnd } = this.props
    const wallet = this.getWallet()
    if (!wallet) {
      return null
    }
    const walletName = this.walletName(wallet)

    return (
      <React.Fragment>
        <Flex mb={4} alignItems="center">
          <WalletHeader title={walletName} />

          <Box ml={2}>
            <Button type="submit" size="small" variant="primary" form="wallet-settings-form">
              <Flex>
                <Box mr={1}>Launch now</Box>
                <Box>
                  <ArrowRight />
                </Box>
              </Flex>
            </Button>
            <Button type="button" size="small" onClick={this.handleDelete} ml={2}>
              delete
            </Button>
          </Box>
        </Flex>

        {wallet.type === 'local' && (
          <>
            <Heading.h1 mb={4}>Settings</Heading.h1>
            <Bar my={2} />
            <WalletSettingsFormLocal
              id="wallet-settings-form"
              wallet={wallet}
              startLnd={startLnd}
            />
          </>
        )}

        {wallet.type !== 'local' && (
          <>
            <WalletSettingsFormRemote
              id="wallet-settings-form"
              wallet={wallet}
              startLnd={startLnd}
            />
          </>
        )}
      </React.Fragment>
    )
  }
}

export default withRouter(WalletLauncher)
