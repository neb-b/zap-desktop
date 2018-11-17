import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, withRouter } from 'react-router-dom'
import { Box } from 'rebass'
import { Bar, Heading, MainContent, Sidebar } from 'components/UI'
import ZapLogo from 'components/Icon/ZapLogo'
import { CreateWalletButton, WalletLauncher, WalletsMenu, WalletUnlocker } from '.'

const NoMatch = () => (
  <Box>
    <Heading>Please select a wallet</Heading>
  </Box>
)

class Home extends React.Component {
  static propTypes = {
    activeWallet: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    history: PropTypes.object.isRequired,
    lightningGrpcActive: PropTypes.bool.isRequired,
    walletUnlockerGrpcActive: PropTypes.bool.isRequired,
    wallets: PropTypes.array.isRequired,
    startLnd: PropTypes.func.isRequired,
    stopLnd: PropTypes.func.isRequired,
    unlockWallet: PropTypes.func.isRequired
  }

  /**
   * If the user has an active wallet redirect to that when the component is mounted at /home.
   */
  componentDidMount() {
    const { history, activeWallet } = this.props
    if (activeWallet && history.location.pathname === '/home') {
      history.push(`/home/wallet/${activeWallet}`)
    }
  }

  /**
   * Handle click event on the Create new wallet button,
   */
  handleCreateNewWalletClick = () => {
    const { history } = this.props
    history.push('/onboarding')
  }

  render() {
    const {
      activeWallet,
      startLnd,
      unlockWallet,
      wallets,
      stopLnd,
      lightningGrpcActive,
      walletUnlockerGrpcActive
    } = this.props

    return (
      <>
        <Sidebar.small p={3} pt={40}>
          <ZapLogo width="70px" height="32px" />

          <WalletsMenu wallets={wallets} mt={20} activeWallet={activeWallet} />

          <Box width={1} css={{ position: 'absolute', left: 0, bottom: 0 }} px={3}>
            <Bar mx={-3} />
            <CreateWalletButton onClick={this.handleCreateNewWalletClick} width={1} p={3} />
          </Box>
        </Sidebar.small>

        <MainContent px={3} mt={92} width={9 / 16}>
          <Switch>
            <Route
              exact
              path="/home/wallet/:walletId"
              render={({ match: { params } }) => (
                <WalletLauncher
                  wallets={wallets}
                  walletId={params.walletId}
                  startLnd={startLnd}
                  stopLnd={stopLnd}
                  lightningGrpcActive={lightningGrpcActive}
                  walletUnlockerGrpcActive={walletUnlockerGrpcActive}
                />
              )}
            />
            <Route
              exact
              path="/home/wallet/:walletId/unlock"
              render={({ match: { params } }) => (
                <WalletUnlocker
                  wallets={wallets}
                  walletId={params.walletId}
                  unlockWallet={unlockWallet}
                  lightningGrpcActive={lightningGrpcActive}
                />
              )}
            />
            <Route component={NoMatch} />
          </Switch>
        </MainContent>
      </>
    )
  }
}

export default withRouter(Home)
