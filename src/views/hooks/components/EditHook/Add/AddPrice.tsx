import { handlePriceBlur, handlePriceChange } from '@/utils'
import { Checkbox, Input, Text } from '@x-vision/design/index.js'
import React from 'react'

interface Iprops {
  updatePrice: (price: string) => void
  updateIsChooseAddPrice: (v: boolean) => void
  price: string
  isChooseAddPrice: boolean
}

function AddPrice(props: Iprops) {
  const { updatePrice, price, updateIsChooseAddPrice, isChooseAddPrice } = props
  return (
    <div className="flex flex-col gap-2">
      {/* checkbox */}
      <div
        className="flex items-center space-x-2"
        onClick={() => {
          updateIsChooseAddPrice(!isChooseAddPrice)
        }}
      >
        <Checkbox checked={isChooseAddPrice}></Checkbox>
        <Text>Add Price</Text>
      </div>
      {/* price */}
      {isChooseAddPrice && (
        <div className="ml-2">
          <Input
            type="text"
            value={price}
            onChange={(e) => {
              handlePriceChange(e.target.value, updatePrice)
            }}
            onBlur={(e) => handlePriceBlur(e.target.value, updatePrice)}
          />
        </div>
      )}
    </div>
  )
}

export default AddPrice
