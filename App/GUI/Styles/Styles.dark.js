import { StyleSheet } from 'react-native';

export default {
    appStyles: StyleSheet.create({
        headerView: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#000000'
        },
        headerTextName: {
            flex: 1,
            textAlign: 'center',
            fontSize: 13,
            color: '#555577'
        },
        toolbarAndroid: {
            height: 40,
            backgroundColor: '#000000',
            flex: 0
        },
    }),
    mainStyles: StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#000000',
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
            flexWrap: 'wrap',
            width: '100%',
        },
        notificationsText: {
            color: '#889999',
            fontWeight: 'bold',
            fontSize: 13,
            lineHeight: 27,
            backgroundColor:'#111124',
            paddingRight:8,
            paddingLeft:8,
            marginBottom:3,
            borderRadius:6
        },
        singleZman: {
            backgroundColor: '#111111',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 7,
            padding: 20,
            width: '100%',
            marginBottom: 10,
            minHeight: 130
        },
        dateText: {
            color: '#bb8888',
            fontSize: 25,
            textAlign: 'center'
        },
        timeText1: {
            color: '#559955',
            fontSize: 80,
            padding: 1,
            marginBottom: 15
        },
        timeNowText: {
            color: '#9999ff',
            fontSize: 20,
            fontWeight: 'bold'
        },
        zmanTimeText: {
            color: '#99bb99'
        },
        within10ZmanTimeText: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#99bb99'
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
            color: '#9999ff',
            fontSize: 22
        },
        zmanTypeNameTextWas: {
            color: '#555588',
            fontSize: 15
        }
    }),
    settingsDrawerStyles: StyleSheet.create({
        outContainer: {
            flex: 1,
            backgroundColor: '#222222',
        },
        container: {
            flex: 1,
            borderWidth: 1,
            borderColor: '#444444',
            borderRadius: 6,
        },
        inContainer: {
            alignContent: 'flex-start',
            alignItems: 'flex-start',
        },
        header: {
            color: '#aaaacc',
            fontSize: 20,
            backgroundColor: '#444444',
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
            color: '#9999aa',
            fontSize: 15,
            marginTop: 25,
            backgroundColor: '#444444',
            width: '100%',
            textAlign: 'center',
            padding: 10,
        },
        label: {
            color: '#9999ff',
            width: '100%',
            fontWeight: 'bold',
            margin: 10,
        },
        selectMultipleStyle: { backgroundColor: '#333333' },
        selectMultipleRowStyle: { backgroundColor: '#333333', flex: 1 },
        selectMultipleCheckboxStyle: { backgroundColor: '#333333' },
        selectMultipleSelectedCheckboxStyle: { backgroundColor: '#888888' },
        selectMultipleSelectedRowStyle: { backgroundColor: '#222322' },
        selectMultipleLabelStyle: { color: '#777777' },
        selectMultipleSelectedLabelStyle: { color: '#eeeeee' },
        checkbox: {
            margin: 5,
            minWidth: 37,
        },
        picker: {
            height: 50,
            width: '100%',
            backgroundColor: '#444444',
        },
        pickerItem: {
            backgroundColor: '#000000',
            color: '#999999',
        },
        numberPicker: {
            height: 50,
            width: 60,
            backgroundColor: '#444444',
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
            backgroundColor: '#333333',
            width: '90%',
            marginLeft: 10,
            marginRight: 10,
            padding: 5,
        },
        labelCheckbox: {
            color: '#777777',
            margin: 5,
        },
        setTimeView: {
            flexDirection: 'row',
            padding: 2,
            backgroundColor: '#555555',
            borderRadius: 5,
        },
        settingsButtons: {
            margin: 10,
            flexDirection: 'row',
            justifyContent: 'space-around',
            flex: 1,
            width: '100%'
        },
    }),
    customZmanimStyles: StyleSheet.create({
        outContainer: {
            flex: 1,
            backgroundColor: '#222222',
        },
        container: {
            flex: 1,
            borderWidth: 1,
            borderColor: '#444444',
            borderRadius: 6,
        },
        inContainer: {
            alignContent: 'flex-start',
            alignItems: 'flex-start',
        },
        header: {
            color: '#aaaacc',
            fontSize: 20,
            backgroundColor: '#444444',
            width: '100%',
            padding: 10,
        },
        close: {
            color: '#9999aa',
            fontSize: 15,
            marginTop: 25,
            backgroundColor: '#444444',
            width: '100%',
            textAlign: 'center',
            padding: 10,
        },
        label: {
            color: '#9999ff',
            width: '100%',
            fontWeight: 'bold',
            margin: 10,
        },
        checkbox: {
            margin: 5,
            minWidth: 37,
        },
        pickerItem: {
            backgroundColor: '#000000',
            color: '#999999',
        },
        numberPicker: {
            height: 50,
            width: 60,
            backgroundColor: '#444444',
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
            backgroundColor: '#333333',
            width: '90%',
            marginLeft: 10,
            marginRight: 10,
            padding: 5,
        },
        labelCheckbox: {
            color: '#777777',
            margin: 5,
        },
        setTimeView: {
            flexDirection: 'row',
            padding: 2,
            backgroundColor: '#555555',
            borderRadius: 5,
        },
    }),
};
