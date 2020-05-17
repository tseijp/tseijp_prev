import React from 'react';
import { MDBTypography,MDBBtn,} from 'mdbreact'

const Heading = (props) => {
    const stylebtn = {borderRadius:"50px",width:"50px",height:"50px",fontSize:"25px",
                    margin:"0 25px 0 0",padding:"0 0"}
    return (
        <MDBTypography
            tag={"h"+props.level} abbr='false'
            style={{margin:"25px 0 25px 25px"}}
            variant={`h${props.level}-display`}>
            {!props.isHome&&props.level===1&&
                <MDBBtn color="elegant" style={stylebtn}
                    onClick={()=>props.getCard(props.username)}>
                    {props.username[0]+props.username[1]}</MDBBtn>
            }
            {props.children}
            </MDBTypography>
    )
}

export default Heading;
