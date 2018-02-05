keytool -importkeystore -srckeystore voetbalpoules-android.jks -destkeystore voetbalpoules-android.jks -deststoretype pkcs12

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore voetbalpoules-android.jks C:\github\voetbalpoules-app\platforms\android\build\outputs\apk\release\android-release-unsigned.apk voetbalpoules-android

%APPDATA$\Local\Android\Sdk\build-tools\27.0.3\zipalign.exe -v 4 C:\github\voetbalpoules-app\platforms\android\build\outputs\apk\release\android-release-unsigned.apk .\voetbalpoules.apk

%APPDATA%\Local\Android\Sdk\build-tools\27.0.3\apksigner verify .\voetbalpoules.apk