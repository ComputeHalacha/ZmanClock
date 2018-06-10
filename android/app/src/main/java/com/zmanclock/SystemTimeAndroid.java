package com.zmanclock.systemtime;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.os.SystemClock;

public class SystemTimeAndroid extends ReactContextBaseJavaModule {

    public SystemTimeAndroid(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SystemTimeAndroid";
    }

    @ReactMethod
    public boolean setSystemTime(long milliseconds) {
        return SystemClock.setCurrentTimeMillis(milliseconds);
    }

    @ReactMethod
    public long getSystemTime() {
        return SystemClock.currentThreadTimeMillis();
    }
}
