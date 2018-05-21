import React, { PureComponent } from 'react';
import {
    ToolbarAndroid,
    StatusBar,
    DrawerLayoutAndroid,
    StyleSheet,
    Text,
    View,
    Image
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

export default class App extends PureComponent {
    constructor(props) {
        super(props);
        KeepAwake.activate();

        this.hamburger = { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAYAAADkmO9VAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAScwAAEnMBjCK5BwAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4yMfEgaZUAAADXSURBVDhPzdOxigIxEIDh8dDO9hCfxicRrCwWVrPJJNnJui4iFlaW4mOJWCsi4sEJFmohQm62tzIKF/jaYcKfgCGaU5bfaTD0QbL8iiYdgdT2hpb8Owg0FzBuMEabrtC6dQhl3ZKyYQzdxaJGRA3nXDMETSbfRVF8wf8/PYmFkPonVKL0oS+xw5XT87Nir1Da/kKi7ZRtRaAEzSZRpgdcphpFUf0dPlPZe18pt2wFKmfwuApINDl/mX1fheEOO6F0u3w2p2fFXhELeQSeOuNCPhTf8iHQxn+Uve7z9rX0GAAAAABJRU5ErkJggg==' };

        this.setInitialData = this.setInitialData.bind(this);
        this.getStorageData = this.getStorageData.bind(this);
        this.needsZmanRefresh = this.needsZmanRefresh.bind(this);
        this.setNotifications = this.setNotifications.bind(this);
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
            zmanTimes = AppUtils.getCorrectZmanTimes(sd, nowTime, settings);
        this.shulZmanim = AppUtils.getBasicShulZmanim(sd, location);
        this.state = { settings, zmanTimes, sd, nowTime, sunset, jdate };
    }

    async getStorageData() {
        const settings = await Settings.getSettings();
        //Setting the state sd to null causes a full refresh on the next iteration of the timer.
        this.setState({ settings, sd: null });
    }
    needsZmanRefresh(sd, nowTime) {
        if (!this.state.sd ||
            sd.getDate() !== this.state.sd.getDate() ||
            this.state.zmanTimes.some(zt =>
                !zt.isTommorrow &&
                Utils.totalMinutes(nowTime) - Utils.totalMinutes(zt.time) >=
                this.state.settings.minToShowPassedZman)) {
            return true;
        }
        else {
            return false;
        }
    }
    setNotifications() {
        const { jdate, sd, nowTime, location } = this.state,
            { chatzosHayom, chatzosHalayla, alos } = this.shulZmanim;
        let needsRefresh = false;
        //Notifications need refreshing by chatzos and alos
        if (chatzosHayom && Utils.totalMinutes(nowTime) >= Utils.totalMinutes(chatzosHayom)) {
            this.shulZmanim.chatzosHayom = null;
            needsRefresh = true;
        }
        if (chatzosHalayla && Utils.totalMinutes(nowTime) >= Utils.totalMinutes(chatzosHalayla)) {
            this.shulZmanim.chatzosHalayla = null;
            needsRefresh = true;
        }
        if (alos && Utils.totalMinutes(nowTime) >= Utils.totalMinutes(alos)) {
            this.shulZmanim.alos = null;
            needsRefresh = true;
        }
        if (needsRefresh) {
            log('Refreshing notifications');
            const notifications = this.state.settings.showNotifications &&
                AppUtils.getNotifications(jdate, sd, nowTime, location);
            this.setState({ notifications });
        }
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
                    : new jDate(Utils.addDaysToSdate(sd, 1)),
                location = this.state.settings.location,
                zmanTimes = AppUtils.getCorrectZmanTimes(sd, nowTime, this.state.settings);
            if (this.state.settings.showNotifications &&
                (!this.state.sd || sd.getDate() !== this.state.sd.getDate())) {
                this.shulZmanim = AppUtils.getBasicShulZmanim(sd, location);
            }
            this.setState({ zmanTimes, sd, nowTime, sunset, jdate });
        }
        if (this.state.settings.showNotifications) {
            this.setNotifications();
        }
    }
    toggleDrawer() {
        if (this.isDrawerOpen) {
            this.closeDrawer();
        }
        else {
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
                drawerWidth={325}
                drawerPosition={DrawerLayoutAndroid.positions.Right}
                onDrawerOpen={() => this.isDrawerOpen = true}
                onDrawerClose={() => this.isDrawerOpen = false}
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
                    onTouchStart={() => this.toggleDrawer()}>
                    <View style={styles.headerView}>
                        <Text style={styles.headerTextName}>
                            {this.state.settings.location.Name}
                        </Text>
                        <Image style={styles.hamburger} source={this.hamburger} />
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
        backgroundColor: '#000'
    },
    headerTextName: {
        flex: 1,
        textAlign: 'center',
        fontSize: 13,
        color: '#557'
    },
    hamburger: {
        width: 20,
        height: 15
    },
    toolbarAndroid: {
        height: 40,
        backgroundColor: '#000',
        flex: 0
    },
});