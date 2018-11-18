import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, withRouter } from 'react-router-dom'
import { Menu, MenuItemGroup, Text } from 'components/UI'

class WalletsMenu extends React.Component {
  static displayName = 'WalletsMenu'

  static propTypes = {
    wallets: PropTypes.array.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  }

  onSelect = info => {
    const { history } = this.props
    history.push(`/home/wallet/${info.key}`)
  }

  walletName = wallet => {
    if (wallet.type === 'local') {
      return wallet.alias || `Wallet #${wallet.id}`
    }
    return wallet.host.split(':')[0]
  }

  render() {
    const { wallets } = this.props
    const localWallets = wallets.filter(wallet => wallet.type === 'local')
    const otherWallets = wallets.filter(wallet => wallet.type !== 'local')
    return (
      <Menu onSelect={this.onSelect}>
        <MenuItemGroup title="Your Wallets">
          {localWallets.map(wallet => (
            <Text key={wallet.id} py={1}>
              <NavLink to={`/home/wallet/${wallet.id}`} activeStyle={{ fontWeight: 'normal' }}>
                {this.walletName(wallet)}
              </NavLink>
            </Text>
          ))}
        </MenuItemGroup>
        {otherWallets.length > 0 && (
          <MenuItemGroup title="More">
            {otherWallets.map(wallet => (
              <Text key={wallet.id} py={1}>
                <NavLink to={`/home/wallet/${wallet.id}`} activeStyle={{ fontWeight: 'normal' }}>
                  {this.walletName(wallet)}
                </NavLink>
              </Text>
            ))}
          </MenuItemGroup>
        )}
      </Menu>
    )
  }
}

export default withRouter(WalletsMenu)
