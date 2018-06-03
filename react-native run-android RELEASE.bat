cd android
./gradlew assembleRelease
PAUSE
ECHO "Before installing app: "
ECHO "1. Set developer mode to on. "
ECHO "2. Turn on developer debug mode. "
ECHO "3. Set lock screen to 'None'. "
ECHO "4. Set developer option to never close screen when plugged in. "
PAUSE
adb install ./app/build/outputs/apk/release/app-release.apk
PAUSE
adb shell dpm set-device-owner com.zmanclock/.DeviceReceiver
PAUSE
adb reboot
ECHO "All done"
PAUSE