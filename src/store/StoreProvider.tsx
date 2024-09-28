'use client'

import {type PropsWithChildren, createContext, useContext, useRef} from 'react';
import {type Store, createAppStore} from './store'
import {useStore as useZustandStore} from 'zustand';

type StoreApi = ReturnType<typeof createAppStore>;

export const StoreContext = createContext<StoreApi | undefined>(undefined);

export const StoreProvider = ({children}: PropsWithChildren) => {
	const storeRef = useRef<StoreApi>();

	if (!storeRef.current) {
		storeRef.current = createAppStore();
	}

	return (
		<StoreContext.Provider value={storeRef.current}>
			{children}
		</StoreContext.Provider>
	)
}

export const useStore = <T,>(selector: (store: Store) => T): T => {
	const storeContext = useContext(StoreContext);

	if (!storeContext) {
		throw new Error(`useStore must be used within StoreProvider`)
	}

	return useZustandStore(storeContext, selector)
}
