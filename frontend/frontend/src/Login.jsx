  import {  useState } from "react";

  export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function submitHandler(e) {
      e.preventDefault();

      const payload = {
        email,
        password
      };

      try {
        fetch("http://localhost:5000/login", {
          method: "POST",
          body: JSON.stringify(payload),
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
        });
      } catch {
        throw Error();
      }
    }

    function profileButtonCall(){

      console.log("hello----------")
      fetch ('http://localhost:5000/profile',{
        method: 'GET',
        credentials: 'include'

      })
    }

    return (
      <>
        <form onSubmit={(e) => submitHandler(e)}>
          <input
            type="text"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />{" "}
          Email
          <input
            type="text"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />{" "}
          Password
          <button>Submitt</button>
        </form>


        <button onClick={profileButtonCall}>
          Profile 
        </button>
      </>
    );
  }
