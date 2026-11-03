package com.blindrank.app;

import android.Manifest;
import android.app.Activity;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;
import android.provider.MediaStore;
import android.util.Base64;
import android.view.DisplayCutout;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.webkit.WebViewAssetLoader;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends Activity {

    private static final String HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + HOST + "/assets/www/index.html";
    private static final int REQ_MEDIA = 41;

    private WebView web;
    private PermissionRequest pendingRequest;
    private final Handler ui = new Handler(Looper.getMainLooper());

    // video transfer state
    private File tempVideo;
    private OutputStream tempOut;
    private String videoName = "BlindRank.mp4";
    private String videoMime = "video/mp4";
    private Uri lastVideoUri;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window w = getWindow();
        w.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        w.setStatusBarColor(Color.TRANSPARENT);
        w.setNavigationBarColor(Color.parseColor("#09090C"));
        if (Build.VERSION.SDK_INT >= 30) w.setDecorFitsSystemWindows(false);

        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#09090C"));
        setContentView(web);
        goImmersive();

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        s.setTextZoom(100);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setVerticalScrollBarEnabled(false);
        web.setHorizontalScrollBarEnabled(false);

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .setDomain(HOST)
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                if (HOST.equals(u.getHost())) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception ignored) {}
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                pushInsets();
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                ui.post(() -> handlePermission(request));
            }
        });

        web.addJavascriptInterface(new Bridge(), "BlindRankNative");
        web.setOnApplyWindowInsetsListener((v, insets) -> { pushInsets(); return insets; });

        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        else web.loadUrl(START_URL);
    }

    private void goImmersive() {
        Window w = getWindow();
        if (Build.VERSION.SDK_INT >= 30) {
            WindowInsetsController c = w.getInsetsController();
            if (c != null) {
                c.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                c.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            w.getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
        }
    }

    /** Tell the page how much space the camera cut-out / gesture bar takes (in CSS px). */
    private void pushInsets() {
        if (web == null) return;
        WindowInsets wi = web.getRootWindowInsets();
        float d = getResources().getDisplayMetrics().density;
        int top = 0, bottom = 0;
        if (wi != null) {
            DisplayCutout cut = wi.getDisplayCutout();
            if (cut != null) { top = cut.getSafeInsetTop(); bottom = cut.getSafeInsetBottom(); }
            if (Build.VERSION.SDK_INT >= 30) {
                int sysBottom = wi.getInsets(WindowInsets.Type.navigationBars()).bottom;
                int sysTop = wi.getInsets(WindowInsets.Type.statusBars()).top;
                bottom = Math.max(bottom, sysBottom);
                top = Math.max(top, sysTop);
            }
        }
        final String js = "document.documentElement.style.setProperty('--native-top','" + Math.round(top / d) + "px');"
                + "document.documentElement.style.setProperty('--native-bottom','" + Math.round(bottom / d) + "px');";
        ui.post(() -> web.evaluateJavascript(js, null));
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) { goImmersive(); pushInsets(); }
    }

    /* ---------------- camera / mic permission bridge ---------------- */
    private void handlePermission(PermissionRequest request) {
        List<String> need = new ArrayList<>();
        for (String r : request.getResources()) {
            if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(r) && checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED)
                need.add(Manifest.permission.CAMERA);
            if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(r) && checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED)
                need.add(Manifest.permission.RECORD_AUDIO);
        }
        if (need.isEmpty()) { request.grant(request.getResources()); return; }
        if (pendingRequest != null) pendingRequest.deny();
        pendingRequest = request;
        requestPermissions(need.toArray(new String[0]), REQ_MEDIA);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode != REQ_MEDIA || pendingRequest == null) return;
        boolean cam = checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED;
        boolean mic = checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED;
        List<String> grant = new ArrayList<>();
        for (String r : pendingRequest.getResources()) {
            if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(r) && cam) grant.add(r);
            if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(r) && mic) grant.add(r);
        }
        boolean wantedCam = false;
        for (String r : pendingRequest.getResources()) if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(r)) wantedCam = true;
        if (grant.isEmpty() || (wantedCam && !cam)) pendingRequest.deny();
        else pendingRequest.grant(grant.toArray(new String[0]));
        pendingRequest = null;
    }

    /* ---------------- back button ---------------- */
    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        web.evaluateJavascript("(window.__onAndroidBack && window.__onAndroidBack()) ? 'y' : 'n'", value -> {
            if (value == null || !value.contains("y")) MainActivity.super.onBackPressed();
        });
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        web.saveState(outState);
    }

    @Override
    protected void onPause() { super.onPause(); web.onPause(); }

    @Override
    protected void onResume() { super.onResume(); web.onResume(); goImmersive(); }

    @Override
    protected void onDestroy() {
        if (web != null) { web.destroy(); web = null; }
        super.onDestroy();
    }

    /* ---------------- JS bridge ---------------- */
    public class Bridge {
        @JavascriptInterface
        public void haptic(String pattern) {
            try {
                Vibrator v;
                if (Build.VERSION.SDK_INT >= 31) {
                    VibratorManager vm = (VibratorManager) getSystemService(Context.VIBRATOR_MANAGER_SERVICE);
                    v = vm.getDefaultVibrator();
                } else {
                    v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
                }
                if (v == null || !v.hasVibrator()) return;
                String[] parts = pattern.split(",");
                if (parts.length == 1) {
                    long ms = Math.max(1, Long.parseLong(parts[0].trim()));
                    v.vibrate(VibrationEffect.createOneShot(ms, VibrationEffect.DEFAULT_AMPLITUDE));
                } else {
                    long[] t = new long[parts.length + 1];
                    t[0] = 0;
                    for (int i = 0; i < parts.length; i++) t[i + 1] = Long.parseLong(parts[i].trim());
                    v.vibrate(VibrationEffect.createWaveform(t, -1));
                }
            } catch (Exception ignored) {}
        }

        @JavascriptInterface
        public void shareText(String title, String text) {
            Intent i = new Intent(Intent.ACTION_SEND);
            i.setType("text/plain");
            i.putExtra(Intent.EXTRA_SUBJECT, title);
            i.putExtra(Intent.EXTRA_TEXT, text);
            ui.post(() -> startActivity(Intent.createChooser(i, "Share your ranking")));
        }

        @JavascriptInterface
        public void videoBegin(String filename, String mime) {
            try {
                closeTemp();
                videoName = filename;
                videoMime = (mime == null || mime.isEmpty()) ? "video/mp4" : mime.split(";")[0];
                tempVideo = new File(getCacheDir(), "pending_video");
                tempOut = new FileOutputStream(tempVideo, false);
            } catch (Exception e) { tempOut = null; }
        }

        @JavascriptInterface
        public void videoChunk(String b64) {
            try { if (tempOut != null) tempOut.write(Base64.decode(b64, Base64.DEFAULT)); } catch (Exception ignored) {}
        }

        @JavascriptInterface
        public boolean videoEnd() {
            try {
                if (tempOut == null) return false;
                tempOut.flush(); tempOut.close(); tempOut = null;
                ContentResolver cr = getContentResolver();
                ContentValues cv = new ContentValues();
                cv.put(MediaStore.Video.Media.DISPLAY_NAME, videoName);
                cv.put(MediaStore.Video.Media.MIME_TYPE, videoMime);
                cv.put(MediaStore.Video.Media.RELATIVE_PATH, Environment.DIRECTORY_MOVIES + "/Blind Rank");
                cv.put(MediaStore.Video.Media.IS_PENDING, 1);
                Uri uri = cr.insert(MediaStore.Video.Media.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY), cv);
                if (uri == null) return false;
                try (InputStream in = new FileInputStream(tempVideo); OutputStream out = cr.openOutputStream(uri)) {
                    byte[] buf = new byte[64 * 1024];
                    int n;
                    while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
                }
                cv.clear();
                cv.put(MediaStore.Video.Media.IS_PENDING, 0);
                cr.update(uri, cv, null, null);
                //noinspection ResultOfMethodCallIgnored
                tempVideo.delete();
                lastVideoUri = uri;
                return true;
            } catch (Exception e) {
                ui.post(() -> Toast.makeText(MainActivity.this, "Couldn't save video", Toast.LENGTH_SHORT).show());
                return false;
            }
        }

        @JavascriptInterface
        public boolean shareLastVideo() {
            if (lastVideoUri == null) return false;
            final Uri u = lastVideoUri;
            Intent i = new Intent(Intent.ACTION_SEND);
            i.setType(videoMime);
            i.putExtra(Intent.EXTRA_STREAM, u);
            i.putExtra(Intent.EXTRA_TEXT, "My Blind Rank 🏆");
            i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            ui.post(() -> startActivity(Intent.createChooser(i, "Share your clip")));
            return true;
        }

        @JavascriptInterface
        public String version() {
            try {
                PackageInfo p = getPackageManager().getPackageInfo(getPackageName(), 0);
                return "v" + p.versionName + " (" + p.getLongVersionCode() + ")";
            } catch (Exception e) { return "v2"; }
        }
    }

    private void closeTemp() {
        try { if (tempOut != null) tempOut.close(); } catch (Exception ignored) {}
        tempOut = null;
    }
}
