import React, { createContext, useContext } from 'react';
const IdentityContext = createContext({ identity: null });
export const InternetIdentityProvider = ({ children }: { children: React.ReactNode }) => {
  return <IdentityContext.Provider value={{ identity: null }}>{children}</IdentityContext.Provider>;
};
export const useInternetIdentity = () => useContext(IdentityContext);
