import React from 'react'

export const RawSelect = ({ value, options = [], onChange }) => (
  <div className="filter_block_select select_list">
    <select className="select" onChange={onChange}>
      {options.map((option) => {
        const optionValue = option && option.value ? option.value : option
        const optionLabel = option && option.label ? option.label : option
        return (
          <option key={optionValue} value={optionValue} defaultValue={value === optionValue}>
            {optionLabel}
          </option>
        )
      })}
    </select>
  </div>
)

const Select = ({ label, ...other }) => {
  return (
    <label>
      <div className="form_input_block">
        {label ? (
          <div className="form_txt_wrap">
            <span className="f-size14 f-clrGrey">{label}</span>
          </div>
        ) : null}
        <RawSelect className="select_bank_wrap" {...other} />
      </div>
    </label>
  )
}

export default Select
