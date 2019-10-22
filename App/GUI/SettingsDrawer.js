/* eslint-disable react-perf/jsx-no-new-object-as-prop */
import React, { PureComponent } from 'react';
import {
    Image,
    Picker,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import SelectMultiple from 'react-native-select-multiple';
import AppUtils from '../Code/AppUtils';
import { range, setDefault } from '../Code/GeneralUtils';
import Utils from '../Code/JCal/Utils';
import { Locations } from '../Code/Locations';
import { openSystemTimeSettings } from '../Code/SystemTime';
import { version } from '../../package.json';
import Settings from './../Code/Settings';

export default class SettingsDrawer extends PureComponent {
    constructor(props) {
        super(props);
        this.onChangeSettings = this.onChangeSettings.bind(this);
        this.resetSetttings = this.resetSetttings.bind(this);
    }
    onChangeSettings(values) {
        const {
            zmanimToShow,
            location,
            showNotifications,
            numberOfItemsToShow,
            minToShowPassedZman,
            showGaonShir
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
            settings.showNotifications
        );
        settings.numberOfItemsToShow = setDefault(
            numberOfItemsToShow,
            settings.numberOfItemsToShow
        );
        settings.minToShowPassedZman = setDefault(
            minToShowPassedZman,
            settings.minToShowPassedZman
        );
        settings.showGaonShir = setDefault(
            showGaonShir,
            settings.showGaonShir
        );

        this.props.changeSettings(settings);
    }
    openAddCustomZmanim() {
        throw new Error('Method not implemented.');
    }
    resetSetttings() {
        const settings = new Settings();
        this.props.changeSettings(settings);
    }
    render() {
        const {
            zmanimToShow,
            location,
            showNotifications,
            numberOfItemsToShow,
            minToShowPassedZman,
            showGaonShir
        } = this.props.settings,
            fullZmanTypeList = AppUtils.AllZmanTypes(this.props.settings);
        return (
            <View style={styles.outContainer}>
                <View style={styles.container}>
                    <Text style={styles.header}>הגדרות</Text>
                    <Text
                        style={
                            styles.version
                        }>{`שעון זמנים - גירסה ${version}`}</Text>
                    <ScrollView contentContainerStyle={styles.inContainer}>
                        <Text style={styles.label}>בחר מיקום</Text>
                        <Picker
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                            selectedValue={location}
                            onValueChange={location =>
                                this.onChangeSettings({ location })
                            }>
                            {Locations.map((location, i) => (
                                <Picker.Item
                                    key={i}
                                    value={location}
                                    label={location.Name}
                                />
                            ))}
                        </Picker>
                        <Text style={styles.label}>בחר איזה זמנים להציג</Text>
                        <View style={styles.scrollView}>
                            <SelectMultiple
                                items={fullZmanTypeList.map(zt => ({
                                    label: zt.desc,
                                    value: zt,
                                }))}
                                selectedItems={zmanimToShow.map(zts => ({
                                    label: zts.desc,
                                    value: zts,
                                }))}
                                onSelectionsChange={selected => {
                                    this.onChangeSettings({
                                        zmanimToShow: fullZmanTypeList.filter(
                                            zt =>
                                                selected.some(i =>
                                                    AppUtils.IsSameZmanToShow(
                                                        i.value,
                                                        zt
                                                    )
                                                )
                                        ),
                                    });
                                }}
                                style={styles.selectMultipleStyle}
                                rowStyle={styles.selectMultipleRowStyle}
                                checkboxStyle={
                                    styles.selectMultipleCheckboxStyle
                                }
                                selectedCheckboxStyle={
                                    styles.selectMultipleSelectedCheckboxStyle
                                }
                                selectedRowStyle={
                                    styles.selectMultipleSelectedRowStyle
                                }
                                labelStyle={styles.selectMultipleLabelStyle}
                                selectedLabelStyle={
                                    styles.selectMultipleSelectedLabelStyle
                                }
                            />
                        </View>
                        <Text style={styles.label}>העדפות כלליות</Text>
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
                                הצג מידע יומית
                            </Text>
                        </View>
                        <View style={styles.numBoxView}>
                            <Picker
                                style={styles.numberPicker}
                                itemStyle={styles.pickerItem}
                                selectedValue={numberOfItemsToShow}
                                onValueChange={numberOfItemsToShow =>
                                    this.onChangeSettings({
                                        numberOfItemsToShow,
                                    })
                                }>
                                {range(1, 10).map(num => (
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
                                onValueChange={minToShowPassedZman =>
                                    this.onChangeSettings({
                                        minToShowPassedZman,
                                    })
                                }>
                                {range(0, 60).map(num => (
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
                                {'הצג שיר של יום של הגר"א'}
                            </Text>
                        </View>
                        <Text style={styles.label}>עריכת שעה</Text>
                        <Text>
                            השעה עכשיו:{' '}
                            {Utils.getTimeString(this.props.nowTime, true)}
                        </Text>
                        <View style={styles.settingsButtons}>
                            <TouchableHighlight
                                onPress={() => this.openAddCustomZmanim()}>
                                <View style={styles.setTimeView}>
                                    <Text style={styles.labelCheckbox}>
                                        הוסף זמן
                                    </Text>
                                    <Image
                                        style={{ width: 35, height: 35 }}
                                        source={{
                                            uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAHUSURBVDhPrVRdSwJBFN3MPiiDXjK1tKio6O8p+BsEf1+RQWDRl74VRSS7ds7de4ZxVXrpwO69587M2Tt37mzy31hxa+h2u1N3k16vNzNWwD7mvtLBvBbMI30iLIrFhAWiO5j3TgdjhzA/4CP4R/AfGC/xJTEMbNMSWZYVPxLEHM94xlhTRXwIv2lR4MwXbuU0KTlvdTqdTKK07l9Gvnawp3lcfGehJPlym3GriA/7/f4FA5ycpqmEbzBedz+DoegmOUHCxRyYqxmF3OXYBfitU/IauB0MAV6FGbOGUwnFAgTiDbcs+gA2ZEIx8CunxJivOKNipqyLnSAsi674Bvg3uYB4BeYzZ7OgqBWcDzh7bN39+OPH7XZbB6bDXAqdWCsS1skT9Sg+B+vDCIu2uQY/tdFcjP1nWCYqKLMmrfvlyG+4ZcvsKu6xAGWozLhNu0Ke2cR9ij3BUuwFTzhtIhbV1Ru5XSR2AF/bVN+xZeyQYM/Z9BINNcRA8AtizMz6UYsExFmSAW7UiYdyRBP5VbursKpZjQNAaCnnQsVj1uRxVgxS8N65aqZtLrpR/AN9uH/NFyesokkn5XLZJgtYzMzecjaDcKMEfSjGXOAP2PZhT3MqJMkvF8kx31lhwIMAAAAASUVORK5CYII='
                                        }}
                                    />
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={openSystemTimeSettings}>
                                <View style={styles.setTimeView}>
                                    <Text style={styles.labelCheckbox}>
                                        עריכת שעון
                                    </Text>
                                    <Image
                                        style={{ width: 35, height: 35 }}
                                        source={{
                                            uri:
                                                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAMAAAApB0NrAAABUFBMVEUAAABPT09QUFBVVVVPT09/f39PT09VVVUAAABPT09NTU1PT09PT09OTk5FRUVQUFBQUFBMTExPT09ISEhQUFBPT09QUFBRUVFQUFBQUFA/Pz9PT09QUFBOTk5OTk5NTU1PT09QUFBUVFRQUFBQUFBRUVFOTk5VVVVQUFBPT08/Pz9QUFBPT09RUVFOTk5LS0tQUFAzMzNRUVFQUFBQUFBRUVFQUFBPT09OTk5OTk5PT09QUFBRUVFbW1tQUFBQUFBRUVFRUVFPT09QUFBPT09MTExSUlJNTU1PT09mZmZOTk5RUVFRUVFQUFBQUFBPT09PT09PT09PT09RUVFOTk5PT09PT09RUVFQUFBPT09PT09OTk5PT09PT09PT09PT09QUFBcXFxQUFBPT09PT09OTk5RUVFPT09ISEhQUFBPT09QUFBRUVFPT09QUFB3d3dTx2nXAAAAb3RSTlMAEBMGOgKDAwFjIWCNRAt1ORTBDilzuFtPwgjAZl6YLoaJITafXjcPiEMErK0cWCJ4BVVptWe/vrhBtFYZDqVJWI1KWbA1IjuHBRo1L6tvvXdwl05RlleXebZ9a0BqpmeoCz/EpCpRTQecmcVIqbISLGCKAAABk0lEQVR42nXTU2MsQRDF8bPu2di2bSfXtm37//3fbmrdnZnf82lWlRpl+5ruA1eaLowpVnGCRj3HCg1eJPQgI8/UEmCGoyi6B5hpNerHND8u5GRyhZFRzG3VPAEYWlCD3CbmqipmAc63ypeeATqr170LPFpUqOsc8NTJ3AAuVSMn2XanipsR8F6nJoGh2kFZKKgqZad1SZoA6tdtb8woAnYkAc1S7D5yy7ArXQf6kzLaArrVBxQSM2ngQE1ATgn30RzQok4YVuI+bhz2BUTJGeWBMNMenwn3+fvnJMgcwkPVZX4B/4quWv5m+BC+Syr2Aj+P69Vo0WWgIE/bb+Cbq/7PG90BRuT78R04tDq/ANYkYDSnwNcv9EjaeAl7tjOwqlDmyM5aBzYl3QLoUJwVYN+OVA8wk9JZHfUjMtPAcuZspBeYd5IZA4hS4UG2y8CkNzxsOdVtvMKsNYwyZmknPWe5XCq9vo3tck0Nup8DZjyfzzcDZr4oj3v7GV/vM6dQ1+td6vaOPipW90HLNvCu5ZN3yn+wsaIKnTCzAwAAAABJRU5ErkJggg==',
                                        }}
                                    />
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={() => this.resetSetttings()}>
                                <View style={styles.setTimeView}>
                                    <Text style={styles.labelCheckbox}>
                                        אפס נתונים
                                    </Text>
                                    <Image
                                        style={{ width: 35, height: 35 }}
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
                                this.props.settings
                            )
                        }>
                        סגור X
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    outContainer: {
        flex: 1,
        backgroundColor: '#222',
    },
    container: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 6,
    },
    inContainer: {
        alignContent: 'flex-start',
        alignItems: 'flex-start',
    },
    header: {
        color: '#aac',
        fontSize: 20,
        backgroundColor: '#444',
        width: '100%',
        padding: 10,
    },
    version: {
        color: '#E7C45D',
        fontSize: 12,
        textAlign: 'center',
        padding: 5,
    },
    close: {
        color: '#99a',
        fontSize: 15,
        marginTop: 25,
        backgroundColor: '#444',
        width: '100%',
        textAlign: 'center',
        padding: 10,
    },
    label: {
        color: '#99f',
        width: '100%',
        fontWeight: 'bold',
        margin: 10,
    },
    selectMultipleStyle: { backgroundColor: '#333' },
    selectMultipleRowStyle: { backgroundColor: '#333', flex: 1 },
    selectMultipleCheckboxStyle: { backgroundColor: '#333' },
    selectMultipleSelectedCheckboxStyle: { backgroundColor: '#888' },
    selectMultipleSelectedRowStyle: { backgroundColor: '#222322' },
    selectMultipleLabelStyle: { color: '#777' },
    selectMultipleSelectedLabelStyle: { color: '#eee' },
    checkbox: {
        margin: 5,
        minWidth: 37,
    },
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: '#444',
    },
    pickerItem: {
        backgroundColor: '#000',
        color: '#999',
    },
    numberPicker: {
        height: 50,
        width: 60,
        backgroundColor: '#444',
        marginBottom: 5,
        alignItems: 'center',
    },
    checkboxView: {
        flexDirection: 'row',
    },
    numBoxView: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
    },
    scrollView: {
        flex: 1,
        borderRadius: 5,
        backgroundColor: '#333',
        width: '90%',
        marginLeft: 10,
        marginRight: 10,
        padding: 5,
    },
    labelCheckbox: {
        color: '#777',
        margin: 5,
    },
    setTimeView: {
        flexDirection: 'row',
        padding: 2,
        backgroundColor: '#555',
        borderRadius: 5,
    },
    settingsButtons: {
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        flex: 1,
        width: '100%'
    },
});
