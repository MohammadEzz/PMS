import { TextField } from '@mui/material'
import React, { Component } from 'react'
import { connectSearchBox } from 'react-instantsearch-dom'

class SearchBox extends Component {
  timerId = null

  state = {
    value: this.props.currentRefinement,
  }

  onChangeDebounced = (event) => {
    const { refine, delay } = this.props
    const value = event.currentTarget.value

    clearTimeout(this.timerId)
    this.timerId = setTimeout(() => refine(value), delay)

    this.setState(() => ({
      value,
    }))
  }

  render() {
    const { value } = this.state

    return (
      <TextField
        className="search-field"
        value={value}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        onChange={this.onChangeDebounced}
        placeholder={this.props.placeholder}
      />
    )
  }
}

const DebouncedSearchBox = connectSearchBox(SearchBox)

export default DebouncedSearchBox;
