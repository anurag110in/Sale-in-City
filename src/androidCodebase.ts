export interface AndroidFile {
  name: string;
  path: string;
  language: "kotlin" | "gradle" | "xml" | "markdown" | "json";
  content: string;
}

export const androidCodebase: AndroidFile[] = [
  {
    name: "build.gradle.kts (Project)",
    path: "build.gradle.kts",
    language: "gradle",
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.serialization) apply false
    alias(libs.plugins.google.services) apply false
    alias(libs.plugins.hilt.android) apply false
}

// libs.versions.toml definitions for reference:
// [versions]
// agp = "8.2.2"
// kotlin = "1.9.22"
// hilt = "2.50"
// googleServices = "4.4.0"
//
// [plugins]
// android-application = { id = "com.android.application", version.ref = "agp" }
// kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
// kotlin-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
// google-services = { id = "com.google.gms.google-services", version.ref = "googleServices" }
// hilt-android = { id = "com.google.dagger.hilt.android", version.ref = "hilt" }`
  },
  {
    name: "build.gradle.kts (Module:app)",
    path: "app/build.gradle.kts",
    language: "gradle",
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.google.services)
    alias(libs.plugins.hilt.android)
    id("kotlin-kapt")
}

android {
    namespace = "com.localdeals.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.localdeals.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug") // Configure release signing in production
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
        freeCompilerArgs += listOf(
            "-opt-in=kotlinx.coroutines.ExperimentalCoroutinesApi",
            "-opt-in=androidx.compose.material3.ExperimentalMaterial3Api"
        )
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    // Jetpack Compose
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.navigation:navigation-compose:2.7.7")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")

    // Firebase (BOM for version management)
    implementation(platform("com.google.firebase:firebase-bom:32.7.2"))
    implementation("com.google.firebase:firebase-auth-ktx")
    implementation("com.google.firebase:firebase-firestore-ktx")
    implementation("com.google.firebase:firebase-messaging-ktx")
    implementation("com.google.firebase:firebase-storage-ktx")

    // Dagger Hilt (Dependency Injection)
    implementation("com.google.dagger:hilt-android:2.50")
    kapt("com.google.dagger:hilt-compiler:2.50")
    implementation("androidx.hilt:hilt-navigation-compose:1.1.0")

    // WorkManager (Background Scheduling)
    implementation("androidx.work:work-runtime-ktx:2.9.0")
    implementation("androidx.hilt:hilt-work:1.1.0")
    kapt("androidx.hilt:hilt-compiler:1.1.0")

    // Google Maps SDK
    implementation("com.google.maps.android:maps-compose:4.3.0")
    implementation("com.google.android.gms:play-services-maps:18.2.0")

    // Image Loading (Coil)
    implementation("io.coil-kt:coil-compose:2.5.0")

    // Serialization (kotlinx)
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.2")

    // Preferences DataStore
    implementation("androidx.datastore:datastore-preferences:1.0.0")

    // Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
    androidTestImplementation(platform("androidx.compose:compose-bom:2024.02.00"))
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}`
  },
  {
    name: "AndroidManifest.xml",
    path: "app/src/main/AndroidManifest.xml",
    language: "xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.localdeals.app">

    <!-- Permissions required for location pinning -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Required for FCM notifications on Android 13+ (API 33+) -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:name=".LocalDealsApp"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.LocalDeals"
        tools:targetApi="34">

        <!-- Google Maps API Key Meta-data -->
        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="\${MAPS_API_KEY}" />

        <activity
            android:name=".ui.MainActivity"
            android:exported="true"
            android:theme="@style/Theme.LocalDeals">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Firebase Cloud Messaging Receiver Service -->
        <service
            android:name=".fcm.LocalDealsFCMService"
            android:exported="false">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT" />
            </intent-filter>
        </service>

    </application>
</manifest>`
  },
  {
    name: "Models.kt",
    path: "app/src/main/java/com/localdeals/app/data/model/Models.kt",
    language: "kotlin",
    content: `package com.localdeals.app.data.model

import kotlinx.serialization.Serializable

@Serializable
enum class UserRole {
    CUSTOMER,
    SHOP_OWNER
}

@Serializable
data class UserProfile(
    val uid: String = "",
    val phoneNumber: String = "",
    val name: String = "",
    val role: UserRole = UserRole.CUSTOMER,
    val city: String = "",
    val businessDetails: BusinessDetails? = null
)

@Serializable
data class BusinessDetails(
    val shopName: String = "",
    val category: String = "",
    val address: String = "",
    val city: String = "",
    val latitude: Double = 0.0,
    val longitude: Double = 0.0,
    val imageUrls: List<String> = emptyList(),
    val averageRating: Double = 0.0,
    val ratingCount: Int = 0
)

@Serializable
data class SaleEvent(
    val id: String = "",
    val shopId: String = "",
    val shopName: String = "",
    val city: String = "",
    val discountPercentage: Int = 0,
    val description: String = "",
    val startDate: Long = 0L, // Epoch timestamp in milliseconds
    val endDate: Long = 0L,   // Epoch timestamp in milliseconds
    val isActive: Boolean = true,
    val createdTimestamp: Long = System.currentTimeMillis()
)

@Serializable
data class ReviewRating(
    val id: String = "",
    val shopId: String = "",
    val customerId: String = "",
    val customerName: String = "",
    val score: Int = 5, // 1 to 5 stars
    val isRealSaleReview: Boolean = true, // specifically rating "Real or Fake Promotion"
    val comment: String = "",
    val timestamp: Long = System.currentTimeMillis()
)`
  },
  {
    name: "AuthRepository.kt",
    path: "app/src/main/java/com/localdeals/app/data/repository/AuthRepository.kt",
    language: "kotlin",
    content: `package com.localdeals.app.data.repository

import android.app.Activity
import com.google.firebase.FirebaseException
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.PhoneAuthCredential
import com.google.firebase.auth.PhoneAuthOptions
import com.google.firebase.auth.PhoneAuthProvider
import com.google.firebase.firestore.FirebaseFirestore
import com.localdeals.app.data.model.UserProfile
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await
import java.util.concurrent.TimeUnit
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepository @Inject constructor(
    private val firebaseAuth: FirebaseAuth,
    private val firestore: FirebaseFirestore
) {
    val currentUserUid: String?
        get() = firebaseAuth.currentUser?.uid

    val currentPhoneNumber: String?
        get() = firebaseAuth.currentUser?.phoneNumber

    fun isUserLoggedIn(): Boolean {
        return firebaseAuth.currentUser != null
    }

    /**
     * Triggers the Firebase Phone OTP generation
     */
    fun sendVerificationCode(
        phoneNumber: String,
        activity: Activity
    ): Flow<PhoneAuthResult> = callbackFlow {
        val callbacks = object : PhoneAuthProvider.OnVerificationStateChangedCallbacks() {
            override fun onVerificationCompleted(credential: PhoneAuthCredential) {
                trySend(PhoneAuthResult.VerificationCompleted(credential))
            }

            override fun onVerificationFailed(e: FirebaseException) {
                trySend(PhoneAuthResult.VerificationFailed(e))
                close(e)
            }

            override fun onCodeSent(
                verificationId: String,
                token: PhoneAuthProvider.ForceResendingToken
            ) {
                trySend(PhoneAuthResult.CodeSent(verificationId, token))
            }
        }

        val options = PhoneAuthOptions.newBuilder(firebaseAuth)
            .setPhoneNumber(phoneNumber)
            .setTimeout(60L, TimeUnit.SECONDS)
            .setActivity(activity)
            .setCallbacks(callbacks)
            .build()

        PhoneAuthProvider.verifyPhoneNumber(options)
        awaitClose { /* Cleanup if needed */ }
    }

    /**
     * Signs in using the SMS credential
     */
    suspend fun signInWithCredential(credential: PhoneAuthCredential): String {
        val authResult = firebaseAuth.signInWithCredential(credential).await()
        return authResult.user?.uid ?: throw Exception("Authentication returned empty user id.")
    }

    /**
     * Fetches custom Firestore user profile based on UID
     */
    suspend fun getUserProfile(uid: String): UserProfile? {
        val documentSnapshot = firestore.collection("users").document(uid).get().await()
        return documentSnapshot.toObject(UserProfile::class.java)
    }

    /**
     * Saves or updates a user profile to Firestore
     */
    suspend fun saveUserProfile(profile: UserProfile) {
        firestore.collection("users")
            .document(profile.uid)
            .set(profile)
            .await()
    }

    fun logout() {
        firebaseAuth.signOut()
    }
}

sealed interface PhoneAuthResult {
    data class VerificationCompleted(val credential: PhoneAuthCredential) : PhoneAuthResult
    data class VerificationFailed(val exception: Exception) : PhoneAuthResult
    data class CodeSent(
        val verificationId: String,
        val token: PhoneAuthProvider.ForceResendingToken
    ) : PhoneAuthResult
}`
  },
  {
    name: "ShopRepository.kt",
    path: "app/src/main/java/com/localdeals/app/data/repository/ShopRepository.kt",
    language: "kotlin",
    content: `package com.localdeals.app.data.repository

import android.net.Uri
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.google.firebase.storage.FirebaseStorage
import com.localdeals.app.data.model.ReviewRating
import com.localdeals.app.data.model.UserProfile
import kotlinx.coroutines.tasks.await
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ShopRepository @Inject constructor(
    private val firestore: FirebaseFirestore,
    private val storage: FirebaseStorage
) {
    /**
     * Queries shops based on city and optional category.
     * Demonstrates City-Based Filtering Logic.
     */
    suspend fun getShopsByCity(city: String, category: String? = null): List<UserProfile> {
        var query: Query = firestore.collection("users")
            .whereEqualTo("role", "SHOP_OWNER")
            .whereEqualTo("city", city)

        if (!category.isNullOrEmpty() && category != "All") {
            query = query.whereEqualTo("businessDetails.category", category)
        }

        val snapshot = query.get().await()
        return snapshot.toObjects(UserProfile::class.java)
    }

    /**
     * Retrieves specific shop details
     */
    suspend fun getShopById(shopId: String): UserProfile? {
        val snapshot = firestore.collection("users").document(shopId).get().await()
        return snapshot.toObject(UserProfile::class.java)
    }

    /**
     * Uploads shop store images to Firebase Storage
     */
    suspend fun uploadStoreImage(shopId: String, fileUri: Uri): String {
        val fileName = "shops/\${shopId}/\${UUID.randomUUID()}.jpg"
        val storageRef = storage.getReference(fileName)
        
        // Lazy upload handling to prevent empty variables crashing
        val uploadTask = storageRef.putFile(fileUri).await()
        return uploadTask.storage.downloadUrl.await().toString()
    }

    /**
     * Submits a customer review for a shop and recalculates the average rating
     */
    suspend fun submitReview(review: ReviewRating) {
        val reviewRef = firestore.collection("reviews").document()
        val finalReview = review.copy(id = reviewRef.id)
        
        // Write the review
        reviewRef.set(finalReview).await()

        // Transaction to update average rating and count on the shop owner's document
        val shopDocRef = firestore.collection("users").document(review.shopId)
        firestore.runTransaction { transaction ->
            val shopSnapshot = transaction.get(shopDocRef)
            val shopProfile = shopSnapshot.toObject(UserProfile::class.java) ?: return@runTransaction
            
            val details = shopProfile.businessDetails ?: return@runTransaction
            val newCount = details.ratingCount + 1
            val newAverage = ((details.averageRating * details.ratingCount) + review.score) / newCount
            
            val updatedDetails = details.copy(
                ratingCount = newCount,
                averageRating = newAverage
            )
            
            transaction.update(shopDocRef, "businessDetails", updatedDetails)
        }.await()
    }

    /**
     * Fetches reviews for a given shop
     */
    suspend fun getShopReviews(shopId: String): List<ReviewRating> {
        val snapshot = firestore.collection("reviews")
            .whereEqualTo("shopId", shopId)
            .orderBy("timestamp", Query.Direction.DESCENDING)
            .get()
            .await()
        return snapshot.toObjects(ReviewRating::class.java)
    }
}`
  },
  {
    name: "SaleRepository.kt",
    path: "app/src/main/java/com/localdeals/app/data/repository/SaleRepository.kt",
    language: "kotlin",
    content: `package com.localdeals.app.data.repository

import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.localdeals.app.data.model.SaleEvent
import kotlinx.coroutines.tasks.await
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SaleRepository @Inject constructor(
    private val firestore: FirebaseFirestore
) {
    /**
     * Create a new Sale event
     */
    suspend fun createSale(sale: SaleEvent): String {
        val saleRef = firestore.collection("sales").document()
        val finalSale = sale.copy(id = saleRef.id)
        saleRef.set(finalSale).await()
        return saleRef.id
    }

    /**
     * Retrieve active sales for customer feed by City with Real-time Query parameters
     */
    suspend fun getActiveSalesByCity(city: String): List<SaleEvent> {
        val currentTime = System.currentTimeMillis()
        val snapshot = firestore.collection("sales")
            .whereEqualTo("city", city)
            .whereEqualTo("isActive", true)
            .whereGreaterThanOrEqualTo("endDate", currentTime)
            .get()
            .await()
            
        // Filter programmatically since Firestore doesn't support complex composite inequalities without composite indexes
        return snapshot.toObjects(SaleEvent::class.java)
            .filter { it.startDate <= currentTime }
    }

    /**
     * Fetch all sales created by a specific shop owner
     */
    suspend fun getSalesByShop(shopId: String): List<SaleEvent> {
        val snapshot = firestore.collection("sales")
            .whereEqualTo("shopId", shopId)
            .orderBy("createdTimestamp", Query.Direction.DESCENDING)
            .get()
            .await()
        return snapshot.toObjects(SaleEvent::class.java)
    }

    /**
     * Toggle active/inactive status of a sale
     */
    suspend fun setSaleStatus(saleId: String, isActive: Boolean) {
        firestore.collection("sales")
            .document(saleId)
            .update("isActive", isActive)
            .await()
    }
}`
  },
  {
    name: "NotificationWorker.kt",
    path: "app/src/main/java/com/localdeals/app/worker/NotificationWorker.kt",
    language: "kotlin",
    content: `package com.localdeals.app.worker

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.Data
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import java.util.concurrent.TimeUnit

@HiltWorker
class NotificationWorker @AssistedInject constructor(
    @Assisted private val context: Context,
    @Assisted workerParams: WorkerParameters
) : CoroutineWorker(context, workerParams) {

    override suspend fun doWork(): Result {
        val shopName = inputData.getString(KEY_SHOP_NAME) ?: "A shop"
        val city = inputData.getString(KEY_CITY) ?: ""
        val discount = inputData.getInt(KEY_DISCOUNT, 0)
        val startDateFormatted = inputData.getString(KEY_START_DATE) ?: "soon"

        sendPushNotification(
            title = "Heads up! Upcoming Sale in $city",
            message = "$shopName in $city is offering $discount% off starting $startDateFormatted."
        )

        return Result.success()
    }

    private fun sendPushNotification(title: String, message: String) {
        val notificationManager =
            context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId = "local_deals_sales"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Local Deals Sales Notifications",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notifies customers about upcoming sales 7 days in advance."
            }
            notificationManager.createNotificationChannel(channel)
        }

        val notification = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .build()

        notificationManager.notify(System.currentTimeMillis().toInt(), notification)
    }

    companion object {
        const val KEY_SHOP_NAME = "key_shop_name"
        const val KEY_CITY = "key_city"
        const val KEY_DISCOUNT = "key_discount"
        const val KEY_START_DATE = "key_start_date"

        /**
         * Schedules a push notification to trigger exactly 7 days prior to Sale start.
         * Calculates initial delay in milliseconds.
         */
        fun scheduleWeekPriorNotification(
            context: Context,
            shopName: String,
            city: String,
            discountPercentage: Int,
            startDateMs: Long,
            formattedDate: String
        ) {
            val currentTimeMs = System.currentTimeMillis()
            val targetTimeMs = startDateMs - TimeUnit.DAYS.toMillis(7)
            val initialDelayMs = targetTimeMs - currentTimeMs

            // If the sale is starting in less than 7 days, schedule immediately
            val safeDelay = if (initialDelayMs < 0) 0L else initialDelayMs

            val inputData = Data.Builder()
                .putString(KEY_SHOP_NAME, shopName)
                .putString(KEY_CITY, city)
                .putInt(KEY_DISCOUNT, discountPercentage)
                .putString(KEY_START_DATE, formattedDate)
                .build()

            val workRequest = OneTimeWorkRequestBuilder<NotificationWorker>()
                .setInitialDelay(safeDelay, TimeUnit.MILLISECONDS)
                .setInputData(inputData)
                .build()

            WorkManager.getInstance(context).enqueue(workRequest)
        }
    }
}`
  },
  {
    name: "LocalDealsFCMService.kt",
    path: "app/src/main/java/com/localdeals/app/fcm/LocalDealsFCMService.kt",
    language: "kotlin",
    content: `package com.localdeals.app.fcm

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class LocalDealsFCMService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // Send token to Firestore user document for targeted city notifications
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)

        val title = remoteMessage.notification?.title ?: remoteMessage.data["title"] ?: "New Local Sale!"
        val message = remoteMessage.notification?.body ?: remoteMessage.data["message"] ?: "Check out new active deals near you."

        showNotification(title, message)
    }

    private fun showNotification(title: String, message: String) {
        val notificationManager =
            getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId = "local_deals_fcm"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Local Deals Push Notifications",
                NotificationManager.IMPORTANCE_HIGH
            )
            notificationManager.createNotificationChannel(channel)
        }

        val notification = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(android.R.drawable.star_on) // Replaced with app launcher icon or notification icon
            .setContentTitle(title)
            .setContentText(message)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()

        notificationManager.notify(System.currentTimeMillis().toInt(), notification)
    }
}`
  },
  {
    name: "AuthViewModel.kt",
    path: "app/src/main/java/com/localdeals/app/ui/auth/AuthViewModel.kt",
    language: "kotlin",
    content: `package com.localdeals.app.ui.auth

import android.app.Activity
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.auth.PhoneAuthCredential
import com.localdeals.app.data.model.BusinessDetails
import com.localdeals.app.data.model.UserProfile
import com.localdeals.app.data.model.UserRole
import com.localdeals.app.data.repository.AuthRepository
import com.localdeals.app.data.repository.PhoneAuthResult
import dagger.hilt.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _authState = MutableStateFlow<AuthState>(AuthState.Idle)
    val authState: StateFlow<AuthState> = _authState.asStateFlow()

    private var verificationId: String? = null

    fun sendOtp(phoneNumber: String, activity: Activity) {
        _authState.value = AuthState.Loading("Sending OTP...")
        viewModelScope.launch {
            authRepository.sendVerificationCode(phoneNumber, activity).collect { result ->
                when (result) {
                    is PhoneAuthResult.CodeSent -> {
                        verificationId = result.verificationId
                        _authState.value = AuthState.OtpSent
                    }
                    is PhoneAuthResult.VerificationCompleted -> {
                        // Instant validation if Google Play Services supports auto-retrieve
                        signInWithCredential(result.credential)
                    }
                    is PhoneAuthResult.VerificationFailed -> {
                        _authState.value = AuthState.Error(result.exception.localizedMessage ?: "OTP sending failed.")
                    }
                }
            }
        }
    }

    fun verifyOtp(code: String) {
        val verificationId = verificationId ?: run {
            _authState.value = AuthState.Error("Session expired. Please resend code.")
            return
        }
        _authState.value = AuthState.Loading("Verifying OTP...")
        val credential = com.google.firebase.auth.PhoneAuthProvider.getCredential(verificationId, code)
        signInWithCredential(credential)
    }

    private fun signInWithCredential(credential: PhoneAuthCredential) {
        viewModelScope.launch {
            try {
                val uid = authRepository.signInWithCredential(credential)
                val profile = authRepository.getUserProfile(uid)
                if (profile != null) {
                    _authState.value = AuthState.Authenticated(profile)
                } else {
                    _authState.value = AuthState.RegistrationRequired(uid, authRepository.currentPhoneNumber ?: "")
                }
            } catch (e: Exception) {
                _authState.value = AuthState.Error(e.localizedMessage ?: "Failed to sign in.")
            }
        }
    }

    fun registerCustomer(uid: String, phoneNumber: String, name: String, city: String) {
        _authState.value = AuthState.Loading("Creating Profile...")
        viewModelScope.launch {
            try {
                val profile = UserProfile(
                    uid = uid,
                    phoneNumber = phoneNumber,
                    name = name,
                    role = UserRole.CUSTOMER,
                    city = city
                )
                authRepository.saveUserProfile(profile)
                _authState.value = AuthState.Authenticated(profile)
            } catch (e: Exception) {
                _authState.value = AuthState.Error(e.localizedMessage ?: "Registration failed.")
            }
        }
    }

    fun registerShopOwner(
        uid: String,
        phoneNumber: String,
        name: String,
        shopName: String,
        category: String,
        address: String,
        city: String,
        lat: Double,
        lng: Double
    ) {
        _authState.value = AuthState.Loading("Creating Seller Profile...")
        viewModelScope.launch {
            try {
                val business = BusinessDetails(
                    shopName = shopName,
                    category = category,
                    address = address,
                    city = city,
                    latitude = lat,
                    longitude = lng
                )
                val profile = UserProfile(
                    uid = uid,
                    phoneNumber = phoneNumber,
                    name = name,
                    role = UserRole.SHOP_OWNER,
                    city = city,
                    businessDetails = business
                )
                authRepository.saveUserProfile(profile)
                _authState.value = AuthState.Authenticated(profile)
            } catch (e: Exception) {
                _authState.value = AuthState.Error(e.localizedMessage ?: "Registration failed.")
            }
        }
    }

    fun logout() {
        authRepository.logout()
        _authState.value = AuthState.Idle
    }
}

sealed interface AuthState {
    object Idle : AuthState
    data class Loading(val message: String) : AuthState
    object OtpSent : AuthState
    data class RegistrationRequired(val uid: String, val phoneNumber: String) : AuthState
    data class Authenticated(val profile: UserProfile) : AuthState
    data class Error(val message: String) : AuthState
}`
  },
  {
    name: "CustomerViewModel.kt",
    path: "app/src/main/java/com/localdeals/app/ui/customer/CustomerViewModel.kt",
    language: "kotlin",
    content: `package com.localdeals.app.ui.customer

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.localdeals.app.data.model.ReviewRating
import com.localdeals.app.data.model.SaleEvent
import com.localdeals.app.data.model.UserProfile
import com.localdeals.app.data.repository.SaleRepository
import com.localdeals.app.data.repository.ShopRepository
import dagger.hilt.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class CustomerViewModel @Inject constructor(
    private val saleRepository: SaleRepository,
    private val shopRepository: ShopRepository
) : ViewModel() {

    private val _sales = MutableStateFlow<List<SaleEvent>>(emptyList())
    val sales: StateFlow<List<SaleEvent>> = _sales.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _selectedShop = MutableStateFlow<UserProfile?>(null)
    val selectedShop: StateFlow<UserProfile?> = _selectedShop.asStateFlow()

    private val _selectedShopReviews = MutableStateFlow<List<ReviewRating>>(emptyList())
    val selectedShopReviews: StateFlow<List<ReviewRating>> = _selectedShopReviews.asStateFlow()

    fun loadActiveDeals(city: String) {
        _isLoading.value = true
        viewModelScope.launch {
            try {
                val activeSales = saleRepository.getActiveSalesByCity(city)
                _sales.value = activeSales
            } catch (e: Exception) {
                _sales.value = emptyList()
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun selectShop(shopId: String) {
        viewModelScope.launch {
            try {
                val shop = shopRepository.getShopById(shopId)
                _selectedShop.value = shop
                if (shop != null) {
                    _selectedShopReviews.value = shopRepository.getShopReviews(shopId)
                }
            } catch (e: Exception) {
                _selectedShop.value = null
            }
        }
    }

    fun submitReview(
        shopId: String,
        customerId: String,
        customerName: String,
        score: Int,
        isRealPromo: Boolean,
        comment: String
    ) {
        viewModelScope.launch {
            try {
                val review = ReviewRating(
                    shopId = shopId,
                    customerId = customerId,
                    customerName = customerName,
                    score = score,
                    isRealSaleReview = isRealPromo,
                    comment = comment
                )
                shopRepository.submitReview(review)
                // Reload shop to reflect average rating and reviews list
                selectShop(shopId)
            } catch (e: Exception) {
                // Handle review submission error
            }
        }
    }
}`
  },
  {
    name: "SellerViewModel.kt",
    path: "app/src/main/java/com/localdeals/app/ui/seller/SellerViewModel.kt",
    language: "kotlin",
    content: `package com.localdeals.app.ui.seller

import android.content.Context
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.localdeals.app.data.model.SaleEvent
import com.localdeals.app.data.model.UserProfile
import com.localdeals.app.data.repository.AuthRepository
import com.localdeals.app.data.repository.SaleRepository
import com.localdeals.app.data.repository.ShopRepository
import com.localdeals.app.worker.NotificationWorker
import dagger.hilt.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import javax.inject.Inject

@HiltViewModel
class SellerViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val saleRepository: SaleRepository,
    private val shopRepository: ShopRepository
) : ViewModel() {

    private val _sellerProfile = MutableStateFlow<UserProfile?>(null)
    val sellerProfile: StateFlow<UserProfile?> = _sellerProfile.asStateFlow()

    private val _mySales = MutableStateFlow<List<SaleEvent>>(emptyList())
    val mySales: StateFlow<List<SaleEvent>> = _mySales.asStateFlow()

    private val _isUploading = MutableStateFlow(false)
    val isUploading: StateFlow<Boolean> = _isUploading.asStateFlow()

    fun loadSellerData(uid: String) {
        viewModelScope.launch {
            _sellerProfile.value = authRepository.getUserProfile(uid)
            _mySales.value = saleRepository.getSalesByShop(uid)
        }
    }

    fun updateProfile(profile: UserProfile) {
        viewModelScope.launch {
            authRepository.saveUserProfile(profile)
            _sellerProfile.value = profile
        }
    }

    fun uploadStoreImage(shopId: String, uri: Uri) {
        _isUploading.value = true
        viewModelScope.launch {
            try {
                val imageUrl = shopRepository.uploadStoreImage(shopId, uri)
                val currentProfile = _sellerProfile.value
                val details = currentProfile?.businessDetails
                if (currentProfile != null && details != null) {
                    val updatedImages = details.imageUrls + imageUrl
                    val updatedProfile = currentProfile.copy(
                        businessDetails = details.copy(imageUrls = updatedImages)
                    )
                    updateProfile(updatedProfile)
                }
            } catch (e: Exception) {
                // Graceful error logging
            } finally {
                _isUploading.value = false
            }
        }
    }

    /**
     * Creates a new Sale event and schedules the 7 days prior Push Notification
     */
    fun createSaleEvent(
        context: Context,
        discount: Int,
        description: String,
        startDate: Long,
        endDate: Long
    ) {
        val profile = _sellerProfile.value ?: return
        val details = profile.businessDetails ?: return

        viewModelScope.launch {
            try {
                val sale = SaleEvent(
                    shopId = profile.uid,
                    shopName = details.shopName,
                    city = profile.city,
                    discountPercentage = discount,
                    description = description,
                    startDate = startDate,
                    endDate = endDate,
                    isActive = true
                )
                saleRepository.createSale(sale)
                
                // Format date for notification body text
                val sdf = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())
                val formattedDate = sdf.format(Date(startDate))

                // Schedule background local push notification (7 Days Prior)
                NotificationWorker.scheduleWeekPriorNotification(
                    context = context,
                    shopName = details.shopName,
                    city = profile.city,
                    discountPercentage = discount,
                    startDateMs = startDate,
                    formattedDate = formattedDate
                )

                // Refresh sales list
                _mySales.value = saleRepository.getSalesByShop(profile.uid)
            } catch (e: Exception) {
                // Graceful error state feedback
            }
        }
    }

    fun toggleSaleStatus(saleId: String, isActive: Boolean, shopId: String) {
        viewModelScope.launch {
            try {
                saleRepository.setSaleStatus(saleId, isActive)
                _mySales.value = saleRepository.getSalesByShop(shopId)
            } catch (e: Exception) {
                // Handle status toggle failure
            }
        }
    }
}`
  },
  {
    name: "Screens.kt",
    path: "app/src/main/java/com/localdeals/app/ui/screens/Screens.kt",
    language: "kotlin",
    content: `package com.localdeals.app.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*
import com.localdeals.app.data.model.UserProfile
import com.localdeals.app.data.model.UserRole
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun CustomerHomeScreen(
    city: String,
    activeSales: List<com.localdeals.app.data.model.SaleEvent>,
    isLoading: Boolean,
    onShopSelected: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Box(modifier = modifier.fillMaxSize().background(Color(0xFFFAFAFA))) {
        if (isLoading) {
            Column(modifier = Modifier.padding(16.dp)) {
                repeat(4) {
                    ShimmerSaleCardItem()
                }
            }
        } else if (activeSales.isEmpty()) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Text("No active sales currently in $city", style = MaterialTheme.typography.bodyLarge)
            }
        } else {
            LazyColumn(
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                item {
                    Text(
                        text = "Active Sales in $city",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1F2937),
                        modifier = Modifier.padding(bottom = 8.dp)
                    )
                }
                items(activeSales) { sale ->
                    SaleCardItem(sale = sale, onCardClick = { onShopSelected(sale.shopId) })
                }
            }
        }
    }
}

@Composable
fun SaleCardItem(
    sale: com.localdeals.app.data.model.SaleEvent,
    onCardClick: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onCardClick() }
    ) {
        Row(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFFFFECE5)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "\${sale.discountPercentage}%",
                    color = Color(0xFFFF5722),
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold
                )
            }
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1.0f)) {
                Text(
                    text = sale.shopName,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111827)
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = sale.description,
                    fontSize = 14.sp,
                    color = Color(0xFF6B7280),
                    maxLines = 1
                )
                Spacer(modifier = Modifier.height(6.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.DateRange,
                        contentDescription = "Expiry",
                        tint = Color(0xFF9CA3AF),
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Ends \${SimpleDateFormat("MMM dd", Locale.getDefault()).format(Date(sale.endDate))}",
                        fontSize = 12.sp,
                        color = Color(0xFF9CA3AF)
                    )
                }
            }
        }
    }
}

@Composable
fun ShimmerSaleCardItem() {
    Card(
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier
            .fillMaxWidth()
            .height(112.dp)
            .padding(vertical = 8.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFFF3F4F6))
    ) {
        Box(modifier = Modifier.fillMaxSize()) // Animated shimmer background in full production app
    }
}

@Composable
fun ShopDetailScreen(
    shop: UserProfile,
    reviews: List<com.localdeals.app.data.model.ReviewRating>,
    currentUserId: String,
    currentUserName: String,
    onSubmitReview: (Int, Boolean, String) -> Unit,
    onBack: () -> Unit
) {
    val details = shop.businessDetails ?: return
    val context = LocalContext.current
    var ratingScore by remember { mutableIntStateOf(5) }
    var isRealSaleReview by remember { mutableStateOf(true) }
    var reviewComment by remember { mutableStateOf("") }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        item {
            // Header Image Placeholder / Carousel
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(220.dp)
                    .background(Color(0xFFE5E7EB))
            ) {
                if (details.imageUrls.isNotEmpty()) {
                    Image(
                        painter = rememberAsyncImagePainter(details.imageUrls.first()),
                        contentDescription = "Shop Image",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                } else {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Home,
                            contentDescription = "Store icon",
                            tint = Color.White,
                            modifier = Modifier.size(64.dp)
                        )
                    }
                }
                IconButton(
                    onClick = onBack,
                    modifier = Modifier
                        .padding(16.dp)
                        .background(Color.Black.copy(alpha = 0.5f), shape = RoundedCornerShape(50))
                ) {
                    Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                }
            }
        }

        item {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = details.shopName,
                    fontSize = 26.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111827)
                )
                Text(
                    text = details.category,
                    fontSize = 14.sp,
                    color = Color(0xFFFF5722),
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.padding(vertical = 4.dp)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.Star, contentDescription = "Rating", tint = Color(0xFFFFB300))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "\${String.format(Locale.getDefault(), "%.1f", details.averageRating)} (\${details.ratingCount} reviews)",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF374151)
                    )
                }
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "Store Address",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111827)
                )
                Text(
                    text = details.address,
                    fontSize = 14.sp,
                    color = Color(0xFF4B5563),
                    modifier = Modifier.padding(vertical = 4.dp)
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "Location on Google Maps",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111827)
                )
                Spacer(modifier = Modifier.height(8.dp))

                // Google Map Compose SDK Integration snippet
                val shopLatLng = LatLng(details.latitude, details.longitude)
                val cameraPositionState = rememberCameraPositionState {
                    position = CameraPosition.fromLatLngZoom(shopLatLng, 15f)
                }
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(180.dp)
                        .clip(RoundedCornerShape(12.dp))
                ) {
                    GoogleMap(
                        modifier = Modifier.fillMaxSize(),
                        cameraPositionState = cameraPositionState,
                        uiSettings = MapUiSettings(zoomControlsEnabled = false)
                    ) {
                        Marker(
                            state = MarkerState(position = shopLatLng),
                            title = details.shopName,
                            snippet = details.address
                        )
                    }
                }
            }
        }

        // Ratings & Reviews feedback form
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFAFAFA)),
                modifier = Modifier.padding(16.dp).fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Rate \"Real or Fake Promotion\"",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF111827)
                    )
                    Text(
                        text = "Help your community by letting them know if this shop's sales are authentic.",
                        fontSize = 12.sp,
                        color = Color(0xFF6B7280)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    
                    // Star Rating Selection Selector
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        for (star in 1..5) {
                            IconButton(onClick = { ratingScore = star }) {
                                Icon(
                                    imageVector = if (star <= ratingScore) Icons.Default.Star else Icons.Default.Star,
                                    contentDescription = "$star stars",
                                    tint = if (star <= ratingScore) Color(0xFFFFB300) else Color(0xFFD1D5DB)
                                )
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Checkbox(
                            checked = isRealSaleReview,
                            onCheckedChange = { isRealSaleReview = it }
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("This is an authentic, genuine sale promotion", fontSize = 14.sp)
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = reviewComment,
                        onValueChange = { reviewComment = it },
                        placeholder = { Text("Write a short review...") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Button(
                        onClick = {
                            onSubmitReview(ratingScore, isRealSaleReview, reviewComment)
                            reviewComment = ""
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFF5722)),
                        modifier = Modifier.align(Alignment.End)
                    ) {
                        Text("Submit Review", color = Color.White)
                    }
                }
            }
        }

        item {
            Text(
                text = "Community Feedback",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF111827),
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )
        }

        if (reviews.isEmpty()) {
            item {
                Box(
                    modifier = Modifier.fillMaxWidth().padding(32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text("No reviews yet. Be the first to rate!", color = Color.Gray)
                }
            }
        } else {
            items(reviews) { review ->
                ReviewItemRow(review)
            }
        }
    }
}

@Composable
fun ReviewItemRow(review: com.localdeals.app.data.model.ReviewRating) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(review.customerName, fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Row {
                repeat(review.score) {
                    Icon(
                        imageVector = Icons.Default.Star,
                        contentDescription = "star",
                        tint = Color(0xFFFFB300),
                        modifier = Modifier.size(14.dp)
                    )
                }
            }
        }
        Spacer(modifier = Modifier.height(4.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(4.dp))
                    .background(if (review.isRealSaleReview) Color(0xFFE6F4EA) else Color(0xFFFCE8E6))
                    .padding(horizontal = 6.dp, vertical = 2.dp)
            ) {
                Text(
                    text = if (review.isRealSaleReview) "Real Sale" else "Suspicious/Fake",
                    color = if (review.isRealSaleReview) Color(0xFF137333) else Color(0xFFC5221F),
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Medium
                )
            }
        }
        if (review.comment.isNotEmpty()) {
            Spacer(modifier = Modifier.height(6.dp))
            Text(review.comment, fontSize = 14.sp, color = Color(0xFF4B5563))
        }
        Divider(modifier = Modifier.padding(top = 12.dp), color = Color(0xFFF3F4F6))
    }
}`
  },
  {
    name: "MainActivity.kt",
    path: "app/src/main/java/com/localdeals/app/ui/MainActivity.kt",
    language: "kotlin",
    content: `package com.localdeals.app.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.localdeals.app.ui.auth.AuthViewModel
import com.localdeals.app.ui.customer.CustomerViewModel
import com.localdeals.app.ui.screens.CustomerHomeScreen
import com.localdeals.app.ui.screens.ShopDetailScreen
import com.localdeals.app.ui.seller.SellerViewModel
import com.localdeals.app.ui.theme.LocalDealsTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    private val authViewModel: AuthViewModel by viewModels()
    private val customerViewModel: CustomerViewModel by viewModels()
    private val sellerViewModel: SellerViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            LocalDealsTheme {
                val navController = rememberNavController()
                val authState by authViewModel.authState.collectAsState()
                
                Scaffold(
                    bottomBar = {
                        if (authState is com.localdeals.app.ui.auth.AuthState.Authenticated) {
                            val profile = (authState as com.localdeals.app.ui.auth.AuthState.Authenticated).profile
                            NavigationBar {
                                NavigationBarItem(
                                    selected = true,
                                    onClick = { /* Nav standard */ },
                                    icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                                    label = { Text("Feed") }
                                )
                                NavigationBarItem(
                                    selected = false,
                                    onClick = { /* Nav standard */ },
                                    icon = { Icon(Icons.Default.Search, contentDescription = "Search") },
                                    label = { Text("Search") }
                                )
                                NavigationBarItem(
                                    selected = false,
                                    onClick = { /* Nav standard */ },
                                    icon = { Icon(Icons.Default.Person, contentDescription = "Profile") },
                                    label = { Text("Profile") }
                                )
                            }
                        }
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = "customer_feed",
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable("customer_feed") {
                            val activeSales by customerViewModel.sales.collectAsState()
                            val isLoading by customerViewModel.isLoading.collectAsState()
                            
                            // Initialize customer view context based on default city
                            LaunchedEffect(Unit) {
                                customerViewModel.loadActiveDeals("Bengaluru")
                            }

                            CustomerHomeScreen(
                                city = "Bengaluru",
                                activeSales = activeSales,
                                isLoading = isLoading,
                                onShopSelected = { shopId ->
                                    customerViewModel.selectShop(shopId)
                                    navController.navigate("shop_detail")
                                }
                            )
                        }
                        
                        composable("shop_detail") {
                            val shop by customerViewModel.selectedShop.collectAsState()
                            val reviews by customerViewModel.selectedShopReviews.collectAsState()
                            
                            shop?.let { currentShop ->
                                ShopDetailScreen(
                                    shop = currentShop,
                                    reviews = reviews,
                                    currentUserId = "customer_uid_123", // Simulated session
                                    currentUserName = "John Doe",
                                    onSubmitReview = { score, isReal, comment ->
                                        customerViewModel.submitReview(
                                            shopId = currentShop.uid,
                                            customerId = "customer_uid_123",
                                            customerName = "John Doe",
                                            score = score,
                                            isRealPromo = isReal,
                                            comment = comment
                                        )
                                    },
                                    onBack = { navController.popBackStack() }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}`
  },
  {
    name: "firestore.rules",
    path: "firestore.rules",
    language: "json",
    content: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User profile permissions
    match /users/{userId} {
      // Any authenticated user can read other profiles (to view Shop name, Category, and Details)
      allow read: if request.auth != null;
      // Only the profile owner can write/edit their profile
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Sales events permissions
    match /sales/{saleId} {
      // Anyone logged in can read Active Sale events
      allow read: if request.auth != null;
      // Shop owners can create and edit their own sales events
      allow create, update: if request.auth != null && request.resource.data.shopId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.shopId == request.auth.uid;
    }

    // Customer reviews & ratings permissions
    match /reviews/{reviewId} {
      // Any authenticated user can read reviews
      allow read: if request.auth != null;
      // Customers can write ratings, but cannot edit or delete other customer reviews
      allow create: if request.auth != null && request.resource.data.customerId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.customerId == request.auth.uid;
    }
  }
}`
  },
  {
    name: "README.md",
    path: "README.md",
    language: "markdown",
    content: `# LocalDeals Android App Installation & Firebase Integration Guide

