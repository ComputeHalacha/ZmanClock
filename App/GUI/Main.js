import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView
} from 'react-native';
import Utils from '../Code/JCal/Utils';

export default class Main extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <View style={styles.container}>
            <Text style={styles.dateText}>{this.props.jdate.toStringHeb()}</Text>
            <Text style={styles.timeNowText}>השעה עכשיו:</Text>
            <Text style={styles.timeText1}>
                {Utils.getTimeString(this.props.nowTime, true)}
            </Text>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {this.props.zmanTimes.map((zt, i) =>
                    <View key={i} style={styles.singleZman}>
                        <Text style={styles.timeRemainingLabel}>
                            {`${zt.zmanType.heb} בעוד:`}
                        </Text>
                        <Text style={styles.timeRemainingText}>
                            {Utils.getTimeString(Utils.timeDiff(
                                this.props.nowTime,
                                zt.time,
                                !zt.isTommorrow), true)}
                        </Text>
                        <Text style={styles.zmanTypeNameText}>
                            {'בשעה: '}
                            <Text style={styles.zmanTimeText}>
                                {Utils.getTimeString(zt.time, true)}
                            </Text>
                        </Text>
                    </View>)}
            </ScrollView>
        </View>;
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView:{flex: 1},
    scrollContent: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    },
    singleZman: {
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#333',
        borderTopWidth: 1,
        padding: 10
    },
    dateText: {
        color: '#b88',
        fontSize: 25,
        marginBottom: 25
    },
    timeText1: {
        color: '#999',
        fontSize: 60,
    },
    timeNowText: {
        color: '#99f',
        fontSize: 18,
        fontWeight: 'bold'
    },
    zmanTimeText: {
        color: '#9b9'
    },
    timeRemainingText: {
        color: '#a99',
        fontSize: 50,
    },
    timeRemainingLabel: {
        color: '#99f',
        fontSize: 18,
        fontWeight: 'bold'
    },
    zmanTypeNameText: {
        color: '#99f',
        fontSize: 14
    },
});
