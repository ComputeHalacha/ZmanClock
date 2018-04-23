import React, { Component } from 'react';
import {
    ToolbarAndroid,
    StatusBar,
    DrawerLayoutAndroid,
    StyleSheet
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import jDate from './Code/JCal/jDate';
import Utils from './Code/JCal/Utils';
import Location from './Code/JCal/Location';
import Main from './GUI/Main';
import SettingsDrawer from './GUI/SettingsDrawer';
import AppUtils from './AppUtils';
import Settings from './Code/Settings';

export default class App extends Component {
    constructor(props) {
        super(props);
        KeepAwake.activate();

        this.setInitialData = this.setInitialData.bind(this);
        this.getStorageData = this.getStorageData.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);

        this.setInitialData();
        this.getStorageData();
    }

    setInitialData() {
        const settings = new Settings(), sd = new Date(), nowTime = Utils.timeFromDate(sd), jdate = new jDate(sd), { zmanTime, isTommorrow } = AppUtils.getCorrectZmanTime(sd, nowTime, settings.location, settings.zmanimToShow[0]);
        this.zmanToShow = this.settings.zmanimToShow[0];
        this.location = this.settings.location;
        this.state = { openDrawer: false, settings: settings, sd, nowTime, jdate, zmanTime, isTommorrow };
    }

    async getStorageData() {
        const settings = await Settings.GetSettings();
        this.settings = settings;
        this.zmanToShow = this.settings.zmanimToShow[0];
        this.location = this.settings.location;
        const sd = new Date(), nowTime = Utils.timeFromDate(sd), jdate = new jDate(sd), { zmanTime, isTommorrow } = AppUtils.getCorrectZmanTime(sd, nowTime, this.location, this.zmanToShow);
        this.setState({ openDrawer: false, settings, sd, nowTime, jdate, zmanTime, isTommorrow });
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            const sd = new Date(),
                nowTime = Utils.timeFromDate(sd);
            if (sd.getDate() !== this.state.sd.getDate()) {
                const jdate = new jDate(sd),
                    { zmanTime, isTommorrow } = AppUtils.getCorrectZmanTime(
                        sd, nowTime, this.location, this.zmanToShow);
                this.setState({ sd, nowTime, jdate, zmanTime, isTommorrow });
                console.log('Refreshed all stuff');
            }
            else {
                this.setState({ sd, nowTime });
            }
        }, 1000);
    }
    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
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
                renderNavigationView={() =>
                    <SettingsDrawer close={this.toggleDrawer} settings={this.state.settings} />}
                ref={(drawer) => this.drawer = drawer}>
                <StatusBar hidden={true} />
                <ToolbarAndroid
                    rtl={true}
                    style={styles.toolbarAndroid}
                    navIcon={require('./Images/menu.png')}
                    onIconClicked={() => this.toggleDrawer()} />
                <Main
                    jdate={this.state.jdate}
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
});