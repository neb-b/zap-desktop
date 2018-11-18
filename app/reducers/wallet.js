import { createSelector } from 'reselect'
import db from 'store/db'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_WALLETS = 'SET_WALLETS'
export const SET_ACTIVE_WALLET = 'SET_ACTIVE_WALLET'
export const SET_IS_WALLET_OPEN = 'SET_IS_WALLET_OPEN'

// ------------------------------------
// Actions
// ------------------------------------

export function setWallets(wallets) {
  return {
    type: SET_WALLETS,
    wallets
  }
}

export function setIsWalletOpen(isWalletOpen) {
  db.settings.put({
    key: 'isWalletOpen',
    value: isWalletOpen
  })
  return {
    type: SET_IS_WALLET_OPEN,
    isWalletOpen
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

export const deleteWallet = walletId => (dispatch, getState) => {
  let { wallets } = getState().wallet
  db.wallets.delete(walletId)
  wallets = wallets.filter(wallet => wallet.id !== walletId)
  dispatch(setWallets(wallets))
  dispatch(setActiveWallet(wallets[0].id))
  setIsWalletOpen(false)
}

export const initWallets = () => async dispatch => {
  let wallets
  let activeWallet
  let isWalletOpen = false
  try {
    wallets = await db.wallets.toArray()

    activeWallet = await db.settings.get({ key: 'activeWallet' })
    activeWallet = activeWallet.value

    isWalletOpen = await db.settings.get({ key: 'isWalletOpen' })
    isWalletOpen = isWalletOpen.value
  } catch (e) {
    wallets = []
  }
  dispatch(setWallets(wallets))
  dispatch(setIsWalletOpen(isWalletOpen))
  dispatch(setActiveWallet(activeWallet))
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_WALLETS]: (state, { wallets }) => ({ ...state, wallets }),
  [SET_ACTIVE_WALLET]: (state, { activeWallet }) => ({ ...state, activeWallet }),
  [SET_IS_WALLET_OPEN]: (state, { isWalletOpen }) => ({ ...state, isWalletOpen })
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
  isWalletOpen: false,
  activeWallet: undefined,
  wallets: []
}

export default function walletReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
