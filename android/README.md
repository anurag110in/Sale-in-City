# LocalDeals Android App Installation & Firebase Integration Guide

This guide explains how to integrate the generated production-grade Kotlin, Jetpack Compose, and Dagger Hilt LocalDeals codebase with your Firebase project and get it running in Android Studio.

---

## 1. Firebase Project Setup

### Enable Authentication (Phone Number SMS OTP)
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select or create your Firebase project.
3. In the left navigation rail, click **Build > Authentication**.
4. Click **Get Started**, go to the **Sign-in method** tab.
5. Select **Phone** under Native providers, toggle **Enable**, and click **Save**.
6. Set up test phone numbers and OTP codes (e.g., `+1 650-555-3434` with OTP `123456`) for seamless internal testing on Google Play Console.

### Setup Firestore Database & Storage
1. Click **Build > Firestore Database** in the Firebase Console.
2. Click **Create database**, select a region closest to your audience, and select **Start in production mode**.
3. Overwrite the default rules with the high-security production rules provided in the `firestore.rules` file.
4. Click **Build > Storage** in the Firebase Console, select **Get Started** to enable image uploads of local storefronts, and configure permission rules to allow writes only if logged in.

---

## 2. Connect Your App in Firebase

1. Click on the **Gear icon (Project settings)** in the top left, under **Your apps** click **Add app > Android**.
2. Enter the Package Name: `com.localdeals.app`.
3. Provide your Debug SHA-1 and SHA-256 certificate hashes (mandatory for Firebase Phone OTP verification).
   - Generate them locally using gradle command: `./gradlew signingReport`.
4. Download the generated `google-services.json` file.
5. Place this file inside your Android project’s `app/` directory.

---

## 3. Enable Push Notifications & WorkManager (7-Days Prior Scheduler)

The `NotificationWorker` implements a WorkManager routine calculating millisecond delay dynamically:
```kotlin
val targetTimeMs = startDateMs - TimeUnit.DAYS.toMillis(7)
val initialDelayMs = targetTimeMs - currentTimeMs
```
This triggers FCM services locally, alerting the customer about upcoming shop sales 7 days prior. Ensure you have requested `POST_NOTIFICATIONS` permission dynamically inside your Compose dashboard before scheduling.

---

## 4. Google Maps SDK Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable **Maps SDK for Android** for your cloud project.
3. Generate an API Key under **APIs & Services > Credentials**.
4. In your local Android project, open `local.properties` and add your key:
   ```properties
   MAPS_API_KEY=AIzaSyYourGoogleMapsAPIKeyHere
   ```
5. This is automatically injected into the AndroidManifest.xml at build time.
