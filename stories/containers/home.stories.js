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
  activeWallet: 1,
  lightningGrpcActive: false,
  walletUnlockerGrpcActive: false,
  wallets: [
    {
      id: 1,
      type: 'local',
      chain: 'bitcoin',
      network: 'testnet',
      alias: 'Small change',
      autopilot: true,
      autopilotAllocation: 0.6,
      autopilotMaxchannels: 5,
      autopilotMinchansize: 20000,
      autopilotMaxchansize: 16777215,
      autopilotPrivate: true
    },
    {
      id: 2,
      type: 'custom',
      chain: 'bitcoin',
      network: 'testnet'
    },
    {
      id: 3,
      alias: 'The Lightning Store',
      type: 'btcpayserver',
      chain: 'bitcoin',
      network: 'testnet'
    }
  ]
})

const startLnd = wallet => {
  console.log('startLnd', wallet)
  delay(500)
  store.set({ walletUnlockerGrpcActive: true, lightningGrpcActive: false })
}
const stopLnd = () => {
  console.log('stopLnd')
  delay(500)
  store.set({ walletUnlockerGrpcActive: false, lightningGrpcActive: false })
}
const unlockWallet = (wallet, password) => {
  console.log('unlockWallet', wallet, password)
  delay(500)
  store.set({ walletUnlockerGrpcActive: false, lightningGrpcActive: true })
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
