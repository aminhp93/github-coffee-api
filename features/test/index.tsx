import React, { ReactNode } from "react";
import { createStore, useStore, StoreApi } from "zustand";

// Define the types for the store state and actions
interface BearState {
  bears: number;
  actions: {
    increasePopulation: (by: number) => void;
    removeAllBears: () => void;
  };
}

// Create a context with the store type
const BearStoreContext = React.createContext<StoreApi<BearState> | null>(null);

interface BearStoreProviderProps {
  children: ReactNode;
  initialBears: number;
}

const BearStoreProvider: React.FC<BearStoreProviderProps> = ({
  children,
  initialBears,
}) => {
  const [store] = React.useState(() =>
    createStore<BearState>((set) => ({
      bears: initialBears,
      actions: {
        increasePopulation: (by) =>
          set((state) => ({ bears: state.bears + by })),
        removeAllBears: () => set({ bears: 0 }),
      },
    }))
  );

  return (
    <BearStoreContext.Provider value={store}>
      {children}
    </BearStoreContext.Provider>
  );
};

const useBearStore = <T,>(selector: (state: BearState) => T): T => {
  const store = React.useContext(BearStoreContext);
  if (!store) {
    throw new Error("Missing BearStoreProvider");
  }
  return useStore(store, selector);
};

// Usage example
const BearCounter: React.FC = () => {
  const bears = useBearStore((state) => state.bears);
  const increasePopulation = useBearStore(
    (state) => state.actions.increasePopulation
  );
  const removeAllBears = useBearStore((state) => state.actions.removeAllBears);

  return (
    <div>
      <h1>{bears} bears around here...</h1>
      <button onClick={() => increasePopulation(1)}>Increase Population</button>
      <button onClick={removeAllBears}>Remove All Bears</button>
    </div>
  );
};

const App: React.FC = () => (
  <BearStoreProvider initialBears={5}>
    <BearCounter />
  </BearStoreProvider>
);

export default App;
