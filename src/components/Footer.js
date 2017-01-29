import React from 'react'

export default function Footer (props) {
  return (
    <footer>
      <h2>Footer</h2>
      <ul>
        <li>The code for <a href={ props.data.repository }>this website is Open Source</a>, so you could help improve my script, translate it into French, open an issue about a bug you found, etc. Thanks!</li>
        <li>Embed this form into your site or article:</li>
      </ul>
      <div>
        <h2>Credits</h2>
      </div>

    </footer>
  )
}
