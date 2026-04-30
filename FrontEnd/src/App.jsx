import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LupaKataSandi from "./pages/LupaKataSandi";
import Verifikasi from "./pages/Verifikasi";
import BuatSandiBaru from "./pages/BuatSandiBaru";
import Beranda from "./pages/Beranda";

function App() {
  const [page, setPage] = useState("login");

  if (page === "register") {
    return <Register goToLogin={() => setPage("login")} />;
  }

  if (page === "forgot") {
    return (
      <LupaKataSandi
        goToLogin={() => setPage("login")}
        goToVerifikasi={() => setPage("verifikasi")}
      />
    );
  }

  if (page === "verifikasi") {
    return (
      <Verifikasi
        goToReset={() => setPage("reset")}
        goToLogin={() => setPage("login")}
      />
    );
  }

  if (page === "reset") {
    return <BuatSandiBaru goToLogin={() => setPage("login")} />;
  }

  if (page === "beranda") {
    return <Beranda />;
  }

  return (
    <Login
      onLogin={() => setPage("beranda")}
      goToRegister={() => setPage("register")}
      goToForgot={() => setPage("forgot")}
    />
  );
}

export default App;