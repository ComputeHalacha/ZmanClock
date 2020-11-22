/* eslint-disable react-perf/jsx-no-new-object-as-prop */
import React, {PureComponent, Fragment} from 'react';
import {
    Image,
    ScrollView,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import SwitchToggle from 'react-native-switch-toggle';
import {Picker} from '@react-native-community/picker';
import AppUtils from '../Code/AppUtils';
import {range, setDefault} from '../Code/GeneralUtils';
import Utils from '../Code/JCal/Utils';
import {Locations} from '../Code/Locations';
import {openSystemTimeSettings} from '../Code/SystemTime';
import {version} from '../../package.json';
import Settings from '../Code/Settings';
import getStyle from './Styles/Styles';

export default class SettingsDrawer extends PureComponent {
    constructor(props) {
        super(props);
        this.onChangeSettings = this.onChangeSettings.bind(this);
        this.resetSettings = this.resetSettings.bind(this);
        this.toggleZmanType = this.toggleZmanType.bind(this);
        this.state = {theme: props.settings.theme};
    }
    /**
     *
     * @param {object} values
     */
    onChangeSettings(values) {
        const {
                zmanimToShow,
                location,
                showNotifications,
                numberOfItemsToShow,
                minToShowPassedZman,
                showGaonShir,
                theme,
                showDafYomi,
                english,
            } = values,
            settings = this.props.settings.clone();
        if (zmanimToShow) {
            settings.zmanimToShow = zmanimToShow;
        }
        if (location) {
            settings.location = location;
        }
        settings.showNotifications = setDefault(
            showNotifications,
            settings.showNotifications,
        );
        settings.numberOfItemsToShow = setDefault(
            numberOfItemsToShow,
            settings.numberOfItemsToShow,
        );
        settings.minToShowPassedZman = setDefault(
            minToShowPassedZman,
            settings.minToShowPassedZman,
        );
        settings.showGaonShir = setDefault(showGaonShir, settings.showGaonShir);
        if (theme) {
            settings.theme = theme;
            this.setState({theme});
        }
        settings.showDafYomi = setDefault(showDafYomi, settings.showDafYomi);
        settings.english = setDefault(english, settings.english);

        this.props.changeSettings(settings);
    }
    openAddCustomZmanim() {
        throw new Error('Method not implemented.');
    }
    resetSettings() {
        const settings = new Settings();
        this.props.changeSettings(settings);
    }
    toggleZmanType(zmanType) {
        const {zmanimToShow} = this.props.settings;
        const isShowing = !!zmanimToShow.find((zts) =>
            AppUtils.IsSameZmanToShow(zts, zmanType),
        );
        let newZmanimList;
        if (isShowing) {
            newZmanimList = zmanimToShow.filter(
                (zmts) => !AppUtils.IsSameZmanToShow(zmts, zmanType),
            );
        } else {
            newZmanimList = [...zmanimToShow, zmanType];
        }
        this.onChangeSettings({
            zmanimToShow: [...new Set(newZmanimList)],
        });
    }
    render() {
        const {
                zmanimToShow,
                location,
                showNotifications,
                numberOfItemsToShow,
                minToShowPassedZman,
                showGaonShir,
                showDafYomi,
                english,
            } = this.props.settings,
            fullZmanTypeList = AppUtils.AllZmanTypes(this.props.settings),
            styles = getStyle(this.state.theme, 'settingsDrawer'),
            otherTheme = this.state.theme === 'dark' ? 'light' : 'dark';
        return (
            <View style={styles.outContainer}>
                <View style={styles.container}>
                    <Text style={styles.header}>
                        {english ? 'Settings' : 'הגדרות'}
                    </Text>
                    <Text style={styles.version}>{`${
                        english ? 'Zman Clock Version' : 'שעון זמנים - גירסה'
                    } ${version}${
                        global.HermesInternal ? ' Hermes' : ''
                    }`}</Text>
                    <ScrollView
                        contentContainerStyle={styles.inContainer}
                        useNativeDriver='true'>
                        <Text style={styles.label}>
                            {english ? 'Choose app language' : 'בחר שפה'}
                        </Text>
                        <View style={styles.checkboxView}>
                            <Text style={styles.labelCheckbox}>
                                {english ? 'Hebrew' : 'עברית'}
                            </Text>
                            <SwitchToggle
                                switchOn={english}
                                onPress={() =>
                                    this.onChangeSettings({
                                        english: !english,
                                    })
                                }
                            />
                            <Text style={styles.labelCheckbox}>
                                {english ? 'English' : 'אנגלית'}
                            </Text>
                        </View>
                        <Text style={styles.label}>
                            {english ? 'Choose your location' : 'בחר מיקום'}
                        </Text>
                        <Picker
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                            selectedValue={location}
                            onValueChange={(location) =>
                                this.onChangeSettings({location})
                            }>
                            {Locations.map((location, i) => (
                                <Picker.Item
                                    key={i}
                                    value={location}
                                    label={location.Name}
                                />
                            ))}
                        </Picker>
                        <Text style={styles.label}>
                            {english
                                ? 'Choose which Zmanim to show'
                                : 'בחר איזה זמנים להציג'}
                        </Text>
                        <View style={styles.scrollView}>
                            {fullZmanTypeList.map((zt, index) => {
                                const showZmanType = !!zmanimToShow.find(
                                    (zts) => AppUtils.IsSameZmanToShow(zts, zt),
                                );
                                return (
                                    <Fragment key={index}>
                                        <Text style={styles.label}>
                                            {english ? zt.eng : zt.desc}
                                        </Text>
                                        <View style={styles.checkboxView}>
                                            <Text style={styles.labelCheckbox}>
                                                {english
                                                    ? 'Don`t Show'
                                                    : 'אל תציג'}
                                            </Text>
                                            <SwitchToggle
                                                switchOn={showZmanType}
                                                onPress={() =>
                                                    this.toggleZmanType(zt)
                                                }
                                            />
                                            <Text style={styles.labelCheckbox}>
                                                {english ? 'Show' : 'הצג'}
                                            </Text>
                                        </View>
                                    </Fragment>
                                );
                            })}
                        </View>
                        <Text style={styles.label}>
                            {english ? 'General Settings' : 'העדפות כלליות'}
                        </Text>
                        <View style={styles.checkboxView}>
                            <CheckBox
                                isChecked={Boolean(showNotifications)}
                                onClick={() =>
                                    this.onChangeSettings({
                                        showNotifications: !showNotifications,
                                    })
                                }
                                style={styles.checkbox}
                            />
                            <Text style={styles.labelCheckbox}>
                                {english
                                    ? 'Show daily information'
                                    : 'הצג מידע יומית'}
                            </Text>
                        </View>
                        <View style={styles.numBoxView}>
                            <Text style={styles.labelCheckbox}>
                                {english
                                    ? 'Number of items to show: '
                                    : ': מקסימום פרטים להציג במסך'}
                            </Text>
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
                        </View>
                        <View style={styles.numBoxView}>
                            <Text style={styles.labelCheckbox}>
                                {english
                                    ? 'Number of minutes to show past items: '
                                    : 'מספר דקות להציג זמנים שעברו: '}
                            </Text>
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
                        </View>
                        <View style={styles.checkboxView}>
                            <CheckBox
                                isChecked={Boolean(showGaonShir)}
                                onClick={() =>
                                    this.onChangeSettings({
                                        showGaonShir: !showGaonShir,
                                    })
                                }
                                style={styles.checkbox}
                            />
                            <Text style={styles.labelCheckbox}>
                                {english
                                    ? 'Show the Shir Shel Yom of the Gr"a'
                                    : 'הצג שיר של יום של הגר"א'}
                            </Text>
                        </View>
                        <View style={styles.checkboxView}>
                            <CheckBox
                                isChecked={Boolean(showDafYomi)}
                                onClick={() =>
                                    this.onChangeSettings({
                                        showDafYomi: !showDafYomi,
                                    })
                                }
                                style={styles.checkbox}
                            />
                            <Text style={styles.labelCheckbox}>
                                {english ? 'Show Daf Yomi' : 'הצג דף היומי'}
                            </Text>
                        </View>
                        <Text style={styles.label}>
                            {english ? 'Choose app color theme' : 'בחר צבע רקע'}
                        </Text>
                        <View style={styles.checkboxView}>
                            <Text style={styles.labelCheckbox}>
                                {english ? 'Light Theme' : 'רקע בהיר'}
                            </Text>
                            <SwitchToggle
                                switchOn={this.state.theme === 'dark'}
                                onPress={() =>
                                    this.onChangeSettings({theme: otherTheme})
                                }
                            />
                            <Text style={styles.labelCheckbox}>
                                {english ? 'Dark Theme' : 'רקע כהה'}
                            </Text>
                        </View>
                        <Text style={styles.label}>
                            {english ? 'Change System Time' : 'עריכת שעה'}
                        </Text>
                        <View style={styles.checkboxView}>
                            <Text style={styles.labelCheckbox}>
                                {english ? 'The time is now: ' : 'השעה עכשיו: '}
                                {Utils.getTimeString(
                                    this.props.nowTime,
                                    location.Israel,
                                )}
                            </Text>
                            <TouchableHighlight
                                onPress={openSystemTimeSettings}>
                                <View style={styles.setTimeView}>
                                    <Text style={styles.labelCheckbox}>
                                        {english ? 'Set Time' : 'עריכת שעון'}
                                    </Text>
                                    <Image
                                        style={{width: 35, height: 35}}
                                        source={{
                                            uri:
                                                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAMAAAApB0NrAAABUFBMVEUAAABPT09QUFBVVVVPT09/f39PT09VVVUAAABPT09NTU1PT09PT09OTk5FRUVQUFBQUFBMTExPT09ISEhQUFBPT09QUFBRUVFQUFBQUFA/Pz9PT09QUFBOTk5OTk5NTU1PT09QUFBUVFRQUFBQUFBRUVFOTk5VVVVQUFBPT08/Pz9QUFBPT09RUVFOTk5LS0tQUFAzMzNRUVFQUFBQUFBRUVFQUFBPT09OTk5OTk5PT09QUFBRUVFbW1tQUFBQUFBRUVFRUVFPT09QUFBPT09MTExSUlJNTU1PT09mZmZOTk5RUVFRUVFQUFBQUFBPT09PT09PT09PT09RUVFOTk5PT09PT09RUVFQUFBPT09PT09OTk5PT09PT09PT09PT09QUFBcXFxQUFBPT09PT09OTk5RUVFPT09ISEhQUFBPT09QUFBRUVFPT09QUFB3d3dTx2nXAAAAb3RSTlMAEBMGOgKDAwFjIWCNRAt1ORTBDilzuFtPwgjAZl6YLoaJITafXjcPiEMErK0cWCJ4BVVptWe/vrhBtFYZDqVJWI1KWbA1IjuHBRo1L6tvvXdwl05RlleXebZ9a0BqpmeoCz/EpCpRTQecmcVIqbISLGCKAAABk0lEQVR42nXTU2MsQRDF8bPu2di2bSfXtm37//3fbmrdnZnf82lWlRpl+5ruA1eaLowpVnGCRj3HCg1eJPQgI8/UEmCGoyi6B5hpNerHND8u5GRyhZFRzG3VPAEYWlCD3CbmqipmAc63ypeeATqr170LPFpUqOsc8NTJ3AAuVSMn2XanipsR8F6nJoGh2kFZKKgqZad1SZoA6tdtb8woAnYkAc1S7D5yy7ArXQf6kzLaArrVBxQSM2ngQE1ATgn30RzQok4YVuI+bhz2BUTJGeWBMNMenwn3+fvnJMgcwkPVZX4B/4quWv5m+BC+Syr2Aj+P69Vo0WWgIE/bb+Cbq/7PG90BRuT78R04tDq/ANYkYDSnwNcv9EjaeAl7tjOwqlDmyM5aBzYl3QLoUJwVYN+OVA8wk9JZHfUjMtPAcuZspBeYd5IZA4hS4UG2y8CkNzxsOdVtvMKsNYwyZmknPWe5XCq9vo3tck0Nup8DZjyfzzcDZr4oj3v7GV/vM6dQ1+td6vaOPipW90HLNvCu5ZN3yn+wsaIKnTCzAwAAAABJRU5ErkJggg==',
                                        }}
                                    />
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.settingsButtons}>
                            <TouchableHighlight
                                onPress={() => this.openAddCustomZmanim()}>
                                <View style={styles.setTimeView}>
                                    <Text style={styles.labelCheckbox}>
                                        {english
                                            ? 'Add Custom Zman'
                                            : 'הוסף זמן'}
                                    </Text>
                                    <Image
                                        style={{width: 35, height: 35}}
                                        source={{
                                            uri:
                                                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAHUSURBVDhPrVRdSwJBFN3MPiiDXjK1tKio6O8p+BsEf1+RQWDRl74VRSS7ds7de4ZxVXrpwO69587M2Tt37mzy31hxa+h2u1N3k16vNzNWwD7mvtLBvBbMI30iLIrFhAWiO5j3TgdjhzA/4CP4R/AfGC/xJTEMbNMSWZYVPxLEHM94xlhTRXwIv2lR4MwXbuU0KTlvdTqdTKK07l9Gvnawp3lcfGehJPlym3GriA/7/f4FA5ycpqmEbzBedz+DoegmOUHCxRyYqxmF3OXYBfitU/IauB0MAV6FGbOGUwnFAgTiDbcs+gA2ZEIx8CunxJivOKNipqyLnSAsi674Bvg3uYB4BeYzZ7OgqBWcDzh7bN39+OPH7XZbB6bDXAqdWCsS1skT9Sg+B+vDCIu2uQY/tdFcjP1nWCYqKLMmrfvlyG+4ZcvsKu6xAGWozLhNu0Ke2cR9ij3BUuwFTzhtIhbV1Ru5XSR2AF/bVN+xZeyQYM/Z9BINNcRA8AtizMz6UYsExFmSAW7UiYdyRBP5VbursKpZjQNAaCnnQsVj1uRxVgxS8N65aqZtLrpR/AN9uH/NFyesokkn5XLZJgtYzMzecjaDcKMEfSjGXOAP2PZhT3MqJMkvF8kx31lhwIMAAAAASUVORK5CYII=',
                                        }}
                                    />
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={() => this.resetSettings()}>
                                <View style={styles.setTimeView}>
                                    <Text style={styles.labelCheckbox}>
                                        {english
                                            ? 'Reset Settings'
                                            : 'איפוס הגדרות'}
                                    </Text>
                                    <Image
                                        style={{width: 35, height: 35}}
                                        source={{
                                            uri:
                                                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAKeSURBVDhPlZRfaNJRFMd/tYkWCgWSBm3Tn9nAlooyZGw4QSVTBDP/UC9DfBOCHgZ7qKceRRBh4oMPe5mwqRAk6GPoizLYgzENHK0/SzEfhBiBD211zuX+fs25XPuAfM8513s85557nWDOsL6+Lp6fn58ul8t9GroUV6kSlpaWbh4eHh4NBoP9YDA4RcOX4gpVkmxxcZGvamtr6yU1CWKxmOn3+w2r1Vrd3Nzs0fAIfEKz2exeWFh4S90LyeVy9w4ODvapy8O3XKlUCnBuz6nLGAyG6yKRaOL0Z3d3d2ZjY+MFrvv9/pZUKn1KvnwKvkIOjUbzzO12Z+AHZNVq9dzWIpGIWCKRHKEN7fvb7XaeLAAjCf+XbDaLFf9CGzq7U6vV2mgPTfksDodD6PV6Z6jL2O32W4lEQoh2IBA4hnO8gfby8vI3VGRsQp1ON1Cr1Z9VKtX9BwCc6/dOpzOgywwM5Qc1ScWoYxNy+Hy+PafT+Z66Q0CVNtRoNHoXlSQ0mUzatbW135lMRoo+B0z2GjV5oCrSMofH4yF3d3JyUoNKEp6cnNxG3d7eHnodqVRKTU2eVqs1FKvX60QFAsFPVJJQoVB8QN3Z2WFROUKh0EibMKg9ahIajQbZI5PJGqgkIZzDV9SVlRX+PiHxePwxKrQu7Ha7pP1YLOZB5eD25PN5cm14YJqreI7w/Mw0dCFGo9GCe2ZnZ1dp6O+U9Xp9HBXedBn+JKZJcAwwSIXNZnuHtlarJXsRPiG0fVwsFlVowz/PF7h7D8nCObAs+8hisXxCu1QqsbiXLAAjT8/lcrFzc3Mfqcuk0+lXcrmcbO71eqpwOPyaLADNZpMtFApkjeOfb1mpVD6B5zU0JA6oyAv38Q11L08ymZzCD3XHwDB/ALGG2jt4Fxh2AAAAAElFTkSuQmCC',
                                        }}
                                    />
                                </View>
                            </TouchableHighlight>
                        </View>
                    </ScrollView>
                    <Text
                        style={styles.close}
                        onPress={() => this.props.close()}
                        onLongPress={() =>
                            AppUtils.changeSystemHomeSettings(
                                this.props.settings,
                            )
                        }>
                        {english ? 'Close' : 'סגור'} X
                    </Text>
                </View>
            </View>
        );
    }
}
