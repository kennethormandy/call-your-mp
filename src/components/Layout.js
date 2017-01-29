import React from 'react'
import data from '../data'
import Footer from '../components/Footer'

class Wrapper extends React.Component {
  render () {
    return (
      <div className="max-width-3 mx-auto p1">{this.props.children}</div>
    )
  }
}

class Layout extends React.Component {
  renderChildren (props) {
    data.description = require('../../package.json').description
    data.repository = require('../../package.json').repository
    data.homepage = require('../../package.json').homepage
    data.name = require('../../package.json').name

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
      <div className="kern liga onum border-top border-medium border-primary">
        <Wrapper>
          { self.renderChildren(self.props) }
        </Wrapper>
        <div className="bg-primary white">
          <Wrapper>
            <Footer {...self.props} />
          </Wrapper>
        </div>
      </div>
    )
  }
}

Layout.defaultProps = {
  data: data
}

export default Layout
