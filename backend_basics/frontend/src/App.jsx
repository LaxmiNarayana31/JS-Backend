/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import axios from 'axios'

import './App.css'

function App() {
  const [blogInfo, setBlogs] = useState([])
  useEffect(() => {
    axios.get("/api/blogs")
      .then((response) => {
      setBlogs(response.data)
      })
      .catch((error) => {
      console.log(error);
    })
  })
  return (
    <>
      <h1>Learn JavaScript Backend</h1>
      <p>BlogInformation: {blogInfo.length}</p>
      {
        blogInfo.map((blogs, index) => (
          <div key={blogs.id}>
            <h3>{blogs.title}</h3>
            <p>{blogs.body}</p>
          </div>
        ))
      }
    </>
  )
}

export default App
