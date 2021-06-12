import React from 'react';
import LoginPage from './components/login-page';
import MainPage from './components/main-page';
import { Context, Provider } from './context/context';

const App = props => {
  return (
    <Provider {...props}>
      {/* <Context.Consumer>
        {context => (
          context.isLogged
            ? <MainPage />
            : <LoginPage />
        )}
      </Context.Consumer> */}
      <MainPage />
    </Provider>
  );
}

export default App;