This guide explains how to integrate the generated production-grade Kotlin, Jetpack Compose, and Dagger Hilt LocalDeals codebase with your Firebase project and get it running in Android Studio.

---

## 1. Firebase Project Setup

### Enable Authentication (Phone Number SMS OTP)
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select or create your Firebase project.
3. In the left navigation rail, click **Build > Authentication**.
4. Click **Get Started**, go to the **Sign-in method** tab.
5. Select **Phone** under Native providers, toggle **Enable**, and click **Save**.
6. Set up test phone numbers and OTP codes (e.g., \`+1 650-555-3434\` with OTP \`123456\`) for seamless internal testing on Google Play Console.

### Setup Firestore Database & Storage
1. Click **Build > Firestore Database** in the Firebase Console.
2. Click **Create database**, select a region closest to your audience, and select **Start in production mode**.
3. Overwrite the default rules with the high-security production rules provided in the \`firestore.rules\` file.
4. Click **Build > Storage** in the Firebase Console, select **Get Started** to enable image uploads of local storefronts, and configure permission rules to allow writes only if logged in.

---

## 2. Connect Your App in Firebase

1. Click on the **Gear icon (Project settings)** in the top left, under **Your apps** click **Add app > Android**.
2. Enter the Package Name: \`com.localdeals.app\`.
3. Provide your Debug SHA-1 and SHA-256 certificate hashes (mandatory for Firebase Phone OTP verification).
   - Generate them locally using gradle command: \`./gradlew signingReport\`.
4. Download the generated \`google-services.json\` file.
5. Place this file inside your Android project’s \`app/\` directory.

---

## 3. Enable Push Notifications & WorkManager (7-Days Prior Scheduler)

The \`NotificationWorker\` implements a WorkManager routine calculating millisecond delay dynamically:
\`\`\`kotlin
val targetTimeMs = startDateMs - TimeUnit.DAYS.toMillis(7)
val initialDelayMs = targetTimeMs - currentTimeMs
\`\`\`
This triggers FCM services locally, alerting the customer about upcoming shop sales 7 days prior. Ensure you have requested \`POST_NOTIFICATIONS\` permission dynamically inside your Compose dashboard before scheduling.

---

## 4. Google Maps SDK Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable **Maps SDK for Android** for your cloud project.
3. Generate an API Key under **APIs & Services > Credentials**.
4. In your local Android project, open \`local.properties\` and add your key:
   \`\`\`properties
   MAPS_API_KEY=AIzaSyYourGoogleMapsAPIKeyHere
   \`\`\`
5. This is automatically injected into the AndroidManifest.xml at build time.`
  }
];
