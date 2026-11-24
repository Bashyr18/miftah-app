package com.miftah.app;

import java.security.KeyFactory;
import java.security.Signature;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

final class UpdateSignature {
    private UpdateSignature() { }

    static byte[] verify(String pinnedKey, String payload, String signature) throws Exception {
        Base64.Decoder base64 = Base64.getDecoder();
        Signature verifier = Signature.getInstance("SHA256withECDSA");
        verifier.initVerify(KeyFactory.getInstance("EC").generatePublic(new X509EncodedKeySpec(base64.decode(pinnedKey))));
        byte[] data = base64.decode(payload);
        verifier.update(data);
        if (!verifier.verify(base64.decode(signature))) throw new java.security.SignatureException("Invalid update manifest signature");
        return data;
    }
}
