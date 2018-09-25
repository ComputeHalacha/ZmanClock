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
        this.getNotificationsView = this.getNotificationsView.bind(this);
    }
    displaySingleZman(zt, index) {
        if (index >= this.props.settings.numberOfItemsToShow)
            return null;
        const timeDiff = Utils.timeDiff(this.props.nowTime, zt.time, !zt.isTommorrow),
            was = (timeDiff.sign === -1),
            minutes = Utils.totalMinutes(timeDiff),
            minutesFrom10 = (10 - minutes),
            isWithin10 = (!was && !zt.isTommorrow) && (minutes < 10),
            itemHeight = Math.trunc(100 /
                Math.min(Number(this.props.settings.numberOfItemsToShow),
                    Number(this.props.zmanTimes.length))) - 2,
            timeRemainingColor = was
                ? '#844'
                : (isWithin10
                    ? `rgb(${200 + (minutesFrom10 * 5)},
                            ${150 + (minutesFrom10 * 5)},
                            100)` :
                    '#a99');
        return <View key={index}
            style={[styles.singleZman, { height: `${itemHeight}%` }]}>
            <Text style={[styles.timeRemainingLabel, {
                color: was ? '#550' : '#99f',
                fontSize: 15
            }]}>
                <Text style={styles.timeRemainingNumber}>{zt.zmanType.heb}</Text>
                {`  ${was ? 'עבר לפני' : 'בעוד'}:`}
            </Text>
            <Text style={[styles.timeRemainingText, { color: timeRemainingColor }]}>
                {Utils.getTimeIntervalTextStringHeb(timeDiff)}
            </Text>
            <Text style={was ? styles.zmanTypeNameTextWas : styles.zmanTypeNameText}>
                {`${zt.isTommorrow && zt.time.hour > 2 ? 'מחר ' : ''}בשעה: `}
                <Text style={isWithin10 ? styles.within10ZmanTimeText : styles.zmanTimeText}>
                    {Utils.getTimeString(zt.time, true)}
                </Text>
            </Text>
        </View>;
    }
    getNotificationsView() {
        const notifications = this.props.notifications,
            innerViews = [];
        if (notifications && notifications.length) {
            for (let i = 0; i < Math.ceil(notifications.length / 3); i++) {
                let texts = [];
                for (let index = 0; index < 3; index++) {
                    const note = notifications[(i * 3) + index];
                    if (note) {
                        texts.push(<Text key={index} style={styles.notificationsText}>
                            {note}
                        </Text>);
                    }
                }
                innerViews.push(<View key={i} style={styles.notificationsInnerView}>
                    {texts}
                </View>);
            }
        }
        return (<View style={styles.notificationsView}>
            {innerViews}
        </View>);
    }

    render() {
        return <View style={styles.container}>
            <Text style={styles.dateText}>{this.props.jdate.toStringHeb()}</Text>
            {this.getNotificationsView()}
            <Text style={styles.timeNowText}>השעה עכשיו:</Text>
            <Text style={styles.timeText1}>
                {Utils.getTimeString(this.props.nowTime, true)}
            </Text>
            <ScrollView style={styles.scrollView}
                contentContainerStyle={{ flex: (this.props.settings.numberOfItemsToShow > 3 ? 0 : 1) }}>
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
        height: '75%',
        flex: 1
    },
    notificationsView: {
        marginTop: 10,
        marginBottom: 10,
        width: '100%'
    },
    notificationsInnerView: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        marginBottom: 10,
        width: '100%',
    },
    notificationsText: {
        color: '#899',
        fontWeight: 'bold',
        fontSize: 13
    },
    singleZman: {
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7,
        padding: 20,
        width: '100%',
        marginBottom: 10,
        minHeight: 130
    },
    dateText: {
        color: '#b88',
        fontSize: 25,
        textAlign: 'center'
    },
    timeText1: {
        color: '#595',
        fontSize: 80,
        padding: 1,
        marginBottom: 15
    },
    timeNowText: {
        color: '#99f',
        fontSize: 20,
        fontWeight: 'bold'
    },
    zmanTimeText: {
        color: '#9b9'
    },
    within10ZmanTimeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#9b9'
    },
    timeRemainingText: {
        fontSize: 38,
        textAlign: 'center'
    },
    timeRemainingNumber: {
        color: '#ffffee',
        fontSize: 20
    },
    timeRemainingLabel: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    zmanTypeNameText: {
        color: '#99f',
        fontSize: 22
    },
    zmanTypeNameTextWas: {
        color: '#558',
        fontSize: 15
    }
});
