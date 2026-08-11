import { useState } from "react";
export default function JWTLogin() {
  const [email, setEmail] = useState("");
  const [pswrd, setPswrd] = useState("");
  const [auth, setAuth] = useState('')

  function submitHandler(e) {
    e.preventDefault();

    const payload = {
      email,
      pswrd,
    };
    fetch("http://localhost:5000/login", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    }).then((res)=> res.json())
    .then((data)=>  setAuth(data.token)).catch((err)=> err);
  }

  function profileAccessHandler(){
    fetch("http://localhost:5000/profile",{
        method:'GET',
        headers:{
            Authorization: `Bearer ${auth}`
        }
    })
  }

  return (
    <>
      <form onSubmit={(e) => submitHandler(e)}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        Email
        <input value={pswrd} onChange={(e) => setPswrd(e.target.value)} />
        Pswrd
        <button>Login</button>
      </form>

      <button onClick={profileAccessHandler}> Profile </button>
    </>
  );
}
