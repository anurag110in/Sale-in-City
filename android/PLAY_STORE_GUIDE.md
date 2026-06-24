# Google Play Store Upload & Release Guide (with Firebase Backend & Auth)

This guide walks you through building your production release, configuring Firebase for production, and successfully uploading and publishing the **LocalDeals** Android application (`com.localdeals.app`) to the Google Play Store.

---

## Prerequisites Before Uploading

1. **Google Play Developer Account**: Set up your developer profile at [Google Play Console](https://play.google.com/console/signup) (requires a one-time $25 registration fee).
2. **Firebase Project**: A fully provisioned Firebase Project with:
   - **Firestore Database** enabled.
   - **Authentication (Phone/SMS Sign-In)** enabled.
   - **Cloud Storage** enabled (for shop owner image uploads).
3. **Google Maps API Key**: Generated from the Google Cloud Console with the **Maps SDK for Android** enabled.

---

## Step 1: Create a Secure Release Keystore (App Signing Key)

To upload your app to Google Play, you must sign it with a secure cryptographic release key.

1. Open a terminal on your local machine and run `keytool` to generate a keystore file:
   ```bash
   keytool -genkey -v -keystore localdeals-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias localdeals-key
   ```
2. You will be prompted to:
   - Enter a secure password (write this down!).
   - Enter your name, organizational unit, city, state, and country code.
3. This generates a file named `localdeals-release-key.jks`. Keep this file extremely secure and back it up. If you lose this key, you will not be able to update your app on the Play Store.

---

## Step 2: Configure Release Signing in Gradle

Add the signing configuration securely so that Android Studio can build a signed release bundle.

1. Place `localdeals-release-key.jks` in your local `android/app/` folder.
2. Open your Module-level `build.gradle` file (`android/app/build.gradle`) and add the `signingConfigs` block under `android`:

```groovy
android {
    ...
    signingConfigs {
        release {
            storeFile file("localdeals-release-key.jks")
            storePassword System.getenv("PLAY_STORE_KEYSTORE_PASSWORD") ?: "your_keystore_password"
            keyAlias "localdeals-key"
            keyPassword System.getenv("PLAY_STORE_KEY_PASSWORD") ?: "your_key_password"
        }
    }
    
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
    }
}
```

*Tip: For maximum security, use environment variables to load passwords during CI/CD builds.*

---

## Step 3: Configure Google Maps API Key for Production

1. Open `local.properties` in your local directory and append your production key:
   ```properties
   MAPS_API_KEY=AIzaSyYourProductionGoogleMapsAPIKey Here
   ```
2. Ensure this key has strict restrictions in Google Cloud Console:
   - Restrict usage to the Android app package `com.localdeals.app`.
   - Add your release certificate's SHA-1 fingerprint (retrieved in Step 5).

---

## Step 4: Build the Signed Android App Bundle (AAB)

Google Play requires the **Android App Bundle (.aab)** format instead of APKs for new apps. AABs allow Google Play to optimize download sizes for different devices.

1. Open the project in Android Studio.
2. Wait for Gradle sync to complete successfully.
3. In the top menu, go to **Build > Generate Signed Bundle / APK...**
4. Select **Android App Bundle** and click **Next**.
5. Choose your generated keystore file (`localdeals-release-key.jks`), enter the password, key alias, and key password.
6. Select the **release** build variant and click **Finish**.
7. Once compiling is complete, Android Studio will show a popup with a link to the generated `.aab` file (usually located under `app/release/app-release.aab`).

---

## Step 5: CRITICAL: Connect Firebase to Production (The App Signing Gotcha)

When you upload an App Bundle, Google Play Console signs your final app with its own **Google Play App Signing Key**. This means your local signature SHA-1 changes after publication, which will **break Firebase Phone Authentication** if not registered in Firebase!

### How to link both fingerprints:

1. **Get your Local Release Fingerprints**:
   Run the signing report locally to get your SHA-1 and SHA-256:
   ```bash
   ./gradlew signingReport
   ```
   Copy the `release` configuration's SHA-1 and SHA-256.

2. **Add Local Fingerprints to Firebase**:
   - Go to your **Firebase Project Settings** (gear icon).
   - Under **Your Apps**, select the Android app (`com.localdeals.app`).
   - Click **Add fingerprint** and add both the local release SHA-1 and SHA-256.

3. **Get Google Play App Signing Fingerprints (Do this after uploading the AAB)**:
   - Log into the [Google Play Console](https://play.google.com/console).
   - Select your app, then navigate to **Setup > App Integrity > App Signing** tab.
   - Look for the **App signing key certificate** section.
   - Copy the **SHA-1** and **SHA-256** fingerprints managed by Google.
   - Go back to **Firebase Console > Project Settings** and add these two fingerprints as well!
   *If you miss this step, your users will receive an "SMS verification failed/App not authorized" error in production.*

---

## Step 6: Create the App in Google Play Console

1. Open [Google Play Console](https://play.google.com/console) and click **Create app**.
2. Fill out the initial details:
   - **App Name**: LocalDeals
   - **Default Language**: English
   - **App or Game**: App
   - **Free or Paid**: Free
   - Accept declarations and click **Create app**.
3. Complete the **Initial App Setup Dashboard** tasks:
   - Set privacy policy.
   - Fill out the content rating questionnaire.
   - Configure target audience (e.g., 18+ or general).
   - Complete data safety questionnaire (declare that the app collects phone numbers for login and stores locations for mapping, and that all data is sent securely via HTTPS).

---

## Step 7: Upload AAB & Release to Internal or Production Track

We recommend deploying to the **Internal Testing** track first to verify phone authentication on actual devices before releasing to the public.

1. In the left panel of Play Console, go to **Release > Testing > Internal testing** (or **Production** for direct public release).
2. Click **Create new release** in the top right.
3. If prompted to enroll in **Google Play App Signing**, accept (this is mandatory and recommended).
4. Drag and drop your compiled `app-release.aab` file into the upload box.
5. Provide a release name (e.g., `1.0.0 (1)`) and write short release notes (e.g., `"Initial release of LocalDeals with instant local discount discovery!"`).
6. Click **Next** to run automated pre-launch checks, verify no errors occur, and click **Save**.
7. Click **Start rollout to Internal testing** (or submit for review in Production).
8. Once Google reviews and approves the build (typically 1-3 days for new apps, or instantly for internal testing), your app is live!

---

## Troubleshooting Production Sign-In & Maps

- **SMS OTP is blocked / Recaptcha showing up**:
  Enable safety nets in your GCP credentials console:
  - Go to Google Cloud Console > APIs & Services > Credentials.
  - Enable **Android Device Verification API** or configure safety checks so Firebase can verify actual device integrity without CAPTCHA challenges.
- **Maps are Blank in Production**:
  Ensure the **Maps SDK for Android** API key restrictions in Google Cloud Console contain the Google Play App Signing SHA-1 fingerprint alongside your local debug SHA-1 fingerprint.
