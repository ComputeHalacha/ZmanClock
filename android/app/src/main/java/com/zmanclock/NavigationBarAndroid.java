package com.zmanclock.navbar;

import android.app.Activity;
import android.content.Intent;
import android.view.View;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class NavigationBarAndroid extends ReactContextBaseJavaModule {

    public NavigationBarAndroid(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "NavigationBarAndroid";
    }

    @ReactMethod
    public void hide() {
        Activity reactActivity = getCurrentActivity();
        if (reactActivity != null) {
            final View decorView = reactActivity.getWindow().getDecorView();
            final int uiOptions = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                                | View.SYSTEM_UI_FLAG_FULLSCREEN
                                | View.SYSTEM_UI_FLAG_IMMERSIVE
                                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION;
            reactActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    decorView.setSystemUiVisibility(uiOptions);
                }
            });
        }
    }

    @ReactMethod
    public void changeSystemHomeSettings() {
        Activity reactActivity = getCurrentActivity();
        reactActivity.startActivity(new Intent(android.provider.Settings.ACTION_HOME_SETTINGS));
    }
}
