keytool -importkeystore -srckeystore voetbalpoules-android.jks -destkeystore voetbalpoules-android.jks -deststoretype pkcs12

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ..\voetbalpoules-android.jks C:\github\voetbalpoules-app\platforms\android\build\outputs\apk\release\android-release-unsigned.apk voetbalpoules-android

%LOCALAPPDATA%\Android\Sdk\build-tools\27.0.3\

del ..\voetbalpoules.apk
zipalign.exe -v 4 .\platforms\android\build\outputs\apk\release\android-release-unsigned.apk ..\voetbalpoules.apk

apksigner verify ..\voetbalpoules.apk

adb install ..\voetbalpoules.apk
