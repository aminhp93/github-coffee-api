import React, { ReactNode, useEffect } from "react";
import { createStore, useStore, StoreApi } from "zustand";
import { useFireantWatchlist } from "./hooks"; // Import the hook

interface FireantWatchlistState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any;
  loading: boolean;
  config: string;
  setConfig: (config: string) => void;
}

const FireantWatchlistContext =
  React.createContext<StoreApi<FireantWatchlistState> | null>(null);

interface FireantWatchlistProviderProps {
  children: ReactNode;
}

const FireantWatchlistProvider: React.FC<FireantWatchlistProviderProps> = ({
  children,
}) => {
  const { rows, loading, config, setConfig } = useFireantWatchlist();

  const [store] = React.useState(() =>
    createStore<FireantWatchlistState>(() => ({
      rows,
      loading,
      config,
      setConfig,
    }))
  );

  useEffect(() => {
    store.setState({ rows, loading, config, setConfig });
  }, [rows, loading, config, setConfig, store]);
  return (
    <FireantWatchlistContext.Provider value={store}>
      {children}
    </FireantWatchlistContext.Provider>
  );
};

const useFireantWatchlistStore = <T,>(
  selector: (state: FireantWatchlistState) => T
): T => {
  const store = React.useContext(FireantWatchlistContext);
  if (!store) {
    throw new Error("Missing FireantWatchlistProvider");
  }
  return useStore(store, selector);
};

export { useFireantWatchlistStore, FireantWatchlistProvider };
