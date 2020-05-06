import React from 'react';
import Radium from 'radium';
import SideItem from './SideItem'
import SideItems from './SideItems'
import SideToggle from './SideToggle'
import {MDBInput} from 'mdbreact'
class Side extends React.Component {
    state = {isOpen:false}
    openSide () {this.setState({isOpen:!this.state.isOpen})};
    closeSide () {this.setState({isOpen:false})};
    render () {
        const p = this.props;
        const s = this.state;
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ');
        const styles = {
            Side : {height:"100%", position:"fixed", overflow:"hidden", zIndex:1, top:0, left:0,
                    backgroundColor:"#111", overflowX:"hidden",transition:"0.75s",
                    [media({        max:576})]:{width:s.isOpen?"250px":"0", },
                    [media({min:576,max:768})]:{width:s.isOpen?"250px":"0", },
                    [media({min:768        })]:{width:s.isOpen?"250px":"0", },},};
        return (
            <div>
                <SideToggle isOpen={s.isOpen} openSide={this.openSide.bind(this)}/>
                <div style={styles.Side}>
                    <SideItems isOpen={s.isOpen} closeSide={this.closeSide.bind(this)}>
                        <MDBInput hint="Search" type="text" containerClass="mt-0" />
                        <SideItem link="/note">App</SideItem>
                        <SideItem link="#">About</SideItem>
                        <SideItem link="/user">{p.isAuth?"Signout":"Signin"}</SideItem>
                    </SideItems>
                </div>
            </div>
        )
    }
}
export default Radium(Side);
