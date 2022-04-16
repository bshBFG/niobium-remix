import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { useDispatchSidebar, useSidebar } from "./sidebar-context";

type DashboardLayoutProps = {
  children: JSX.Element;
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { mobileSidebar, showSidebar } = useSidebar();
  const dispatchSidebar = useDispatchSidebar();

  return (
    <>
      <div className="flex h-full min-h-screen w-full overflow-x-hidden">
        <div className="fixed top-0 left-0 -z-10 h-screen w-screen overflow-hidden">
          <div className="absolute top-0 left-0 h-screen w-screen overflow-hidden bg-slate-100" />
        </div>

        <div
          className={`fixed top-0 left-0 z-50 h-full min-h-screen w-72 -translate-x-full py-6 pl-6 transition xl:w-80 lg:translate-x-0${
            showSidebar ? " translate-x-0" : ""
          }`}
        >
          <Sidebar />
        </div>

        <div className="`flex h-full w-full flex-col lg:ml-72 xl:ml-80">
          <div className="flex w-full justify-between lg:p-6">
            <Header />
          </div>

          <div className="flex flex-auto p-6">{children}</div>
        </div>
      </div>
      {mobileSidebar && showSidebar && (
        <div
          className="fixed top-0 left-0 z-10 h-screen w-screen bg-black/40"
          onClick={() => dispatchSidebar({ type: "TOGGLE_SIDEBAR" })}
        ></div>
      )}
    </>
  );
};
