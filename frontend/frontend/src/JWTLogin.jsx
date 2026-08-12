import { useState } from "react";
export default function JWTLogin() {
  const [email, setEmail] = useState("");
  const [pswrd, setPswrd] = useState("");
  const [auth, setAuth] = useState("");

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
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setAuth(data.token))
      .catch((err) => err);
  }

  async function profileAccessHandler() {
    const profileData = await fetch("http://localhost:5000/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    });
    if (profileData.status == 401) {
      const refreshResponse = await fetch("http://localhost:5000/refresh", {
        method: "POST",
        credentials: "include",
      });
      const refreshData = await refreshResponse.json();
      if (refreshResponse.ok) {
        setAuth(refreshData.token);

        fetch("http://localhost:5000/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${refreshData.token}`,
          },
        });
      }
    }

    console.log(profileData);
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
