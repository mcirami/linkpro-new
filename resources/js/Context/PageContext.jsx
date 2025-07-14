import { createContext, useContext } from 'react';
const PageContext = createContext(undefined);
export const usePageContext = () => useContext(PageContext);
export default PageContext;
