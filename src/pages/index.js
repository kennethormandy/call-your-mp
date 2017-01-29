import React from 'react'
import _throttle from 'lodash.throttle'
import _filter from 'lodash.filter'
import 'whatwg-fetch'

function Abbr (props) {
  return (
    <abbr className="caps" {...props}>{props.children}</abbr>
  )
}

class Index extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      yourName: props.yourName,
      yourPostalCode: props.yourPostalCode,
      latitude: false,
      longitude: false,
      locRequested: false,
      repData: props.repData
    }

    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleChangePostalCode = this.handleChangePostalCode.bind(this)
    this.handleAskForLocation = this.handleAskForLocation.bind(this)
  }

  handleAskForLocation (e) {
    const self = this
    const url = 'https://represent.opennorth.ca/representatives/house-of-commons/?point='

    e.preventDefault()

    self.setState({ locRequested: 'requesting' })

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        let lat = position.coords.latitude.toFixed(3)
        let lon = position.coords.longitude.toFixed(3)

        self.setState({
          latitude: lat,
          longitude: lon,
          locRequested: true
        })

        fetch(`${url}${lat},${lon}`)
          .then(function(response) {
            return response.json()
          }).then(function (json) {
            console.log('parsed json', json)
            self.setState({ repData: json.objects[0] })
          }).catch(function (err) {
            console.warn(err)
          })
      })
    } else {
      // Location is not available
    }
  }

  handleChangeName (e) {
    const self = this
    self.setState({ yourName: e.target.value || self.props.yourName })
  }

  handleChangePostalCode (e) {
    // const url = 'http://www.lop.parl.gc.ca/ParlInfo/Compilations/HouseOfCommons/MemberByPostalCode.aspx?Menu=HOC&'
    //
    // fetch(`${url}&PostalCode=A1A1A1`)
    //   .then(function(response) {
    //     return response.text()
    //   }).then(function(body) {
    //     console.log(body)
    //   }, function(error) {
    //     console.warn(err)
    //   })
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
      buttonText = 'Getting location…'
    } else if (state.locRequested === true) {
      buttonText = 'Update location'
    }




    return (
      <div>
        <header className="mb3">
        <h1 className="mb0">{ data.title }</h1>
        <p className="h3 muted mt0 max-width-2">{ data.description }</p>
        </header>

        <form className="flex flex-wrap mxn1">
          <label className="px1 col-12 md-col-6">
            <span className="label">Your Name</span>
            <input
              className="input"
              placeholder="Ex. Jane"
              onChange={this.handleChangeName}
              spellCheck={false} />
          </label>
          <div className="px1 col-12 md-col-6">
            <div className="mb2 border-bottom">
              <span className="label">Your Postal Code</span>
              <input
                className="input"
                placeholder="Ex. A1A 1A1"
                onChange={this.handleChangePostalCode}
                spellCheck={false} />
            </div>
            <div>
              <button className="btn btn-primary" onClick={this.handleAskForLocation} disabled={ state.locRequested === 'requesting' }>{ buttonText }</button>
              <aside className="h5 mt2 muted">
              <p className="m0">Postal Codes are not a completely accurate method of finding your <Abbr>MP</Abbr>.</p>
              <p className="m0" style={{ textIndent: '1em' }}>This site does not track, store, or use your location data for any purpose other than looking up your <Abbr>MP</Abbr> via the <a href="http://represent.opennorth.ca/">Represent Civic Information <Abbr>API</Abbr></a>.</p>
              </aside>
            </div>
          </div>
        </form>

        <section className="border p1 sm-p2 md-p3 my3 lg-mxn3">
          <header>
            <h3 className="normal h5 m0 muted">The Honourable { state.repData.name }</h3>
            <h2 className="lnum tnum zero mt0"><a href={`tel:${repPhoneNumber}`}>{ repPhoneNumber }</a></h2>
          </header>
          <p className="mt0">Hello, my name is { state.yourName } and I live in the the { state.repData.district_name } electoral district. I wanted to let my <Abbr title="Member of Parliament">MP</Abbr> The Honourable { state.repData.name } know how important it is to me that we welcome those fleeing violence and deportation from Trump’s America. Today, if an asylum seeker currently in the <Abbr>US</Abbr> showed up at the Canadian border trying to escape deportation to an unsafe country, Canada would turn them away.</p>
          <p>I support calling on Prime Minister Trudeau and Minister Hussen to immediately rescind the <em className="italic">Safe Third Country Agreement</em> so refugees who originally arrived in the United States can seek refugee status in Canada. Thank you for your time.</p>
        </section>

        <p>Calling or leaving a message for your <Abbr>MP</Abbr> is likely the most effective way to deliver this message based on what I’ve read. You can additionally send it to their email address at:</p>

        <a href={`mailto:${state.repData.email}`}>{state.repData.email}</a>

        <footer className="clearfix mt4 pt2 border-top">
          <p>You can also:</p>
          <ul>
            <li>Email this message you your <Abbr>MP</Abbr></li>
            <li>Sign the petition</li>
          </ul>
        </footer>

      </div>
    )
  }
}

Index.defaultProps = {
  yourName: '[your name]',
  yourPostalCode: false,
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
