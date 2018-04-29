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
        this.refresh = this.refresh.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.changeSettings = this.changeSettings.bind(this);

        this.setInitialData();
    }
    componentDidMount() {
        this.getStorageData();
        this.timer = setInterval(this.refresh, 1000);
    }
    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    setInitialData() {
        const settings = new Settings(),
            sd = new Date(),
            nowTime = Utils.timeFromDate(sd),
            jdate = new jDate(sd),
            location = settings.location,
            zmanimToShow = settings.zmanimToShow,
            zmanTimes = AppUtils.getCorrectZmanTimes(sd, nowTime, location, zmanimToShow);
        console.log('Settings in constructor:', settings);
        this.state = { openDrawer: false, zmanimToShow, location, zmanTimes, sd, nowTime, jdate };
    }

    async getStorageData() {
        let { zmanimToShow, location } = await Settings.getSettings();
        if (!zmanimToShow) {
            zmanimToShow = this.state.zmanimToShow;
        }
        if (!location) {
            location = this.state.location;
        }
        //Setting the state sd to null causes a full refresh on the next iteration of the timer.
        this.setState({ zmanimToShow, location, sd: null });
    }
    refresh() {
        const sd = new Date(),
            nowTime = Utils.timeFromDate(sd);
        if (this.state.sd && sd.getDate() === this.state.sd.getDate()) {
            this.setState({ sd, nowTime });
        }
        else {
            const jdate = new jDate(sd),
                zmanTimes = AppUtils.getCorrectZmanTimes(
                    sd,
                    nowTime,
                    this.state.location,
                    this.state.zmanimToShow);
            this.setState({ zmanTimes, sd, nowTime, jdate });
            console.log('Refreshed everything');
        }
    }
    toggleDrawer() {
        if (this.state.openDrawer) {
            this.setState({ openDrawer: false });
            this.drawer.closeDrawer();
        }
        else {
            this.drawer.openDrawer();
            this.setState({ openDrawer: true });
        }
    }
    changeSettings(zmanimToShow, location) {
        console.log('changed settings:', zmanimToShow, location);
        //Setting the state sd to null causes a full refresh on the next iteration of the timer.
        this.setState({ zmanimToShow, location, sd: null });
    }
    render() {
        return (
            <DrawerLayoutAndroid
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Right}
                renderNavigationView={() =>
                    <SettingsDrawer
                        close={this.toggleDrawer}
                        changeSettings={this.changeSettings}
                        zmanimToShow={this.state.zmanimToShow}
                        location={this.state.location} />}
                ref={(drawer) => this.drawer = drawer}>
                <StatusBar hidden={true} />
                <ToolbarAndroid
                    rtl={true}
                    style={styles.toolbarAndroid}
                    navIcon={require('./Images/menu.png')}
                    onIconClicked={() => this.toggleDrawer()} />
                <Main
                    jdate={this.state.jdate}
                    zmanTimes={this.state.zmanTimes}
                    nowTime={this.state.nowTime} />
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