import React, { Component } from 'react';
import {
    StatusBar,
    DrawerLayoutAndroid
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import Main from './GUI/Main';
import SettingsDrawer from './GUI/SettingsDrawer';

export default class App extends Component {
    constructor(props) {
        super(props);
        KeepAwake.activate();
    }
    render() {
        return (
            <DrawerLayoutAndroid
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => <SettingsDrawer />}
                ref={drawer => this.drawer = drawer}>
                <StatusBar hidden={true} />
                <Main openSettings={this.drawer.openDrawer} closeSettings={this.drawer.closeDrawer} />
            </DrawerLayoutAndroid>
        );
    }
}