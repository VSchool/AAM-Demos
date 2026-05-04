import { createContext, useContext, useState, useCallback } from "react";

const NavigationContext = createContext();

export function NavigationProvider({ children }) {
  const [lastNavMethod, setLastNavMethod] = useState("Initial load");
  const [matchedRoute, setMatchedRoute] = useState("/");

  const recordNavigation = useCallback((method, route) => {
    setLastNavMethod(method);
    if (route) setMatchedRoute(route);
  }, []);

  return (
    <NavigationContext.Provider
      value={{ lastNavMethod, matchedRoute, recordNavigation }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavContext() {
  return useContext(NavigationContext);
}
