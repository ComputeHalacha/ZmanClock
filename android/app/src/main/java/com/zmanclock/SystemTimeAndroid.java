package com.zmanclock.systemtime;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.ReactActivity;

import android.content.Context;
import android.app.Activity;
import android.content.Intent;
import android.os.SystemClock;
import java.util.Calendar;

public class SystemTimeAndroid extends ReactContextBaseJavaModule {

    public SystemTimeAndroid(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SystemTimeAndroid";
    }

    @ReactMethod
    public boolean setSystemTime(final double milliseconds) {
        return SystemClock.setCurrentTimeMillis((long)milliseconds);
    }

    @ReactMethod
    public double getSystemTime() {
        Calendar rightNow = Calendar.getInstance();
        return (double)rightNow.getTimeInMillis();
    }

    @ReactMethod
    public void openSystemTimeSettings() {
        Activity reactActivity = getCurrentActivity();
        reactActivity.startActivity(new Intent(android.provider.Settings.ACTION_DATE_SETTINGS));
    }
}
