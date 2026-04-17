"""
PySpark Real-Time Twitter Sentiment Analysis Job
-----------------------------------------------
This script represents the 'Heart' of the sentiment analysis engine.
It uses Spark Streaming to process live tweet data and VADER or Gemini for sentiment.

Prerequisites:
- Spark 3.x
- Python 3.x
- pyspark, pandas, vaderSentiment
"""

from pyspark.sql import SparkSession
from pyspark.sql.functions import explode, split, window, col, udf
from pyspark.sql.types import StringType
import time
import json

# Placeholder for real Twitter API credentials
# In production, use environment variables!
API_KEY = "YOUR_TWITTER_API_KEY"

def analyze_sentiment(text):
    # This is where your classification logic lives
    # You can use NLTK VADER or call an LLM API
    if any(word in text.lower() for word in ["good", "great", "awesome", "🚀"]):
        return "positive"
    if any(word in text.lower() for word in ["bad", "worst", "fail", "📉"]):
        return "negative"
    return "neutral"

sentiment_udf = udf(analyze_sentiment, StringType())

def main():
    # Initialize Spark Session
    spark = SparkSession.builder \
        .appName("TwitterSentimentAnalysis") \
        .getOrCreate()

    # Create a streaming DataFrame (Simulated from Socket for demonstration)
    # For real Twitter: use Tweepy and push to Kafka or Socket
    lines = spark.readStream \
        .format("socket") \
        .option("host", "localhost") \
        .option("port", 9999) \
        .load()

    # Process tweets
    tweets = lines.select(
        sentiment_udf(col("value")).alias("sentiment"),
        col("value").alias("text")
    )

    # Aggregate sentiment counts in 1-minute windows
    sentiment_counts = tweets.groupBy("sentiment").count()

    # Output to Console (or Sink to Database/Socket for Dashboard)
    query = sentiment_counts.writeStream \
        .outputMode("complete") \
        .format("console") \
        .start()

    print("Spark Streaming Job Started...")
    query.awaitTermination()

if __name__ == "__main__":
    main()
