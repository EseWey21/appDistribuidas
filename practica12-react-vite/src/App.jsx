import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <h1>Edgar Sajit López Ventura</h1>
      <h2>Aplicaciones Distribuidas — Práctica 12</h2>

      <div className="card">
        <button type="button" onClick={() => setCount((count) => count + 1)}>
          Contador: {count}
        </button>
        <p>
          Cada clic ejecuta <code>setCount</code> y React vuelve a renderizar
          este componente con el nuevo valor.
        </p>
      </div>
    </div>
  )
}

export default App
