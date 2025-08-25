'use client'

import React from 'react'
import './loading.css'

const LoadingAnimation = () => {
  return (
    <div className="loading-wrapper">
      <p className="title">Loading</p>
      <div className="box">
        <div className="load"></div>
        <div className="load"></div>
        <div className="load"></div>
      </div>
    </div>
  )
}

export default LoadingAnimation
