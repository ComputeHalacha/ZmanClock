cd android
./gradlew assembleRelease
PAUSE
ECHO "Before installing app: "
ECHO "1. Set developer mode to on. "
ECHO "2. Turn on developer debug mode. "
ECHO "3. In Settings/SecuritySet lock screen to 'None'. "
ECHO "4. In Settings/Developer Options, set to never close screen when plugged in. "
ECHO "5. In settings/Display, set screen brightness to 100%. "
ECHO "6. In settings/Display/Sleep - set to never"
ECHO "7. In settings/Display/Sleep - turn off intelligent backlight"
ECHO "8. If on large device, in settings - set to to large font size"
PAUSE
adb install ./app/build/outputs/apk/release/app-release.apk
PAUSE
adb shell dpm set-device-owner com.zmanclock/.DeviceReceiver
PAUSE
adb reboot
ECHO "All done"
PAUSE