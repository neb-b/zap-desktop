import { connect } from 'react-redux'
import { walletSelectors, deleteWallet } from 'reducers/wallet'
import { stopLnd, startLnd, unlockWallet } from 'reducers/lnd'
import { Home } from 'components/Home'

const mapStateToProps = state => ({
  wallets: state.wallet.wallets,
  activeWallet: walletSelectors.activeWallet(state),
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  lightningGrpcActive: state.lnd.lightningGrpcActive,
  walletUnlockerGrpcActive: state.lnd.walletUnlockerGrpcActive
})

const mapDispatchToProps = {
  stopLnd,
  startLnd,
  unlockWallet,
  deleteWallet
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
