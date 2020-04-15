import React from 'react';
import Radium from 'radium';
import TransItem from './TransItem'
import TransItems from './TransItems'
import TransToggle from './TransToggle'
class Side extends React.Component {
    state = {isOpen:false, collapseID:""}
    click () {this.setState({
        isOpen:!this.state.isOpen,
        collapseID:!this.state.isOpen?"basicCollapse":"",
    })};
    render () {
        const s = this.state;
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ');
        return (
            <div>
                <TransToggle isOpen={s.isOpen} click={this.click.bind(this)}/>
                <TransItems isOpen={s.isOpen} collapseID={this.state.collapseID}>
                    <TransItem click={console.log('ja')}>Ja</TransItem>
                    <TransItem click={console.log('en')}>En</TransItem>
                </TransItems>
            </div>
        )
    }
}
export default Radium(Side);
