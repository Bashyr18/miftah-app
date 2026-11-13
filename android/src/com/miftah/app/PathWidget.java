package com.miftah.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;

import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/** Today's path on the home screen: the next door, and how far along the day is. It reads the app's snapshot and never keeps its own state. */
public class PathWidget extends AppWidgetProvider {
    static void refresh(Context c) {
        AppWidgetManager m = AppWidgetManager.getInstance(c);
        int[] ids = m.getAppWidgetIds(new ComponentName(c, PathWidget.class));
        if (ids != null && ids.length > 0) new PathWidget().onUpdate(c, m, ids);
    }
    @Override
    public void onUpdate(Context c, AppWidgetManager m, int[] ids) {
        JSONObject cfg = Reminder.config(c);
        boolean ar = "ar".equals(cfg.optString("lang"));
        String today = new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date());
        boolean fresh = today.equals(cfg.optString("day"));
        int done = fresh ? cfg.optInt("done") : 0, total = fresh ? cfg.optInt("total") : 0;
        String next = fresh ? cfg.optString("next", "") : "";
        String name = cfg.optString("name", "");
        String title = total > 0 && done >= total ? (ar ? "اكتمل طريق اليوم" : "Today’s path is walked") : next.isEmpty() ? (ar ? "باب اليوم ينتظر" : "Today’s door is waiting") : next;
        for (int id : ids) {
            RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget_path);
            v.setTextViewText(R.id.w_name, name);
            v.setTextViewText(R.id.w_title, title);
            v.setProgressBar(R.id.w_prog, Math.max(total, 1), done, false);
            Intent open = new Intent(Intent.ACTION_VIEW, Uri.parse("miftah://route/home"), c, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            v.setOnClickPendingIntent(R.id.w_root, PendingIntent.getActivity(c, 3, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE));
            m.updateAppWidget(id, v);
        }
    }
}
