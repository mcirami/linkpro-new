import { createContext, useContext } from 'react';
const UserLinksContext = createContext(undefined);
export const useUserLinksContext = () => useContext(UserLinksContext);
export default UserLinksContext;
