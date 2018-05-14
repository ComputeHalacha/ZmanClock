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
import jDate from './Code/JCal/jDate';
import Utils from './Code/JCal/Utils';
import Zmanim from './Code/JCal/Zmanim';
import Main from './GUI/Main';
import SettingsDrawer from './GUI/SettingsDrawer';
import AppUtils from './AppUtils';
import Settings from './Code/Settings';
import { log, setDefault } from './Code/GeneralUtils';

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
            location = settings.location,
            sunset = Zmanim.getSunTimes(sd, location).sunset,
            jdate = Utils.timeDiff(nowTime, sunset, true).sign > 0
                ? new jDate(sd)
                : new jDate(new Date(sd.getDate() + 1)),
            zmanimToShow = settings.zmanimToShow,
            zmanTimes = AppUtils.getCorrectZmanTimes(sd, nowTime, location, zmanimToShow),
            showNotifications = settings.showNotifications;
        log('Settings in constructor:', settings);
        this.state = { openDrawer: false, zmanimToShow, location, zmanTimes, sd, nowTime, sunset, jdate, showNotifications };
    }

    async getStorageData() {
        let { zmanimToShow, location, showNotifications } = await Settings.getSettings();
        if (!zmanimToShow) {
            zmanimToShow = this.state.zmanimToShow;
        }
        if (!location) {
            location = this.state.location;
        }
        showNotifications = setDefault(showNotifications, this.state.showNotifications);

        //Setting the state sd to null causes a full refresh on the next iteration of the timer.
        this.setState({ zmanimToShow, location, sd: null, showNotifications });
    }
    refresh() {
        const sd = new Date(),
            nowTime = Utils.timeFromDate(sd);
        if (this.state.sd && sd.getDate() === this.state.sd.getDate()) {
            let { jdate } = this.state;
            if (Utils.isSameSdate(jdate.getDate(), sd) &&
                Utils.timeDiff(nowTime, this.state.sunset, true).sign === -1) {
                jdate = jdate.addDays(1);
            }
            this.setState({ sd, nowTime, jdate });
        }
        else {
            const sunset = Zmanim.getSunTimes(sd, this.state.location).sunset,
                jdate = Utils.timeDiff(nowTime, sunset, true).sign > 0
                    ? new jDate(sd)
                    : new jDate(new Date(sd.getDate() + 1)),
                zmanTimes = AppUtils.getCorrectZmanTimes(
                    sd,
                    nowTime,
                    this.state.location,
                    this.state.zmanimToShow),
                notifications = this.state.showNotifications &&
                    AppUtils.getNotifications(jdate, sd, nowTime, this.state.location);

            this.setState({ zmanTimes, sd, nowTime, sunset, jdate, notifications });
            log('Refreshed everything');
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
    changeSettings(zmanimToShow, location, showNotifications) {
        log('changed settings:', zmanimToShow, location, showNotifications);
        //Setting the state sd to null causes a full refresh on the next iteration of the timer.
        this.setState({ zmanimToShow, location, sd: null, showNotifications });
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
                    onIconClicked={() => this.toggleDrawer()}>
                    <View style={styles.headerView}>
                        <Text style={styles.headerTextName}
                            onPress={() => this.toggleDrawer()}>
                            {this.state.location.Name}
                        </Text>
                    </View>
                </ToolbarAndroid>
                <Main
                    jdate={this.state.jdate}
                    zmanTimes={this.state.zmanTimes}
                    nowTime={this.state.nowTime}
                    notifications={this.state.notifications} />
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