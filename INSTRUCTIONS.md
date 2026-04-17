# Comprehensive Setup Guide: Spark Sentinel in VS Code

This guide provides step-by-step instructions to move this project from Google AI Studio to your local Visual Studio Code environment.

---

## 1. Prerequisites
Before starting, ensure your local machine has:
- **Node.js** (v18.0 or higher)
- **Python** (v3.9 or higher)
- **Java Development Kit (JDK)** (v11 or v17 - required for Apache Spark)
- **VS Code** installed

---

## 2. Export & Import
1. **In AI Studio**: Click **Settings** (gear icon) -> **Export to ZIP**.
2. **On your machine**: Extract the ZIP file.
3. **In VS Code**: Go to `File > Open Folder...` and select the extracted project folder.

---

## 3. Recommended VS Code Extensions
Install these from the Extensions view (`Ctrl+Shift+X`):
- **Python** (Microsoft): Essential for running and debugging the Spark script.
- **ESLint**: For real-time JavaScript/TypeScript error checking.
- **Tailwind CSS IntelliSense**: For autocompletion of styling classes.
- **Prettier**: To maintain consistent code formatting.
- **Thunder Client**: (Optional) For testing your Express API endpoints.

---

## 4. Environment Configuration
1. **Install Node dependencies**:
   ```bash
   npm install
   ```

2. **Create a local `.env` file**:
   Rename `.env.example` to `.env` and fill in your keys:
   ```env
   GEMINI_API_KEY=your_google_ai_key_here
   ```

3. **Python Virtual Environment (Recommended)**:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   pip install pyspark pandas vaderSentiment
   ```

---

## 5. Setting up Apache Spark
PySpark requires a local Spark installation to run its master/worker nodes.

1. **Download Spark**: Visit [spark.apache.org](https://spark.apache.org/downloads.html) and download the latest pre-built version.
2. **Set Environment Variables**:
   Add Spark's `bin` folder to your system `PATH`.
   Set `SPARK_HOME` to the extracted Spark directory.
3. **Verify**: Run `pyspark --version` in your terminal.

---

## 6. Running the Application

### Step A: Start the Web Dashboard & API
This starts the Express server and the Vite frontend.
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step B: Run the PySpark Streaming Job
In a **second terminal** (with your Python environment active):
```bash
python pyspark_streaming.py
```
*Note: The script is configured to look for a data stream on localhost:9999. In production, you would connect this to Kafka or a Twitter API stream.*

---

## 7. Connecting to Twitter (X) API
To use real live data instead of simulated batches:
1. Apply for a Developer Account at [developer.twitter.com](https://developer.twitter.com/).
2. Get your `Bearer Token`.
3. In `pyspark_streaming.py`, replace the simulation logic with a `tweepy` stream that pushes data into the Spark `readStream`.

---

## 8. Debugging in VS Code
- **Client Side**: Use the **Debugger for Chrome/Edge** extension. Hit `F5` and select "Vite".
- **Backend/Spark**: Open `server.ts` or `pyspark_streaming.py` and use the built-in VS Code Run/Debug button on the top right.
