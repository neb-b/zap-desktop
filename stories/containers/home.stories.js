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
      autopilot: true,
      autopilotAllocation: 0.6,
      autopilotMaxchannels: 5,
      autopilotMaxchansize: 16777215,
      autopilotMinchansize: 20000,
      autopilotMinconfs: 0,
      autopilotPrivate: true,
      binaryPath: '/Users/tom/workspace/zap-desktop/node_modules/lnd-binary/vendor/lnd',
      cert: '~/.lnd/bitcoin/testnet/wallet-14/tls.cert',
      chain: 'bitcoin',
      configPath: 'resources/lnd.conf',
      host: 'localhost:10009',
      lndDir: '/Users/tom/Library/Application Support/Electron/lnd/bitcoin/testnet/wallet-14',
      macaroon: '~/.lnd/bitcoin/testnet/wallet-14/data/chain/bitcoin/testnet/admin.macaroon',
      network: 'testnet',
      rpcProtoPath: 'resources/rpc.proto',
      type: 'local',
      wallet: 'wallet-14'
    },
    {
      id: 2,
      type: 'custom',
      chain: 'bitcoin',
      network: 'testnet',
      host: 'mynode.local'
    },
    {
      id: 3,
      alias: 'The Lightning Store',
      type: 'btcpayserver',
      chain: 'bitcoin',
      network: 'testnet',
      host: 'example.btcpay.store'
    }
  ]
})

const startLnd = async wallet => {
  console.log('startLnd', wallet)
  await delay(500)
  store.set({ walletUnlockerGrpcActive: true, lightningGrpcActive: false })
}
const stopLnd = async () => {
  console.log('stopLnd')
  await delay(500)
  store.set({ walletUnlockerGrpcActive: false, lightningGrpcActive: false })
}
const unlockWallet = async (wallet, password) => {
  console.log('unlockWallet', wallet, password)
  await delay(300)
  store.set({ walletUnlockerGrpcActive: false, lightningGrpcActive: true })
}
const deleteWallet = async walletId => {
  console.log('deleteWallet', walletId)
  await delay(200)
}

storiesOf('Containers.Home', module)
  .addParameters({
    info: {
      disable: true
    }
  })
  .addDecorator(
    StoryRouter({
      '/onboarding': linkTo('Containers.Onboarding', 'Onboarding'),
      '/syncing': linkTo('Containers.Syncing', 'Syncing'),
      '/app': linkTo('Containers.App', 'App')
    })
  )
  .add('Home', () => {
    return (
      <Page css={{ height: 'calc(100vh - 40px)' }}>
        <State store={store}>
          <Home
            startLnd={startLnd}
            stopLnd={stopLnd}
            unlockWallet={unlockWallet}
            deleteWallet={deleteWallet}
          />
        </State>
      </Page>
    )
  })
