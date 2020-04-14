import React from 'react';

const NoteContext = React.createContext({
    isDark:false,
    isHome:true,
    isAuth:false,
    tag:'',
})

export default NoteContext;
