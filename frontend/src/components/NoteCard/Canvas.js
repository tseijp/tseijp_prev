import React from 'react';
import Radium from 'radium';
class Canvas extends React.Component {
    render() {
        return(
            <canvas className="myCanvas" mode="edit" resize="true"></canvas>
        )
    }
}

export default Radium(Canvas);
