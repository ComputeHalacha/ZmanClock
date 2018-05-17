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
import { range } from '../Code/GeneralUtils';

export default class SettingsDrawer extends Component {
    constructor(props) {
        super(props);
        this.onChangeSettings = this.onChangeSettings.bind(this);
    }
    onChangeSettings(zmanimToShow, location, showNotifications, numberOfItemsToShow, minToShowPassedZman) {
        const settings = this.props.settings.clone();
        if (zmanimToShow) {
            settings.zmanimToShow = zmanimToShow;
        }
        if (location) {
            settings.location = location;
        }
        if (typeof showNotifications !== 'undefined') {
            settings.showNotifications = showNotifications;
        }
        if (typeof numberOfItemsToShow !== 'undefined') {
            settings.numberOfItemsToShow = numberOfItemsToShow;
        }
        if (typeof minToShowPassedZman !== 'undefined') {
            settings.minToShowPassedZman = minToShowPassedZman;
        }

        this.props.changeSettings(settings);
    }
    render() {
        const { zmanimToShow, location, showNotifications, numberOfItemsToShow, minToShowPassedZman } = this.props.settings;
        return (
            <View style={styles.outContainer}>
                <View style={styles.container}>
                    <Text style={styles.header}>שעון זמנים - הגדרות</Text>
                    <View style={styles.inContainer}>
                        <Text style={styles.label}>בחר מיקום</Text>
                        <Picker
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                            selectedValue={location}
                            onValueChange={location => this.onChangeSettings(null, location)}>
                            {Locations.map((location, i) =>
                                <Picker.Item key={i} value={location} label={location.Name} />)}
                        </Picker>
                        <Text style={styles.label}>בחר איזה זמנים להציג</Text>
                        <ScrollView style={styles.scrollView} scrollEnabled>
                            {ZmanTypes.map((zt, i) => <View style={styles.checkboxView} key={i}>
                                <CheckBox
                                    value={Boolean(zmanimToShow.find(z => z.name === zt.name))}
                                    onValueChange={selected => {
                                        const zmanimToShowList = zmanimToShow.filter(zts =>
                                            zts.name !== zt.name);
                                        if (selected) {
                                            zmanimToShowList.push(zt);
                                        }
                                        this.onChangeSettings(zmanimToShowList);
                                    }}
                                    style={styles.checkbox} />
                                <Text style={styles.labelCheckbox}>{zt.decs}</Text>
                            </View>)}
                        </ScrollView>
                        <Text style={styles.label}>העדפות כלליות</Text>
                        <View style={styles.checkboxView}>
                            <CheckBox
                                value={Boolean(showNotifications)}
                                onValueChange={selected =>
                                    this.onChangeSettings(null, null, selected)
                                }
                                style={styles.checkbox} />
                            <Text style={styles.labelCheckbox}>הצג מידע יומית</Text>
                        </View>
                        <View style={styles.checkboxView}>
                            <Text style={styles.labelCheckbox}>מקסימום פרטים להציג במסך</Text>
                            <Picker
                                style={styles.numberPicker}
                                itemStyle={styles.pickerItem}
                                selectedValue={numberOfItemsToShow}
                                onValueChange={numberOfItemsToShow => this.onChangeSettings(null, null, null, numberOfItemsToShow)}>
                                {range(1, 10).map(num =>
                                    <Picker.Item key={num} value={num} label={num.toString()} />)}
                            </Picker>
                        </View>
                        <View style={styles.checkboxView}>
                            <Text style={styles.labelCheckbox}>מספר דקות להציג זמנים שעברו</Text>
                            <Picker
                                style={styles.numberPicker}
                                itemStyle={styles.pickerItem}
                                selectedValue={minToShowPassedZman}
                                onValueChange={minToShowPassedZman => this.onChangeSettings(null, null, null, null, minToShowPassedZman)}>
                                {range(0, 60).map(num =>
                                    <Picker.Item key={num} value={num} label={num.toString()} />)}
                            </Picker>
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
        width: '100%',
        fontWeight: 'bold',
        margin: 10
    },
    checkbox: {
        minWidth: 20,
        marginBottom: 5
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
    numberPicker: {
        height: 30,
        width: 40,
        backgroundColor: '#444',
        marginBottom: 5
    },
    checkboxView: {
        flexDirection: 'row-reverse',
    },
    scrollView: {
        flex: 1,
        borderRadius: 5,
        backgroundColor: '#333',
        width: '90%',
        marginRight:10,
        padding: 5
    },
    labelCheckbox: {
        color: '#777',
        margin: 5
    }
});
