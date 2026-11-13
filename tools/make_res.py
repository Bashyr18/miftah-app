"""Generates the Android resources: launcher icon (a gold key whose bow is the eight-point rosette), styles, widget. Run: python tools/make_res.py"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RES = os.path.join(ROOT, 'android', 'res')


def w(rel, body):
    p = os.path.join(RES, rel); os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, 'w', encoding='utf-8').write(body)


BOW = 'M54,21L60.6,28.9 70.8,27.1 72.6,37.3 82.5,44 77.5,53 82.5,62 72.6,68.7 70.8,78.9 60.6,77.1 54,85 47.4,77.1 37.2,78.9 35.4,68.7 25.5,62 30.5,53 25.5,44 35.4,37.3 37.2,27.1 47.4,28.9Z'
GRAD = '<aapt:attr name="android:fillColor"><gradient android:type="linear" android:startX="28" android:startY="20" android:endX="84" android:endY="96"><item android:offset="0" android:color="#FFFBE7B4"/><item android:offset="0.55" android:color="#FFE2B768"/><item android:offset="1" android:color="#FFB0863F"/></gradient></aapt:attr>'


def key(scale=.62):
    tx = 54 * (1 - scale); ty = 54 * (1 - scale) - 2
    return '''<group android:scaleX="{s}" android:scaleY="{s}" android:translateX="{tx}" android:translateY="{ty}">
<path android:pathData="{b}">{g}</path>
<path android:pathData="M50,76h8v30a3,3 0 0 1 -3,3h-2a3,3 0 0 1 -3,-3z">{g}</path>
<path android:pathData="M58,90h12a2,2 0 0 1 2,2v3a2,2 0 0 1 -2,2h-12z">{g}</path>
<path android:pathData="M58,100h8a2,2 0 0 1 2,2v3a2,2 0 0 1 -2,2h-8z">{g}</path>
<path android:fillColor="#FF0B0D14" android:pathData="M54,42a11,11 0 1 0 0.01,0z"/>
</group>'''.format(s=scale, tx=round(tx, 2), ty=round(ty, 2), b=BOW, g=GRAD)


w('drawable/ic_launcher_fg.xml', '<vector xmlns:android="http://schemas.android.com/apk/res/android" xmlns:aapt="http://schemas.android.com/aapt" android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108">' + key() + '</vector>')
w('drawable/ic_launcher_bg.xml', '''<vector xmlns:android="http://schemas.android.com/apk/res/android" xmlns:aapt="http://schemas.android.com/aapt" android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108"><path android:pathData="M0,0h108v108h-108z"><aapt:attr name="android:fillColor"><gradient android:type="radial" android:centerX="54" android:centerY="44" android:gradientRadius="90"><item android:offset="0" android:color="#FF1B2146"/><item android:offset="0.6" android:color="#FF0C0F1E"/><item android:offset="1" android:color="#FF07080D"/></gradient></aapt:attr></path></vector>''')
w('drawable/ic_launcher_mono.xml', '<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108"><group android:scaleX="0.62" android:scaleY="0.62" android:translateX="20.5" android:translateY="18.5"><path android:fillColor="#FFFFFFFF" android:pathData="%s"/><path android:fillColor="#FFFFFFFF" android:pathData="M50,76h8v33h-8z"/><path android:fillColor="#FFFFFFFF" android:pathData="M58,90h14v7h-14zM58,100h10v7h-10z"/></group></vector>' % BOW)
for n in ('ic_launcher', 'ic_launcher_round'):
    w('mipmap-anydpi-v26/%s.xml' % n, '<?xml version="1.0" encoding="utf-8"?><adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android"><background android:drawable="@drawable/ic_launcher_bg"/><foreground android:drawable="@drawable/ic_launcher_fg"/><monochrome android:drawable="@drawable/ic_launcher_mono"/></adaptive-icon>')
w('drawable/ic_notif.xml', '<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="24dp" android:height="24dp" android:viewportWidth="24" android:viewportHeight="24"><path android:fillColor="#FFFFFFFF" android:fillType="evenOdd" android:pathData="M12,2a6,6 0 0 1 1.2,11.9V15h2.3v2h-2.3v1.3h1.6v2h-1.6V22h-2.4v-8.1A6,6 0 0 1 12,2zM12,5.500a2.500,2.500 0 1 0 0,5 2.500,2.500 0 0 0 0,-5z"/></vector>')
w('drawable/ic_sc_door.xml', '<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="24dp" android:height="24dp" android:viewportWidth="24" android:viewportHeight="24"><path android:fillColor="#FF1A1206" android:pathData="M5,22V10a7,7 0 0 1 14,0v12h-2V10a5,5 0 0 0 -10,0v12z"/><path android:fillColor="#FF1A1206" android:pathData="M9,22V12h6v10z"/></vector>')
w('drawable/ic_sc_parent.xml', '<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="24dp" android:height="24dp" android:viewportWidth="24" android:viewportHeight="24"><path android:fillColor="#FF1A1206" android:pathData="M12,3a4,4 0 1 1 0,8 4,4 0 0 1 0,-8zM4,21c0,-5 3.500,-8 8,-8s8,3 8,8z"/></vector>')
w('drawable/splash.xml', '<?xml version="1.0" encoding="utf-8"?><layer-list xmlns:android="http://schemas.android.com/apk/res/android"><item android:drawable="@color/splash"/></layer-list>')
w('drawable/widget_bg.xml', '<?xml version="1.0" encoding="utf-8"?><shape xmlns:android="http://schemas.android.com/apk/res/android"><gradient android:startColor="#FF1B2146" android:endColor="#FF0B0D14" android:angle="315"/><corners android:radius="22dp"/><stroke android:width="1dp" android:color="#55D9B26F"/></shape>')
w('drawable/widget_prog.xml', '<?xml version="1.0" encoding="utf-8"?><layer-list xmlns:android="http://schemas.android.com/apk/res/android"><item android:id="@android:id/background"><shape><corners android:radius="5dp"/><solid android:color="#33F1D59E"/></shape></item><item android:id="@android:id/progress"><clip><shape><corners android:radius="5dp"/><solid android:color="#FFE2B768"/></shape></clip></item></layer-list>')
w('layout/widget_path.xml', '''<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android" android:id="@+id/w_root" android:layout_width="match_parent" android:layout_height="match_parent" android:orientation="vertical" android:gravity="center_vertical" android:padding="14dp" android:background="@drawable/widget_bg">
  <TextView android:id="@+id/w_name" android:layout_width="wrap_content" android:layout_height="wrap_content" android:textColor="#FFF1D59E" android:textSize="12sp" android:maxLines="1"/>
  <TextView android:id="@+id/w_title" android:layout_width="match_parent" android:layout_height="wrap_content" android:textColor="#FFF5F0E7" android:textSize="16sp" android:textStyle="bold" android:maxLines="2" android:ellipsize="end" android:layout_marginTop="2dp"/>
  <ProgressBar android:id="@+id/w_prog" style="@android:style/Widget.ProgressBar.Horizontal" android:layout_width="match_parent" android:layout_height="9dp" android:layout_marginTop="9dp" android:progressDrawable="@drawable/widget_prog" android:max="5"/>
</LinearLayout>''')
w('xml/widget_path.xml', '<?xml version="1.0" encoding="utf-8"?><appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android" android:minWidth="180dp" android:minHeight="90dp" android:targetCellWidth="3" android:targetCellHeight="1" android:updatePeriodMillis="21600000" android:initialLayout="@layout/widget_path" android:resizeMode="horizontal|vertical" android:widgetCategory="home_screen"/>')
w('xml/shortcuts.xml', '''<?xml version="1.0" encoding="utf-8"?>
<shortcuts xmlns:android="http://schemas.android.com/apk/res/android">
  <shortcut android:shortcutId="today" android:enabled="true" android:icon="@drawable/ic_sc_door" android:shortcutShortLabel="@string/sc_today"><intent android:action="android.intent.action.VIEW" android:targetPackage="com.miftah.app" android:targetClass="com.miftah.app.MainActivity" android:data="miftah://route/home"/></shortcut>
  <shortcut android:shortcutId="parents" android:enabled="true" android:icon="@drawable/ic_sc_parent" android:shortcutShortLabel="@string/sc_parents"><intent android:action="android.intent.action.VIEW" android:targetPackage="com.miftah.app" android:targetClass="com.miftah.app.MainActivity" android:data="miftah://route/parent"/></shortcut>
</shortcuts>''')
w('values/strings.xml', '<?xml version="1.0" encoding="utf-8"?><resources><string name="app_name">Miftāḥ</string><string name="widget_label">Today’s path</string><string name="sc_today">Today</string><string name="sc_parents">Parents</string></resources>')
w('values-ar/strings.xml', '<?xml version="1.0" encoding="utf-8"?><resources><string name="app_name">مفتاح</string><string name="widget_label">طريق اليوم</string><string name="sc_today">اليوم</string><string name="sc_parents">الآباء</string></resources>')
w('values/colors.xml', '<?xml version="1.0" encoding="utf-8"?><resources><color name="splash">#FF07080D</color></resources>')
w('values/styles.xml', '<?xml version="1.0" encoding="utf-8"?><resources><style name="Theme.Miftah" parent="android:Theme.Material.NoActionBar"><item name="android:windowBackground">@drawable/splash</item><item name="android:windowLightStatusBar">false</item></style></resources>')
w('values-v31/styles.xml', '<?xml version="1.0" encoding="utf-8"?><resources><style name="Theme.Miftah" parent="android:Theme.Material.NoActionBar"><item name="android:windowBackground">@drawable/splash</item><item name="android:windowSplashScreenBackground">#FF07080D</item><item name="android:windowSplashScreenAnimatedIcon">@drawable/ic_launcher_fg</item></style></resources>')
print('res ok')
