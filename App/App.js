import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import jDate from './Code/JCal/jDate';
import Utils from './Code/JCal/Utils';
import Zmanim from './Code/JCal/Zmanim';
import Location from './Code/JCal/Location';

export default class App extends Component {
    constructor(props) {
        super(props);
        const sd = new Date(),
            nowTime = { hour: sd.getHours(), minute: sd.getMinutes(), second: sd.getSeconds() },
            jd = new jDate(sd),
            zmanTime = Zmanim.getSunTimes(sd, Location.getJerusalem(), false).sunrise;
        this.state = { sd, nowTime, jd, zmanTime };
        this.zmanToShow = { name: 'netzMishor', eng: 'Sunrise', heb: 'נץ החמה' };
        KeepAwake.activate();
    }
    componentDidMount() {
        setInterval(() => {
            const sd = new Date(),
                nowTime = { hour: sd.getHours(), minute: sd.getMinutes(), second: sd.getSeconds() };
            if (sd.getDate() !== this.state.sd.getDate()) {
                const jd = new jDate(sd),
                    zmanTime = Zmanim.getSunTimes(sd, Location.getJerusalem(), false).sunrise;
                this.setState({ sd, nowTime, jd, zmanTime });
                console.log('Refreshed all stuff');
            }
            else {
                this.setState({ sd, nowTime });
            }
        }, 1000);
    }
    render() {
        return (
            <View style={styles.container}>
                <StatusBar style={{ backgroundColor: 'transparent' }} />
                <Text style={styles.dateText}>
                    {this.state.jd.toStringHeb()}
                </Text>
                <View style={styles.container}>
                    <Text style={styles.label1}>
                        השעה עכשיו:
                    </Text>
                    <Text style={styles.timeText1}>
                        {Utils.getTimeString(this.state.nowTime, true)}
                    </Text>
                    <Text style={styles.label2}>
                        {`\n\n${this.zmanToShow.heb}:`}
                    </Text>
                    <Text style={styles.timeText2}>
                        {Utils.getTimeString(this.state.zmanTime, true)}
                    </Text>
                    <Text style={styles.label1}>
                        {`\n\n${this.zmanToShow.heb} בעוד:`}
                    </Text>
                    <Text style={styles.timeText1}>
                        {Utils.getTimeString(Utils.timeDiff(this.state.nowTime, this.state.zmanTime, true), true)}
                    </Text>
                </View>
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
    timeText1: {
        color: '#999',
        fontSize: 50,
    },
    timeText2: {
        color: '#999',
        fontSize: 30,
    },
    dateText: {
        color: '#999',
        fontSize: 20,
    },
    label1: {
        color: '#99f',
        fontSize: 18,
        fontWeight: 'bold'
    },
    label2: {
        color: '#99f',
        fontSize: 12,
        fontWeight: 'bold'
    },
});
