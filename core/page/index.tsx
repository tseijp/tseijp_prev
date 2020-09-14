import React from 'react';
import ReactDOM from 'react-dom';
import { unregister } from './serviceWorker';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { Home } from './Home';
import { None } from './None';
import { Note } from './Note';

import './styles.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

const App = (
    <HelmetProvider>
        <BrowserRouter>
            <Switch>
                <Route path="/"     component={Home} exact/>
                <Route path="/note" component={Note}/>
                <Route path='/none' component={None}/>
                <Redirect to='/none' />
            </Switch>
        </BrowserRouter>
    </HelmetProvider>
)

ReactDOM.render( App , document.getElementById('root'));
unregister();