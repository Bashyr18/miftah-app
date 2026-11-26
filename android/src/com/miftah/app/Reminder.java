package com.miftah.app;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;

import org.json.JSONObject;

import java.util.Calendar;

/** One quiet daily nudge for school time. It has no sound: no bells, no chimes. */
public class Reminder extends BroadcastReceiver {
    private static final String CH = "school";

    static JSONObject config(Context c) {
        try { return new JSONObject(c.getSharedPreferences("m", Context.MODE_PRIVATE).getString("config", "{}")); }
        catch (Exception e) { return new JSONObject(); }
    }

    static void schedule(Context c) {
        AlarmManager am = c.getSystemService(AlarmManager.class);
        if (am == null) return;
        Intent i = new Intent(c, Reminder.class).setAction("com.miftah.app.REMIND");
        PendingIntent pi = PendingIntent.getBroadcast(c, 1, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        JSONObject r = config(c).optJSONObject("remind");
        if (r == null || !r.optBoolean("on")) { am.cancel(pi); return; }
        Calendar t = Calendar.getInstance();
        t.set(Calendar.HOUR_OF_DAY, r.optInt("h", 9)); t.set(Calendar.MINUTE, r.optInt("m", 0)); t.set(Calendar.SECOND, 0);
        if (t.getTimeInMillis() <= System.currentTimeMillis() + 5000) t.add(Calendar.DAY_OF_YEAR, 1);
        am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, t.getTimeInMillis(), pi);
    }

    @Override
    public void onReceive(Context c, Intent in) {
        String a = in.getAction();
        if ("com.miftah.app.REMIND".equals(a)) post(c);
        schedule(c);
        PathWidget.refresh(c);
    }

    private void post(Context c) {
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        if (nm == null) return;
        JSONObject cfg = config(c);
        boolean ar = "ar".equals(cfg.optString("lang"));
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel ch = new NotificationChannel(CH, ar ? "وقت المدرسة" : "School time", NotificationManager.IMPORTANCE_DEFAULT);
            ch.setSound(null, null);
            nm.createNotificationChannel(ch);
        }
        Intent open = new Intent(Intent.ACTION_VIEW, Uri.parse("miftah://route/home"), c, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pi = PendingIntent.getActivity(c, 2, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        Calendar cal = Calendar.getInstance();
        String today = String.format(java.util.Locale.US, "%04d-%02d-%02d", cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) + 1, cal.get(Calendar.DAY_OF_MONTH));
        String next = today.equals(cfg.optString("day", "")) ? cfg.optString("next", "") : "";
        Notification n = new Notification.Builder(c, CH).setSmallIcon(R.drawable.ic_notif)
                .setContentTitle(ar ? "باب اليوم ينتظر" : "Today’s door is waiting")
                .setContentText(next.isEmpty() ? (ar ? "افتح مفتاح" : "Open Miftāḥ") : next)
                .setContentIntent(pi).setAutoCancel(true).build();
        try { nm.notify(1, n); } catch (SecurityException ignored) { }
    }
}
