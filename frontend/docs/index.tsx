import React from 'react';
import ReactDOM from 'react-dom';
import { unregister } from './serviceWorker';
import { Note } from './Note';

import './styles.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

ReactDOM.render(<Note />, document.getElementById('root'));
unregister();
