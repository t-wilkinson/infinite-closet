import React from 'react'

import { Dayjs } from 'dayjs'
import DropDownPicker from 'react-native-dropdown-picker'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'

import { div, span, button, CallToAction } from '@/shared/components'

import { OneTime } from './types'
import DatePicker from './DatePicker'

export const ProductRentContents = ({ shopItem, state, setState }) => {
  const [visible, setVisible] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Dayjs>()

  return (
    <div height={250}>
      {productRentContents[state.rentType]({
        // TODO performance?
        shopItem,
        setState,
        visible,
        setVisible,
        selectedDate,
        setSelectedDate,
        state,
      })}
    </div>
  )
}
export default ProductRentContents

const rentalLengths: { [key in OneTime]: number } = {
  Short: 4,
  Long: 8,
}

const productRentContents = {
  OneTime: ({
    setState,
    shopItem,
    visible,
    setVisible,
    state,
    selectedDate,
    setSelectedDate,
  }) => (
    <>
      <DatePicker
        visible={visible}
        setVisible={setVisible}
        rentalLength={rentalLengths[state.oneTime]}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <SelectorItem label="Size" zIndex={10} width={100}>
        <DropDownPicker
          containerStyle={{ zIndex: 10 }}
          style={{ zIndex: 10 }}
          items={shopItem.sizes.map((v: { id: string } & unknown) => ({
            ...v,
            value: v.id,
          }))}
          itemStyle={{ justifyContent: 'flex-start' }}
          placeholder="Select"
          onChangeItem={(item) =>
            setState((s: { id: string } & unknown) => ({
              ...s,
              size: item.id,
            }))
          }
        />
      </SelectorItem>
      <SelectorItem label="Rental time">
        <div flexDirection="row" justifyContent="space-between">
          <div mr="lg">
            <OneTimeRadioButton
              setState={setState}
              selected={state.oneTime === 'Short'}
              oneTime={'Short'}
            />
            <OneTimeRadioButton
              setState={setState}
              selected={state.oneTime === 'Long'}
              oneTime={'Long'}
            />
          </div>
          <button
            onPress={() => setVisible(true)}
            style={{ flex: 1 }}
          >
            <div
              borderWidth={1}
              borderColor="light-gray"
              borderRadius={4}
              flexDirection="row"
              flex={1}
              justifyContent="space-between"
              alignItems="center"
              px="sm"
            >
              <span>
                {selectedDate &&
                  selectedDate.format('dd M/D') +
                    ' - ' +
                    selectedDate
                      .add(rentalLengths[state.oneTime], 'day')
                      .format('dd M/D')}
              </span>
              <MaterialIcons name="date-range" size={24} color="black" />
            </div>
          </button>
        </div>
      </SelectorItem>
      <CallToAction onPress={() => {}} width="100%" my="sm">
        Add to Closet
      </CallToAction>
    </>
  ),

  Membership: () => (
    <div justifyContent="center" alignItems="center" flex={1}>
      <span variant="subheader" textAlign="center">
        Coming Soon!
      </span>
    </div>
  ),

  Purchase: () => (
    <div justifyContent="center" alignItems="center" flex={1}>
      <span variant="subheader" textAlign="center">
        Coming Soon!
      </span>
    </div>
  ),
}

const SelectorItem = ({ label, children, ...props }) => (
  <div my="sm" {...props}>
    <span variant="body-bold" my="sm">
      {label}
    </span>
    {children}
  </div>
)

const OneTimeRadioButton = ({ setState, selected, oneTime }) => (
  <button
    style={{ flexDirection: 'row', alignItems: 'center' }}
    onPress={() =>
      setState((s: any) => ({
        ...s,
        oneTime,
      }))
    }
  >
    <button>
      <Ionicons
        name={selected ? 'radio-button-on' : 'radio-button-off'}
        size={16}
      />
    </button>
    <span>{oneTime}-day rental</span>
  </button>
)
