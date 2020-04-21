import React, { PureComponent } from 'react';
import { Text, View, ScrollView } from 'react-native';
import Utils from '../Code/JCal/Utils';
import getStyle from './Styles/Styles';

export default class Main extends PureComponent {
    constructor(props) {
        super(props);
        this.displaySingleZman = this.displaySingleZman.bind(this);
        this.getNotificationsView = this.getNotificationsView.bind(this);
    }
    displaySingleZman(zt, index, styles) {
        if (index >= this.props.settings.numberOfItemsToShow) return null;
        const timeDiff = Utils.timeDiff(
                this.props.nowTime,
                zt.time,
                !zt.isTomorrow
            ),
            was = timeDiff.sign === -1,
            minutes = Utils.totalMinutes(timeDiff),
            minutesFrom10 = 10 - minutes,
            isWithin10 = !was && !zt.isTomorrow && minutes < 10,
            itemHeight =
                Math.trunc(
                    100 /
                        Math.min(
                            Number(this.props.settings.numberOfItemsToShow),
                            Number(this.props.zmanTimes.length)
                        )
                ) - 2,
            timeRemainingColor = was
                ? '#844'
                : isWithin10
                ? `rgb(${200 + minutesFrom10 * 5},
                            ${150 + minutesFrom10 * 5},
                            100)`
                : '#a99';
        return (
            <View
                key={index}
                style={[styles.singleZman, { height: `${itemHeight}%` }]}>
                <Text
                    style={[
                        styles.timeRemainingLabel,
                        {
                            color: was ? '#550' : '#99f',
                            fontSize: 15,
                        },
                    ]}>
                    <Text style={styles.timeRemainingNumber}>
                        {zt.zmanType.heb}
                    </Text>
                    {`  ${was ? 'עבר לפני' : 'בעוד'}:`}
                </Text>
                <Text
                    style={[
                        styles.timeRemainingText,
                        { color: timeRemainingColor },
                    ]}>
                    {Utils.getTimeIntervalTextStringHeb(timeDiff)}
                </Text>
                <Text
                    style={
                        was
                            ? styles.zmanTypeNameTextWas
                            : styles.zmanTypeNameText
                    }>
                    {`${zt.time && zt.isTomorrow && zt.time.hour > 2 ? 'מחר ' : ''}בשעה: `}
                    <Text
                        style={
                            isWithin10
                                ? styles.within10ZmanTimeText
                                : styles.zmanTimeText
                        }>
                        {Utils.getTimeString(zt.time, true)}
                    </Text>
                </Text>
            </View>
        );
    }
    getNotificationsView(styles) {
        const notifications = this.props.notifications,
            innerViews = [];
        if (notifications && notifications.length) {
            for (let i = 0; i < Math.ceil(notifications.length / 3); i++) {
                let texts = [];
                for (let index = 0; index < 3; index++) {
                    const note = notifications[i * 3 + index];
                    if (note) {
                        texts.push(
                            <Text key={index} style={styles.notificationsText}>
                                {note}
                            </Text>
                        );
                    }
                }
                innerViews.push(
                    <View key={i} style={styles.notificationsInnerView}>
                        {texts}
                    </View>
                );
            }
        }
        return <View style={styles.notificationsView}>{innerViews}</View>;
    }

    render() {
        const styles = getStyle(this.props.settings.theme, 'main');
        return (
            <View style={styles.container}>
                <Text style={styles.dateText}>
                    {this.props.jdate.toStringHeb()}
                </Text>
                {this.getNotificationsView(styles)}
                <Text style={styles.timeNowText}>השעה עכשיו:</Text>
                <Text style={styles.timeText1}>
                    {Utils.getTimeString(this.props.nowTime, true)}
                </Text>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={{
                        flex:
                            this.props.settings.numberOfItemsToShow > 3 ? 0 : 1,
                    }}>
                    {this.props.zmanTimes.map((zt, i) =>
                        this.displaySingleZman(zt, i, styles)
                    )}
                </ScrollView>
            </View>
        );
    }
}
