import React, { PureComponent } from 'react';
import {
    ToolbarAndroid,
    StatusBar,
    DrawerLayoutAndroid,
    Text,
    View,
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import NavigationBarAndroid from './Code/NavigationBar';
import jDate from './Code/JCal/jDate';
import Utils from './Code/JCal/Utils';
import Zmanim from './Code/JCal/Zmanim';
import Main from './GUI/Main';
import SettingsDrawer from './GUI/SettingsDrawer';
import AppUtils from './Code/AppUtils';
import getNotifications from './Code/Notifications';
import Settings from './Code/Settings';
import { log } from './Code/GeneralUtils';
import getStyle from './GUI/Styles/Styles';

export default class App extends PureComponent {
    /**
     * @param {any} props
     */
    constructor(props) {
        super(props);

        this.setInitialData = this.setInitialData.bind(this);
        this.getStorageData = this.getStorageData.bind(this);
        this.needsZmanRefresh = this.needsZmanRefresh.bind(this);
        this.setNotifications = this.setNotifications.bind(this);
        this.refresh = this.refresh.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.openDrawer = this.openDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.changeSettings = this.changeSettings.bind(this);
        this.isPastShulZman = this.isPastShulZman.bind(this);

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
            jdate = Utils.isTimeAfter(sunset, nowTime)
                ? new jDate(Utils.addDaysToSdate(sd, 1))
                : new jDate(sd),
            zmanTimes = AppUtils.getCorrectZmanTimes(
                sd,
                jdate,
                nowTime,
                settings,
                sunset
            ),
            styles = getStyle('dark', 'app');
        this.shulZmanim = AppUtils.getBasicShulZmanim(sd, jdate, location);
        this.needsNotificationsRefresh = true;
        this.state = {
            settings,
            zmanTimes,
            sd,
            nowTime,
            sunset,
            jdate,
            styles,
        };
    }
    async getStorageData() {
        const settings = await Settings.getSettings(),
            styles = getStyle(settings.theme, 'app');
        //Cause a notifications refresh
        this.needsNotificationsRefresh = settings.showNotifications;
        //Setting the state sd to null causes a full refresh on the next iteration of the timer.
        this.setState({ settings, styles, sd: null });
    }
    /**
     * @param {Date} sd
     * @param {{ hour: number; minute: number; second: number; }} nowTime
     */
    needsZmanRefresh(sd, nowTime) {
        if (
            /**
             * @param {{ isTomorrow: any; time: { hour: number; minute: number; second: number; }; }} zt
             */
            !this.state.sd ||
            sd.getDate() !== this.state.sd.getDate() ||
            this.state.zmanTimes.some(
                zt =>
                    !zt.isTomorrow &&
                    Utils.totalMinutes(nowTime) - Utils.totalMinutes(zt.time) >=
                        this.state.settings.minToShowPassedZman
            )
        ) {
            return true;
        } else {
            return false;
        }
    }
    setNotifications() {
        const { settings } = this.state;
        if (settings.showNotifications) {
            if (this.needsNotificationsRefresh || this.isPastShulZman()) {
                const { jdate, sd, nowTime } = this.state,
                    notifications = getNotifications(
                        jdate,
                        sd,
                        nowTime,
                        settings
                    );
                this.needsNotificationsRefresh = false;
                this.setState({ notifications });
                log('Refreshing notifications: ', jdate, sd, nowTime);
            }
        } else if (
            this.state.notifications &&
            this.state.notifications.length
        ) {
            //If setting is off, hide all notifications
            this.setState({ notifications: [] });
        }
    }
    isPastShulZman() {
        const { nowTime } = this.state,
            { chatzosHayom, chatzosHalayla, alos, shkia } = this.shulZmanim;

        //Notifications need refreshing by chatzos, alos and shkia
        if (shkia && Utils.isTimeAfter(shkia, nowTime)) {
            //We only want to refresh the notifications one time
            this.shulZmanim.shkia = null;
            //Nullify passed zmanim, we are refreshing anyway.
            this.shulZmanim.alos = null;
            this.shulZmanim.chatzosHayom = null;
            if (chatzosHalayla && chatzosHalayla.hour < 12) {
                this.shulZmanim.chatzosHalayla = null;
            }
            log('Refreshing notifications due to shkia.');
            return true;
        } else if (chatzosHayom && Utils.isTimeAfter(chatzosHayom, nowTime)) {
            //We only want to refresh the notifications one time
            this.shulZmanim.chatzosHayom = null;
            //Nullify passed zmanim, we are refreshing anyway.
            this.shulZmanim.alos = null;
            if (chatzosHalayla && chatzosHalayla.hour < 12) {
                this.shulZmanim.chatzosHalayla = null;
            }
            log('Refreshing notifications due to chatzos hayom.');
            return true;
        } else if (alos && Utils.isTimeAfter(alos, nowTime)) {
            //We only want to refresh the notifications one time
            this.shulZmanim.alos = null;
            //Nullify passed zmanim, we are refreshing anyway.
            if (chatzosHalayla && chatzosHalayla.hour < 12) {
                this.shulZmanim.chatzosHalayla = null;
            }
            log('Refreshing notifications due to alos.');
            return true;
        } else if (
            chatzosHalayla &&
            Utils.isTimeAfter(chatzosHalayla, nowTime)
        ) {
            //We only want to refresh the notifications one time
            this.shulZmanim.chatzosHalayla = null;
            log('Refreshing notifications due to chatzosHalayla.');
            return true;
        }
        return false;
    }
    refresh() {
        const sd = new Date(),
            nowTime = Utils.timeFromDate(sd);
        if (!this.needsZmanRefresh(sd, nowTime)) {
            log('Refreshing just times');
            let { jdate, sunset } = this.state;
            if (
                Utils.isSameSdate(jdate.getDate(), sd) &&
                Utils.isTimeAfter(sunset, nowTime)
            ) {
                jdate = jdate.addDays(1);
            }
            this.setState({ sd, nowTime, jdate });
        } else {
            log('Refreshing all zmanim');
            const sunset = Zmanim.getSunTimes(sd, this.state.settings.location)
                    .sunset,
                jdate = Utils.isTimeAfter(sunset, nowTime)
                    ? new jDate(Utils.addDaysToSdate(sd, 1))
                    : new jDate(sd),
                location = this.state.settings.location,
                zmanTimes = AppUtils.getCorrectZmanTimes(
                    sd,
                    jdate,
                    nowTime,
                    this.state.settings,
                    sunset
                );
            this.setState({ zmanTimes, sd, nowTime, sunset, jdate });
            this.shulZmanim = AppUtils.getBasicShulZmanim(sd, jdate, location);
        }
        this.setNotifications();
    }
    toggleDrawer() {
        if (this.isDrawerOpen) {
            this.closeDrawer();
        } else {
            this.openDrawer();
        }
    }
    openDrawer() {
        this.drawer.openDrawer();
        this.isDrawerOpen = true;
    }
    closeDrawer() {
        this.isDrawerOpen = false;
        this.drawer.closeDrawer();
        //refresh notifications
        this.needsNotificationsRefresh = this.state.settings.showNotifications;
    }
    /**
     * @param {Settings} settings
     */
    changeSettings(settings) {
        log('changed settings:', settings);
        settings.save();
        this.needsNotificationsRefresh = settings.showNotifications;
        //Setting the state sd to null causes a full refresh on the next iteration of the timer.
        this.setState({ settings, sd: null });
    }
    render() {
        log('Rendering');
        const { styles } = this.state;
        return (
            <DrawerLayoutAndroid
                drawerWidth={400}
                onDrawerOpen={() => (this.isDrawerOpen = true)}
                onDrawerClose={() => (this.isDrawerOpen = false)}
                renderNavigationView={() => (
                    <SettingsDrawer
                        close={this.closeDrawer}
                        changeSettings={this.changeSettings}
                        settings={this.state.settings}
                        nowTime={this.state.nowTime}
                        drawerPosition={DrawerLayoutAndroid.positions.Right}
                    />
                )}
                ref={drawer => (this.drawer = drawer)}>
                <KeepAwake />
                <StatusBar hidden={true} />
                <ToolbarAndroid
                    style={styles.toolbarAndroid}
                    onTouchStart={() => this.toggleDrawer()}>
                    <View style={styles.headerView}>
                        <Text style={styles.headerTextName}>
                            {this.state.settings.location.Name}
                        </Text>
                    </View>
                </ToolbarAndroid>
                <Main
                    jdate={this.state.jdate}
                    zmanTimes={this.state.zmanTimes}
                    nowTime={this.state.nowTime}
                    notifications={this.state.notifications}
                    settings={this.state.settings}
                />
            </DrawerLayoutAndroid>
        );
    }
}
