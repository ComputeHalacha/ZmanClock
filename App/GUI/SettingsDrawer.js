import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Picker,
    ScrollView,
    CheckBox,
    Image,
    TouchableHighlight
} from 'react-native';
import { Locations } from '../Code/Locations';
import { ZmanTypes } from '../Code/ZmanTypes';
import { range, setDefault } from '../Code/GeneralUtils';
import Utils from '../Code/JCal/Utils';
import { openSystemTimeSettings } from '../Code/SystemTime';

export default class SettingsDrawer extends PureComponent {
    constructor(props) {
        super(props);
        this.onChangeSettings = this.onChangeSettings.bind(this);
    }
    onChangeSettings(values) {
        const { zmanimToShow, location, showNotifications, numberOfItemsToShow, minToShowPassedZman } = values,
            settings = this.props.settings.clone();
        if (zmanimToShow) {
            settings.zmanimToShow = zmanimToShow;
        }
        if (location) {
            settings.location = location;
        }
        settings.showNotifications = setDefault(showNotifications, settings.showNotifications);
        settings.numberOfItemsToShow = setDefault(numberOfItemsToShow, settings.numberOfItemsToShow);
        settings.minToShowPassedZman = setDefault(minToShowPassedZman, settings.minToShowPassedZman);

        this.props.changeSettings(settings);
    }
    render() {
        const { zmanimToShow, location, showNotifications, numberOfItemsToShow, minToShowPassedZman } = this.props.settings;
        return (
            <View style={styles.outContainer}>
                <View style={styles.container}>
                    <Text style={styles.header}>שעון זמנים - הגדרות</Text>
                    <ScrollView contentContainerStyle={styles.inContainer}>
                        <Text style={styles.label}>בחר מיקום</Text>
                        <Picker
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                            selectedValue={location}
                            onValueChange={location => this.onChangeSettings({ location })}>
                            {Locations.map((location, i) =>
                                <Picker.Item key={i} value={location} label={location.Name} />)}
                        </Picker>
                        <Text style={styles.label}>בחר איזה זמנים להציג</Text>
                        <View style={styles.scrollView}>
                            {ZmanTypes.map((zt, i) => <View style={styles.checkboxView} key={i}>
                                <CheckBox
                                    value={Boolean(zmanimToShow.find(z => z.name === zt.name))}
                                    onValueChange={selected => {
                                        const zmanimToShowList = zmanimToShow.filter(zts =>
                                            zts.name !== zt.name);
                                        if (selected) {
                                            zmanimToShowList.push(zt);
                                        }
                                        this.onChangeSettings({ zmanimToShow: zmanimToShowList });
                                    }}
                                    style={styles.checkbox} />
                                <Text style={styles.labelCheckbox}>{zt.decs}</Text>
                            </View>)}
                        </View>
                        <Text style={styles.label}>העדפות כלליות</Text>
                        <View style={styles.checkboxView}>
                            <CheckBox
                                value={Boolean(showNotifications)}
                                onValueChange={showNotifications =>
                                    this.onChangeSettings({ showNotifications })
                                }
                                style={styles.checkbox} />
                            <Text style={styles.labelCheckbox}>הצג מידע יומית</Text>
                        </View>
                        <View style={styles.numBoxView}>
                            <Picker
                                style={styles.numberPicker}
                                itemStyle={styles.pickerItem}
                                selectedValue={numberOfItemsToShow}
                                onValueChange={numberOfItemsToShow => this.onChangeSettings({ numberOfItemsToShow })}>
                                {range(1, 10).map(num =>
                                    <Picker.Item key={num} value={num} label={num.toString()} />)}
                            </Picker>
                            <Text style={styles.labelCheckbox}>מקסימום פרטים להציג במסך:     </Text>
                        </View>
                        <View style={styles.numBoxView}>
                            <Picker
                                style={styles.numberPicker}
                                itemStyle={styles.pickerItem}
                                selectedValue={minToShowPassedZman}
                                onValueChange={minToShowPassedZman => this.onChangeSettings({ minToShowPassedZman })}>
                                {range(0, 60).map(num =>
                                    <Picker.Item key={num} value={num} label={num.toString()} />)}
                            </Picker>
                            <Text style={styles.labelCheckbox}>מספר דקות להציג זמנים שעברו: </Text>
                        </View>
                        <Text style={styles.label}>עריכת שעה</Text>
                        <Text>השעה עכשיו: {Utils.getTimeString(this.props.nowTime, true)}</Text>
                        <View style={{ margin: 10 }}>
                            <TouchableHighlight onPress={openSystemTimeSettings}>
                                <View style={styles.setTimeView}>
                                    <Text style={styles.labelCheckbox}>עריכת שעון</Text>
                                    <Image
                                        style={{ width: 35, height: 35 }}
                                        source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAMAAAApB0NrAAABUFBMVEUAAABPT09QUFBVVVVPT09/f39PT09VVVUAAABPT09NTU1PT09PT09OTk5FRUVQUFBQUFBMTExPT09ISEhQUFBPT09QUFBRUVFQUFBQUFA/Pz9PT09QUFBOTk5OTk5NTU1PT09QUFBUVFRQUFBQUFBRUVFOTk5VVVVQUFBPT08/Pz9QUFBPT09RUVFOTk5LS0tQUFAzMzNRUVFQUFBQUFBRUVFQUFBPT09OTk5OTk5PT09QUFBRUVFbW1tQUFBQUFBRUVFRUVFPT09QUFBPT09MTExSUlJNTU1PT09mZmZOTk5RUVFRUVFQUFBQUFBPT09PT09PT09PT09RUVFOTk5PT09PT09RUVFQUFBPT09PT09OTk5PT09PT09PT09PT09QUFBcXFxQUFBPT09PT09OTk5RUVFPT09ISEhQUFBPT09QUFBRUVFPT09QUFB3d3dTx2nXAAAAb3RSTlMAEBMGOgKDAwFjIWCNRAt1ORTBDilzuFtPwgjAZl6YLoaJITafXjcPiEMErK0cWCJ4BVVptWe/vrhBtFYZDqVJWI1KWbA1IjuHBRo1L6tvvXdwl05RlleXebZ9a0BqpmeoCz/EpCpRTQecmcVIqbISLGCKAAABk0lEQVR42nXTU2MsQRDF8bPu2di2bSfXtm37//3fbmrdnZnf82lWlRpl+5ruA1eaLowpVnGCRj3HCg1eJPQgI8/UEmCGoyi6B5hpNerHND8u5GRyhZFRzG3VPAEYWlCD3CbmqipmAc63ypeeATqr170LPFpUqOsc8NTJ3AAuVSMn2XanipsR8F6nJoGh2kFZKKgqZad1SZoA6tdtb8woAnYkAc1S7D5yy7ArXQf6kzLaArrVBxQSM2ngQE1ATgn30RzQok4YVuI+bhz2BUTJGeWBMNMenwn3+fvnJMgcwkPVZX4B/4quWv5m+BC+Syr2Aj+P69Vo0WWgIE/bb+Cbq/7PG90BRuT78R04tDq/ANYkYDSnwNcv9EjaeAl7tjOwqlDmyM5aBzYl3QLoUJwVYN+OVA8wk9JZHfUjMtPAcuZspBeYd5IZA4hS4UG2y8CkNzxsOdVtvMKsNYwyZmknPWe5XCq9vo3tck0Nup8DZjyfzzcDZr4oj3v7GV/vM6dQ1+td6vaOPipW90HLNvCu5ZN3yn+wsaIKnTCzAwAAAABJRU5ErkJggg==' }} />
                                </View>
                            </TouchableHighlight>
                        </View>
                    </ScrollView>
                    <Text style={styles.close}
                        onPress={() => this.props.close()}
                        onLongPress={() => this.props.showSettings()}>סגור X</Text>
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
        borderRadius: 6
    },
    inContainer: {
        alignContent: 'flex-start',
        alignItems: 'flex-start'
    },
    header: {
        color: '#aac',
        fontSize: 20,
        marginBottom: 10,
        backgroundColor: '#444',
        width: '100%',
        padding: 10,
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
        margin: 10
    },
    checkbox: {
        margin: 5,
        minWidth: 37,
        padding: 5
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
        alignItems: 'center'
    },
    checkboxView: {
        flexDirection: 'row'
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
        padding: 5
    },
    labelCheckbox: {
        color: '#777',
        margin: 5
    },
    setTimeView: {
        flexDirection: 'row',
        padding: 2,
        backgroundColor: '#555',
        borderRadius: 5
    },
});
