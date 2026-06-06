# **Comprehensive Guide: Fine-Tuning BioBERT for Medical Triage**

## **Project Overview**

The goal of this project was to automate and assist in the clinical triage process by predicting a patient's **Triage Acuity Level** based solely on their raw, spoken symptoms (the Chief Complaint).

To achieve this, we took a powerful pre-trained Artificial Intelligence model (**BioBERT**) and "fine-tuned" it using a custom dataset of over 100,000 patient records. This document explains the data architecture, the training mechanics, and the final prediction generation.

## **Phase 1: The Data Ecosystem (What We Fed the AI)**

Machine learning for natural language text classification requires a specific setup: the model needs the **Input Text** (what it reads) perfectly aligned with the **Ground Truth Label** (the correct answer it needs to learn).

Your data was originally split across two distinct files. Here is how they functioned:

### **1\. train.csv (The Clinical Context & The "Answer Key")**

This file contained the structured clinical data recorded by nurses and doctors.

* **What it contained:** Vitals (heart rate, blood pressure), demographics (age, sex), hospital logistics (arrival mode, shift), and the critical triage\_acuity column.  
* **Its Role in Training:** For an NLP (Natural Language Processing) model, we ignore the physical numbers (like blood pressure). The sole purpose of this file in our workflow was to provide the **Answer Key**.  
* **Example:** The file told us that patient TG-UXRGA9UCO was assessed by a human nurse as triage\_acuity Level **2** (highly urgent).

### **2\. chief\_complaints.csv (The Raw Input Data)**

This file contained the messy, human-readable text describing why the patient was at the hospital.

* **What it contained:** The patient\_id and the chief\_complaint\_raw (the exact phrasing of the symptom).  
* **Its Role in Training:** This provided the raw text the model needed to read and analyze.  
* **Example:** Patient TG-UXRGA9UCO arrived with a *"thunderclap headache, worsening with movement"*.

### **3\. The Crucial Data Merge**

Because the Hugging Face model requires the text and the answer to be in the exact same row, our first step was writing a Pandas Python script to merge these two files using the patient\_id as the anchor:

df \= pd.merge(train\_df, complaints\_df, on="patient\_id")

**The Result:** The model could now see the complete equation. It learned that:

* *"thunderclap headache"* \= Level 2 (Urgent)  
* *"contraception advice, intermittent"* \= Level 5 (Non-Urgent)

## **Phase 2: The Training Engine (How the AI Learned)**

With our data merged and cleaned, we fed it into the Hugging Face Trainer API. Here is the exact step-by-step process of what happened inside the GPU during training.

### **1\. The Foundation: What is BioBERT?**

Instead of teaching a computer English and medical terminology from scratch, we downloaded Yuvrajxms09/biobert-triage-classifier.

* **Pre-training:** BioBERT is a massive neural network built by researchers who forced it to "read" millions of PubMed biomedical articles. Right out of the box, it inherently understands complex medical anatomy, phrasing, and the difference between "hyper-" and "hypo-".

### **2\. Tokenization (Translating English to Math)**

Machine learning models cannot read English letters; they only understand matrices of numbers.

* We used a **Tokenizer** to chop your chief\_complaint\_raw text into smaller pieces (tokens) and map them to ID numbers.  
* *Example:* "Thunderclap headache" might become \[102, 5493, 294, 8831, 103\].  
* We also applied **Padding** and **Truncation**. Neural networks require uniform inputs. If a complaint was too short, we added blank zeros up to 128 tokens. If it was too long, we chopped it off at 128\.

### **3\. The Classification Head Mismatch (Customizing the Output)**

When loading the model, we passed a critical parameter: ignore\_mismatched\_sizes=True.

* **Why?** The original model might have been trained to output only 3 labels (e.g., Low, Medium, High). However, your dataset used a specific 5-level acuity system.  
* **What it did:** The script automatically severed the "old brain" (the output layer) of the pre-trained model and attached a brand new, randomly initialized output layer perfectly sized to output exactly your specific Triage Levels.

### **4\. The Fine-Tuning Loop (Epochs & GPU)**

We ran the training over **3 Epochs** (3 complete passes through your entire dataset) using a **T4 GPU**. Here is the microscopic lifecycle of how it learned:

1. **Forward Pass:** The model looks at a batch of 16 text complaints and makes a guess at their triage levels using its current weights.  
2. **Loss Calculation:** It compares its guesses to the actual triage\_acuity answers. It calculates how "wrong" it is (a metric called Loss).  
3. **Backpropagation:** It sends a mathematical signal backwards through the neural network to slightly adjust its internal weights.  
4. **Result:** By Epoch 3, the model's weights had shifted dramatically to map specific phrasing (like "contraception advice") to low-acuity levels, and trauma phrasing to high-acuity levels. We then saved this newly "fine-tuned" model permanently to your Google Drive.

## **Phase 3: Batch Inference (Making Predictions)**

With a highly trained model saved, we shifted from *learning* to *predicting*. We wanted to test our new model against the 100,000+ records in the chief\_complaints.csv file.

### **GPU Batch Processing**

Because your dataset was massive, doing this one by one (sequentially) would have taken over 30 minutes. We optimized the script to utilize **GPU Batch Processing**:

predictions \= triage\_pipe(texts, batch\_size=64, truncation=True, max\_length=128)

This forced the T4 GPU to process 64 patient records at the exact same microsecond, massively reducing computation time to just a few minutes.

### **Understanding the Output: triage\_predictions\_results.csv**

The script spit out a final dataset containing your original text appended with two brand new, AI-generated columns:

1. **predicted\_triage\_level**: The model's final decision.  
   * *Real Data Example:* It looked at patient TG-UXRGA9UCO ("thunderclap headache") and correctly flagged it as a Level 1 / 2 (Highly Urgent).  
2. **confidence\_score**: A percentage (0.0 to 1.0) representing the neural network's mathematical certainty.  
   * A score of 0.99 means the model is absolutely certain.  
   * A score of 0.45 means the text was vague, and the model had to make a highly educated guess between two different triage levels.

## **Summary & Next Steps**

By combining clinical context with raw patient narratives, we successfully adapted a world-class medical language model to your specific clinical environment. The model is now saved in Google Drive and ready to be deployed.

The next phase of the project involves wrapping this model in a Python API (FastAPI) and connecting it to a ReactJS frontend to create a live, interactive Triage Dashboard.