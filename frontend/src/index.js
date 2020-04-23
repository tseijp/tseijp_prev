import React from 'react';
import Radium from 'radium';
import ReactDOM from 'react-dom';
import './css/index.css';

import Note from './containers/Note/Note';
import User from './containers/User'
import * as serviceWorker from './dev/serviceWorker';
import { Route, BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

// Import style files into the src/index.js before the App.js file:
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

const routing = (
    <BrowserRouter>
        <Radium.StyleRoot>
            <CookiesProvider>
                <div>
                    <Route exact path="/user" component={User}/>
                    <Route exact path="/note"  component={Note}/>
                </div>
            </CookiesProvider>
        </Radium.StyleRoot>
    </BrowserRouter>
)
ReactDOM.render( routing, document.getElementById('root') );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
