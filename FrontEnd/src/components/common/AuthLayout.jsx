import logo from "../../assets/MoneFlologo.png";

const AuthLayout = ({ children, title = "MoneFlo", subtitle = "" }) => {
  return (
    <main className="w-full min-h-screen flex bg-[linear-gradient(0deg,rgba(245,245,245,1)_0%,rgba(245,245,245,1)_100%),linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)]">
      
      <section className="min-h-screen flex-1 relative overflow-hidden bg-[linear-gradient(151deg,rgba(8,61,86,1)_0%,rgba(12,82,114,1)_40%,rgba(0,105,92,1)_100%)]">
        
        {/* BACKGROUND SHAPE */}
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#00695c26] rounded-[250px]" />
        <div className="absolute -left-20 -bottom-20 w-[350px] h-[350px] bg-[#546e7a1f] rounded-[175px]" />

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[52%] flex flex-col items-center">

          {/* LOGO */}
          <img src={logo} alt="logo" className="w-14 h-14" />

          <h1 className="text-white text-3xl font-bold mt-2">
            {title}
          </h1>

          <p className="text-white/70 text-sm">{subtitle}</p>

          {/* CONTENT */}
          <div className="mt-8 w-[420px] bg-white rounded-2xl shadow-xl p-8">
            {children}
          </div>

        </div>
      </section>
    </main>
  );
};

export default AuthLayout;
