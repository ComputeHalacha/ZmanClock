import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView
} from 'react-native';
import Utils from '../Code/JCal/Utils';

export default class Main extends PureComponent {
    constructor(props) {
        super(props);
        this.displaySingleZman = this.displaySingleZman.bind(this);
    }
    displaySingleZman(zt, index) {
        if (index >= this.props.settings.numberOfItemsToShow)
            return null;
        const timeDiff = Utils.timeDiff(this.props.nowTime, zt.time, !zt.isTommorrow),
            was = (timeDiff.sign === -1),
            minutes = timeDiff.minute,
            minutesFrom10 = (10 - minutes),
            isWithin10 = (!was && !zt.isTommorrow) && (minutes < 10);
        return <View key={index} style={[
            styles.singleZman,
            was
                ? styles.singleZmanWas
                : (isWithin10
                    ? styles.singleZman10
                    : styles.singleZmanReg)]}>
            <Text style={[styles.timeRemainingLabel, {
                color: was ? '#550' : '#99f',
                fontSize: was ? 15 : (isWithin10 ? 20 + minutesFrom10 : 18)
            }]}>
                {`${zt.zmanType.heb} ${was ? 'עבר לפני' : 'בעוד'}:`}
            </Text>
            <Text style={[styles.timeRemainingText, {
                color: was
                    ? '#844'
                    : (isWithin10
                        ? `rgb(${200 + (minutesFrom10 * 5)},
                            ${150 + (minutesFrom10 * 5)},
                            100)` :
                        '#a99'),
                fontSize: was
                    ? 20
                    : (isWithin10
                        ? 50 + (minutesFrom10 * 3)
                        : 50)
            }]}>
                {Utils.getTimeString(timeDiff, true)}
            </Text>
            <Text style={
                was
                    ? styles.zmanTypeNameTextWas :
                    (isWithin10
                        ? styles.zmanTypeNameText10
                        : styles.zmanTypeNameText)}>
                {'בשעה: '}
                <Text style={[styles.zmanTimeText, isWithin10
                    ? { fontSize: 22 } : null]}>
                    {Utils.getTimeString(zt.time, true)}
                </Text>
            </Text>
        </View>;
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
                contentContainerStyle={
                    this.props.zmanTimes.length > 3 && this.props.settings.numberOfItemsToShow > 3
                        ? styles.scrollContent
                        : styles.container}>
                {this.props.zmanTimes.map((zt, i) => this.displaySingleZman(zt, i))}
            </ScrollView>
        </View >;
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
        backgroundColor: '#000',
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
    singleZmanReg: {
        backgroundColor: '#112'
    },
    singleZman10: {
        backgroundColor: '#334',
        height: 300
    },
    singleZmanWas: {
        backgroundColor: '#111',
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
    zmanTypeNameTextWas: {
        color: '#558',
        fontSize: 12
    },
    zmanTypeNameText10: {
        color: '#99f',
        fontSize: 22
    },
});
