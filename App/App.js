import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    Picker,
    TouchableOpacity
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import moment from 'moment';
import jDate from './Code/JCal/jDate';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: moment().format('LTS'),
            date: jDate.now().toString(),
            zmanToShow: 0,
            showPicker: false
        };
        KeepAwake.activate();
    }
    componentDidMount() {
        setInterval(() => {
            console.log('HIT');
            this.setState({
                time: moment().format('LTS'),
                date: jDate.now().toString(),
            });
        }, 1000);
    }
    render() {
        return (
            <View style={styles.container}>
                <StatusBar style={{ backgroundColor: 'transparent' }} />
                <Text style={styles.label}>
                    Current time:
                </Text>
                <Text style={styles.timeText}>
                    {this.state.time}
                </Text>
                <TouchableOpacity onPress={() => this.setState({ showPicker: !this.state.showPicker })}>
                    <Text style={styles.label}>
                        {`${this.state.zmanToShow}:`}
                    </Text>
                    {this.state.showPicker &&
                        <Picker
                            selectedValue={this.state.zmanToShow}
                            style={styles.androidPicker}
                            textStyle={{fontSize: 40}}
                            onValueChange={itemValue => this.setState({ zmanToShow: itemValue })}>
                            <Picker.Item label="Alos" value="0" />
                            <Picker.Item label="Netz" value="1" />
                        </Picker>}
                    <Text style={styles.timeText}>
                        {this.state.time}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.label}>
                    Current date:
                </Text>
                <Text style={styles.dateText}>
                    {this.state.date}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeText: {
        color: '#999',
        fontSize: 50,
    },
    dateText: {
        color: '#999',
        fontSize: 20,
    },
    label: {
        color: '#99f',
        fontSize: 18,
        fontWeight: 'bold'
    },
    androidPicker: {
        color: '#99f',
        height: 40,
        alignItems:'center',
        justifyContent:'center',
    }
});
