package com.zmanclock.systemtime;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.ReactActivity;

import android.content.Context;
import android.app.Activity;
import android.app.AlarmManager;
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
    public void setSystemTime(final double milliseconds) {
        Activity reactActivity = getCurrentActivity();
        AlarmManager am = (AlarmManager) reactActivity.getSystemService(Context.ALARM_SERVICE);
        am.setTime((long)milliseconds);
    }

    @ReactMethod
    public double getSystemTime() {
        Calendar rightNow = Calendar.getInstance();
        return (double)rightNow.getTimeInMillis();
    }

    @ReactMethod
    public void openSystemTimeSettings() {

    }
}
