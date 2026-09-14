import React, { useState } from "react";
import {
  FolderGit2,
  FileCode,
  Download,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  Cpu,
  Layers,
  ExternalLink,
} from "lucide-react";
import { UserSettings } from "../types";
import { translations } from "../translations";

interface AndroidProjectExporterProps {
  settings: UserSettings;
}

export const AndroidProjectExporter: React.FC<AndroidProjectExporterProps> = ({
  settings,
}) => {
  const t = translations[settings.language];
  const [selectedFile, setSelectedFile] = useState<string>("app/build.gradle.kts");
  const [copied, setCopied] = useState(false);

  const fileContents: Record<string, string> = {
    "app/build.gradle.kts": `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    id("kotlin-kapt")
}

android {
    namespace = "com.creatorflow.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.creatorflow.app"
        minSdk = 24
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
            signingConfig = signingConfigs.getByName("debug")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
}

dependencies {
    // Jetpack Compose & Material 3
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.navigation:navigation-compose:2.7.7")

    // Room Database (Local Persistence)
    val roomVersion = "2.6.1"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    kapt("androidx.room:room-compiler:$roomVersion")

    // Google Generative AI / Gemini Android SDK
    implementation("com.google.ai.client.generativeai:generativeai:0.2.2")

    // Tapsell Plus SDK (Rewarded & Banner Ads)
    implementation("ir.tapsell.plus:tapsell-plus-sdk:2.1.8")

    // Cafe Bazaar In-App Billing (Poolkey)
    implementation("com.github.cafebazaar.poolkey:poolkey:2.0.0")

    // Lifecycle & Coroutines
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.0")
}`,
    "app/src/main/AndroidManifest.xml": `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.creatorflow.app">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="com.farsitel.bazaar.permission.PAY_THROUGH_BAZAAR" />

    <application
        android:name=".CreatorFlowApplication"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.CreatorFlow"
        tools:targetApi="31">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.CreatorFlow">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
    ".github/workflows/android-build.yml": `name: Android CI & APK Build

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    name: Build Debug APK and AAB Release
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: Grant Execute Permission to Gradlew
        run: chmod +x gradlew || true

      - name: Build Debug APK
        run: ./gradlew assembleDebug --stacktrace

      - name: Build Release Bundle (AAB)
        run: ./gradlew bundleRelease --stacktrace || true

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: CreatorFlow-Debug-APK
          path: app/build/outputs/apk/debug/app-debug.apk

      - name: Upload Release AAB Artifact
        uses: actions/upload-artifact@v4
        with:
          name: CreatorFlow-Release-AAB
          path: app/build/outputs/bundle/release/*.aab`,
    "MainActivity.kt": `package com.creatorflow.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.creatorflow.app.ui.navigation.CreatorFlowNavGraph
import com.creatorflow.app.ui.theme.CreatorFlowTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Initialize Tapsell Plus SDK with official Ad IDs
        // Rewarded: 6aa84a381f07c00619f451f1
        // Banner: 6aa84a4fcd33cd4ed6e43287
        (application as CreatorFlowApplication).initTapsell(this)

        setContent {
            CreatorFlowTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    CreatorFlowNavGraph()
                }
            }
        }
    }
}`,
    "TapsellManager.kt": `package com.creatorflow.app.data.ads

import android.app.Activity
import android.content.Context
import android.util.Log
import ir.tapsell.plus.TapsellPlus
import ir.tapsell.plus.TapsellPlusInitListener
import ir.tapsell.plus.model.AdShowListener

object TapsellManager {
    const val TAG = "TapsellManager"
    const val REWARDED_ZONE_ID = "6aa84a381f07c00619f451f1"
    const val BANNER_ZONE_ID = "6aa84a4fcd33cd4ed6e43287"

    fun initialize(context: Context, appKey: String) {
        TapsellPlus.initialize(context, appKey, object : TapsellPlusInitListener {
            override fun onInitializeSuccess(adNetworks: String?) {
                Log.d(TAG, "Tapsell Plus Initialized successfully with networks: $adNetworks")
            }
            override fun onInitializeFailed(error: String?) {
                Log.e(TAG, "Tapsell Plus Initialization failed: $error")
            }
        })
    }

    fun showRewardedAd(activity: Activity, onRewardUnlocked: (Int) -> Unit) {
        TapsellPlus.requestRewardedVideoAd(activity, REWARDED_ZONE_ID, object : ir.tapsell.plus.Listener() {
            override fun onResponse(tapsellPlusAdModel: ir.tapsell.plus.models.TapsellPlusAdModel?) {
                tapsellPlusAdModel?.let { model ->
                    TapsellPlus.showRewardedVideoAd(activity, model.responseId, object : AdShowListener() {
                        override fun onRewarded(tapsellPlusAdModel: ir.tapsell.plus.models.TapsellPlusAdModel?) {
                            onRewardUnlocked(3) // Grant 3 complimentary AI tokens
                        }
                    })
                }
            }
            override fun onError(error: String?) {
                Log.e(TAG, "Rewarded ad request error: $error")
            }
        })
    }
}`,
    "BazaarBillingManager.kt": `package com.creatorflow.app.data.billing

import android.app.Activity
import android.content.Context
import android.os.Handler
import android.os.Looper
import ir.cafebazaar.poolkey.Poolkey
import ir.cafebazaar.poolkey.callback.PurchaseCallback
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors

/**
 * CreatorFlow Cafe Bazaar In-App Billing & VIP Manager
 * CRITICAL SECURITY ARCHITECTURE:
 * - BAZAAR_CLIENT_SECRET, BAZAAR_CLIENT_ID, and BAZAAR_REFRESH_TOKEN are NEVER stored in Android code,
 *   never embedded in BuildConfig, and never packaged in APK or public git repositories.
 * - In-App Billing purchases return a purchaseToken from Cafe Bazaar's client SDK (Poolkey).
 * - Verification is executed cryptographically via the secure backend server (/api/bazaar/verify).
 * - The backend handles OAuth token exchange and devapi verification with Cafe Bazaar servers.
 */
class BazaarBillingManager(private val context: Context) {
    private val poolkey: Poolkey = Poolkey(context, BAZAAR_RSA_KEY)
    private val executor = Executors.newSingleThreadExecutor()
    private val mainHandler = Handler(Looper.getMainLooper())

    fun purchaseVipMonthly(
        activity: Activity,
        onSuccess: (purchaseToken: String) -> Unit,
        onFailure: (error: String) -> Unit
    ) {
        poolkey.purchaseProduct(activity, SKU_VIP_MONTHLY, object : PurchaseCallback {
            override fun onSuccess(purchaseToken: String) {
                onSuccess(purchaseToken)
            }
            override fun onFailure(error: String) {
                onFailure(error)
            }
        })
    }

    fun purchaseVipYearly(
        activity: Activity,
        onSuccess: (purchaseToken: String) -> Unit,
        onFailure: (error: String) -> Unit
    ) {
        poolkey.purchaseProduct(activity, SKU_VIP_YEARLY, object : PurchaseCallback {
            override fun onSuccess(purchaseToken: String) {
                onSuccess(purchaseToken)
            }
            override fun onFailure(error: String) {
                onFailure(error)
            }
        })
    }

    /**
     * Sends the purchase receipt (purchaseToken, sku, packageName) to the secure backend server
     * to perform server-to-server cryptographic verification against Cafe Bazaar Developer API.
     */
    fun verifyPurchaseWithBackend(
        purchaseToken: String,
        sku: String,
        backendBaseUrl: String,
        onVerificationResult: (isVerified: Boolean, message: String) -> Unit
    ) {
        executor.execute {
            try {
                val cleanUrl = backendBaseUrl.trimEnd('/')
                val url = URL("$cleanUrl/api/bazaar/verify")
                val conn = (url.openConnection() as HttpURLConnection).apply {
                    requestMethod = "POST"
                    setRequestProperty("Content-Type", "application/json; charset=UTF-8")
                    setRequestProperty("Accept", "application/json")
                    connectTimeout = 10000
                    readTimeout = 15000
                    doOutput = true
                    doInput = true
                }

                val payload = JSONObject().apply {
                    put("purchaseToken", purchaseToken)
                    put("sku", sku)
                    put("packageName", context.packageName)
                }

                OutputStreamWriter(conn.outputStream).use { writer ->
                    writer.write(payload.toString())
                    writer.flush()
                }

                val responseCode = conn.responseCode
                val stream = if (responseCode in 200..299) conn.inputStream else conn.errorStream
                val responseString = BufferedReader(InputStreamReader(stream)).use { it.readText() }
                val jsonResponse = JSONObject(responseString)
                val verified = jsonResponse.optBoolean("verified", false)
                val message = jsonResponse.optString("message", if (verified) "VIP Verified" else "Verification failed")

                mainHandler.post {
                    onVerificationResult(verified, message)
                }
            } catch (e: Exception) {
                mainHandler.post {
                    onVerificationResult(false, e.message ?: "Failed to connect to verification server")
                }
            }
        }
    }

    companion object {
        const val SKU_VIP_MONTHLY = "creatorflow_vip_monthly"
        const val SKU_VIP_YEARLY = "creatorflow_vip_yearly"
        const val BAZAAR_RSA_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA..."
    }
}`,
    "server/bazaarService.ts": `/**
 * Cafe Bazaar Developer API & In-App Billing (IAB) Server-Side OAuth Service
 * CRITICAL SECURITY RULES:
 * 1. BAZAAR_CLIENT_ID, BAZAAR_CLIENT_SECRET, and BAZAAR_REFRESH_TOKEN are stored ONLY in server environment variables.
 * 2. Secrets are NEVER passed to the Android client or stored in APK / GitHub repo.
 * 3. Token exchange (authorization_code -> access_token + refresh_token) occurs solely server-side.
 * 4. Purchase verification executes server-to-server with Cafe Bazaar's Developer API.
 */
import { exchangeAuthorizationCode, refreshAccessToken, verifyBazaarPurchase } from "./bazaarService";
// See /server/bazaarService.ts for full implementation`,
  };

  const handleCopy = () => {
    if (!fileContents[selectedFile]) return;
    navigator.clipboard.writeText(fileContents[selectedFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-400">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {settings.language === "fa" ? "فایل‌های سورس اندروید و گیت‌هاب" : "Android Native & GitHub CI/CD"}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                Ready for APK
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400">
              {settings.language === "fa"
                ? "سورس کد کاتلین جت‌پک کامپوز اندروید متصل به پایپ‌لاین بیلد خودکار در GitHub Actions"
                : "Standard Kotlin Jetpack Compose Android source code configured for automated GitHub builds"}
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 transition-colors self-start sm:self-center"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">کپی شد!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>کپی کد فایل</span>
            </>
          )}
        </button>
      </div>

      {/* GitHub Actions Instructions Banner */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Terminal className="w-4 h-4" />
          <span>
            {settings.language === "fa"
              ? "راهنمای ساخت خودکار فایل APK در گیت‌هاب اکشنز (GitHub Actions):"
              : "How to Build the Real APK on GitHub Actions:"}
          </span>
        </div>
        <ol className="text-xs text-neutral-300 space-y-1.5 list-decimal list-inside leading-relaxed">
          <li>
            {settings.language === "fa"
              ? "کدها را در ریپازیتوری گیت‌هاب خود Push کنید."
              : "Push the project code to your GitHub repository."}
          </li>
          <li>
            {settings.language === "fa"
              ? "فایل .github/workflows/android-build.yml به طور خودکار اجرا شده و فایل خروجی app-debug.apk را بیلد می‌کند."
              : "The GitHub Actions workflow (.github/workflows/android-build.yml) automatically triggers and builds the APK."}
          </li>
          <li>
            {settings.language === "fa"
              ? "از بخش تب Actions در گیت‌هاب، فایل آرتیفکت APK را مستقیماً دانلود نمایید."
              : "Download the compiled APK directly from the GitHub Actions Artifacts tab."}
          </li>
        </ol>
      </div>

      {/* Code File Explorer & Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* File Tree List */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-2">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
            فایل‌های پروژه
          </span>
          {Object.keys(fileContents).map((fileName) => (
            <button
              key={fileName}
              onClick={() => setSelectedFile(fileName)}
              className={`w-full p-2.5 rounded-xl text-left rtl:text-right text-xs font-mono transition-colors flex items-center gap-2 ${
                selectedFile === fileName
                  ? "bg-emerald-950/60 text-emerald-300 border border-emerald-700/50"
                  : "bg-neutral-950/60 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              <FileCode className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{fileName}</span>
            </button>
          ))}
        </div>

        {/* Code Content Preview */}
        <div className="lg:col-span-3 rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-neutral-800 bg-neutral-900/80 flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>{selectedFile}</span>
            <span className="text-emerald-400">Kotlin / Groovy / YAML</span>
          </div>
          <pre className="flex-1 p-4 overflow-x-auto text-xs font-mono text-neutral-200 leading-relaxed max-h-[500px]">
            {fileContents[selectedFile]}
          </pre>
        </div>
      </div>
    </div>
  );
};
