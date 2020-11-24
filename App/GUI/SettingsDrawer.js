/* eslint-disable react-perf/jsx-no-new-object-as-prop */
import React, {PureComponent, Fragment} from 'react';
import {
    Image,
    ScrollView,
    Text,
    TouchableHighlight,
    View,
    BackHandler,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import ToggleSwitch from 'toggle-switch-react-native';
import {Picker} from '@react-native-community/picker';
import AppUtils from '../Code/AppUtils';
import {range, setDefault, onChangeLanguage} from '../Code/GeneralUtils';
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
                    <ScrollView contentContainerStyle={styles.inContainer}>
                        <Text style={styles.label}>
                            {english ? 'Choose app language' : 'בחר שפה'}
                        </Text>
                        <View style={styles.checkboxView}>
                            <Text style={styles.labelCheckbox}>
                                {english ? 'Hebrew  ' : 'עברית  '}
                            </Text>
                            <ToggleSwitch
                                isOn={english}
                                onColor="#555"
                                offColor="#555"
                                size="large"
                                onToggle={(isOn) => {
                                    this.onChangeSettings({english: isOn});
                                    onChangeLanguage(isOn);
                                }}
                            />
                            <Text style={styles.labelCheckbox}>
                                {english ? '  English' : '  אנגלית'}
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
                                        <View style={styles.zmanTypesView}>
                                            <Text style={styles.labelZmanType}>
                                                {english ? zt.eng : zt.desc}
                                            </Text>
                                            <Text
                                                style={
                                                    showZmanType
                                                        ? styles.showTag
                                                        : styles.noShowTag
                                                }>
                                                {showZmanType
                                                    ? english
                                                        ? 'Showing'
                                                        : 'הצג'
                                                    : english
                                                    ? 'Not showing'
                                                    : 'אל תציג'}
                                            </Text>
                                            <ToggleSwitch
                                                isOn={showZmanType}
                                                size="large"
                                                onColor="#377696"
                                                offColor="#444"
                                                onToggle={() =>
                                                    this.toggleZmanType(zt)
                                                }
                                            />
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
                                value={Boolean(showNotifications)}
                                onValueChange={(checked) =>
                                    this.onChangeSettings({
                                        showNotifications: checked,
                                    })
                                }
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
                                value={Boolean(showGaonShir)}
                                onValueChange={(checked) =>
                                    this.onChangeSettings({
                                        showGaonShir: checked,
                                    })
                                }
                                customStyle={styles.checkbox}
                            />
                            <Text style={styles.labelCheckbox}>
                                {english
                                    ? 'Show the Shir Shel Yom of the Gr"a'
                                    : 'הצג שיר של יום של הגר"א'}
                            </Text>
                        </View>
                        <View style={styles.checkboxView}>
                            <CheckBox
                                value={Boolean(showDafYomi)}
                                onValueChange={(checked) =>
                                    this.onChangeSettings({
                                        showDafYomi: checked,
                                    })
                                }
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
                                {english ? 'Light Theme  ' : 'רקע בהיר  '}
                            </Text>
                            <ToggleSwitch
                                isOn={this.state.theme === 'dark'}
                                onColor="#345"
                                offColor="#89a"
                                size="large"
                                onToggle={(isOn) =>
                                    this.onChangeSettings({theme: otherTheme})
                                }
                            />
                            <Text style={styles.labelCheckbox}>
                                {english ? '  Dark Theme' : '  רקע כהה'}
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

                        <TouchableHighlight
                            style={styles.settingsButtonsOutside}
                            onPress={() => this.openAddCustomZmanim()}>
                            <View style={styles.settingsButton}>
                                <Text style={styles.labelCheckbox}>
                                    {english ? 'Add Custom Zman' : 'הוסף זמן'}
                                </Text>
                                <Image
                                    style={{width: 35, height: 35}}
                                    source={{
                                        uri:
                                            'data:image/png;base64,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',
                                    }}
                                />
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.settingsButtonsOutside}
                            onPress={() => this.resetSettings()}>
                            <View style={styles.settingsButton}>
                                <Text style={styles.labelCheckbox}>
                                    {english
                                        ? 'Reset Settings'
                                        : 'איפוס הגדרות'}
                                </Text>
                                <Image
                                    style={{width: 35, height: 35}}
                                    source={{
                                        uri:
                                            'data:image/png;base64,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',
                                    }}
                                />
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.settingsButtonsOutside}
                            onPress={() => BackHandler.exitApp()}>
                            <View style={styles.settingsButton}>
                                <Text style={styles.labelCheckbox}>
                                    {english ? 'Exit App' : 'צא'}
                                </Text>
                                <Image
                                    style={{width: 35, height: 35}}
                                    source={{
                                        uri:
                                            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEoAAABQCAYAAAC+neOMAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAABJRJREFUeJztnE9oHFUcxz+/2WkT/5QasF4E/6dmE7SCQkVFCZY0wWgUJJcieKkXD1KQlELs7jRCwIPoQVTqSU/mZLGEJlGKQgsVEao02bQqWrS1aUhiRc2f3fl5SBOS3Ukys/tmErPvAznkvTe/7+PD7Mu8ycyCxWKxWCwWi8ViWX8k9EhVeTA7uGMuJdsLBT9VTphLfmrYa/+jnGPXm1VFPdB7vG5u2t0HPI+wW5CbK8zzUXl2xGvpr7BO4rhBjfe921/jTqa65ma0S6RiOUtxFG0FwotSlXR2cJ/Ci8A18N/JeW3fGZxTKJzihqae/nvdidQZgSMGzqASRHRblPFpb/B1hE9E6BDhJRE51ZAZaDE9r7VYJqrpyIldhYJzWoRdcQWqUoh4RNfy36VWRI8lLWtR1M6egbv9ggwJclucgYKcj3jErQFtictyAR7+8Nst/1we70Nkx0oDFSaArwV+U9WIZ8U8gkz5N/77fplzLa62IKsj5+0dNFNzZVyAvy+NvyoijwQNUJhA5aDD1MfDXuds3BOKRnKy5M7MydobZObX4I+c/uyrPj3qtf0S5yRWI50d0LVH6bSqxCrLuYnZ9kBJyl+i7F1PSeGJf81yVPSZ4Gx6hr3WH+MKNk+8shygZG1SNL9Vtx6NIzBe4pPlKNxVEod8f9ZrnjIdlgzxyHKCrr5V9YrJkOQxL6tkCwMgiG8qYP0wKytQ1ObBnKxNLgpMyaoCUWBCVuD9qKg8lTnpjjHzlgr747g1Y4bKtjtGzqgxZrsRObBxJS1Q/pllRNT1u4//E8qTZWqNqjVUJyGiy6qSxTyIaLKqWBREkVXloiCsLCsKCCPLilpkdVlW1DLmZaUzA08W91hRJUgtou8Vt1pRASg0FLdZUcGcLm6woopRrqqjrxQ3W1FLUa6S8ptHD7eNFndZUQtclzRyuO1cULcVBWtKAisqlCSodlEhJUE1i4ogCYyJ0mtm6iRERElgTJR8YKZOApQhCQz9FyaXbTnakB3yEd0vynYTNRcR7jdWq0xJYEgUIpqDj5j/MUq4B8lCUIEkqJbFvEJJUA2iDEiCzS7KkCRYQZQKZb0UtKEwKAnm300JerLuDhPF1w3DkgAcUfmpuFGgsf7NL243FZIoMUgCcBA9E9ThzhUOmAxKhJgkATiqciwwU/S1xszQE6YDYyNGSQBOrunPLxVKnicXxPWl8PlOb+DxOIKNErMkAIfOzgLKG0GdgtyS8vkqnTnxdmNmaGMu8AlIgoVXZVWlwRv4TJDnVp2T6gXgokC+zLTLedftvtC95/ewh6y6hUlIEizs9UR0S+/xl+em3VMikl5psIjUA/WVBKby+THgYCU1gEQlwZILzh8OtU8qzh5VHYkzUFTqooxX9GJAY6KSoOjKfNRruVRDzWOqBP4lNINujTJaoAvVxY+fql5JWhIEbGHOes1TuWzLCyLSCRrxtdYwyHiU0SPZ1k8dx9+Naq+qHnLIP5S0JFjrCyL6+lLpc9uaEacD9FFF7hHVOkTCf7HEElSZdNDWYa/1m7Jma7FYLBaLxWKxWCwWi0H+A3Z9AKBalGAjAAAAAElFTkSuQmCC',
                                    }}
                                />
                            </View>
                        </TouchableHighlight>
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
