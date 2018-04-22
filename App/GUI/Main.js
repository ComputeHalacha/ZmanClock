import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import Utils from '../Code/JCal/Utils';

export default class Main extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.label1}>
                    השעה עכשיו:
                    </Text>
                <Text style={styles.timeText1}>
                    {Utils.getTimeString(this.props.nowTime, true)}
                </Text>
                <Text style={styles.label2}>
                    {`\n\n${this.props.zmanToShow.heb}:`}
                </Text>
                <Text style={styles.timeText2}>
                    {Utils.getTimeString(this.props.zmanTime, true)}
                </Text>
                <Text style={styles.label1}>
                    {`\n\n${this.props.zmanToShow.heb} בעוד:`}
                </Text>
                <Text style={styles.timeText1}>
                    {Utils.getTimeString(Utils.timeDiff(
                        this.props.nowTime,
                        this.props.zmanTime,
                        !this.props.isTommorrow), true)}
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
    timeText1: {
        color: '#999',
        fontSize: 50,
    },
    timeText2: {
        color: '#999',
        fontSize: 30,
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
