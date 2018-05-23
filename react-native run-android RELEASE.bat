cd android
./gradlew assembleRelease
PAUSE

adb shell
dpm set-device-owner com.zmanclock/.DeviceReceiver
PAUSE