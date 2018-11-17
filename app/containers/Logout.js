import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { walletSelectors } from 'reducers/wallet'
import { stopLnd } from 'reducers/onboarding'

/**
 * Root component that deals with mounting the app and managing top level routing.
 */
class Logout extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    lightningGrpcActive: PropTypes.bool,
    onboarding: PropTypes.bool,
    stopLnd: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { history, lightningGrpcActive, stopLnd } = this.props
    if (lightningGrpcActive) {
      stopLnd()
    } else {
      history.push('/home')
    }
  }

  /**
   * Redirect to the correct page when we establish a connection to lnd.
   */
  componentDidUpdate(prevProps) {
    const { history, onboarding } = this.props
    // If we have just determined that the user has an active wallet, attempt to start it.
    if (onboarding && !prevProps.onboarding) {
      history.push('/home')
    }
  }

  render() {
    return null
  }
}

const mapStateToProps = state => ({
  activeWallet: walletSelectors.activeWallet(state),
  lightningGrpcActive: state.lnd.lightningGrpcActive,
  onboarding: state.onboarding.onboarding
})

const mapDispatchToProps = {
  stopLnd
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Logout))
