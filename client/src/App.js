import React, { useState, useEffect } from "react"

const linkStyle = {
  color: "#999",
  textDecorationStyle: "dotted",
}

const App = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const getData = async () => {
      const data = await fetch("/api/data", {
        method: "GET",
        credentials: "same-origin",
      })
      const read = await data.json()
      if (read.status.code === 200) setData(read.data)
      else console.log(read)
    }
    getData()
  }, [])

  return (
    <main
      style={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#222",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      {data.length
        ? data.map((teamMember, i) => (
            <div
              key={i}
              style={{
                width: "50%",
                margin: ".5em 0",
                display: "flex",
                flexDirection: i % 2 === 0 ? "row" : "row-reverse",
                fontSize: "min(4vw,1.5em)",
                color: "#6f6f6f",
                justifyContent: "space-around",
              }}
            >
              <img
                src={teamMember.picture}
                alt={teamMember.fullName}
                style={{ height: "10em", borderRadius: "50%" }}
              />
              <div
                style={{
                  minWidth: "12em",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <span>Name: {teamMember.fullName}</span>
                <span>Specialty: {teamMember.role}</span>
                <a
                  href={`mailto:${teamMember.email}?subject=Hi ${teamMember.firstName}!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                >
                  Contact {teamMember.firstName}
                </a>
                <a
                  href={`https://github.com/${teamMember.gitHub}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                >
                  {teamMember.firstName}'s Github
                </a>
              </div>
            </div>
          ))
        : null}
    </main>
  )
}

export default App
