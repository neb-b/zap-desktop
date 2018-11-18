import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'informed'

class WalletSettingsFormRemote extends React.Component {
  static propTypes = {
    wallet: PropTypes.object.isRequired,
    startLnd: PropTypes.func.isRequired
  }

  onSubmit = async values => {
    const { startLnd } = this.props
    return startLnd(values)
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const { wallet, startLnd, ...rest } = this.props
    return (
      <Form
        width={1}
        getApi={this.setFormApi}
        onSubmit={this.onSubmit}
        initialValues={wallet}
        {...rest}
      />
    )
  }
}

export default WalletSettingsFormRemote
