import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
} from "react";

import { Breakpoints, useWindowSize } from "~/hooks/useWindowSize";

const MIN_WIDTH = Breakpoints.lg;

type SidebarStore = {
  mobileSidebar: boolean;
  showSidebar: boolean;
};

type SidebarActions = {
  type: "TOGGLE_SIDEBAR" | "MOBILE_SIDEBAR" | "DESKTOP_SIDEBAR";
};

const reducer = (state: SidebarStore, action: SidebarActions): SidebarStore => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        showSidebar: !state.showSidebar,
      };
    case "MOBILE_SIDEBAR":
      return {
        mobileSidebar: true,
        showSidebar: false,
      };
    case "DESKTOP_SIDEBAR":
      return {
        mobileSidebar: false,
        showSidebar: true,
      };
    default:
      throw new Error("Incorrect Action");
  }
};

const SidebarStoreContext = createContext({} as SidebarStore);
const SidebarDispatchContext = createContext({} as Dispatch<SidebarActions>);

type SidebarProviderProps = {
  children: JSX.Element;
};

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const { minWidth } = useWindowSize();

  const [state, dispatch] = useReducer(reducer, {
    mobileSidebar: true,
    showSidebar: false,
  });

  useEffect(() => {
    if (minWidth(MIN_WIDTH)) {
      dispatch({ type: "DESKTOP_SIDEBAR" });
    } else {
      dispatch({ type: "MOBILE_SIDEBAR" });
    }
  }, [minWidth]);

  useEffect(() => {
    if (window) {
      if (state.mobileSidebar && state.showSidebar) {
        document.body.classList.add("overflow-y-hidden");
      } else {
        document.body.classList.remove("overflow-y-hidden");
      }
    }
  }, [state]);

  return (
    <SidebarDispatchContext.Provider value={dispatch}>
      <SidebarStoreContext.Provider value={state}>
        {children}
      </SidebarStoreContext.Provider>
    </SidebarDispatchContext.Provider>
  );
};

export { SidebarStoreContext, SidebarDispatchContext, SidebarProvider };

const useSidebar = () => {
  return useContext(SidebarStoreContext);
};

const useDispatchSidebar = () => {
  return useContext(SidebarDispatchContext);
};

export { useSidebar, useDispatchSidebar };
