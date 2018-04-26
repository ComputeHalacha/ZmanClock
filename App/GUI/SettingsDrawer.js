import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Switch,
    Picker,
    ScrollView,
} from 'react-native';
import { Locations } from '../Code/Locations';
import { ZmanTypes } from '../Code/ZmanTypes';

export default class SettingsDrawer extends Component {
    constructor(props) {
        super(props);
        this.close = props.close;
        this.state = { settings: props.settings };
    }
    componentDidMount() {

    }
    render() {
        return (
            <View style={styles.outContainer}>
                <View style={styles.container}>
                    <Text style={styles.header}>שעון זמנים - הגדרות</Text>
                    <View style={styles.inContainer}>
                        <Text style={styles.label}>{this.state.settings.zmanimToShow[0].decs}</Text>
                        <Text style={styles.label}>בחר מיקום</Text>
                        <Picker
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                            selectedValue={this.state.settings.location}
                            onValueChange={(location) => {
                                const settings = this.state.settings;
                                settings.location = location;
                                this.setState(settings);
                            }}>
                            {
                                Locations.map((location, i) =>
                                    <Picker.Item key={i} value={location} label={location.Name} />)

                            }
                        </Picker>
                        <ScrollView>
                            {ZmanTypes.map((zt, i) => <View style={styles.ztView} key={i}>
                                <Switch
                                    value={Boolean(this.state.settings.zmanimToShow.find(z => z.name === zt.name))}
                                    onValueChange={v => {
                                        const settings = this.state.settings;
                                        if (v) {
                                            if (settings.zmanimToShow.length > 1) {
                                                settings.zmanimToShow.splice(
                                                    settings.zmanimToShow.findIndex(z => z.name === zt.name), 1);
                                            }
                                        }
                                        else {
                                            settings.zmanimToShow.push(zt);
                                        }
                                        this.setState({ settings });
                                    }} />
                                <Text style={styles.label}>{zt.decs}</Text>
                            </View>)}
                        </ScrollView>
                    </View>
                    <Text style={styles.close} onPress={() => this.close(this.state.settings)}>סגור X</Text>
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
        color: '#999'
    },
    picker: {
        height: 30,
        width: '100%',
        backgroundColor: '#555'
    },
    pickerItem: {
        backgroundColor: '#000',
        color: '#999'
    },
    ztView: {
        flexDirection: 'row-reverse',
    }
});
