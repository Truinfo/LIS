# livinSync

npm install -g @ionic/cli native-run cordova-res
ionic start liveSync tabs --type=react --capacitor
npm install @capacitor/camera @capacitor/preferences @capacitor/filesystem
npm install @ionic/pwa-elements

// Apk Building
ionic build
ionic capacitor add android
ionic capacitor sync
cd android && gradlew assembleDebug && cd ..
