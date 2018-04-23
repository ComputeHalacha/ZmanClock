import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity
} from 'react-native';
export default class SettingsDrawer extends Component {
    constructor(props) {
        super(props);
        this.close = props.close;
        this.settings = props.settings;
    }
    componentDidMount() {

    }
    render() {
        return (
            <View style={styles.outContainer}>
                <View style={styles.container}>
                    <Text style={styles.header}>שעון זמנים - הגדרות</Text>
                    <View style={styles.inContainer}>
                        <Text style={{ color: '#fff' }}>THIS IS STUFF</Text>
                    </View>
                    <Text style={styles.close} onPress={() => this.close()}>סגור X</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    outContainer: {
        flex: 1,
        backgroundColor: '#223',
    },
    container: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#446',
        borderRadius: 6
    },
    inContainer: {
        flex: 1,
        alignItems: 'flex-end',
        padding: 5
    },
    header: {
        color: '#99f',
        fontSize: 20,
        marginBottom: 25,
        backgroundColor: '#446',
        width: '100%',
        textAlign: 'center',
        padding: 10,
    },
    close: {
        color: '#f99',
        fontSize: 15,
        marginTop: 25,
        backgroundColor: '#446',
        width: '100%',
        textAlign: 'center',
        padding: 10,
    }
});
