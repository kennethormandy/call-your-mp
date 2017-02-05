import React from 'react'
import ReactMarkdown from 'react-markdown'
import _throttle from 'lodash.throttle'
import _filter from 'lodash.filter'
import 'whatwg-fetch'
import Abbr from '../components/Abbr'

class Index extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      yourName: props.yourName,
      yourPostalCode: props.yourPostalCode,
      latitude: false,
      longitude: false,
      locRequested: false,
      repData: props.repData,
      yourLetter: 'Loading…',
      showPostalCodeField: false
    }

    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleChangePostalCode = this.handleChangePostalCode.bind(this)
    this.handleAskForLocation = this.handleAskForLocation.bind(this)
    this.handleAskForPostalCode = _throttle(this.handleAskForPostalCode.bind(this), 1000)
    this.handleLocationNotAvailable = this.handleLocationNotAvailable.bind(this)
  }

  componentDidMount () {
    const self = this

    fetch('https://rawgit.com/skeskali/MPFormLetters/master/Response%20to%20Muslim%20Ban.md')
      .then(function(response) {
        return response.text()
      }).then(function (text) {
        let formatted1 = text.split(':\n\n')
        if (typeof formatted1.length !== 'undefined' && formatted1.length >= 2) {
          return self.setState({ yourLetter: formatted1[1].split('\n\nSincerely,')[0] })
        } else {
          return self.setState({ yourLetter: text })
        }
      }).catch(function (err) {
        console.warn(err)
      })
  }

  handleLocationNotAvailable (err) {
    const self = this

    self.setState({
      locRequested: 'error',
      showPostalCodeField: true
    })
  }

  handleAskForPostalCode (e) {
    e.preventDefault()
    console.log('postal code')
    this.setState({ showPostalCodeField: !this.state.showPostalCodeField })
  }

  handleAskForLocation (e) {
    const self = this
    const url = 'https://represent.opennorth.ca/representatives/house-of-commons/?point='

    e.preventDefault()

    self.setState({ locRequested: 'requesting' })

    // Assume location isn’t available after 5s
    setTimeout(function () {
      self.handleLocationNotAvailable()
    }, 5000)

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        let lat = position.coords.latitude.toFixed(3)
        let lon = position.coords.longitude.toFixed(3)

        console.log('req 2')

        self.setState({
          latitude: lat,
          longitude: lon,
          locRequested: true
        })

        fetch(`${url}${lat},${lon}`)
          .then(function(response) {
            return response.json()
          }).then(function (json) {
            self.setState({ repData: json.objects[0] })
          }).catch(function (err) {
            console.warn(err)
            self.handleLocationNotAvailable(err)
          })
      })
    } else {
      // Location is not available
      self.handleLocationNotAvailable()
    }
  }

  handleChangeName (e) {
    const self = this
    self.setState({ yourName: e.target.value || self.props.yourName })
  }

  handleChangePostalCode (e) {
    e.preventDefault()

    const self = this
    const state = self.state
    const url = 'https://represent.opennorth.ca/postcodes'
    let postalCode = e.target.value.split(' ').join('').toUpperCase()
    console.log(postalCode)
    // const postalCode = state.yourPostalCode.split(' ').join('')

    if (postalCode && postalCode.length === 6) {
      fetch(`${url}/${postalCode}/`)
        .then(function(response) {
          return response.json()
        }).then(function (json) {
          console.log('parsed json', json)
          const filtered = _filter(json.representatives_centroid, { 'elected_office': 'MP' })
          console.log(filtered)

          self.setState({ repData: filtered[0] })
        }).catch(function (err) {
          console.warn(err)
        })
    }
  }

  render (props) {
    const self = this
    const data = self.props.data
    const state = self.state
    let buttonText = 'Get location'
    let office = _filter(state.repData.offices, { type: 'constituency' })
    let repPhoneNumber = office && office.length >= 1 ? office[0].tel : state.repData.office[0].tel

    // Could be better obviously…
    if (state.locRequested === 'requesting') {
      buttonText = 'Finding…'
    } else if (state.locRequested === 'error') {
      buttonText = 'Unavailable'
    } else if (state.locRequested === true) {
      buttonText = 'Update location'
    }




    return (
      <div>
        <header className="mb3">
        <h1 className="mb0">{ data.title }</h1>
        <p className="h3 muted mt0 max-width-2">{ data.description }</p>
        </header>

        <div className="clearfix">
        <div className="flex flex-wrap mxn1">
          <label className="flex-auto px1 col-12 md-col-6">
            <span className="label">Your Name</span>
            <input
              className="input"
              placeholder="Ex. Jane"
              onChange={this.handleChangeName}
              spellCheck={false} />
          </label>
          <div className="flex-auto px1 col-12 md-col-6">
            <div>
              <span className="label">Find Your <Abbr>MP</Abbr></span>
              <div className="flex flex-wrap">
              <div className="col-12 sm-col-6" style={{ minHeight: '2.5rem' }}>
              <button
                style={{ height: '100%' }}
                className="btn btn-primary col-12"
                onClick={this.handleAskForLocation}
                disabled={ state.locRequested === 'requesting' }>{ buttonText }</button>
              </div>
              <div className="col-12 sm-col-6" style={{ minHeight: '2.5rem' }}>
              <button
                style={{ height: '100%' }}
                onClick={this.handleAskForPostalCode}
                className="btn border col-12"><span className="h6 muted border-bottom">{ state.showPostalCodeField ? 'Close' : 'Use your postal code' }</span></button>
              </div>
              </div>
              <aside className={this.state.showPostalCodeField ? '' : 'hide'}>
              <form className="my2" action="" onSubmit={(e) => { this.handleChangePostalCode }}>
                <span className="label">Your Postal Code</span>
                <input
                  className="input tnum"
                  placeholder="Ex. A1A 1A1"
                  onChange={this.handleChangePostalCode}
                  disabled={ state.locRequested === 'requesting' }
                  spellCheck={false} />
              </form>
              <div className="h6 mt2 muted">
                <p className="m0">Please note postal Codes are not a completely accurate method of finding your <Abbr>MP</Abbr>. This site does not track, store, or use your location data for any purpose other than looking up your <Abbr>MP</Abbr> via the <a href="https://represent.opennorth.ca/">Represent Civic Information <Abbr>API</Abbr></a>.</p>
              </div>
              </aside>
            </div>
          </div>
        </div>
        </div>

        <section className="border p1 sm-p2 md-p3 my3 lg-mxn3">
          <header>
            <h3 className="normal h5 m0 muted">The Honourable { state.repData.name }</h3>
            <h2 className="lnum tnum zero mt0"><a href={`tel:${repPhoneNumber}`}>{ repPhoneNumber }</a></h2>
          </header>
          <div className="markdown-content">
            <p>Hello, my name is <strong>{ state.yourName }</strong> and I’m calling to speak with <strong>The Honourable { state.repData.name }</strong></p>
            <ReactMarkdown source={ state.yourLetter } />
            <p>Thanks for your time.</p>
          </div>
        </section>

        <p>Calling your <Abbr>MP</Abbr> is likely the most effective way to deliver this message. You can also send it to their email address at:</p>

        <a href={`mailto:${state.repData.email}?body=${state.yourLetter}`}>{state.repData.email}</a>

        {/* This could include other call to action links in the Markdown frontmatter */}
        {/*
        <footer className="clearfix mt4 pt2 border-top">
          <p>You can also:</p>
          <ul>
            <li>Email this message you your <Abbr>MP</Abbr></li>
            <li><a href="https://you.leadnow.ca/petitions/tell-trudeau-welcome-those-fleeing-violence-and-deportation-under-trump">Sign the petition</a></li>
          </ul>
        </footer>
        */}

      </div>
    )
  }
}

Index.defaultProps = {
  yourName: '[your name]',
  yourPostalCode: '',
  repData: {
    district_name: '[your district name]',
    name: '[your MP’s name]',
    party_name: '',
    url: '#',
    photo_url: 'https://placehold.it/800x600',
    email: '[your MP’s email]',
    offices: [{
      type: 'constituency',
      tel: '1 555 555-5555'
    }]
  }
}

export default Index
