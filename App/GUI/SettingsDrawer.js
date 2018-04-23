import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Picker
} from 'react-native';
import { Locations } from '../Code/Locations';

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
    picker:{
        height:30,
        width:'100%',
        backgroundColor:'#555'
    }
});
