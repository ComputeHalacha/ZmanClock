import { StyleSheet } from 'react-native';

export default {
    appStyles: StyleSheet.create({
        headerView: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
        },
        headerTextName: {
            flex: 1,
            textAlign: 'center',
            fontSize: 13,
            color: '#AAAA88',
        },
        toolbarAndroid: {
            height: 40,
            backgroundColor: '#FFFFFF',
            flex: 0,
        },
    }),
    mainStyles: StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
        },
        scrollView: {
            width: '90%',
            height: '75%',
            flex: 1,
        },
        notificationsView: {
            marginTop: 10,
            marginBottom: 10,
            width: '100%',
        },
        notificationsInnerView: {
            justifyContent: 'space-around',
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
        },
        notificationsText: {
            color: '#776666',
            fontWeight: 'bold',
            fontSize: 13,
            lineHeight: 27,
            backgroundColor: '#EEEEDB',
            paddingRight: 8,
            paddingLeft: 8,
            marginBottom: 3,
            borderRadius: 6,
        },
        singleZman: {
            backgroundColor: '#EEEEEE',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 7,
            padding: 7,
            marginBottom: 7,
            minHeight: 130,
        },
        dateText: {
            color: '#447777',
            fontSize: 25,
            textAlign: 'center',
        },
        sDateText: {
            color: '#576',
            fontSize: 15,
            textAlign: 'center',
        },
        timeText1: {
            color: '#AA66AA',
            fontSize: 80,
            padding: 1,
            marginBottom: 15,
        },
        timeText1Eng: {
            color: '#AA66AA',
            fontSize: 60,
            marginBottom: 12,
        },
        timeNowText: {
            color: '#666600',
            fontSize: 20,
            fontWeight: 'bold',
        },
        zmanTimeText: {
            color: '#664466',
        },
        within10ZmanTimeText: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#664466',
        },
        timeRemainingText: {
            fontSize: 38,
            textAlign: 'center',
        },
        timeRemainingTextEng: {
            fontSize: 30,
            textAlign: 'center',
        },
        timeRemainingNumber: {
            color: '#000011',
            fontSize: 20,
        },
        timeRemainingNumberEng: {
            color: '#000011',
            fontSize: 17,
        },
        timeRemainingLabel: {
            fontSize: 18,
            fontWeight: 'bold',
        },
        zmanTypeNameText: {
            color: '#666600',
            fontSize: 22,
        },
        zmanTypeNameTextEng: {
            color: '#666600',
            fontSize: 13,
        },
        zmanTypeNameTextWas: {
            color: '#AAAA77',
            fontSize: 15,
        },
        zmanTypeNameTextWasEng: {
            color: '#AAAA77',
            fontSize: 12,
        },
    }),
    settingsDrawerStyles: StyleSheet.create({
        outContainer: {
            flex: 1,
            backgroundColor: '#DDDDDD',
        },
        container: {
            flex: 1,
            borderWidth: 1,
            borderColor: '#BBBBBB',
            borderRadius: 6,
        },
        inContainer: {
            alignContent: 'flex-start',
            alignItems: 'flex-start',
        },
        header: {
            color: '#555533',
            fontSize: 20,
            backgroundColor: '#BBBBBB',
            width: '100%',
            padding: 10,
        },
        version: {
            color: '#183BA2',
            fontSize: 12,
            textAlign: 'center',
            padding: 5,
        },
        close: {
            color: '#666655',
            fontSize: 15,
            marginTop: 25,
            backgroundColor: '#BBBBBB',
            width: '100%',
            textAlign: 'center',
            padding: 10,
        },
        label: {
            color: '#666600',
            width: '100%',
            fontWeight: 'bold',
            margin: 10,
        },
        selectMultipleStyle: { backgroundColor: '#CCCCCC' },
        selectMultipleRowStyle: { backgroundColor: '#CCCCCC', flex: 1 },
        selectMultipleCheckboxStyle: { backgroundColor: '#CCCCCC' },
        selectMultipleSelectedCheckboxStyle: { backgroundColor: '#777777' },
        selectMultipleSelectedRowStyle: { backgroundColor: '#DDDCDD' },
        selectMultipleLabelStyle: { color: '#888888' },
        selectMultipleSelectedLabelStyle: { color: '#111111' },
        checkbox: {
            margin: 5,
            minWidth: 50,
        },
        picker: {
            height: 50,
            width: '100%',
            backgroundColor: '#BBBBBB',
            color: '#888888',
        },
        pickerItem: {
            backgroundColor: '#FFFFFF',
            color: '#666666',
        },
        numberPicker: {
            height: 50,
            width: 60,
            backgroundColor: '#BBBBBB',
            marginBottom: 5,
            alignItems: 'center',
        },
        checkboxView: {
            flexDirection: 'row',
        },
        numBoxView: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            padding: 10,
            marginBottom: 10,
        },
        scrollView: {
            flex: 1,
            borderRadius: 5,
            backgroundColor: '#CCCCCC',
            width: '90%',
            marginLeft: 10,
            marginRight: 10,
            padding: 5,
        },
        labelCheckbox: {
            color: '#888888',
            margin: 5,
        },
        setTimeView: {
            flexDirection: 'row',
            padding: 2,
            backgroundColor: '#AAAAAA',
            borderRadius: 5,
        },
        settingsButtons: {
            margin: 10,
            flexDirection: 'row',
            justifyContent: 'space-around',
            flex: 1,
            width: '100%',
        },
    }),
    customZmanimStyles: StyleSheet.create({
        outContainer: {
            flex: 1,
            backgroundColor: '#DDDDDD',
        },
        container: {
            flex: 1,
            borderWidth: 1,
            borderColor: '#BBBBBB',
            borderRadius: 6,
        },
        inContainer: {
            alignContent: 'flex-start',
            alignItems: 'flex-start',
        },
        header: {
            color: '#555533',
            fontSize: 20,
            backgroundColor: '#BBBBBB',
            width: '100%',
            padding: 10,
        },
        close: {
            color: '#666655',
            fontSize: 15,
            marginTop: 25,
            backgroundColor: '#BBBBBB',
            width: '100%',
            textAlign: 'center',
            padding: 10,
        },
        label: {
            color: '#666600',
            width: '100%',
            fontWeight: 'bold',
            margin: 10,
        },
        checkbox: {
            margin: 5,
            minWidth: 37,
        },
        pickerItem: {
            backgroundColor: '#FFFFFF',
            color: '#666666',
        },
        numberPicker: {
            height: 50,
            width: 60,
            backgroundColor: '#BBBBBB',
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
            backgroundColor: '#CCCCCC',
            width: '90%',
            marginLeft: 10,
            marginRight: 10,
            padding: 5,
        },
        labelCheckbox: {
            color: '#888888',
            margin: 5,
        },
        setTimeView: {
            flexDirection: 'row',
            padding: 2,
            backgroundColor: '#AAAAAA',
            borderRadius: 5,
        },
    }),
};