// import React, {
//   createContext,
//   useContext,
//   ReactNode,
//   Dispatch,
//   SetStateAction,
// } from "react";
// import { useFireantWatchlist } from "./hooks";

// interface FireantWatchlistContextType {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   rows: any;
//   loading: boolean;
//   config: string;
//   setConfig: Dispatch<SetStateAction<string>>;
// }

// interface FireantWatchlistProviderProps {
//   children: ReactNode;
// }

// const FireantWatchlistContext =
//   createContext<FireantWatchlistContextType | null>(null);

// export const FireantWatchlistProvider = ({
//   children,
// }: FireantWatchlistProviderProps) => {
//   const fireantWatchlist = useFireantWatchlist();

//   return (
//     <FireantWatchlistContext.Provider value={fireantWatchlist}>
//       {children}
//     </FireantWatchlistContext.Provider>
//   );
// };

// export const useFireantWatchlistContext = () => {
//   const context = useContext(FireantWatchlistContext);
//   if (!context) {
//     throw new Error(
//       "useFireantWatchlistContext must be used within a FireantWatchlistProvider"
//     );
//   }
//   return context;
// };

import React, { ReactNode, useEffect } from "react";
import { createStore, useStore, StoreApi } from "zustand";
import { useFireantWatchlist } from "./hooks"; // Import the hook

interface FireantWatchlistState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any;
  loading: boolean;
  config: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setConfig: any;
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
