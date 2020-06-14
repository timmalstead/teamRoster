import React, { useState, useEffect } from "react"

const App = () => {
  useEffect(() => {
    const getData = async () => {
      const data = await fetch("http://localhost:8000/")
      const read = await data.json()
      console.log(read)
    }
    getData()
  }, [])

  return <span>hello there</span>
}

export default App
