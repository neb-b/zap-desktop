import { createSelector } from 'reselect'
import db from 'store/db'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_WALLETS = 'SET_WALLETS'
export const SET_ACTIVE_WALLET = 'SET_ACTIVE_WALLET'

// ------------------------------------
// Actions
// ------------------------------------

export const initWallets = () => async dispatch => {
  let wallets
  let activeWallet
  try {
    wallets = await db.wallets.toArray()
    activeWallet = await db.settings.get({ key: 'activeWallet' })
    activeWallet = activeWallet.value
  } catch (e) {
    wallets = []
  }
  dispatch(setWallets(wallets))
  dispatch(setActiveWallet(activeWallet))
}

export function setWallets(wallets) {
  return {
    type: SET_WALLETS,
    wallets
  }
}

export function setActiveWallet(activeWallet) {
  db.settings.put({
    key: 'activeWallet',
    value: activeWallet
  })
  return {
    type: SET_ACTIVE_WALLET,
    activeWallet
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_WALLETS]: (state, { wallets }) => ({ ...state, wallets }),
  [SET_ACTIVE_WALLET]: (state, { activeWallet }) => ({ ...state, activeWallet })
}

// ------------------------------------
// Selectors
// ------------------------------------

const walletSelectors = {}
const activeWalletSelector = state => state.wallet.activeWallet
const walletsSelector = state => state.wallet.wallets

walletSelectors.wallets = createSelector(walletsSelector, wallets => wallets)
walletSelectors.activeWallet = createSelector(activeWalletSelector, activeWallet => activeWallet)
walletSelectors.activeWalletSettings = createSelector(
  walletsSelector,
  activeWalletSelector,
  (wallets, activeWallet) => wallets.find(wallet => wallet.id === activeWallet)
)

export { walletSelectors }

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  activeWallet: undefined,
  wallets: []
}

export default function walletReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
