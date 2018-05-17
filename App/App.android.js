import React, { Component } from 'react';
import {
    ToolbarAndroid,
    StatusBar,
    DrawerLayoutAndroid,
    StyleSheet,
    Text,
    View
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import NavigationBarAndroid from './Code/NavigationBar';
import jDate from './Code/JCal/jDate';
import Utils from './Code/JCal/Utils';
import Zmanim from './Code/JCal/Zmanim';
import Main from './GUI/Main';
import SettingsDrawer from './GUI/SettingsDrawer';
import AppUtils from './Code/AppUtils';
import Settings from './Code/Settings';
import { log } from './Code/GeneralUtils';

export default class App extends Component {
    constructor(props) {
        super(props);
        KeepAwake.activate();

        this.setInitialData = this.setInitialData.bind(this);
        this.getStorageData = this.getStorageData.bind(this);
        this.needsZmanRefresh = this.needsZmanRefresh.bind(this);
        this.refresh = this.refresh.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.openDrawer = this.openDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
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
    componentDidUpdate() {
        NavigationBarAndroid.hide();
    }
    setInitialData() {
        const settings = new Settings(),
            sd = new Date(),
            nowTime = Utils.timeFromDate(sd),
            location = settings.location,
            sunset = Zmanim.getSunTimes(sd, location).sunset,
            jdate = Utils.timeDiff(nowTime, sunset, true).sign > 0
                ? new jDate(sd)
                : new jDate(Utils.addDaysToSdate(sd, 1)),
            zmanimToShow = settings.zmanimToShow,
            zmanTimes = AppUtils.getCorrectZmanTimes(sd, nowTime, settings);
        log('Settings in constructor:', settings);
        this.state = { openDrawer: false, settings, zmanTimes, sd, nowTime, sunset, jdate };
    }

    async getStorageData() {
        const settings = await Settings.getSettings();
        //Setting the state sd to null causes a full refresh on the next iteration of the timer.
        this.setState({ settings, sd: null });
    }
    needsZmanRefresh(sd, nowTime) {
        return !this.state.sd ||
            sd.getDate() !== this.state.sd.getDate() ||
            this.state.zmanTimes.some(zt =>
                !zt.isTommorrow &&
                Utils.totalMinutes(nowTime) - Utils.totalMinutes(zt.time) >=
                    this.state.settings.minToShowPassedZman);
    }
    refresh() {
        const sd = new Date(),
            nowTime = Utils.timeFromDate(sd);
        if (!this.needsZmanRefresh(sd, nowTime)) {
            log('Refreshing just times');
            let { jdate } = this.state;
            if (Utils.isSameSdate(jdate.getDate(), sd) &&
                Utils.timeDiff(nowTime, this.state.sunset, true).sign === -1) {
                jdate = jdate.addDays(1);
            }
            this.setState({ sd, nowTime, jdate });
        }
        else {
            log('Refreshing all zmanim');
            const sunset = Zmanim.getSunTimes(sd, this.state.settings.location).sunset,
                jdate = Utils.timeDiff(nowTime, sunset, true).sign > 0
                    ? new jDate(sd)
                    : new jDate(new Date(sd.getDate() + 1)),
                location = this.state.settings.location,
                zmanTimes = AppUtils.getCorrectZmanTimes(sd, nowTime, this.state.settings),
                notifications = this.state.settings.showNotifications &&
                    AppUtils.getNotifications(jdate, sd, nowTime, location);

            this.setState({ zmanTimes, sd, nowTime, sunset, jdate, notifications });
        }
    }
    toggleDrawer() {
        if (this.state.openDrawer) {
            this.closeDrawer();
        }
        else {
            this.openDrawer();
        }
    }
    openDrawer() {
        this.drawer.openDrawer();
        this.setState({ openDrawer: true });
    }
    closeDrawer() {
        this.setState({ openDrawer: false });
        this.drawer.closeDrawer();
    }
    changeSettings(settings) {
        log('changed settings:', settings);
        settings.save();
        //Setting the state sd to null causes a full refresh on the next iteration of the timer.
        this.setState({ settings, sd: null });
    }
    render() {
        log('Rendering');
        return (
            <DrawerLayoutAndroid
                drawerWidth={500}
                drawerPosition={DrawerLayoutAndroid.positions.Right}
                onDrawerOpen={() => this.setState({ openDrawer: true })}
                onDrawerClose={() => this.setState({ openDrawer: false })}
                renderNavigationView={() =>
                    <SettingsDrawer
                        close={this.closeDrawer}
                        changeSettings={this.changeSettings}
                        settings={this.state.settings} />}
                ref={(drawer) => this.drawer = drawer}>
                <StatusBar hidden={true} />
                <ToolbarAndroid
                    rtl={true}
                    style={styles.toolbarAndroid}
                    navIcon={require('./Images/menu.png')}
                    onIconClicked={() => this.toggleDrawer()}>
                    <View style={styles.headerView}>
                        <Text style={styles.headerTextName}
                            onPress={() => this.toggleDrawer()}>
                            {this.state.settings.location.Name}
                        </Text>
                    </View>
                </ToolbarAndroid>
                <Main
                    jdate={this.state.jdate}
                    zmanTimes={this.state.zmanTimes}
                    nowTime={this.state.nowTime}
                    notifications={this.state.notifications}
                    settings={this.state.settings} />
            </DrawerLayoutAndroid>
        );
    }
}

const styles = StyleSheet.create({
    headerView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000'
    },
    headerTextName: {
        fontSize: 13,
        color: '#557'
    },
    toolbarAndroid: {
        height: 40,
        backgroundColor: '#000',
        flex: 0
    },
});