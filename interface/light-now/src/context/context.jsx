import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const Context = createContext();

const Provider = ({ children }) => {

  const [isLogged, setIsLogged] = useState(false);

  return (
    <Context.Provider
      value={{
        // VALUES
        isLogged,
        // METHODS,
        setIsLogged
      }}
    >
      {children}
    </Context.Provider>
  );

};

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export {
  Context,
  Provider,
};
