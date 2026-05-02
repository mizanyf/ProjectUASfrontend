import { NavigationSidebarSection } from "./NavigationSidebarSection";

export const DashboardLayout = ({ children, activePage }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[linear-gradient(0deg,rgba(245,245,245,1)_0%,rgba(245,245,245,1)_100%)]">
      <NavigationSidebarSection activePage={activePage} />
      <main className="flex-1 ml-64 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;