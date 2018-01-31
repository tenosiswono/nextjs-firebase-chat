/* @flow */
import React from 'react'
import type {Node} from 'react'

type Props = {
  secondary?: boolean,
  children?: Node
}

const Button = ({children, secondary, ...props}: Props) => (
  <button className={`btn btn-${secondary ? 'secondary' : 'primary'}`} {...props}>
    { children }
  </button>
)

export default Button
