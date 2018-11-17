/* eslint-disable max-len */

import React from 'react'
import { storiesOf } from '@storybook/react'
import { linkTo } from '@storybook/addon-links'
import { State, Store } from '@sambego/storybook-state'
import StoryRouter from 'storybook-react-router'
import { Page } from 'components/UI'
import { Home } from 'components/Home'

const delay = time => new Promise(resolve => setTimeout(() => resolve(), time))

const store = new Store({
  activeWallet: 'c0b4c9cee61aee28447438985ae6f770',
  lndWalletStarted: false,
  lndWalletUnlockerStarted: false,
  wallets: [
    {
      id: 'c0b4c9cee61aee28447438985ae6f770',
      name: 'Wallet #1',
      type: 'local',
      chain: 'bitcoin',
      network: 'testnet',
      settings: {
        autopilot: true,
        autopilotMaxChannels: 10,
        autopilotAllocation: 0.6
      }
    },
    {
      id: '3bb00e950e3f48833fb026b1cc994f25',
      name: 'Home Node',
      type: 'custom',
      chain: 'bitcoin',
      network: 'testnet'
    },
    {
      id: 'f8937948e98812b8bdd5b797494fb559',
      name: 'My Store',
      type: 'btcpayserver',
      chain: 'bitcoin',
      network: 'testnet'
    }
  ]
})

const startLnd = wallet => {
  console.log('startLnd', wallet)
  delay(500)
  store.set({ lndWalletUnlockerStarted: true, lndWalletStarted: false })
}
const stopLnd = () => {
  console.log('stopLnd')
  delay(500)
  store.set({ lndWalletUnlockerStarted: false, lndWalletStarted: false })
}
const unlockWallet = (wallet, password) => {
  console.log('unlockWallet', wallet, password)
  delay(500)
  store.set({ lndWalletUnlockerStarted: false, lndWalletStarted: true })
}

storiesOf('Containers.Home', module)
  .addParameters({
    info: {
      disable: true
    }
  })
  .addDecorator(
    StoryRouter({
      '/onboarding': linkTo('Containers.Onboarding', 'Onboarding')
    })
  )
  .add('Home', () => {
    return (
      <Page css={{ height: 'calc(100vh - 40px)' }}>
        <State store={store}>
          <Home startLnd={startLnd} stopLnd={stopLnd} unlockWallet={unlockWallet} />
        </State>
      </Page>
    )
  })
