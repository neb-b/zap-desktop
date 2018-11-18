import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Box, Flex } from 'rebass'
import { Form } from 'informed'
import { Bar, Button, Heading, Input, Label, Range, Toggle, Truncate } from 'components/UI'
import ArrowRight from 'components/Icon/ArrowRight'
import * as yup from 'yup'

class WalletLauncher extends React.Component {
  static propTypes = {
    wallets: PropTypes.array.isRequired,
    walletId: PropTypes.string.isRequired,
    deleteWallet: PropTypes.func.isRequired,
    startLnd: PropTypes.func.isRequired,
    lightningGrpcActive: PropTypes.bool.isRequired,
    walletUnlockerGrpcActive: PropTypes.bool.isRequired,
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
    const { history, lightningGrpcActive, walletUnlockerGrpcActive, walletId } = this.props

    // If the wallet unlocker became active, switch to the login screen
    if (walletUnlockerGrpcActive && !prevProps.walletUnlockerGrpcActive) {
      history.push(`/home/wallet/${walletId}/unlock`)
    }

    // If an active wallet connection has been established, switch to the app.
    if (lightningGrpcActive && !prevProps.lightningGrpcActive) {
      if (this.getWallet().type === 'local') {
        history.push('/syncing')
      } else {
        history.push('/app')
      }
    }
  }

  validateAutopilot = value => {
    try {
      yup.boolean().validateSync(value)
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

  validateAutopilotMaxchannels = value => {
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

  validateAutopilotChansize = value => {
    try {
      yup
        .number()
        .required()
        .positive()
        .integer()
        .max(100000000)
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

  getWalletName = () => {
    const wallet = this.getWallet()
    return wallet.alias || `Wallet #${this.getWallet().id}`
  }

  handleDelete = () => {
    const { deleteWallet, walletId } = this.props
    deleteWallet(walletId)
  }

  onSubmit = async values => {
    const { startLnd } = this.props
    return startLnd(values)
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  render() {
    const wallet = this.getWallet()
    const wallletName = this.getWalletName()

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
            <Flex py={3} mb={4} alignItems="center">
              <Box>
                <Heading.h1 fontSize="xxxl">
                  <Truncate text={wallletName} maxlen={25} />
                </Heading.h1>
              </Box>
              <Box ml={2}>
                <Button type="submit" size="small" variant="primary">
                  <Flex>
                    <Box mr={1}>Launch now</Box>
                    <Box>
                      <ArrowRight />
                    </Box>
                  </Flex>
                </Button>
                <Button type="button" size="small" onClick={this.handleDelete} ml={2}>
                  delete
                </Button>
              </Box>
            </Flex>

            <Heading.h1 mb={4}>Settings</Heading.h1>

            <Bar my={2} />

            <Flex py={3} alignItems="center">
              <Box width={1 / 2}>
                <Label htmlFor="alias">Alias</Label>
              </Box>
              <Box ml="auto">
                <Input field="alias" id="alias" ml="auto" justifyContent="flex-end" />
              </Box>
            </Flex>

            <Bar my={2} />

            <Flex alignItems="center">
              <Box width={1 / 2}>
                <Label htmlFor="autopilot">Autopilot</Label>
              </Box>

              <Box ml="auto">
                <Toggle
                  field="autopilot"
                  id="autopilot"
                  validate={this.validateAutopilot}
                  validateOnBlur
                  validateOnChange={formState.invalid}
                />
              </Box>
            </Flex>

            {formState.values.autopilot ? (
              <React.Fragment>
                <Flex py={3} alignItems="center">
                  <Box width={1 / 2}>
                    <Label htmlFor="autopilotAllocation">Percentage of Balance</Label>
                  </Box>
                  <Box ml="auto">
                    <Range
                      field="autopilotAllocation"
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

                <Flex py={3} alignItems="center">
                  <Box width={1 / 2}>
                    <Label htmlFor="autopilotMaxchannels">Number of Channels max.</Label>
                  </Box>
                  <Box ml="auto">
                    <Input
                      field="autopilotMaxchannels"
                      id="autopilotMaxchannels"
                      type="number"
                      min="0"
                      max="1000"
                      step="1"
                      validate={this.validateAutopilotMaxchannels}
                      validateOnBlur
                      validateOnChange={formState.invalid}
                      ml="auto"
                      justifyContent="flex-end"
                    />
                  </Box>
                </Flex>

                <Flex py={3} alignItems="center">
                  <Box width={1 / 2}>
                    <Label htmlFor="autopilotMinchansize">Minimum channel size</Label>
                  </Box>
                  <Box ml="auto">
                    <Input
                      field="autopilotMinchansize"
                      id="autopilotMinchansize"
                      type="number"
                      min="0"
                      max="100000000"
                      step="1"
                      validate={this.validateAutopilotChansize}
                      validateOnBlur
                      validateOnChange={formState.invalid}
                      ml="auto"
                      justifyContent="flex-end"
                    />
                  </Box>
                </Flex>

                <Flex py={3} alignItems="center">
                  <Box width={1 / 2}>
                    <Label htmlFor="autopilotMaxchansize">Maximum channel size</Label>
                  </Box>
                  <Box ml="auto">
                    <Input
                      field="autopilotMaxchansize"
                      id="autopilotMaxchansize"
                      type="number"
                      min="0"
                      max="100000000"
                      step="1"
                      validate={this.validateAutopilotChansize}
                      validateOnBlur
                      validateOnChange={formState.invalid}
                      ml="auto"
                      justifyContent="flex-end"
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
