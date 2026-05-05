import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LupaKataSandi from "./pages/LupaKataSandi";
import Verifikasi from "./pages/Verifikasi";
import BuatSandiBaru from "./pages/BuatSandiBaru";
import Beranda from "./pages/Beranda";
import BerhasilBuatAkun from "./pages/BerhasilBuatAkun";
import { AppProvider } from "./context/AppContext";

function App() {
  const [page, setPage] = useState("login");
  const [verifikasiOptions, setVerifikasiOptions] = useState({
    fromRegister: false,
    email: "",
  });

  const goToVerifikasi = (options = {}) => {
    setVerifikasiOptions(options);
    setPage("verifikasi");
  };

  const goToBerhasilBuatAkun = () => {
    setPage("berhasilBuatAkun");
  };

  if (page === "register") {
    return (
      <Register
        goToLogin={() => setPage("login")}
        goToVerifikasi={goToVerifikasi}
      />
    );
  }

  if (page === "forgot") {
    return (
      <LupaKataSandi
        goToLogin={() => setPage("login")}
        goToVerifikasi={goToVerifikasi}
      />
    );
  }

  if (page === "verifikasi") {
    return (
      <Verifikasi
        goToReset={() => setPage("reset")}
        goToLogin={() => setPage("login")}
        goToBerhasilBuatAkun={goToBerhasilBuatAkun}
        fromRegister={verifikasiOptions.fromRegister}
        email={verifikasiOptions.email}
      />
    );
  }

  if (page === "reset") {
    return <BuatSandiBaru goToLogin={() => setPage("login")} />;
  }

  if (page === "berhasilBuatAkun") {
    return <BerhasilBuatAkun goToLogin={() => setPage("login")} />;
  }

  if (page === "beranda") {
    return (
      <AppProvider>
        <Beranda onLogout={() => setPage("login")} />
      </AppProvider>
    );
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