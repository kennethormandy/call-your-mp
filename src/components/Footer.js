import React from 'react'
import Abbr from './Abbr'

export default function Footer (props) {
  return (
    <footer>
      <h2>Call Your <Abbr>MP</Abbr></h2>
      <ul>
        <li>Letter by <a href="https://twitter.com/skeskali">@skeskali</a> and <a href="https://twitter.com/freyburg">@freyburg</a></li>
        <li>Better integration with<a href="https://github.com/skeskali/MPFormLetters">skeskali/MPFormLetters</a> coming soon</li>
        <li>The code for <a href={ props.data.repository }>this website is open source</a>, so you could help translate the <Abbr title="User Interface">UI</Abbr> into French, open an issue about a bug you found, etc. Thanks!</li>
      </ul>
    </footer>
  )
}
