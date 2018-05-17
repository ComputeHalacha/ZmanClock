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
            <View style={styles.notificationsView}>
                {this.props.notifications && this.props.notifications.map((n, i) =>
                    <Text key={i} style={styles.notificationsText}>
                        {n}
                    </Text>
                )}
            </View>
            <Text style={styles.timeNowText}>השעה עכשיו:</Text>
            <Text style={styles.timeText1}>
                {Utils.getTimeString(this.props.nowTime, true)}
            </Text>
            <ScrollView style={styles.scrollView}
                contentContainerStyle={this.props.zmanTimes.length > 2
                    ? styles.scrollContent
                    : styles.container}>
                {this.props.zmanTimes.map((zt, i) => {
                    if (i >= this.props.settings.numberOfItemsToShow)
                        return null;
                    const timeDiff = Utils.timeDiff(this.props.nowTime, zt.time, !zt.isTommorrow),
                        was = timeDiff.sign === -1;
                    return <View key={i} style={[styles.singleZman, {
                        backgroundColor: was
                            ? '#311'
                            : '#112'
                    }]}>
                        <Text style={[styles.timeRemainingLabel, {
                            color: was
                                ? '#aa6'
                                : '#99f'
                        }]}>
                            {`${zt.zmanType.heb} ${was ? 'עבר לפני' : 'בעוד'}:`}
                        </Text>
                        <Text style={[styles.timeRemainingText, {
                            color: was
                                ? '#f99'
                                : '#a99'
                        }]}>
                            {Utils.getTimeString(timeDiff, true)}
                        </Text>
                        <Text style={styles.zmanTypeNameText}>
                            {'בשעה: '}
                            <Text style={styles.zmanTimeText}>
                                {Utils.getTimeString(zt.time, true)}
                            </Text>
                        </Text>
                    </View>;
                })}
            </ScrollView>
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollView: {
        width: '90%',
        flex: 1
    },
    scrollContent: {
        justifyContent: 'center'
    },
    notificationsView: {
        marginTop: 10,
        marginBottom: 20,
        justifyContent: 'space-around',
        flexDirection: 'row',
        width: '100%'
    },
    notificationsText: {
        color: '#899',
        fontWeight: 'bold',
        fontSize: 13
    },
    singleZman: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7,
        padding: 20,
        width: '100%',
        marginBottom: 5
    },
    dateText: {
        color: '#b88',
        fontSize: 25,
        textAlign: 'center'
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
        fontSize: 50,
    },
    timeRemainingLabel: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    zmanTypeNameText: {
        color: '#99f',
        fontSize: 14
    },
});
