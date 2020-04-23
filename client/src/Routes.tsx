import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Header } from './components/Header';

export const Routes: React.FC = () => {

  return (
    <BrowserRouter>
      <div className="wrapper">
        <Header />
        <div>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />

          </Switch>
        </div>

      </div>
    </BrowserRouter>
  )
}

