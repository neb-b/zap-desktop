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
    deleteWallet: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    lightningGrpcActive: PropTypes.bool.isRequired,
    walletUnlockerGrpcActive: PropTypes.bool.isRequired,
    wallets: PropTypes.array.isRequired,
    startLnd: PropTypes.func.isRequired,
    stopLnd: PropTypes.func.isRequired,
    unlockWallet: PropTypes.func.isRequired
  }

  /**
   * If the user has an active wallet when the component is mounted at /home, navigate to that wallet's launcher.
   */
  componentDidMount() {
    const { history, activeWallet } = this.props
    const activeWalletPath = `/home/wallet/${activeWallet}`
    if (activeWallet && history.location.pathname !== activeWalletPath) {
      history.push(activeWalletPath)
    }
  }

  /**
   * If the active wallet has changed, navigate to the new wallet's launcher
   */
  componentDidUpdate(prevProps) {
    const { history, activeWallet } = this.props
    if (activeWallet !== prevProps.activeWallet) {
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
      deleteWallet,
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

          <WalletsMenu wallets={wallets} mt={30} activeWallet={activeWallet} />

          <Box width={1} css={{ position: 'absolute', left: 0, bottom: 0 }} px={3}>
            <Bar mx={-3} />
            <CreateWalletButton onClick={this.handleCreateNewWalletClick} width={1} p={3} />
          </Box>
        </Sidebar.small>

        <MainContent>
          <Box px={3} mt={72}>
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
                    deleteWallet={deleteWallet}
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
          </Box>
        </MainContent>
      </>
    )
  }
}

export default withRouter(Home)
