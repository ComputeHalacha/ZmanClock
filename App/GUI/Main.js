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
    displaySingleZman(zt, index, styles, itemHeight) {
        const { english, numberOfItemsToShow, location } = this.props.settings;
        if (index >= numberOfItemsToShow) return null;
        const timeDiff = Utils.timeDiff(
                this.props.nowTime,
                zt.time,
                !zt.isTomorrow
            ),
            was = timeDiff.sign === -1,
            minutes = Utils.totalMinutes(timeDiff),
            minutesFrom10 = 10 - minutes,
            isWithin10 = !was && !zt.isTomorrow && minutes < 10,
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
                        english
                            ? styles.timeRemainingLabelEng
                            : styles.timeRemainingLabel,
                        { color: was ? '#550' : '#99f' },
                    ]}>
                    <Text
                        style={
                            english
                                ? styles.timeRemainingNumberEng
                                : styles.timeRemainingNumber
                        }>
                        {english ? zt.zmanType.eng : zt.zmanType.heb}
                    </Text>
                    {english
                        ? `  ${was ? 'passed' : 'in'}:`
                        : `  ${was ? 'עבר לפני' : 'בעוד'}:`}
                </Text>
                <Text
                    style={[
                        english
                            ? styles.timeRemainingTextEng
                            : styles.timeRemainingText,
                        { color: timeRemainingColor },
                    ]}>
                    {english
                        ? Utils.getTimeIntervalTextString(timeDiff)
                        : Utils.getTimeIntervalTextStringHeb(timeDiff)}
                </Text>
                <Text
                    style={
                        was
                            ? english
                                ? styles.zmanTypeNameTextWasEng
                                : styles.zmanTypeNameTextWas
                            : english
                            ? styles.zmanTypeNameTextEng
                            : styles.zmanTypeNameText
                    }>
                    {`${
                        zt.time && zt.isTomorrow && zt.time.hour > 2
                            ? english
                                ? ' Tomorrow'
                                : 'מחר '
                            : ''
                    } ${english ? 'at' : 'בשעה'}: `}
                    <Text
                        style={
                            isWithin10
                                ? styles.within10ZmanTimeText
                                : styles.zmanTimeText
                        }>
                        {Utils.getTimeString(zt.time, location.Israel)}
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
        const { english, location } = this.props.settings,
            styles = getStyle(this.props.settings.theme, 'main'),
            itemHeight =
                Math.trunc(
                    100 /
                        Math.min(
                            Number(this.props.settings.numberOfItemsToShow),
                            Number(this.props.zmanTimes.length)
                        )
                ) - 2;
        return (
            <View style={styles.container}>
                <Text style={styles.dateText}>
                    {english
                        ? this.props.jdate.toString()
                        : this.props.jdate.toStringHeb()}
                </Text>
                <Text style={styles.sDateText}>
                    {english
                        ? Utils.toStringDate(this.props.sdate, true)
                        : Utils.toShortStringDate(
                              this.props.sdate,
                              location.Israel
                          )}
                </Text>
                {this.getNotificationsView(styles)}
                <Text style={english ? styles.timeText1Eng : styles.timeText1}>
                    {Utils.getTimeString(this.props.nowTime, location.Israel)}
                </Text>
                <ScrollView style={styles.scrollView} useNativeDriver='true'>
                    {this.props.zmanTimes.map((zt, i) =>
                        this.displaySingleZman(zt, i, styles, itemHeight)
                    )}
                </ScrollView>
            </View>
        );
    }
}
