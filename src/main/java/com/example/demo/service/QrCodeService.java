
package com.example.demo.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Base64;

@Service
public class QrCodeService {

    public String gerar(String codigo) throws Exception {
        BitMatrix matriz = new QRCodeWriter().encode(
            codigo,
            BarcodeFormat.QR_CODE,
            300,
            300
        );

        ByteArrayOutputStream saida =
            new ByteArrayOutputStream();

        MatrixToImageWriter.writeToStream(
            matriz, "PNG", saida);

        return Base64.getEncoder()
            .encodeToString(saida.toByteArray());
    }
}
