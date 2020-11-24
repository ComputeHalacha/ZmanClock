/* eslint-disable react-perf/jsx-no-new-object-as-prop */
import React, {PureComponent} from 'react';
import {
    Image,
    Picker,
    ScrollView,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';
import {Checkbox} from 'dooboo-ui';
import AppUtils from '../Code/AppUtils';
import {range} from '../Code/GeneralUtils';
import Utils from '../Code/JCal/Utils';
import {ZmanTypes} from '../Code/ZmanTypes';
import getStyle from './Styles/Styles';

export default class CustomZmanim extends PureComponent {
    constructor(props) {
        super(props);
        this.onChangeSettings = this.onChangeSettings.bind(this);
    }
    onChangeSettings(values) {
        this.props.changeSettings(settings);
    }
    render() {
        const {
                zmanimToShow,
                location,
                english,
                showNotifications,
                numberOfItemsToShow,
                minToShowPassedZman,
                theme,
            } = this.props.settings,
            fullZmanTypeList = [...ZmanTypes],
            customZmanimList = this.props.settings.CustomZmanim,
            styles = getStyle(theme, 'customZmanim');

        return (
            <View style={styles.outContainer}>
                <View style={styles.container}>
                    <Text style={styles.header}>
                        {english ? 'Other Zmanim' : 'זמנים אחרים'}
                    </Text>
                    <ScrollView
                        contentContainerStyle={styles.inContainer}
                        useNativeDriver="true">
                        <View style={styles.scrollView}>
                            {customZmanimList.map((cz, index) => (
                                <View key={index}>{cz.desc}</View>
                            ))}
                        </View>
                        <Text style={styles.label}>
                            {english ? 'General Settings' : 'העדפות כלליות'}
                        </Text>
                        <View style={styles.checkboxView}>
                            <Checkbox
                                checked={Boolean(showNotifications)}
                                onChange={() =>
                                    this.onChangeSettings({
                                        showNotifications: !showNotifications,
                                    })
                                }
                                customStyle={styles.checkbox}
                                label=' הצג מידע יומית'
                            />
                            <Text style={styles.labelCheckbox}>

                            </Text>
                        </View>
                        <View style={styles.numBoxView}>
                            <Picker
                                style={styles.numberPicker}
                                itemStyle={styles.pickerItem}
                                selectedValue={numberOfItemsToShow}
                                onValueChange={(numberOfItemsToShow) =>
                                    this.onChangeSettings({
                                        numberOfItemsToShow,
                                    })
                                }>
                                {range(1, 10).map((num) => (
                                    <Picker.Item
                                        key={num}
                                        value={num}
                                        label={num.toString()}
                                    />
                                ))}
                            </Picker>
                            <Text style={styles.labelCheckbox}>
                                מקסימום פרטים להציג במסך:{' '}
                            </Text>
                        </View>
                        <View style={styles.numBoxView}>
                            <Picker
                                style={styles.numberPicker}
                                itemStyle={styles.pickerItem}
                                selectedValue={minToShowPassedZman}
                                onValueChange={(minToShowPassedZman) =>
                                    this.onChangeSettings({
                                        minToShowPassedZman,
                                    })
                                }>
                                {range(0, 60).map((num) => (
                                    <Picker.Item
                                        key={num}
                                        value={num}
                                        label={num.toString()}
                                    />
                                ))}
                            </Picker>
                            <Text style={styles.labelCheckbox}>
                                מספר דקות להציג זמנים שעברו:{' '}
                            </Text>
                        </View>
                        <Text style={styles.label}>עריכת שעה</Text>
                        <Text>
                            השעה עכשיו:{' '}
                            {Utils.getTimeString(this.props.nowTime, true)}
                        </Text>
                    </ScrollView>
                    <Text
                        style={styles.close}
                        onPress={() => this.props.close()}
                        onLongPress={() =>
                            AppUtils.changeSystemHomeSettings(
                                this.props.settings,
                            )
                        }>
                        סגור X
                    </Text>
                </View>
            </View>
        );
    }
}
