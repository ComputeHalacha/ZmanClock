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
        this.toggleDrawer = this.toggleDrawer.bind(this);

        this.setInitialData();
    }

    setInitialData() {
        const settings = new Settings(),
            sd = new Date(),
            nowTime = Utils.timeFromDate(sd),
            jdate = new jDate(sd),
            location = settings.location,
            zmanimToShow = settings.zmanimToShow,
            zmanTimes = AppUtils.getCorrectZmanTimes(sd, nowTime, location, zmanimToShow),
            zmanToShow = AppUtils.getNextZmanToShow(nowTime, zmanTimes);

        this.state = { openDrawer: false, settings, zmanimToShow, location, zmanToShow, zmanTimes, sd, nowTime, jdate };
    }

    async getStorageData() {
        const settings = await Settings.getSettings(),
            sd = new Date(),
            nowTime = Utils.timeFromDate(sd),
            jdate = new jDate(sd),
            location = settings.location,
            zmanimToShow = settings.zmanimToShow,
            zmanTimes = AppUtils.getCorrectZmanTimes(sd, nowTime, location, zmanimToShow),
            zmanToShow = AppUtils.getNextZmanToShow(nowTime, zmanTimes);
        this.setState({ settings, zmanimToShow, location, zmanToShow, zmanTimes, sd, nowTime, jdate });
    }

    componentDidMount() {
        this.getStorageData();
        this.timer = setInterval(() => {
            const sd = new Date(),
                nowTime = Utils.timeFromDate(sd);
            if (sd.getDate() !== this.state.sd.getDate()) {
                const jdate = new jDate(sd),
                    zmanTimes = AppUtils.getCorrectZmanTimes(sd, nowTime, this.state.location, this.state.zmanimToShow),
                    zmanToShow = AppUtils.getNextZmanToShow(nowTime, zmanTimes);
                this.setState({ zmanToShow, zmanTimes, sd, nowTime, jdate });
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
    toggleDrawer(settings) {
        if (this.state.openDrawer) {
            if (!settings) {
                settings = this.state.settings;
            }
            settings.save();
            this.drawer.closeDrawer();

            const zmanimToShow = settings.zmanimToShow,
            location = settings.location,
                zmanTimes = AppUtils.getCorrectZmanTimes(this.state.sd, this.state.nowTime, location, zmanimToShow),
                zmanToShow = AppUtils.getNextZmanToShow(this.state.nowTime, zmanTimes);
            this.setState({ openDrawer: false, settings: new Settings(zmanimToShow, location), zmanimToShow, zmanToShow, zmanTimes });
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
                    zmanToShow={this.state.zmanToShow}
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