import { connect } from 'react-redux'
import { walletSelectors } from 'reducers/wallet'
import { stopLnd, startLnd, unlockWallet } from 'reducers/onboarding'
import { Home } from 'components/Home'

const mapStateToProps = state => ({
  wallets: state.wallet.wallets,
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  lndWalletStarted: state.onboarding.lndWalletStarted,
  lndWalletUnlockerStarted: state.onboarding.lndWalletUnlockerStarted
})

const mapDispatchToProps = {
  stopLnd,
  startLnd,
  unlockWallet
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
