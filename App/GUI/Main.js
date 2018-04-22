import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import jDate from '../Code/JCal/jDate';
import Utils from '../Code/JCal/Utils';
import Zmanim from '../Code/JCal/Zmanim';
import Location from '../Code/JCal/Location';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.openSettings = props.openSettings;
        this.closeSettings = props.closeSettings;

        this.zmanToShow = { name: 'netzMishor', eng: 'Sunrise', heb: 'נץ החמה' };

        const sd = new Date(),
            nowTime = Utils.timeFromDate(sd),
            jd = new jDate(sd),
            { zmanTime, isTommorrow } = Main.getCorrectZmanTime(
                sd, nowTime, Location.getJerusalem(), this.zmanToShow);
        this.state = { sd, nowTime, jd, zmanTime, isTommorrow };

    }
    componentDidMount() {
        setInterval(() => {
            const sd = new Date(),
                nowTime = Utils.timeFromDate(sd);
            if (sd.getDate() !== this.state.sd.getDate()) {
                const jd = new jDate(sd),
                    { zmanTime, isTommorrow } = Main.getCorrectZmanTime(
                        sd, nowTime, Location.getJerusalem(), this.zmanToShow);
                this.setState({ sd, nowTime, jd, zmanTime, isTommorrow });
                console.log('Refreshed all stuff');
            }
            else {
                this.setState({ sd, nowTime });
            }
        }, 1000);
    }
    /**
     * Returns the date corrected time of the given zman on the given date at the given location
     * If the zman is after or within an hour of the given time, this days zman is returned, othwise tomorrows zman is returned.
     * @param {Date} sdate
     * @param {{hour : Number, minute :Number, second: Number }} time
     * @param {Location} location
     * @param {{ name: String, eng: String, heb: String }} zmanToShow
     * @returns {{zmanTime:{hour : Number, minute :Number, second: Number }, isTommorrow:Boolean}}
     */
    static getCorrectZmanTime(sdate, time, location, zmanToShow) {
        let zmanTime = Main.getZmanTime(sdate, location, zmanToShow),
            isTommorrow = false,
            diff = Utils.timeDiff(time, zmanTime, true);
        if (diff.sign < 1 && Utils.totalMinutes(diff) >= 60) {
            zmanTime = Main.getZmanTime(new Date(sdate.valueOf() + 8.64E7), location, zmanToShow);
            isTommorrow = true;
        }
        return { zmanTime, isTommorrow };
    }
    /**
     * Returns the time of the given zman on the given date at the given location
     * @param {Date} sdate
     * @param {Location} location
     * @param {{ name: String, eng: String, heb: String }} zmanToShow
     */
    static getZmanTime(sdate, location, zmanToShow) {
        switch (zmanToShow.name) {
            case 'netzMishor':
                return Zmanim.getSunTimes(sdate, location, false).sunrise
        }
    }
    render() {
        return (
            <View style={styles.container}>
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
                        {Utils.getTimeString(Utils.timeDiff(
                            this.state.nowTime,
                            this.state.zmanTime,
                            !this.state.isTommorrow), true)}
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
