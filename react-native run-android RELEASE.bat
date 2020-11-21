@REM To install this app, follow the steps below.
@REM After successful completion, it will be quite difficult to
@REM access the regular Android home screen and app launcher -
@REM effectively dedicating the device to this app.

@REM Compile the release build of the app *************************************************************************************
cd android
rm app/build/outputs/apk/release/*
./gradlew assembleRelease
ECHO "The release build has been created"
PAUSE

@REM Copy the new apk to the lastestRelesae directory *************************************************************************
cp app/build/outputs/apk/release/app-release.apk ../latestAPK/app-release.apk
ECHO "The release build has been copied to the ./lastestAPK directory"
PAUSE

ECHO "Before installing app: "
ECHO "1. Set developer mode to on. (click 7 times on Build Number in Settings/About Device)"
ECHO "2. Turn on developer debug mode. "
ECHO "3. In Settings/SecuritySet lock screen to 'None'. "
ECHO "4. In Settings/Developer Options, set to never close screen when plugged in. "
ECHO "5. In settings/Display, set screen brightness to 100%. "
ECHO "6. In settings/Display/Sleep - set to never"
ECHO "7. In settings/Display/Sleep - turn off intelligent back-light"
ECHO "8. If on large device, in settings - set to large font size"
PAUSE

@REM Install the app on the device ********************************************************************************************
cd ../
adb install latestAPK/app-release.apk
ECHO "The app has been installed on the device"
PAUSE


@REM Make the app the device owner ********************************************************************************************
adb shell dpm set-device-owner com.zmanclock/.DeviceReceiver
ECHO "The app has been set as the device owner"
PAUSE

@REM Try to Root the device **************************************************************************************************
ECHO "Attempting to Root the device"
adb root
@REM Expect some response about success
adb remount
@REM If that fails try:
	@REM adb root
	@REM adb disable-verity
	@REM adb reboot
	@REM adb root
	@REM adb remount

ECHO "Rooting and Remounting succeeded"
PAUSE

@REM Convert the app to a system app *******************************************************************************************
@REM We will try to move app to the system app folder. 
@REM NOTE: This will almost surely fail if the Rooting did not succeed.
@REM First, access the device command line
adb shell
@REM adb install usually pushes apps to the /data/app directory
cd /data/app/
@REM List the contents of the directory
ls
@REM Now, in the list displayed, find the full name of the com.zmanclock folder. For a new installation it usually is com.zmanclock-1.
@REM We will now attempt to move the app to the system/app directory. 
@REM NOTE: The following command assumes that the app was installed to /data/app/com.zmanclock-1. Change source path as needed.
mv com.zmanclock-1 /system/app/com.zmanclock-1
@REM Exit the android shell
exit
@REM For the system to recognize the new system app, it needs to reboot
adb reboot
ECHO "Converted the app to a system device"
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