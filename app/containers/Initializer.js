import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { walletSelectors } from 'reducers/wallet'
import { startActiveWallet } from 'reducers/onboarding'

/**
 * Root component that deals with mounting the app and managing top level routing.
 */
class Initializer extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    activeWallet: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    activeWalletSettings: PropTypes.object.isRequired,
    lightningGrpcActive: PropTypes.bool,
    walletUnlockerGrpcActive: PropTypes.bool,
    startActiveWallet: PropTypes.func.isRequired
  }

  /**
   * Redirect to the correct page when we establish a connection to lnd.
   */
  componentDidUpdate(prevProps) {
    const {
      history,
      activeWallet,
      activeWalletSettings,
      lightningGrpcActive,
      walletUnlockerGrpcActive,
      startActiveWallet
    } = this.props

    // If we have just determined that the user has an active wallet, attempt to start it.
    if (activeWallet && !prevProps.activeWallet) {
      startActiveWallet()
    }

    // If the wallet unlocker became active, switch to the login screen
    if (walletUnlockerGrpcActive && !prevProps.walletUnlockerGrpcActive) {
      history.push(`/home/wallet/${activeWallet}/unlock`)
    }

    // If an active wallet connection has been established, switch to the app.
    if (lightningGrpcActive && !prevProps.lightningGrpcActive) {
      if (activeWalletSettings.type === 'local') {
        history.push('/syncing')
      } else {
        history.push('/app')
      }
    }
  }

  render() {
    return null
  }
}

const mapStateToProps = state => ({
  activeWallet: walletSelectors.activeWallet(state),
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  lightningGrpcActive: state.lnd.lightningGrpcActive,
  walletUnlockerGrpcActive: state.lnd.walletUnlockerGrpcActive
})

const mapDispatchToProps = {
  startActiveWallet
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Initializer))
