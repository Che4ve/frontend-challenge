import './App.scss';

import React from 'react';
import './App.scss';
import {store} from './store';
import {Router} from "./router/Router";
import {Provider} from "react-redux";

export const App = () => {
  return (
    <Provider store={store}>
        <Router/>
    </Provider>
  );
}