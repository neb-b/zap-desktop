import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Form } from 'informed'
import { Button, PasswordInput } from 'components/UI'
import * as yup from 'yup'
import { WalletHeader } from '.'

/**
 * @render react
 * @name WalletUnlocker
 * @example
 * <WalletUnlocker
     wallet={{ ... }}
     unlockWallet={() => {}}
     setError={() => {}} >
 */
class WalletUnlocker extends React.Component {
  static displayName = 'WalletUnlocker'

  static propTypes = {
    wallets: PropTypes.array.isRequired,
    walletId: PropTypes.string.isRequired,
    lightningGrpcActive: PropTypes.bool.isRequired,
    unlockWallet: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    })
  }

  /**
   * Redirect to the login page when we establish a connection to lnd.
   */
  componentDidUpdate(prevProps) {
    const { history, lightningGrpcActive } = this.props

    // If an active wallet connection has been established, switch to the app.
    if (lightningGrpcActive && !prevProps.lightningGrpcActive) {
      if (this.getWallet().type === 'local') {
        history.push('/syncing')
      } else {
        history.push('/app')
      }
    }
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  onSubmit = values => {
    const { unlockWallet } = this.props
    unlockWallet(values.password)
  }

  getWallet = () => {
    const { wallets, walletId } = this.props
    return wallets.find(wallet => wallet.id == walletId)
  }

  walletName = wallet => {
    if (wallet.type === 'local') {
      return wallet.alias || `Wallet #${wallet.id}`
    }
    return wallet.host.split(':')[0]
  }

  validatePassword = value => {
    try {
      yup
        .string()
        .required()
        .min(8)
        .validateSync(value)
    } catch (error) {
      return error.message
    }
  }

  render = () => {
    const wallet = this.getWallet()
    if (!wallet) {
      return null
    }
    const walletName = this.walletName(wallet)

    return (
      <Form
        width={1}
        getApi={this.setFormApi}
        onSubmit={this.onSubmit}
        onSubmitFailure={this.onSubmitFailure}
        key={`wallet-unlocker-form-${wallet.id}`}
      >
        {({ formState }) => (
          <React.Fragment>
            <WalletHeader title={walletName} />

            <PasswordInput
              field="password"
              id="password"
              label="Enter Password"
              my={3}
              validate={this.validatePassword}
              validateOnBlur
              validateOnChange={formState.invalid}
            />

            <Button type="submit">Enter</Button>
          </React.Fragment>
        )}
      </Form>
    )
  }
}

export default withRouter(WalletUnlocker)
