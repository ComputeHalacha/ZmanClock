@REM To install this app, follow the steps below.
@REM After successful completion, it will be quite difficult to
@REM access the regular Android home screen and app launcher -
@REM effectively dedicating the device to this app.

cd android
rm app/build/outputs/apk/release/*
./gradlew assembleRelease
PAUSE

@REM Copy the new apk to the lastestRelesae directory.
cp app/build/outputs/apk/release/app-release.apk ../latestAPK/app-release.apk

ECHO "Before installing app: "
ECHO "1. Set developer mode to on. "
ECHO "2. Turn on developer debug mode. "
ECHO "3. In Settings/SecuritySet lock screen to 'None'. "
ECHO "4. In Settings/Developer Options, set to never close screen when plugged in. "
ECHO "5. In settings/Display, set screen brightness to 100%. "
ECHO "6. In settings/Display/Sleep - set to never"
ECHO "7. In settings/Display/Sleep - turn off intelligent back-light"
ECHO "8. If on large device, in settings - set to large font size"
PAUSE

cd ../
adb install latestAPK/app-release.apk
PAUSE

adb shell dpm set-device-owner com.zmanclock/.DeviceReceiver
PAUSE

ECHO "Try to Root the device **************************************************************************************************"
adb root
@REM Some response about success
adb remount
@REM Remount succeeded

    ECHO "If that fails try"
    adb root
    adb disable-verity
    adb reboot
    adb root
    adb remount
    @REM Remount succeeded

ECHO "Now if the rooting suceeded, try to move app to system app folder. (may need rooted device) *****************************"
adb shell
cd /data/app/
ls
PAUSE

@REM Find full name of com.zmanclock folder. Say it is com.zmanclock-1.
mv com.zmanclock-1 /system/app/com.zmanclock-1
exit
PAUSE

adb reboot
PAUSE

@REM If all the above is successful, the device will be almost hermetically "locked" on this app -
@REM without any obvious way to access the system settings etc.
@REM For the developer, there is a hidden back-door within the app to access the regular Android system.
@REM To access this back-door, open the settings drawer, set the settings to:
@REM   • location = 'פומפדיתא'
@REM   • showNotifications = false
@REM   • numberOfItemsToShow = 9
@REM   • minToShowPassedZman = 57
@REM Then do a long-press on the Close button at the bottom of the settings drawer.
@REM If done correctly, the Android settings page where you choose the Home app should show up.
@REM Set the home page to the Launcher App.
@REM Long press the start key to reboot the device into the Launcher App.