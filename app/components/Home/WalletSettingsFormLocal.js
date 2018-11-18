import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { Bar, Form, Input, Label, Range, Toggle } from 'components/UI'
import * as yup from 'yup'

class WalletSettingsFormLocal extends React.Component {
  static propTypes = {
    wallet: PropTypes.object.isRequired,
    startLnd: PropTypes.func.isRequired
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
      <Form width={1} getApi={this.setFormApi} onSubmit={this.onSubmit} {...rest}>
        {({ formState }) => (
          <React.Fragment>
            <Flex py={3} alignItems="center">
              <Box width={1 / 2}>
                <Label htmlFor="alias">Alias</Label>
              </Box>
              <Box ml="auto">
                <Input
                  field="alias"
                  id="alias"
                  ml="auto"
                  justifyContent="flex-end"
                  initialValue={wallet.alias}
                />
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
                  initialValue={wallet.autopilot}
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
                      initialValue={wallet.autopilotAllocation}
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
                      initialValue={wallet.autopilotMaxchannels}
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
                      initialValue={wallet.autopilotMinchansize}
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
                      initialValue={wallet.autopilotMaxchansize}
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

export default WalletSettingsFormLocal
