import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Box, Flex } from 'rebass'
import { Form } from 'informed'
import {
  Bar,
  Button,
  Heading,
  Input,
  Label,
  Notification,
  Range,
  Toggle,
  Truncate
} from 'components/UI'
import * as yup from 'yup'

class WalletLauncher extends React.Component {
  static propTypes = {
    wallets: PropTypes.array.isRequired,
    walletId: PropTypes.string.isRequired,
    startLnd: PropTypes.func.isRequired,
    lndWalletStarted: PropTypes.bool.isRequired,
    lndWalletUnlockerStarted: PropTypes.bool.isRequired,
    stopLnd: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    })
  }

  componentDidMount() {
    const { stopLnd } = this.props
    stopLnd()
  }

  /**
   * Redirect to the login page when we establish a connection to lnd.
   */
  componentDidUpdate(prevProps) {
    const { history, lndWalletStarted, lndWalletUnlockerStarted, walletId } = this.props

    // If the wallet unlocker became active, switch to the login screen
    if (lndWalletUnlockerStarted && !prevProps.lndWalletUnlockerStarted) {
      history.push(`/home/wallet/${walletId}/unlock`)
    }

    // If an active wallet connection has been established, switch to the app.
    if (lndWalletStarted && !prevProps.lndWalletStarted) {
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

  onSubmit = async values => {
    const { startLnd } = this.props
    return startLnd(values)
  }

  validateAutopilot = value => {
    try {
      yup.boolean().validateSync(value)
    } catch (error) {
      return error.message
    }
  }

  validateAutopilotMaxChannels = value => {
    try {
      yup
        .number()
        .required()
        .positive()
        .integer()
        .max(100)
        .typeError('A number is required')
        .validateSync(value)
    } catch (error) {
      return error.message
    }
  }

  validateAutopilotAllocation = value => {
    try {
      yup
        .number()
        .required()
        .positive()
        .min(0)
        .max(1)
        .typeError('A number is required')
        .validateSync(value)
    } catch (error) {
      return error.message
    }
  }

  getWallet = () => {
    const { wallets, walletId } = this.props
    return wallets.find(wallet => wallet.id == walletId)
  }

  render() {
    const wallet = this.getWallet()
    if (!wallet) {
      return null
    }

    return (
      <Form
        width={1}
        getApi={this.setFormApi}
        onSubmit={this.onSubmit}
        onSubmitFailure={this.onSubmitFailure}
        initialValues={wallet}
        key={`wallet-settings-form-${wallet.id}`}
      >
        {({ formState }) => (
          <React.Fragment>
            {formState.submits > 0 &&
              formState.invalid && (
                <Notification variant="error">Please correct the errors show below.</Notification>
              )}

            <Flex py={3} mb={4} alignItems="center">
              <Box>
                <Heading.h1 fontSize="xxxl">
                  <Truncate text={wallet.name || wallet.id} />
                </Heading.h1>
              </Box>
              <Box ml={2}>
                <Button type="submit" size="small">
                  Launch now
                </Button>
              </Box>
            </Flex>

            <Heading.h1 mb={4}>Settings</Heading.h1>

            <Flex alignItems="center">
              <Box width={1 / 2}>
                <Label htmlFor="autopilot">Autopilot</Label>
              </Box>

              <Box ml="auto">
                <Toggle
                  field="settings.autopilot"
                  id="autopilot"
                  validate={this.validateAutopilot}
                  validateOnBlur
                  validateOnChange={formState.invalid}
                />
              </Box>
            </Flex>

            <Bar my={2} />

            {formState.values.settings && formState.values.settings.autopilot ? (
              <React.Fragment>
                <Flex py={3} alignItems="center">
                  <Box width={1 / 2}>
                    <Label htmlFor="autopilotMaxChannels">Number of Channels max.</Label>
                  </Box>
                  <Box ml="auto">
                    <Input
                      field="settings.autopilotMaxChannels"
                      id="autopilotMaxChannels"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      validate={this.validateAutopilotMaxChannels}
                      validateOnBlur
                      validateOnChange={formState.invalid}
                      ml="auto"
                      justifyContent="flex-end"
                    />
                  </Box>
                </Flex>

                <Flex py={3} alignItems="center">
                  <Box width={1 / 2}>
                    <Label htmlFor="autopilotAllocation">Percentage of Balance</Label>
                  </Box>
                  <Box ml="auto">
                    <Range
                      field="settings.autopilotAllocation"
                      id="autopilotAllocation"
                      validate={this.validateAutopilotAllocation}
                      validateOnBlur
                      validateOnChange={formState.invalid}
                      ml="auto"
                      justifyContent="flex-end"
                      min="0"
                      max="1"
                      step="0.01"
                    />
                  </Box>
                </Flex>
              </React.Fragment>
            ) : null}
          </React.Fragment>
        )}
      </Form>
    )
  }
}

export default withRouter(WalletLauncher)
