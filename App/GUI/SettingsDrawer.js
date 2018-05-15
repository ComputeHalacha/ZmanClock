import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Picker,
    ScrollView,
    CheckBox
} from 'react-native';
import { Locations } from '../Code/Locations';
import { ZmanTypes } from '../Code/ZmanTypes';
import Settings from '../Code/Settings';
import { setDefault } from '../Code/GeneralUtils';

export default class SettingsDrawer extends Component {
    constructor(props) {
        super(props);
        this.onChangeSettings = this.onChangeSettings.bind(this);
    }
    onChangeSettings(zmanimToShow, location, showNotifications) {
        if (zmanimToShow) {
            Settings.saveZmanim(zmanimToShow);
        }
        if (location) {
            Settings.saveLocation(location);
        }
        if (typeof showNotifications !== 'undefined') {
            Settings.saveShowNotifications(showNotifications);
        }

        this.props.changeSettings(
            zmanimToShow || this.props.zmanimToShow,
            location || this.props.location,
            setDefault(showNotifications, this.props.showNotifications)
        );
    }
    render() {
        return (
            <View style={styles.outContainer}>
                <View style={styles.container}>
                    <Text style={styles.header}>שעון זמנים - הגדרות</Text>
                    <View style={styles.inContainer}>
                        <Text style={styles.label}>בחר מיקום</Text>
                        <Picker
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                            selectedValue={this.props.location}
                            onValueChange={location => this.onChangeSettings(null, location)}>
                            {Locations.map((location, i) =>
                                <Picker.Item key={i} value={location} label={location.Name} />)}
                        </Picker>
                        <Text style={styles.label}>בחר זמנים</Text>
                        <ScrollView style={styles.scrollView}>
                            {ZmanTypes.map((zt, i) => <View style={styles.ztView} key={i}>
                                <CheckBox
                                    value={Boolean(this.props.zmanimToShow.find(z => z.name === zt.name))}
                                    onValueChange={selected => {
                                        const zmanimToShow = this.props.zmanimToShow.filter(zts =>
                                            zts.name !== zt.name);
                                        if (selected) {
                                            zmanimToShow.push(zt);
                                        }
                                        this.onChangeSettings(zmanimToShow);
                                    }} />
                                <Text style={styles.labelZman}>{zt.decs}</Text>
                            </View>)}
                        </ScrollView>
                        <Text style={styles.label}>העדפות</Text>
                        <View style={styles.ztView}>
                            <CheckBox
                                value={Boolean(this.props.showNotifications)}
                                onValueChange={selected =>
                                    this.onChangeSettings(null, null, selected)
                                } />
                            <Text style={styles.labelZman}>הצג מידע יומית</Text>
                        </View>
                    </View>
                    <Text style={styles.close} onPress={() => this.props.close()}>סגור X</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    outContainer: {
        flex: 1,
        backgroundColor: '#222',
    },
    container: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 6
    },
    inContainer: {
        flex: 1,
        alignItems: 'flex-end',
        padding: 5
    },
    header: {
        color: '#aac',
        fontSize: 20,
        marginBottom: 25,
        backgroundColor: '#444',
        width: '100%',
        textAlign: 'center',
        padding: 10,
    },
    close: {
        color: '#99a',
        fontSize: 15,
        marginTop: 25,
        backgroundColor: '#444',
        width: '100%',
        textAlign: 'center',
        padding: 10,
    },
    label: {
        color: '#99f',
        textAlign: 'center',
        width: '100%',
        fontWeight: 'bold',
        margin: 10
    },
    picker: {
        height: 30,
        width: '100%',
        backgroundColor: '#444',
    },
    pickerItem: {
        backgroundColor: '#000',
        color: '#999'
    },
    ztView: {
        flexDirection: 'row-reverse',
    },
    scrollView: {
        flex: 1
    },
    labelZman: {
        color: '#777',
        margin: 5
    }
});
