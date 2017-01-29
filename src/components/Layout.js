import React from 'react'
import data from '../data'

class Layout extends React.Component {
  renderChildren (props) {
    return React.Children.map(props.children, child => {
      return React.cloneElement(child, {
        data: props.data
      })
    })
  }

  componentDidMount () {
  }

  render () {
    const self = this
    return (
      <div className="kern liga onum max-width-3 mx-auto p1">
        { self.renderChildren(self.props) }
      </div>
    )
  }
}

Layout.defaultProps = {
  data: data
}

export default Layout
