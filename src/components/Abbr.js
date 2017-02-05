import React from 'react'

export default function Abbr (props) {
  return (
    <abbr className="caps" {...props}>{props.children}</abbr>
  )
}
