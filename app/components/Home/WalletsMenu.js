import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { Box } from 'rebass'
import { Text } from 'components/UI'

const walletName = wallet => {
  if (wallet.type === 'local') {
    return wallet.alias || `Wallet #${wallet.id}`
  }
  return wallet.host.split(':')[0]
}

const WalletGroup = ({ title, wallets, ...rest }) => (
  <Box {...rest}>
    <Text fontWeight="normal">{title}</Text>
    {wallets.map(wallet => (
      <Text key={wallet.id} py={1}>
        <NavLink to={`/home/wallet/${wallet.id}`} activeStyle={{ fontWeight: 'normal' }}>
          {walletName(wallet)}
        </NavLink>
      </Text>
    ))}
  </Box>
)

class WalletsMenu extends React.Component {
  static displayName = 'WalletsMenu'

  static propTypes = {
    wallets: PropTypes.array.isRequired
  }

  render() {
    const { wallets, history, ...rest } = this.props
    const localWallets = wallets.filter(wallet => wallet.type === 'local')
    const otherWallets = wallets.filter(wallet => wallet.type !== 'local')
    return (
      <Box {...rest}>
        <WalletGroup title="Your Wallets" wallets={localWallets} mb={3} />
        {otherWallets.length > 0 && <WalletGroup title="More" wallets={otherWallets} />}
      </Box>
    )
  }
}

export default WalletsMenu
