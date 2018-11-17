import React from 'react'
import PropTypes from 'prop-types'
import { NavLink, withRouter } from 'react-router-dom'
import { Menu, MenuItemGroup, Text } from 'components/UI'

class WalletsMenu extends React.Component {
  static displayName = 'WalletsMenu'

  static propTypes = {
    activeWallet: PropTypes.string.isRequired,
    wallets: PropTypes.array.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  }

  onSelect = info => {
    const { history } = this.props
    history.push(`/home/wallet/${info.key}`)
  }

  render() {
    const { activeWallet, wallets, history, match, location, staticContext, ...rest } = this.props
    const localWallets = wallets.filter(wallet => wallet.type === 'local')
    const otherWallets = wallets.filter(wallet => wallet.type !== 'local')
    return (
      <Menu onSelect={this.onSelect} {...rest}>
        <MenuItemGroup title="Your Wallets">
          {localWallets.map(wallet => (
            <Text key={wallet.id} py={1}>
              <NavLink to={`/home/wallet/${wallet.id}`} activeStyle={{ fontWeight: 'normal' }}>
                {wallet.name || wallet.id}
              </NavLink>
            </Text>
          ))}
        </MenuItemGroup>
        {otherWallets && (
          <MenuItemGroup title="More">
            {otherWallets.map(wallet => (
              <Text key={wallet.id} py={1}>
                <NavLink to={`/home/wallet/${wallet.id}`} activeStyle={{ fontWeight: 'normal' }}>
                  {wallet.name || wallet.id}
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
