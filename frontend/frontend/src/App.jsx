import './App.css'
import { useEffect, useState } from 'react'

function App() {
    const [users, setUser] = useState([])

    useEffect(() => {
        fetch('http://localhost:5000/api/users')
            .then((res) => res.json())
            .then((data) => setUser(data))
            .catch((error) => console.error('Error:', error))
    }, [])

    return (
        <>
            {users.map((user, index) => (
                <div key={index}>
                    <h2>{user.name}</h2>
                    <p>{user.age}</p>
                </div>
            ))}
        </>
    )
}

export default App