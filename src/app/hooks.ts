
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux"; // import the useSelector and useDispatch hooks from react-redux
import type { RootState, AppDispatch } from "./store"; // import the RootState and AppDispatch types from the store.ts file

// Redux provides the useDispatch and useSelector hooks to access the store's dispatch and state inside a React component.
// But in order to have them aware of the types defined in the store.ts file, we need to re-export new functions that are type aware.

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>(); // create a custom hook that returns the AppDispatch type
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // create a custom hook that returns the RootState type
