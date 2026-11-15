package com.miftah.app;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;
import java.io.File;
import java.io.FileNotFoundException;

/** Hands what the parent chose to share (the family file, a challenge pack or a card picture) to the app they pick, and nothing else;
 *  and a verified update (Miftah-update.apk) to the system installer. */
public class ShareProvider extends ContentProvider {
    private File file(Uri u) throws FileNotFoundException {
        String n = u.getLastPathSegment();
        if (n == null || n.contains("/") || n.contains("..")) throw new FileNotFoundException();
        File f = new File(new File(getContext().getCacheDir(), "share"), n);
        if (!f.isFile()) throw new FileNotFoundException();
        return f;
    }
    @Override public boolean onCreate() { return true; }
    @Override public String getType(Uri u) { String n = u.getLastPathSegment(); return n == null ? "application/zip" : n.endsWith(".png") ? "image/png" : n.endsWith(".apk") ? "application/vnd.android.package-archive" : "application/zip"; }
    @Override public ParcelFileDescriptor openFile(Uri u, String mode) throws FileNotFoundException { return ParcelFileDescriptor.open(file(u), ParcelFileDescriptor.MODE_READ_ONLY); }
    @Override public Cursor query(Uri u, String[] p, String s, String[] a, String o) {
        MatrixCursor c = new MatrixCursor(new String[]{OpenableColumns.DISPLAY_NAME, OpenableColumns.SIZE});
        try { File f = file(u); c.addRow(new Object[]{f.getName(), f.length()}); } catch (FileNotFoundException ignored) { }
        return c;
    }
    @Override public Uri insert(Uri u, ContentValues v) { return null; }
    @Override public int delete(Uri u, String s, String[] a) { return 0; }
    @Override public int update(Uri u, ContentValues v, String s, String[] a) { return 0; }
}
