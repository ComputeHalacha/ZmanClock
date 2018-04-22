import React, { Component } from 'react';
import {
    ToolbarAndroid,
    StatusBar,
    DrawerLayoutAndroid,
    StyleSheet,
    Text
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import jDate from './Code/JCal/jDate';
import Utils from './Code/JCal/Utils';
import Location from './Code/JCal/Location';
import Main from './GUI/Main';
import SettingsDrawer from './GUI/SettingsDrawer';
import AppUtils from './AppUtils';

export default class App extends Component {
    constructor(props) {
        super(props);
        KeepAwake.activate();

        this.zmanToShow = { name: 'netzMishor', eng: 'Sunrise', heb: 'נץ החמה' };

        const sd = new Date(),
            nowTime = Utils.timeFromDate(sd),
            jd = new jDate(sd),
            { zmanTime, isTommorrow } = AppUtils.getCorrectZmanTime(
                sd, nowTime, Location.getJerusalem(), this.zmanToShow);
        this.state = { openDrawer: false, sd, nowTime, jd, zmanTime, isTommorrow };
        this.toggleDrawer = this.toggleDrawer.bind(this);

    }
    componentDidMount() {
        setInterval(() => {
            const sd = new Date(),
                nowTime = Utils.timeFromDate(sd);
            if (sd.getDate() !== this.state.sd.getDate()) {
                const jd = new jDate(sd),
                    { zmanTime, isTommorrow } = AppUtils.getCorrectZmanTime(
                        sd, nowTime, Location.getJerusalem(), this.zmanToShow);
                this.setState({ sd, nowTime, jd, zmanTime, isTommorrow });
                console.log('Refreshed all stuff');
            }
            else {
                this.setState({ sd, nowTime });
            }
        }, 1000);
    }
    toggleDrawer() {
        if (this.state.openDrawer) {
            this.drawer.closeDrawer();
            this.setState({ openDrawer: false });
        }
        else {
            this.drawer.openDrawer();
            this.setState({ openDrawer: true });
        }
    }
    render() {
        return (
            <DrawerLayoutAndroid
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Right}
                renderNavigationView={() => <SettingsDrawer />}
                ref={(drawer) => this.drawer = drawer}>
                <StatusBar hidden={true} />
                <ToolbarAndroid
                    rtl={true}
                    style={styles.toolbarAndroid}
                    navIcon={require('./Images/menu.png')}
                    onIconClicked={() => this.toggleDrawer()}>
                    <Text style={styles.dateText}>{this.state.jd.toStringHeb()}</Text>
                </ToolbarAndroid>
                <Main
                    zmanToShow={this.zmanToShow}
                    nowTime={this.state.nowTime}
                    zmanTime={this.state.zmanTime}
                    isTommorrow={this.state.isTommorrow} />
            </DrawerLayoutAndroid>
        );
    }
}

const styles = StyleSheet.create({
    toolbarAndroid: {
        height: 40,
        backgroundColor: '#000'
    },
    dateText: {
        color: '#999',
        fontSize: 20
    },
});