---
title: "MediSync: AI-Powered Closed-Loop Saline IV Monitoring System"
subtitle: "Clinical Technical Documentation for Healthcare Professionals"
author: "Jinmoyee Thakuria"
date: "2025"
---

# Abstract

MediSync is a dual-device IoT system designed for continuous patient monitoring and automated saline IV flow regulation in hospital wards, ICUs, and home-care settings. The system integrates clinical-grade sensors—including ECG (ADS1292R), SpO₂ (AFE4490), temperature (YSI-compatible probe), NIBP (OEM module), IMU (MPU6050), and dual IR drop sensors—with edge AI inference on a Raspberry Pi 4.

The architecture enables real-time classification of patient condition across multiple physiological parameters, including heart rhythm, oxygen saturation, blood pressure, respiratory rate, body temperature, and motion. The core innovation lies in its closed-loop control logic: based on AI-assessed patient condition and continuous vital sign trends, the system automatically adjusts saline IV flow rates via a stepper motor actuator.

This document presents the market-ready design, clinical rationale, related work, prototype description, validation plan, and budget summary, with specific focus on deployment in Indian healthcare settings. The system is positioned as a continuous early-warning monitoring platform—not a diagnostic tool—capable of detecting deterioration patterns associated with sepsis, respiratory infections, post-operative complications, fluid overload, falls, fever, and dehydration.

\newpage

# Chapter 1: Introduction

## 1.1 Background and Motivation

Intravenous (IV) saline therapy is one of the most common interventions in modern healthcare, used for hydration, medication delivery, and hemodynamic support. In large-scale healthcare settings such as hospitals and ICUs, managing IV saline flow rates for multiple patients simultaneously is a significant challenge for nursing staff. Manual monitoring is time-consuming and error-prone.

MediSync addresses this challenge by combining wearable multi-sensor hardware, edge AI inference, and automated stepper-controlled IV regulation—all communicating over a local WiFi network.

### 1.1.1 The Clinical Burden in India

India faces a critical shortage of nursing staff, which directly impacts patient monitoring and safety. According to the World Health Organization, India's national average is approximately 1.96 nurses per 1,000 people, well below the WHO recommendation of at least 3 nurses per 1,000 individuals. This shortage is particularly acute in hospital wards, where nurses are required to manage 18–20 patients in general wards and 3–4 patients in critical care units, with nurse-patient ratios of 1:30 and 1:22 being common in some private hospitals.

The consequences of this shortage are severe. A 2025 study published in the Indian Journal of Community Medicine and Public Health found that high nursing workload is a significant issue in Indian healthcare settings, affecting patient care quality, patient safety, and nursing outcomes.

### 1.1.2 Sepsis Burden in India

Sepsis represents a substantial public health issue in India. Data from a 2025 Indiaspend report states that one in two Intensive Care Unit (ICU) patients had sepsis, and among them 27.6% died. A 2017 study estimated 11.3 million sepsis cases in India with subsequent 2.9 million deaths. A 2024 study published in a journal of the National Institutes of Health (NIH) states that sepsis patients had a mortality rate of 36.3% and a 50.8% mortality rate for septic shock.

A 2025 prospective observational study (MARS-India) conducted in a low- and middle-income intensive care setting revealed that in-hospital mortality was 24.1%, with about 54% having confirmed microbiological diagnosis and more than 18% having a viral cause of sepsis.

### 1.1.3 Technological Opportunity

Recent advances in low-power sensors, edge computing, and machine learning have enabled the development of compact, affordable monitoring systems that can:

1. Continuously acquire multi-parameter vital signs
2. Run AI inference on-device
3. Automatically adjust IV flow rates based on real-time physiological feedback
4. Alert clinicians to deterioration patterns

\newpage

## 1.2 Problem Statement

### 1.2.1 Core Problem

Manual IV fluid management in clinical settings is:

- Labor-intensive: Requires frequent physical checks
- Error-prone: Susceptible to human error
- Reactive: Deterioration may go unnoticed between checks
- Unsafe: Fluid overload can cause pulmonary edema, cardiac complications

### 1.2.2 Specific Gaps in Indian Healthcare

| Gap | Current State | Impact |
|-----|---------------|--------|
| Continuous monitoring | Episodic (every 4–6 hours) | Delayed deterioration detection |
| Automated flow adjustment | Manual | Human error, delayed response |
| Multi-parameter fusion | Single-parameter alarms | False alarms, missed patterns |
| Closed-loop control | None | No automated fluid safety |
| Edge AI | Cloud-dependent | Latency, privacy concerns |
| Nursing shortage | 1.96 nurses per 1,000 population | High workload, burnout |

### 1.2.3 Problem Statement

There is a critical need for a continuous, multi-parameter patient monitoring system that can automatically detect deterioration patterns and adjust IV fluid delivery in real-time, reducing nursing workload and improving patient safety in Indian healthcare settings.

\newpage

## 1.3 Objectives

### 1.3.1 Primary Objectives

1. Design and develop a dual-device IoT system for continuous patient monitoring and automated IV flow control
2. Integrate clinical-grade sensors for ECG, SpO₂, temperature, blood pressure, motion, and IV flow
3. Develop an edge AI model for multi-parameter condition classification
4. Implement closed-loop control logic for automated IV flow adjustment
5. Create a real-time dashboard for clinician monitoring and alerts
6. Validate system performance against clinical reference standards

### 1.3.2 Secondary Objectives

1. Ensure patient safety through fail-safe design and redundant sensing
2. Minimize nursing workload through automation
3. Enable deployment in resource-constrained Indian settings
4. Prepare for regulatory certification (CDSCO)
5. Establish clinical partnerships for pilot deployment

\newpage

## 1.4 Scope and Delimitations

### 1.4.1 Scope

- Clinical Settings: Hospital wards, ICUs, home-care
- Patient Population: Normal-to-moderate acuity
- Conditions Covered: Sepsis, respiratory infection, post-operative recovery, fluid overload, falls, fever, dehydration
- Monitoring Parameters: ECG, SpO₂, temperature, BP, RR, motion, IV flow
- Control Action: IV flow rate adjustment only

### 1.4.2 Delimitations

- Not a Diagnostic Device: Detects deterioration patterns, not specific diseases
- Excluded Conditions: DKA, traumatic brain injury, hemorrhagic shock, snake bite, hyponatremia, kidney stones, conditions requiring lab-based diagnosis
- Sensor Limitations: Single-lead ECG, intermittent NIBP, skin-surface temperature
- Regulatory: Requires approval before clinical use

\newpage

# Chapter 2: Clinical Problem Statement

## 2.1 The Challenge of IV Fluid Management in India

### 2.1.1 Importance of IV Fluid Therapy

Intravenous (IV) fluid therapy is essential for:

- Hydration: Maintaining fluid balance
- Medication Delivery: Administering drugs, antibiotics, electrolytes
- Hemodynamic Support: Maintaining blood pressure and organ perfusion
- Nutrition: Parenteral nutrition in patients unable to eat

### 2.1.2 Complexity of Fluid Management

| Factor | Challenge |
|--------|-----------|
| Individual Variability | Fluid requirements vary by age, weight, comorbidities |
| Dynamic Needs | Requirements change with clinical status |
| Narrow Therapeutic Window | Under- and over-infusion both harmful |
| Multiple Patients | Nurses manage 18–20 patients in general wards |
| Intermittent Monitoring | Checks every 4–6 hours leave gaps |

### 2.1.3 Consequences of Poor Fluid Management

Under-infusion: Dehydration, electrolyte imbalances, delayed recovery, organ hypoperfusion

Over-infusion (Fluid Overload): Fluid overload is a critical concern in intensive care units, contributing to increased morbidity and mortality. Excessive fluid accumulation can exacerbate organ dysfunction, particularly affecting the cardiovascular, respiratory, and renal systems. Research indicates that a positive cumulative fluid balance after 72 hours of ICU stay is associated with increased morbidity such as pulmonary edema, impaired gastrointestinal motility, intra-abdominal hypertension, delayed wound healing, and mortality.

\newpage

## 2.2 Nursing Workload and Human Error in India

### 2.2.1 Nursing Shortage Statistics

| Metric | India | WHO Recommendation |
|--------|-------|-------------------|
| Nurse-to-population ratio | 1.96 per 1,000 | 3 per 1,000 |
| Nurses in private hospitals (Delhi) | 1:30 ratio | 1:6 (ideal) |
| Patients per nurse (general ward) | 18–20 | 4–6 |
| Patients per nurse (ICU) | 3–4 | 1–2 |

### 2.2.2 Nursing Workload

| Task | Frequency | Time per Task | Daily Time |
|------|-----------|---------------|------------|
| Vital sign checks | Every 4 hours | 10 min | 60 min |
| IV flow adjustment | Every 1–2 hours | 5 min | 60–120 min |
| Documentation | Continuous | - | 60 min |
| Patient care | Continuous | - | Variable |
| Total Monitoring | | | 3–4 hours/day |

### 2.2.3 Human Error in Manual Monitoring

- Calculation Errors: Incorrect drip rate calculations
- Observation Errors: Missed deterioration signs
- Documentation Errors: Incomplete or inaccurate records
- Response Delays: Delayed adjustment of flow rates

### 2.2.4 Real-World Consequences in India

A 2025 incident in West Bengal involved the administration of expired intravenous fluid to patients, with a preliminary report indicating human error as a contributing factor. In another case at AIIMS Bhopal, a child died due to wrong injection, with investigation revealing that formalin was mistakenly injected instead of medicine.

These incidents underscore the critical need for automated monitoring systems that can reduce reliance on manual checks and provide real-time alerts for abnormal conditions.

\newpage

## 2.3 Delayed Deterioration Detection

### 2.3.1 Deterioration Patterns

Many adverse events manifest as subtle changes in vital signs:

| Condition | Early Signs | Late Signs |
|-----------|-------------|------------|
| Sepsis | Tachycardia, tachypnea, mild fever | Hypotension, organ failure |
| Respiratory Infection | Increased RR, mild SpO₂ drop | Severe hypoxemia |
| Post-Operative Complication | HR changes, fever, RR increase | Shock, organ failure |
| Fluid Overload | RR increase, SpO₂ drop | Pulmonary edema |

### 2.3.2 The Detection Gap

Clinical deterioration in general ward patients is often missed due to the intermittent nature of routine vital sign monitoring performed at intervals of 4–6 hours. Sudden changes between monitoring cycles may remain unnoticed, leading to preventable morbidity, delayed escalation, and avoidable ICU admissions. Studies have demonstrated that up to 80% of in-hospital cardiac arrests are preceded by abnormal vital signs in the preceding 6–8 hours.

### 2.3.3 Evidence from Indian Hospitals

A multicenter study conducted across three tertiary-care hospitals in India monitored 5,253 adult inpatients continuously through a Tele-ICU hemodynamic surveillance program. The system demonstrated a sensitivity of 79.2% and specificity of 80.1%, with patients experiencing verified alerts having a mortality rate of 12%, lower than the APACHE-predicted rate of 24.5%.

A retrospective observational study at Manipal Hospital, Bengaluru, integrated continuous wireless monitoring into the Medical Emergency Team workflow. The study found a statistically significant reduction in unplanned ICU transfers (11.2% vs. 18.8%; p=0.028; OR=0.54), indicating nearly 46% lower escalation risk. More than 90% of system-generated alerts resulted in immediate bedside interventions including oxygen optimization, bronchodilator escalation, diuretic titration, antimicrobial re-evaluation, or fluid adjustment.

\newpage

## 2.4 Target Clinical Environments

| Environment | Patient Acuity | Monitoring Needs | MediSync Fit |
|-------------|----------------|------------------|--------------|
| General Ward | Low-Moderate | Continuous vitals, IV management | Primary |
| Post-Surgical Ward | Moderate | Recovery monitoring, fluid balance | Primary |
| ICU Step-Down | Moderate-High | Continuous monitoring, early warning | Primary |
| Home Care | Low-Moderate | Remote monitoring, alerts | Secondary |
| Field Hospital | Variable | Portable, offline-capable | Secondary |
| ICU (High Acuity) | High | Advanced monitoring, ventilation | Limited |

\newpage

## 2.5 Clinical Need Summary

| Need | Current State | MediSync Solution |
|------|---------------|-------------------|
| Continuous vital sign monitoring | Episodic, manual | Continuous, automated |
| IV flow rate adjustment | Manual, error-prone | Closed-loop, actuator-controlled |
| Early deterioration detection | Reactive, clinician-dependent | AI-based, multi-parameter early warning |
| Fluid overload prevention | Retrospective, after symptoms | Real-time, trend-based intervention |
| Nursing workload reduction | High burden (18–20 patients/nurse) | Automated monitoring + alerts |
| Data logging | Paper-based, incomplete | Digital, complete audit trail |

\newpage

# Chapter 3: Related Work: Multi-Parameter Vital Sign Sensing

## 3.1 Evolution of Wearable and Bedside Monitoring

### 3.1.1 Traditional Bedside Monitors

Traditional bedside monitors (e.g., Philips IntelliVue, GE CARESCAPE) provide multi-parameter vital sign monitoring but are:

- Expensive (INR 5–15 lakh)
- Bulky
- Designed for acute care settings
- Not suitable for home care

### 3.1.2 Wearable and Portable Monitoring in India

India has recently seen the launch of indigenous wearable monitoring solutions. COVID BEEP, India's first indigenous wireless physiological parameters monitoring system, facilitates non-invasive blood pressure (NIBP), electrocardiogram (ECG), body temperature, and respiratory rate monitoring. More recently, iLive Connect—a doctor-led AI healthcare ecosystem—uses FDA- and CE-approved wearable biosensors including a chest patch and wristband to continuously track two-lead ECG, heart rate, respiratory rate, oxygen saturation, body temperature, blood pressure trends, physical activity, and heart rate variability. A 10-week observational study of 410 patients showed a 76% reduction in hospital readmissions with early detection of cardiac, metabolic, and post-discharge complications.

### 3.1.3 Research Systems

| System | Sensors | Compute | Application |
|--------|---------|---------|-------------|
| HealthPad | ECG, SpO₂, Temp | Smartphone | General monitoring |
| WISE | ECG, SpO₂, BP | Raspberry Pi | Ward monitoring |
| iLive Connect | Multi-parameter | Cloud AI | Post-hospital care |
| MediSync | Multi-parameter | Raspberry Pi 4 | IV closed-loop |

\newpage

## 3.2 ECG Sensing for Cardiac Monitoring

### 3.2.1 ECG Fundamentals

Electrocardiography (ECG) measures the electrical activity of the heart:

- P Wave: Atrial depolarization
- QRS Complex: Ventricular depolarization
- T Wave: Ventricular repolarization

### 3.2.2 ECG Sensor Comparison

| Sensor | Leads | Resolution | Interface | Cost (INR) | Application |
|--------|-------|------------|-----------|------------|-------------|
| AD8232 | 1 | 10-bit | Analog | 500–800 | Prototype |
| ADS1292R | 2 | 24-bit | SPI | 4,000–5,000 | Clinical-grade |
| MAX30003 | 1 | 18-bit | SPI | 1,500–2,000 | Wearable |
| ADAS1000 | 5 | 24-bit | SPI | 8,000–12,000 | Diagnostic |

### 3.2.3 ADS1292R Features

- 2-channel ECG: Simultaneous acquisition
- Integrated respiration: Impedance-based RR measurement
- 24-bit resolution: High-fidelity signal
- Low noise: Less than 1 microvolt peak-to-peak
- Programmable gain: 1–12
- SPI interface: Easy integration

### 3.2.4 ECG-Based Heart Disease Classification

Reference Papers:

1. Interpretable ML Techniques in ECG-Based Heart Disease Classification — PMC9818170
2. Wearable ECG Device and Machine Learning for Heart Monitoring — MDPI Sensors
3. Imbalanced ECG Signal-Based Heart Disease Classification Using Ensemble ML — PMC9589052

Key Findings:

- Ensemble methods (RF, XGBoost) achieve greater than 95% accuracy for arrhythmia detection
- Feature extraction (HRV, morphology) is critical for performance
- Wearable ECG can detect atrial fibrillation with high sensitivity

### 3.2.5 ECG Interpretation in Indian Primary Care

In many remote primary care settings in developing countries, including India, the availability of basic ECG remains low. Studies indicate that primary care practitioners were less experienced and less confident with ECG interpretation than cardiologists and require support in interpreting ECG readings. AI-assisted ECG interpretation has shown promise, with a hub-and-spoke network in India demonstrating a mean diagnostic turnaround time of 5.12 minutes, with critical ECGs processed faster at 2.91 minutes.

\newpage

## 3.3 SpO₂ and Pulse Oximetry in Indian Populations

### 3.3.1 SpO₂ Fundamentals

Pulse oximetry measures peripheral capillary oxygen saturation (SpO₂) by:

1. Emitting red (660 nm) and infrared (940 nm) light
2. Measuring differential absorption by oxygenated vs. deoxygenated hemoglobin
3. Calculating ratio-of-ratios

### 3.3.2 SpO₂ Sensor Comparison

| Sensor | Wavelengths | Interface | Cost (INR) | Application |
|--------|-------------|-----------|------------|-------------|
| MAX30102 | 660/880 nm | I2C | 200–400 | Prototype |
| AFE4490 | 660/940 nm | SPI | 7,500–8,500 | Clinical-grade |
| MAX86150 | 660/940 nm | I2C | 1,500–2,000 | Wearable |
| ADPD105 | 660/940 nm | I2C | 1,000–1,500 | Consumer |

### 3.3.3 AFE4490 Features

- Integrated AFE: LED driver + photodiode amplifier
- High resolution: 22-bit ADC
- Low noise: Suitable for clinical use
- SPI interface: Easy integration
- Flexible LED timing: Supports various probe types

### 3.3.4 Critical Consideration: Pulse Oximetry Accuracy and Skin Pigmentation in Indian Populations

This is a critical safety consideration for deployment in India. The absorption spectrum of melanin, an important chromophore present in pigmented skin, significantly overlaps with that of oxygenated hemoglobin, resulting in overestimation of blood oxygen levels. Many oximeters have a bias against dark skin because their manufacturers calibrated them in trials most of whose participants were white people.

Research has demonstrated that the Indian group had the greatest difference between SpO₂ and arterial oxygen saturation (SaO₂) compared to other ethnic groups. Studies have found that increased pigmentation levels are associated with increased positive measurement error (falsely elevated SpO₂ levels), with conventional LED-based pulse oximeters reading higher on darkly pigmented persons than on lightly pigmented persons at lower oxygen saturation values.

Clinical Implication: MediSync must include skin-tone-aware calibration and validation specifically in Indian populations to ensure accurate SpO₂ readings. This is not merely a technical detail but a patient safety imperative.

### 3.3.5 SpO₂/PPG for Respiratory Conditions

Reference Papers:

4. ML-Based Respiration Rate and SpO₂ Estimation Using PPG — MDPI Bioengineering
5. ML-Based Prediction Method for COPD Classification Based on Pulse Oximetry — Zenodo
6. A Machine Learning Model for Predicting Hospitalization in Patients with Respiratory Symptoms — MDPI JCM

Key Findings:

- PPG-derived RR correlates well with capnography (r greater than 0.9)
- SpO₂ trends can predict COPD exacerbation
- ML models can predict hospitalization from respiratory symptoms

\newpage

## 3.4 Temperature Sensing for Fever Detection

### 3.4.1 Temperature Fundamentals

Body temperature is a vital sign reflecting:

- Core Temperature: Hypothalamic set point
- Skin Temperature: Peripheral perfusion
- Temperature Trend: Fever, hypothermia

### 3.4.2 Temperature Sensor Comparison

| Sensor | Accuracy | Interface | Cost (INR) | Application |
|--------|----------|-----------|------------|-------------|
| DS18B20 | ±0.5°C | 1-Wire | 100–200 | Prototype |
| YSI-compatible | ±0.1°C | Analog | 500–1,000 | Clinical-grade |
| MAX30205 | ±0.1°C | I2C | 300–500 | Wearable |
| TMP117 | ±0.1°C | I2C | 500–800 | Precision |

### 3.4.3 YSI-Compatible Probe + ADS1115

- YSI Probe: Industry-standard thermistor (2252 ohm at 25°C)
- ADS1115: 16-bit ADC, I2C interface
- Precision Reference: Stable voltage reference
- Accuracy: ±0.1°C after calibration

\newpage

## 3.5 Blood Pressure Monitoring

### 3.5.1 BP Fundamentals

Blood pressure is measured as:

- Systolic: Peak pressure during ventricular contraction
- Diastolic: Minimum pressure during ventricular relaxation
- Mean Arterial Pressure (MAP): Average pressure

### 3.5.2 BP Measurement Methods

| Method | Principle | Continuous? | Accuracy | Cost |
|--------|-----------|-------------|----------|------|
| Auscultatory | Korotkoff sounds | No | High | Low |
| Oscillometric | Pressure oscillations | No | High | Moderate |
| Volume Clamp | Vascular unloading | Yes | High | High |
| PTT-based | Pulse transit time | Yes | Moderate | Low |

### 3.5.3 PTT-Based Cuffless BP

Reference Papers:

7. Assessing the Efficacy of Various ML Algorithms in Predicting BP Using PTT — PMC11816412
8. Development of Real-Time Cuffless BP Measurement Using ECG Electrodes and Microphone via PTT — PMC9920508
9. Pulse Transit Time Based Continuous Cuffless BP Estimation — Nature Scientific Reports

Key Findings:

- PTT (ECG R-peak to PPG pulse arrival) correlates with BP
- ML models can estimate BP from PTT with reasonable accuracy
- Calibration is required for individual patients

\newpage

## 3.6 Motion Sensing for Fall Detection

### 3.6.1 IMU Fundamentals

Inertial Measurement Units (IMUs) combine:

- Accelerometer: Measures linear acceleration
- Gyroscope: Measures angular velocity
- Magnetometer: Measures magnetic field (optional)

### 3.6.2 IMU Comparison

| Sensor | Axes | Interface | Cost (INR) | Application |
|--------|------|-----------|------------|-------------|
| MPU6050 | 6 | I2C | 150–500 | Prototype |
| MPU9250 | 9 | I2C/SPI | 300–600 | Advanced |
| BMI160 | 6 | I2C/SPI | 200–400 | Wearable |
| LSM6DS3 | 6 | I2C/SPI | 250–500 | Wearable |

### 3.6.3 Fall Detection in Indian Elderly Population

Falls are a significant health concern among older adults in India. A cross-sectional analysis of the Longitudinal Aging Study India Wave 1 data (31,464 older adults aged 60+) found that 15% had experienced a major injury, 13% a fall, and 5% a bone/joint fracture. Among those who fell, 78% sought medical treatment, and 56% needed treatment for a serious fall. Another study found that falls predominated in patients aged greater than 60 years (71.2%).

\newpage

## 3.7 Respiratory Rate Derivation

### 3.7.1 RR Fundamentals

Respiratory rate (RR) is a critical vital sign often overlooked in manual monitoring. It can be derived from:

- ECG: Impedance variations with respiration
- Accelerometer: Chest wall movement
- PPG: Respiratory-induced intensity variations

### 3.7.2 IMU for Respiratory Rate

Reference Papers:

15. Respiratory Monitoring in Motion — PubMed
16. Comparison between Chest-Worn Accelerometer and Gyroscope Performance for HR and RR Monitoring — MDPI Biosensors

Key Findings:

- Chest-worn accelerometer can detect respiratory movements
- Gyroscope provides complementary information
- Fusion of ECG + accelerometer improves RR accuracy

\newpage

## 3.8 IV Flow Monitoring

### 3.8.1 IV Flow Fundamentals

IV flow rate is measured in:

- mL/hr: Volume per hour
- drops/min: Drops per minute (depends on drip factor)

### 3.8.2 IR Drop Sensor

- Principle: IR beam interrupted by falling drop
- Output: Pulse per drop
- Calculation: Flow rate = drops/min divided by drip factor

### 3.8.3 Dual IR Sensor Configuration

- Primary Sensor: At drip chamber
- Backup Sensor: At bag outlet
- Redundancy: If one fails, system continues

\newpage

## 3.9 Sensor Fusion for Clinical Insight

### 3.9.1 Why Sensor Fusion?

Single-parameter monitoring is insufficient for:

- Complex Conditions: Sepsis requires multiple signals
- False Alarm Reduction: Cross-validation reduces false positives
- Early Detection: Trends across parameters precede clinical deterioration

### 3.9.2 Fusion Architecture

The sensor fusion architecture integrates data from ECG, SpO₂, temperature, blood pressure, IMU, PPG, and IV flow sensors. Features are extracted including heart rate variability, SpO₂ trends, temperature trends, BP trends, respiratory rate, and activity level. A stacking ensemble of machine learning models (Gradient Boosting, LightGBM, Logistic Regression, Random Forest, SVM, XGBoost) performs the final classification, producing condition labels, flow rate recommendations, alerts, and dashboard displays.

### 3.9.3 Multi-Sensor Fusion Papers

Reference Papers:

10. Multi-Modal Stacking Ensemble for the Diagnosis of Cardiovascular Diseases — MDPI JPM
11. Stress Classification and Vital Signs Forecasting for IoT-Health Monitoring — JETIR

Key Findings:

- Stacking ensembles outperform single models
- Multi-modal fusion improves diagnostic accuracy
- IoT health monitoring benefits from edge AI

\newpage

# Chapter 4: Related Work: Non-Invasive Blood Pressure (NIBP)

## 4.1 NIBP Technologies

### 4.1.1 Overview

Non-invasive blood pressure (NIBP) measurement avoids arterial puncture and is suitable for routine monitoring.

### 4.1.2 Methods

| Method | Principle | Continuous? | Accuracy | Cost |
|--------|-----------|-------------|----------|------|
| Auscultatory | Korotkoff sounds | No | High | Low |
| Oscillometric | Pressure oscillations | No | High | Moderate |
| Volume Clamp | Vascular unloading | Yes | High | High |
| Tonometry | Arterial compression | Yes | Moderate | Moderate |
| PTT-based | Pulse transit time | Yes | Moderate | Low |

\newpage

## 4.2 Oscillometric Method

### 4.2.1 Principle

1. Cuff inflates above systolic pressure
2. Cuff deflates slowly
3. Pressure oscillations are detected
4. MAP is at maximum oscillation
5. Systolic/diastolic are derived from oscillation envelope

### 4.2.2 Advantages

- Automated
- Operator-independent
- Widely validated
- Suitable for OEM integration

### 4.2.3 Limitations

- Intermittent (not continuous)
- Affected by motion
- Requires correct cuff size
- Not suitable for arrhythmias

\newpage

## 4.3 OEM NIBP Modules

### 4.3.1 Available Modules

| Module | Validation | Interface | Cost (INR) | Application |
|--------|------------|-----------|------------|-------------|
| UN300C-class | ISO 81060-2 / AAMI | UART | 10,000–15,000 | Clinical |
| MedLab | CE | UART/USB | 8,000–12,000 | Clinical |
| BIOPAC | Research | USB | 15,000–25,000 | Research |

### 4.3.2 UN300C-Class Features

- Compact: Suitable for portable devices
- Validated: ISO 81060-2 / AAMI
- Serial Interface: Easy integration
- Multi-size Cuffs: Pediatric, adult, large adult

\newpage

## 4.4 Integration Considerations

### 4.4.1 Hardware

- Power Supply: 5V or 12V, stable
- Isolation: Patient safety (IEC 60601-1)
- Level Shifting: UART voltage compatibility
- Cuff Connection: Pneumatic tubing, connectors

### 4.4.2 Software

- Communication Protocol: UART commands
- Measurement Trigger: On-demand or scheduled
- Data Parsing: Extract systolic, diastolic, MAP, HR
- Error Handling: Cuff loose, motion artifact

### 4.4.3 Validation

- Clinical Validation: Against reference sphygmomanometer
- Accuracy: ±5 mmHg (AAMI standard)
- Repeatability: Multiple measurements

\newpage

## 4.5 Role in MediSync

### 4.5.1 Data Provided

- Systolic BP
- Diastolic BP
- Mean Arterial Pressure (MAP)
- Heart Rate (from NIBP)

### 4.5.2 Clinical Applications

| Condition | BP Role |
|-----------|---------|
| Sepsis | Hypotension (SBP less than 90) is warning sign |
| Post-Operative | BP trend indicates recovery/complication |
| Hypertension | Baseline and trend monitoring |
| Fluid Overload | BP changes with fluid status |

### 4.5.3 Integration in MediSync

- NIBP module connected to Raspberry Pi via UART
- Measurements every 15–30 minutes (configurable)
- Data fused with other sensors for AI classification
- Displayed on dashboard

\newpage

# Chapter 5: Related Work: AI-Based Early Warning / Deterioration Prediction

## 5.1 Early Warning Scores (EWS)

### 5.1.1 Overview

Early Warning Scores (EWS) are rule-based systems that aggregate vital signs to predict deterioration.

### 5.1.2 Common EWS Systems

| Score | Parameters | Threshold | Application |
|-------|------------|-----------|-------------|
| MEWS | HR, RR, BP, Temp, Consciousness | 5 or more | General ward |
| NEWS | + SpO₂ | 5 or more | General ward |
| NEWS2 | + SpO₂ (2 scales) | 5 or more | UK standard |
| qSOFA | RR, SBP, Consciousness | 2 or more | Sepsis screening |

\newpage

## 5.2 NEWS2 and qSOFA

### 5.2.1 NEWS2 Components

| Parameter | 3 | 2 | 1 | 0 | 1 | 2 | 3 |
|-----------|---|---|---|---|---|---|---|
| RR | 8 or less | | 9–11 | 12–20 | | 21–24 | 25 or more |
| SpO₂ (Scale 1) | 91 or less | 92–93 | 94–95 | 96 or more | | | |
| SpO₂ (Scale 2) | 83 or less | 84–85 | 86–87 | 88–92 | 93–94 | 95–96 | 97 or more |
| Temp | 35.0 or less | | 35.1–36.0 | 36.1–38.0 | 38.1–39.0 | 39.1 or more | |
| SBP | 90 or less | 91–100 | 101–110 | 111–219 | | | 220 or more |
| HR | 40 or less | | 41–50 | 51–90 | 91–110 | 111–130 | 131 or more |
| Consciousness | | | | Alert | | | CVPU |

### 5.2.2 qSOFA Components

- Respiratory rate 22 or more
- Altered mentation (GCS less than 15)
- Systolic BP 100 or less

### 5.2.3 Limitations

- Fixed thresholds (not personalized)
- Intermittent data collection
- No integration with fluid delivery
- Alert fatigue

\newpage

## 5.3 Machine Learning for Deterioration Prediction in India

### 5.3.1 ML Approaches

| Approach | Examples | Advantages | Disadvantages |
|----------|----------|------------|---------------|
| Logistic Regression | LR | Interpretable | Linear only |
| Random Forest | RF | Non-linear, robust | Black box |
| Gradient Boosting | XGBoost, LightGBM | High accuracy | Tuning required |
| SVM | SVM | Effective for small data | Kernel selection |
| Deep Learning | LSTM, Transformer | Captures temporal patterns | Data-hungry |
| Stacking Ensemble | GB + LGBM + LR + RF + SVM + XGB | Best performance | Complex |

### 5.3.2 Sepsis Prediction in Indian Hospitals

A prospective cohort study conducted in ICUs in Madhya Pradesh, India, with 638 sepsis patients evaluated the effectiveness of AI-enhanced Early Warning Systems (AI-SOFA) compared to traditional EWS models like MEWS, NEWS, and SOFA. ICU mortality was significantly lower in the AI-SOFA group (25%) compared to the control group (36%) (p=0.001). The incidence of septic shock and organ failure was also reduced in the AI-enhanced EWS group. The mean length of ICU stay was shorter in the AI-SOFA group (6.4 days vs. 8.7 days, p=0.004).

A study on early prediction of neonatal sepsis using machine learning algorithms based on data from Indian hospitals showed promising results with a receiver operating characteristic (ROC) of 0.8703 for 12-hour prediction.

### 5.3.3 Temperature + HR/BP for Deterioration

- Fever + Tachycardia: Early infection sign
- Hypotension + Tachycardia: Shock warning
- Temperature trend: Predicts sepsis onset

\newpage

## 5.4 Edge AI for Real-Time Clinical Inference

### 5.4.1 Why Edge AI?

| Factor | Cloud AI | Edge AI |
|--------|----------|---------|
| Latency | High (100–500 ms) | Low (less than 50 ms) |
| Privacy | Data leaves device | Data stays local |
| Connectivity | Required | Offline capable |
| Cost | Ongoing | One-time |
| Reliability | Dependent on network | Independent |

### 5.4.2 Edge AI Platforms

| Platform | Compute | Power | Cost (INR) | Application |
|----------|---------|-------|------------|-------------|
| Raspberry Pi 4 | 1.5 GHz quad-core | 3–5 W | 11,000–15,000 | MediSync |
| ESP32-S3 | 240 MHz dual-core | 0.5 W | 500–1,200 | Sensor hub |
| Jetson Nano | 128-core GPU | 5–10 W | 15,000–20,000 | Advanced AI |
| Coral Dev Board | Edge TPU | 2–4 W | 8,000–12,000 | TensorFlow Lite |

\newpage

## 5.5 Condition Classification in MediSync

### 5.5.1 Classification Labels

| Label | Condition | Description |
|-------|-----------|-------------|
| 0 | Healthy | No abnormality detected |
| 1 | Heart Disease | Arrhythmia, ischemia patterns |
| 2 | Hypertension | Elevated BP trends |
| 3 | Diabetes Mellitus | HRV patterns, metabolic signs |
| 4 | Asthma | Respiratory patterns, SpO₂ |

### 5.5.2 Model Files

| File | Purpose |
|------|---------|
| best_model.pkl | Primary deployed model |
| best_model_v2.pkl | Improved version |
| feature_columns.pkl | Input feature schema |
| label_encoder.pkl | Condition label mapping |

### 5.5.3 Training Data

- ECG: PhysioNet Apnea-ECG dataset (70 recordings)
- Vitals: Synthetic multi-condition dataset
- Features: ECG morphology, HRV, SpO₂, HR, Temp, RR, motion

\newpage

## 5.6 Disease Coverage and Implementation Ease

### 5.6.1 Full Disease Coverage Table

| Number | Condition | Clinical Evidence (India) | Sensors/Signals Used | Detection Logic | Implementation Ease |
|--------|-----------|--------------------------|---------------------|-----------------|---------------------|
| 1 | Fall detection / mobility monitoring | 43.6% of elderly report falls; 78.1% sustain injuries | Accelerometer + Gyroscope | Sudden high-magnitude deceleration/orientation change | Easy |
| 2 | Fever / infection tracking | Common ward presentation | Temp, ECG (HR) | Threshold-based trend | Easy |
| 3 | Mild dehydration / gastroenteritis recovery | Common in tropical settings | ECG (HR), RR, IV flow data | Tracks tachycardia/elevated RR trend back to normal | Moderate |
| 4 | Respiratory infection / pneumonia / COPD | COPD affects 55 million Indians; pneumonia 3.6% of disease burden | SpO₂, RR, Temp, ECG (HR) | SpO₂ drop + rising RR + mild fever pattern | Moderate |
| 5 | Post-operative recovery monitoring | SSI incidence 5.2%; up to 13.4% in some studies | ECG, SpO₂, Temp, RR, BP, Accelerometer | Deviation from patient-specific baseline | Moderate |
| 6 | Sepsis / systemic infection | 1 in 2 ICU patients; 27.6% mortality; 11.3M cases, 2.9M deaths annually | Temp, ECG (HR), RR, SpO₂ | Composite multi-parameter score (NEWS2/qSOFA-style) | Harder |
| 7 | Fluid overload during IV therapy | Positive fluid balance after 72h associated with increased morbidity/mortality | RR, SpO₂, ECG, IV flow/volume + actuator | Correlates worsening RR/SpO₂ with cumulative infused volume | Hardest |

### 5.6.2 Excluded Conditions

| Condition | Reason for Exclusion |
|-----------|---------------------|
| DKA | Requires blood glucose measurement |
| Traumatic Brain Injury | Requires ICP monitoring, imaging |
| Hemorrhagic Shock | Requires invasive BP, hemoglobin |
| Snake Bite | Requires specific antivenom, lab tests |
| Hyponatremia | Requires electrolyte panel |
| Kidney Stones | Requires imaging, urinalysis |
| Any lab-based diagnosis | Sensors cannot measure blood chemistry |

\newpage

## 5.7 Build Order Recommendation

### 5.7.1 Phased Development

| Phase | Conditions | Rationale |
|-------|------------|-----------|
| Phase 1 | Fall detection, Fever tracking | Easy wins, demo-ready |
| Phase 2 | Mild dehydration, Respiratory infection | Composite scoring foundation |
| Phase 3 | Post-operative recovery | Personalized baselines |
| Phase 4 | Sepsis | Full multi-parameter engine |
| Phase 5 | Fluid overload / closed-loop | Final, most-tested feature |

### 5.7.2 Rationale

- Phase 1: Standalone, low-risk, easy to demo
- Phase 2: Build composite scoring foundation
- Phase 3: Add personalization
- Phase 4: Validate full engine
- Phase 5: Finalize closed-loop control

\newpage

# Chapter 6: Prototype Description

## 6.1 System Architecture

### 6.1.1 Dual-Device Design

MediSync consists of two physical devices:

Device 1 — IV Flow Controller

- ESP8266 (WiFi microcontroller)
- NEMA 17 stepper motor + driver
- Primary IR drop sensor
- Backup IR sensor

Device 2 — Patient Monitoring Hub

- ESP32-S3 (sensor hub)
- Raspberry Pi 4 (AI/application compute)
- 128GB SATA SSD + enclosure
- Multi-parameter sensors

### 6.1.2 Communication

- Device 2 Internal: BLE/Serial (ESP32-S3 to Pi)
- Device 1 to Device 2: WiFi TCP
- Dashboard: Flask web server on Pi

\newpage

## 6.2 Device 1 — IV Flow Controller

### 6.2.1 Components

| Component | Role |
|-----------|------|
| ESP8266 | WiFi microcontroller, receives commands from Pi |
| Stepper Motor (NEMA 17) | Physically clamps/releases IV drip pipe |
| Stepper Driver | Controls stepper motor |
| Primary IR Sensor | Detects drip drops |
| Backup IR Sensor | Redundant bag-outlet detection |

### 6.2.2 Function

1. Receive target flow rate from Pi
2. Calculate required stepper position
3. Adjust clamp opening
4. Monitor actual flow via IR sensor
5. Report back to Pi

\newpage

## 6.3 Device 2 — Patient Monitoring Hub

### 6.3.1 Components

| Component | Role |
|-----------|------|
| ESP32-S3 | Sensor hub, transmits data to Pi |
| ADS1292R | ECG signal acquisition |
| AFE4490 | SpO₂ and heart rate monitoring |
| YSI Probe + ADS1115 | Body temperature measurement |
| MPU6050 | Accelerometer/gyroscope for fall detection |
| Second PPG | Peripheral perfusion |
| OEM NIBP Module | Non-invasive blood pressure |
| Raspberry Pi 4 | Central AI hub, dashboard server |
| 128GB SSD | OS, application data, logs |
| LCD + Buttons | User interface |

### 6.3.2 Function

1. Acquire multi-parameter vital signs
2. Transmit to Raspberry Pi
3. Run AI classification
4. Calculate flow rate
5. Send commands to Device 1
6. Display dashboard

\newpage

## 6.4 System Diagram

The MediSync system architecture consists of two interconnected devices:

Device 2 (Patient Monitoring Hub) contains an ESP32-S3 sensor hub that acquires ECG, SpO₂, temperature, IMU, and PPG data. This data is transmitted via BLE/Serial to a Raspberry Pi 4, which runs AI classification, hosts a Flask web dashboard, and sends flow commands via WiFi TCP. An OEM NIBP module provides blood pressure measurements.

Device 1 (IV Flow Controller) contains an ESP8266 microcontroller, stepper motor, and dual IR sensors. It receives commands from the Raspberry Pi, controls the pipe clamp, and monitors flow rate.

The two devices communicate over a local WiFi network, with Device 1 reporting flow rate feedback back to Device 2.

\newpage

## 6.5 Key Components and Clinical Rationale

### 6.5.1 Per-Device BOM with Clinical Rationale

| Category | Component | Estimated Price (INR) | Clinical Rationale |
|----------|-----------|----------------------|-------------------|
| Sensing | ECG — ADS1292R | 4,000–5,000 | Detects arrhythmias, ischemia, HRV changes |
| Sensing | SpO₂ — AFE4490 | 7,500–8,500 | Monitors oxygen saturation; critical for respiratory and sepsis detection |
| Sensing | Temperature — YSI probe + ADS1115 | 2,000–3,000 | Fever tracking; early infection indicator |
| Sensing | IMU — MPU6050 | 150–500 | Fall detection; mobility monitoring in elderly |
| Sensing | Peripheral perfusion — PPG | 400–600 | Secondary perfusion measurement; PTT for BP |
| Sensing | Respiratory rate (software) | 0 | Derived from ECG + IMU; key early warning parameter |
| Blood Pressure | OEM NIBP module | 10,000–15,000 | Validated BP measurement; hypotension detection |
| Blood Pressure | BP integration (cuff, power, isolation) | 1,700–4,300 | Multi-size cuffs; patient safety |
| IV Flow | Primary IR drop sensor | 200–400 | Accurate flow rate monitoring |
| IV Flow | Backup IR sensor | 200–400 | Redundant detection; fail-safe |
| IV Flow | Stepper motor + driver | 1,000–2,000 | Precise flow control actuation |
| IV Flow | Flow controller MCU — ESP32-S3 | 500–1,200 | Dedicated real-time processing |
| Compute | Vitals hub MCU — ESP32-S3 | 500–1,200 | Sensor data acquisition |
| Compute | Raspberry Pi 4 (4GB) | 11,000–15,000 | Edge AI inference; dashboard hosting |
| Compute | SATA SSD — 128GB | 1,500–2,500 | Audit trail; data logging |
| Compute | SSD enclosure | 500–1,000 | Storage interface |
| Enclosure | Chest belt/strap | 200–500 | Patient-worn mounting |
| Enclosure | 3D-printed PETG enclosure | 300–1,800 | Pilot enclosure |
| Enclosure | Power supply, wiring, connectors | 400–800 | System power/interconnect |
| Enclosure | LCD buttons | 100–300 | UI controls |
| Enclosure | Internal wiring harnesses | 300–800 | Signal/power wiring |
| Total | | 42,450–64,800 | |

### 6.5.2 Optional Add-On

| Item | Price (INR) | Note |
|------|-------------|------|
| OLED/LCD standalone display | 1,500–2,000 | Optional; not included in base BOM |

\newpage

## 6.6 AI Model Pipeline

### 6.6.1 Pipeline Steps

1. Data Acquisition: ESP32-S3 reads ECG, SpO₂, temperature, IMU, PPG
2. Transmission: BLE/Serial to Raspberry Pi 4
3. Preprocessing: Feature extraction (ECG features, vitals trends)
4. Classification: best_model_v2.pkl predicts condition label (0–4)
5. Flow Calculation: Based on label + trend, Pi calculates required drip rate
6. Command Dispatch: TCP over WiFi to ESP8266 (Device 1)
7. Actuation: Stepper motor adjusts pipe clamp
8. Feedback: IR sensor verifies actual flow rate; reports back to Pi
9. Dashboard: Flask web dashboard displays live data and alerts

### 6.6.2 Model Files

| File | Purpose |
|------|---------|
| best_model.pkl | Primary deployed model |
| best_model_v2.pkl | Improved version |
| feature_columns.pkl | Input feature schema |
| label_encoder.pkl | Condition label mapping |

### 6.6.3 Training Models

| Model | File |
|-------|------|
| Gradient Boosting | Gradient_Boosting.pkl |
| LightGBM | LightGBM.pkl |
| Logistic Regression | Logistic_Regression.pkl |
| Random Forest | Random_Forest.pkl |
| SVM | SVM.pkl |
| XGBoost | XGBoost.pkl |
| Stacking Ensemble | Stacking_Ensemble.pkl |

\newpage

## 6.7 Hardware Components

### 6.7.1 Device 1 — IV Flow Controller

| Component | Role |
|-----------|------|
| ESP8266 | WiFi microcontroller, receives commands from Raspberry Pi |
| Stepper Motor | Physically clamps/releases the IV drip pipe to regulate flow |
| IR / Photo Sensor | Detects drip drops to calculate actual flow rate |

### 6.7.2 Device 2 — Patient Monitor

| Component | Role |
|-----------|------|
| ESP32-S3 | Sensor hub, transmits data to Raspberry Pi |
| ADS1292R | ECG signal acquisition |
| AFE4490 | SpO₂ and heart rate monitoring |
| YSI Probe + ADS1115 | Body temperature measurement |
| MPU6050 | Accelerometer/gyroscope for fall detection |
| OEM NIBP Module | Non-invasive blood pressure |
| Raspberry Pi 4 | Central AI hub, dashboard server, command dispatcher |
| 128GB SSD | Storage for OS, application data, logs |

\newpage

# Chapter 7: Closed-Loop Control Logic

## 7.1 Control Architecture

### 7.1.1 Supervisory Closed-Loop Control

MediSync implements a supervisory closed-loop control system with three layers:

Supervisory Layer (Raspberry Pi 4): Receives vital signs (ECG, SpO₂, Temp, BP, RR, Motion) and outputs target flow rate (mL/hr) using AI classification, clinical rules, and trend analysis.

Control Layer (ESP8266): Receives target flow rate and outputs stepper position (clamp opening) using PID or feedforward control with IR feedback.

Physical Layer (IV Tube + Stepper Motor + IR Sensor): Actuates clamp to adjust drip rate; IR sensor counts drops to measure actual flow rate.

\newpage

## 7.2 Clinical Control Modes

### 7.2.1 Mode Definitions

| Mode | Trigger | Clinical Action | Safety |
|------|---------|-----------------|--------|
| Normal | Stable vitals, no alerts | Maintain prescribed flow rate | IR feedback verifies |
| Caution | Mild deviation (e.g., HR +10%, Temp 37.5–38°C) | Reduce flow by 10–20%; alert nurse | Nurse can override |
| Warning | Moderate deviation (e.g., SpO₂ less than 94%, RR greater than 24) | Reduce flow by 20–50%; escalate alert | Auto-reduce, nurse notified |
| Critical | Severe deviation (e.g., SpO₂ less than 90%, SBP less than 90) | Stop flow; full alarm; call for help | Hard stop, manual restart required |
| Fluid Overload Prevention | Cumulative volume + worsening RR/SpO₂ | Auto-reduce flow; alert | Trend-based, fail-safe |

### 7.2.2 State Transitions

The system transitions between NORMAL, CAUTION, WARNING, and CRITICAL states based on vital sign deviations. In NORMAL mode, the prescribed flow rate is maintained. When mild deviations occur, the system enters CAUTION mode and reduces flow by 10–20%. Moderate deviations trigger WARNING mode with 20–50% flow reduction. Severe deviations trigger CRITICAL mode, stopping flow entirely and requiring manual restart. As vitals normalize, the system returns to NORMAL mode.

\newpage

## 7.3 Safety Features

### 7.3.1 Safety Hierarchy

| Feature | Description | Priority |
|---------|-------------|----------|
| Fail-Safe Design | If communication lost, stepper returns to safe position | 1 |
| Redundant Sensing | Primary + backup IR sensors | 2 |
| Manual Override | Nurse can always manually adjust/stop flow | 3 |
| Hard Limits | Max flow = prescribed rate; min flow = safe minimum | 4 |
| Watchdog Timer | If Pi stops sending commands, ESP8266 enters safe mode | 5 |
| Audit Log | All commands, alerts, adjustments logged to SSD | 6 |

### 7.3.2 Fail-Safe Logic

If communication is lost, the stepper moves to a safe position (partial clamp), the nurse is alerted, and the event is logged. If the primary IR sensor fails, the system switches to the backup sensor and alerts the nurse. If both IR sensors fail, the stepper moves to a safe position and the nurse is alerted for manual check.

\newpage

## 7.4 Flow Rate Adjustment Algorithm (Clinical Description)

The flow rate adjustment follows a clinical decision protocol:

1. Baseline: Start with the clinician-prescribed flow rate.
2. Condition-based adjustment: Reduce flow for specific conditions—Heart Disease (20% reduction), Hypertension (10%), Diabetes (15%), Asthma (10%).
3. Vital sign trend adjustments: Reduce flow when SpO₂ less than 94% (30% reduction), RR greater than 24 (20%), Temp greater than 38.5°C (10%), or SBP less than 90 (40%).
4. Fluid overload prevention: If cumulative volume exceeds threshold and RR greater than 24 or SpO₂ less than 94%, aggressively reduce flow by 50%.
5. Hard limits: Never exceed prescribed rate; never go below minimum safe rate.

\newpage

## 7.5 Actuation and Feedback

### 7.5.1 Stepper Motor Control

- Motor: NEMA 17 stepper
- Driver: A4988 or DRV8825
- Steps per Revolution: 200 (1.8 degrees)
- Microstepping: 1/16
- Precision: 0.1125 degrees per microstep

### 7.5.2 IR Feedback

- Principle: IR beam interrupted by falling drop
- Output: Pulse per drop
- Calculation: Flow rate = drops/min divided by drip factor
- Drip Factor: 20 drops/mL (standard)

### 7.5.3 Closed-Loop Response

| Time (s) | Target (mL/hr) | Actual (mL/hr) | Error (%) |
|----------|----------------|----------------|-----------|
| 0 | 125 | 125 | 0 |
| 10 | 125 | 123 | 1.6 |
| 20 | 125 | 126 | -0.8 |
| 30 | 125 | 124 | 0.8 |
| 40 | 125 | 125 | 0 |

\newpage

# Chapter 8: Clinical Use Case & Workflow

## 8.1 Primary Use Case: Post-Operative Ward Monitoring

### 8.1.1 Scenario

A 65-year-old patient recovering from abdominal surgery is admitted to the surgical ward. The patient is on IV saline (125 mL/hr prescribed). A single nurse manages 6 patients.

### 8.1.2 Clinical Context in India

Surgical site infections (SSIs) are a significant concern in Indian hospitals, with reported incidence ranging from 3% to 13.4% depending on the surgical procedure and hospital setting. A multicentric study in India found an SSI incidence of 5.2%, with post-discharge surveillance detecting 66% of SSI cases. Postoperative infections account for about 24% of all nosocomial infections among 16 million patients who undergo surgery every year in India.

### 8.1.3 Workflow

1. Admission: Patient fitted with MediSync wearable (chest belt with sensors). NIBP cuff applied. IV line connected to Device 1 (flow controller).
2. Baseline: System records baseline vitals for 15 minutes. Nurse confirms prescribed flow rate via dashboard.
3. Continuous Monitoring: ESP32-S3 reads ECG, SpO₂, temperature, IMU, PPG every second. Data streamed to Raspberry Pi.
4. AI Classification: Pi runs best_model_v2.pkl every 30 seconds. Patient classified as "Healthy" (label 0) initially.
5. Trend Detection: Over 4 hours, HR increases from 72 to 95 bpm, temperature rises to 38.2°C, RR increases to 22. AI detects pattern consistent with early infection.
6. Alert: System escalates to "Caution" mode. Dashboard alerts nurse: "Possible early infection—review patient."
7. Flow Adjustment: Flow rate automatically reduced by 15% (to 106 mL/hr) pending nurse review.
8. Nurse Response: Nurse assesses patient, orders blood cultures, confirms flow adjustment. System logs event.
9. Deterioration: If vitals worsen (SpO₂ less than 94%, RR greater than 24), system escalates to "Warning" mode, reduces flow by 30%, and triggers urgent alert.
10. Recovery: As patient responds to treatment, vitals normalize. System gradually returns to "Normal" mode and prescribed flow rate.

\newpage

## 8.2 Secondary Use Case: Home-Care Dehydration Management

### 8.2.1 Scenario

A 45-year-old patient with gastroenteritis is managed at home with IV fluids. Family member supervises.

### 8.2.2 Clinical Context in India

Home-care IV fluid management is increasingly relevant in India, particularly for patients in remote or resource-limited settings. The launch of indigenous remote monitoring solutions like iLive Connect demonstrates the growing acceptance of home-based continuous monitoring in India.

### 8.2.3 Workflow

1. Setup: Home nurse installs MediSync. Prescribed rate: 100 mL/hr.
2. Monitoring: System tracks HR, RR, temperature, and IV flow.
3. Dehydration Tracking: Initial HR 105 bpm, RR 20. As fluids infuse, HR trends down to 88 bpm over 2 hours.
4. Alert: If HR fails to improve or worsens, system alerts family to contact nurse.
5. Fluid Overload Prevention: If RR increases or SpO₂ drops, system automatically reduces flow and alerts.
6. Remote Monitoring: Nurse can view dashboard remotely (via secure connection) and adjust prescriptions.

\newpage

## 8.3 Tertiary Use Case: ICU Sepsis Early Warning

### 8.3.1 Scenario

A 70-year-old patient in ICU with suspected pneumonia. On IV antibiotics and fluids.

### 8.3.2 Clinical Context in India

Sepsis disproportionately affects younger and lower-socioeconomic demographics in India, yielding high mortality. One in two ICU patients has sepsis, with 27.6% mortality among them. Early recognition and timely intervention are crucial for improving outcomes. AI-enhanced Early Warning Systems have demonstrated significant improvements in Indian ICUs, reducing mortality from 36% to 25% (p=0.001) and shortening ICU stay from 8.7 to 6.4 days (p=0.004).

### 8.3.3 Workflow

1. Continuous Monitoring: All sensors active. NIBP every 15 minutes.
2. Sepsis Screening: AI model continuously evaluates composite score (NEWS2/qSOFA-style).
3. Early Detection: At hour 6, HR 110, RR 26, Temp 38.8°C, SpO₂ 92%, SBP 95. System flags "Sepsis Warning."
4. Auto-Response: Flow rate reduced by 40% (fluid caution in sepsis). Alert sent to ICU team.
5. Clinician Intervention: Sepsis bundle initiated. Vasopressors started. Fluid strategy adjusted.
6. Closed-Loop Support: System continues to monitor and adjust flow based on evolving vitals.

\newpage

## 8.4 Workflow Diagram

The clinical workflow begins with patient admission, followed by fitting the wearable sensors, NIBP cuff, and IV device. Baseline recording takes 15 minutes. Continuous monitoring then begins, with data flowing to the AI classification engine. The system calculates flow rate, sends commands to Device 1, actuates the stepper motor, receives IR feedback, and loops back to the Raspberry Pi. The nurse monitors the dashboard throughout.

\newpage

## 8.5 User Roles and Responsibilities

| Role | Responsibilities |
|------|------------------|
| Nurse | Monitor dashboard, respond to alerts, confirm flow adjustments |
| Doctor | Review trends, adjust prescriptions, authorize changes |
| Patient | Wear sensors, report symptoms |
| Family (home care) | Supervise, contact nurse if alerted |
| Biomedical Engineer | Maintain equipment, calibrate sensors |

\newpage

# Chapter 9: Validation Plan / Limitations

## 9.1 Validation Plan

### 9.1.1 Phases

| Phase | Objective | Methodology | Success Criteria |
|-------|-----------|-------------|------------------|
| Bench Testing | Verify sensor accuracy | Compare against reference devices | ECG: ±5% HR error; SpO₂: ±2%; Temp: ±0.2°C; NIBP: ±5 mmHg |
| Flow Control Testing | Verify stepper accuracy | Gravimetric flow measurement | Flow error less than 10% of setpoint |
| Closed-Loop Testing | Verify control logic | Simulate vital sign changes | Response time less than 30 sec; overshoot less than 15% |
| Human Factors | Verify usability | Nurse feedback | SUS score greater than 70; no critical use errors |
| Clinical Pilot | Real-world validation | 10–20 patients | Detection sensitivity greater than 80%; false alarm rate less than 20% |
| Regulatory Prep | Prepare for certification | Gap analysis | Complete documentation |

\newpage

## 9.2 Bench Testing

### 9.2.1 ECG Testing

- Reference: 12-lead ECG simulator
- Metrics: HR accuracy, rhythm detection
- Target: ±5 bpm

### 9.2.2 SpO₂ Testing

- Reference: Clinical pulse oximeter
- Metrics: SpO₂ accuracy (90–100%)
- Target: ±2%
- Critical Consideration: Validation must include Indian subjects across Fitzpatrick skin types I–VI to address the documented bias in pulse oximetry for pigmented skin

### 9.2.3 Temperature Testing

- Reference: Calibrated thermometer
- Metrics: Temperature accuracy
- Target: ±0.2°C

### 9.2.4 NIBP Testing

- Reference: Sphygmomanometer
- Metrics: Systolic, diastolic accuracy
- Target: ±5 mmHg

\newpage

## 9.3 Flow Control Testing

### 9.3.1 Gravimetric Method

1. Set target flow rate
2. Collect fluid for 5 minutes
3. Weigh collected fluid
4. Calculate actual flow rate
5. Compare to target

### 9.3.2 Test Matrix

| Target (mL/hr) | Actual (mL/hr) | Error (%) |
|----------------|----------------|-----------|
| 50 | 52 | 4.0 |
| 100 | 97 | -3.0 |
| 150 | 153 | 2.0 |
| 200 | 195 | -2.5 |

\newpage

## 9.4 Closed-Loop Testing

### 9.4.1 Simulated Vital Sign Changes

1. Baseline: HR 72, SpO₂ 98%, Temp 36.8°C
2. Induce tachycardia: HR 110
3. Observe flow response
4. Induce desaturation: SpO₂ 92%
5. Observe flow response

### 9.4.2 Response Metrics

| Metric | Target |
|--------|--------|
| Response time | Less than 30 sec |
| Overshoot | Less than 15% |
| Steady-state error | Less than 5% |

\newpage

## 9.5 Human Factors Testing

### 9.5.1 Usability Metrics

- SUS Score: Greater than 70
- Task Completion: Greater than 90%
- Error Rate: Less than 5%
- Satisfaction: Greater than 4/5

### 9.5.2 Feedback Areas

- Dashboard readability
- Alert clarity
- Workflow integration
- Trust in automation

\newpage

## 9.6 Clinical Pilot

### 9.6.1 Design

- Patients: 10–20
- Setting: Hospital ward (Indian tertiary care)
- Duration: 72 hours per patient
- Comparison: Standard monitoring

### 9.6.2 Metrics

| Metric | Target |
|--------|--------|
| Detection sensitivity | Greater than 80% |
| False alarm rate | Less than 20% |
| Nurse satisfaction | Greater than 4/5 |
| Adverse events | 0 |

\newpage

## 9.7 Validation Metrics

| Parameter | Target | Method |
|-----------|--------|--------|
| ECG HR accuracy | ±5 bpm | vs. 12-lead ECG |
| SpO₂ accuracy | ±2% (90–100%) | vs. clinical pulse oximeter |
| Temperature accuracy | ±0.2°C | vs. calibrated thermometer |
| NIBP accuracy | ±5 mmHg | vs. sphygmomanometer |
| RR accuracy | ±2 breaths/min | vs. manual count |
| Flow rate accuracy | ±10% | Gravimetric |
| Alert latency | Less than 30 sec | Timestamped event log |
| Uptime | Greater than 99% | 72-hour continuous run |

\newpage

## 9.8 Limitations

### 9.8.1 Device Limitations

1. Not a Diagnostic Device: Detects deterioration patterns, not specific diseases
2. Sensor Limitations:
   - ECG: Single-lead; not for full 12-lead interpretation
   - SpO₂: Affected by motion, low perfusion, nail polish, and skin pigmentation
   - NIBP: Intermittent; affected by motion
   - Temperature: Skin-surface; may lag core temperature
   - IMU: Affected by bed transfers
3. AI Model Limitations:
   - Trained on synthetic and limited real-world data
   - Five-condition classification is not exhaustive
   - Does not account for medications, comorbidities
4. Closed-Loop Safety:
   - Limited to IV flow adjustment
   - Requires clinician oversight
   - Fail-safes must be rigorously tested
5. Regulatory: Requires approval before clinical use
6. Cost: 42,450–64,800 INR per device; scale needed for adoption

\newpage

## 9.9 Excluded Conditions

| Condition | Reason for Exclusion |
|-----------|---------------------|
| DKA | Requires blood glucose measurement |
| Traumatic Brain Injury | Requires ICP monitoring, imaging |
| Hemorrhagic Shock | Requires invasive BP, hemoglobin |
| Snake Bite | Requires specific antivenom, lab tests |
| Hyponatremia | Requires electrolyte panel |
| Kidney Stones | Requires imaging, urinalysis |
| Any lab-based diagnosis | Sensors cannot measure blood chemistry |

\newpage

# Chapter 10: Budget Summary

## 10.1 Per-Device BOM

| Category | Component | Estimated Price (INR) |
|----------|-----------|----------------------|
| Sensing | ECG — ADS1292R | 4,000–5,000 |
| Sensing | SpO₂ — AFE4490 | 7,500–8,500 |
| Sensing | Temperature — YSI probe + ADS1115 | 2,000–3,000 |
| Sensing | IMU — MPU6050 | 150–500 |
| Sensing | Peripheral perfusion — PPG | 400–600 |
| Sensing | Respiratory rate (software) | 0 |
| Blood Pressure | OEM NIBP module | 10,000–15,000 |
| Blood Pressure | BP integration (cuff, power, isolation) | 1,700–4,300 |
| IV Flow | Primary IR drop sensor | 200–400 |
| IV Flow | Backup IR sensor | 200–400 |
| IV Flow | Stepper motor + driver | 1,000–2,000 |
| IV Flow | Flow controller MCU — ESP32-S3 | 500–1,200 |
| Compute | Vitals hub MCU — ESP32-S3 | 500–1,200 |
| Compute | Raspberry Pi 4 (4GB) | 11,000–15,000 |
| Compute | SATA SSD — 128GB | 1,500–2,500 |
| Compute | SSD enclosure | 500–1,000 |
| Enclosure | Chest belt/strap | 200–500 |
| Enclosure | 3D-printed PETG enclosure | 300–1,800 |
| Enclosure | Power supply, wiring, connectors | 400–800 |
| Enclosure | LCD buttons | 100–300 |
| Enclosure | Internal wiring harnesses | 300–800 |
| Total | | 42,450–64,800 |

\newpage

## 10.2 Optional Add-On

| Item | Price (INR) | Note |
|------|-------------|------|
| OLED/LCD standalone display | 1,500–2,000 | Optional; not included in base BOM |

\newpage

## 10.3 One-Time Investment for Market Readiness

| Item | Estimated Range (INR) | Notes |
|------|----------------------|-------|
| Custom PCB design & prototype fabrication | 15,000–50,000 | One-time; converts breadboard to manufacturable board |
| Injection-molded enclosure tooling | 50,000–2,00,000+ | Later-stage; not required for 3D-printed pilot units |
| Electrical safety & EMC pre-compliance testing | Varies by lab | Recommended before formal certification |
| 3D printer | 50,000–60,000 | Prototype/manufacturing equipment; capital expense |

\newpage

## 10.4 Total Budget — Everything Currently Quantified

| Budget Layer | Estimated Range (INR) | Treatment |
|--------------|----------------------|-----------|
| Per-device BOM | 42,450–64,800 | Recurring cost per device |
| Optional OLED/LCD display | 1,500–2,000 | Only if selected |
| 3D printer | 50,000–60,000 | One-time equipment |
| Custom PCB design & prototype run | 15,000–50,000 | One-time engineering |
| Injection-molded enclosure tooling | 50,000–2,00,000+ | One-time production tooling |
| Grand Total | 1,57,450–4,36,800+ | Excludes EMC testing |

\newpage

## 10.5 Budget Interpretation for Incubator Review

- Pilot hardware cost: approximately 42,450–64,800 INR per completed device (before optional display)
- Initial setup/capital requirement: Add 3D printer + PCB/prototyping budget as applicable
- Production transition: Injection-molded tooling should be considered only when moving beyond 3D-printed pilot units
- Final funding ask: Should be based on actual vendor quotations, especially for OEM NIBP module, Raspberry Pi/SSD supply, PCB fabrication, and tooling

\newpage

# Chapter 11: Conclusion & Next Steps

## 11.1 Conclusion

### 11.1.1 Summary

MediSync represents a significant advancement in continuous patient monitoring and automated fluid delivery for Indian healthcare settings. By integrating clinical-grade sensors, edge AI, and closed-loop control, the system addresses critical gaps in clinical workflow:

1. Continuous Monitoring: Replaces episodic vital sign checks with real-time data streams.
2. Early Warning: AI-based multi-parameter analysis detects deterioration patterns hours before clinical recognition.
3. Automated Fluid Safety: Closed-loop control prevents fluid overload and adjusts infusion rates based on real-time physiological feedback.
4. Workload Reduction: Automates routine monitoring and adjustment, allowing nurses to focus on high-acuity tasks—critical given India's nursing shortage of 1.96 nurses per 1,000 population.
5. Scalability: Designed for ward, ICU, and home-care settings; suitable for resource-constrained environments.

### 11.1.2 Clinical Evidence Supporting Need

The clinical need for MediSync in India is compelling:

- Sepsis: 1 in 2 ICU patients affected; 27.6% mortality; 11.3 million cases annually
- Nursing Shortage: 1.96 nurses per 1,000 population vs. WHO recommendation of 3
- COPD: 55 million Indians affected; 3.6% of total disease burden from pneumonia and respiratory infections
- Falls: 43.6% of elderly report falls; 78.1% sustain injuries
- Post-Operative Complications: SSI incidence 5.2–13.4%
- Fluid Overload: Positive fluid balance after 72 hours associated with increased morbidity and mortality

### 11.1.3 Positioning

MediSync is an AI-powered closed-loop saline IV monitoring system that provides continuous early-warning monitoring across common ward and home-care scenarios, with automated fluid-safety intervention. It is not a diagnostic device; rather, it detects abnormal vital sign trajectories associated with conditions such as sepsis, respiratory infection, post-operative deterioration, and fluid overload, enabling timely clinician intervention and reducing nursing workload.

\newpage

## 11.2 Next Steps

| Phase | Timeline | Key Activities |
|-------|----------|----------------|
| Prototype Refinement | 1–2 months | Finalize sensor integration; validate NIBP module; optimize enclosure |
| AI Model Enhancement | 2–3 months | Expand training data; validate against real-world vitals; improve condition classification |
| Bench Testing | 2–3 months | Verify sensor accuracy, flow control, closed-loop response |
| Human Factors Testing | 1–2 months | Nurse feedback; dashboard usability; alert fatigue assessment |
| Clinical Pilot | 3–6 months | 10–20 patients; compare to standard monitoring; refine algorithms |
| Regulatory Preparation | 6–12 months | Gap analysis; pre-compliance testing; documentation for CDSCO |
| Manufacturing Scale-Up | 12–18 months | PCB fabrication; injection-molded tooling; vendor negotiations |
| Market Launch | 18–24 months | Regulatory approval; clinical partnerships; commercial rollout |

\newpage

## 11.3 Immediate Action Items

1. Obtain vendor quotations for OEM NIBP module, Raspberry Pi 4, SSD, and PCB fabrication.
2. Validate AI model on real-world vital sign data (partner with Indian hospital for retrospective data).
3. Conduct bench testing of sensor accuracy with Indian subjects across skin types.
4. Develop regulatory strategy for CDSCO approval.
5. Secure incubator funding based on revised budget (1,57,450–4,36,800+ INR).
6. Build clinical partnerships for pilot deployment in Indian tertiary care hospitals.
7. Refine closed-loop safety logic with clinician input.
8. Document all design decisions for regulatory submission.

\newpage

## 11.4 Final Positioning Statement

MediSync is an AI-powered closed-loop saline IV monitoring system that provides continuous early-warning monitoring across common ward and home-care scenarios, with automated fluid-safety intervention. It is not a diagnostic device; rather, it detects abnormal vital sign trajectories associated with conditions such as sepsis, respiratory infection, post-operative deterioration, and fluid overload, enabling timely clinician intervention and reducing nursing workload in Indian healthcare settings.

\newpage

# References

1. Interpretable ML Techniques in ECG-Based Heart Disease Classification. PMC9818170
2. Wearable ECG Device and Machine Learning for Heart Monitoring. MDPI Sensors
3. Imbalanced ECG Signal-Based Heart Disease Classification Using Ensemble ML. PMC9589052
4. ML-Based Respiration Rate and SpO₂ Estimation Using PPG. MDPI Bioengineering
5. ML-Based Prediction Method for COPD Classification Based on Pulse Oximetry. Zenodo
6. A Machine Learning Model for Predicting Hospitalization in Patients with Respiratory Symptoms. MDPI JCM
7. Assessing the Efficacy of Various ML Algorithms in Predicting BP Using PTT. PMC11816412
8. Development of Real-Time Cuffless BP Measurement Using ECG Electrodes and Microphone via PTT. PMC9920508
9. Pulse Transit Time Based Continuous Cuffless BP Estimation. Nature Scientific Reports
10. Multi-Modal Stacking Ensemble for the Diagnosis of Cardiovascular Diseases. MDPI JPM
11. Stress Classification and Vital Signs Forecasting for IoT-Health Monitoring. JETIR
12. Performance Effectiveness of Vital Parameter Combinations for Early Warning of Sepsis. PMC9566305
13. Wearable Vital-Sign Sensors for Early Detection of Severe Dengue and Sepsis in Resource-Limited Settings. PMC12605882
14. i-CardiAx: Wearable IoT-Driven System for Early Sepsis Detection. arXiv
15. Respiratory Monitoring in Motion. PubMed
16. Comparison between Chest-Worn Accelerometer and Gyroscope Performance for HR and RR Monitoring. MDPI Biosensors
17. Thakur, C. (2025). How can high nursing workloads in India be reduced? Solutions for healthcare leaders. Indian Journal of Community Medicine and Public Health.
18. Virk, H.S., et al. (2025). Unraveling Sepsis Epidemiology in a Low- and Middle-Income Intensive Care Setting: MARS-India. Clinical Infectious Diseases, 80(1), 101.
19. PatientsEngage. (2025). Understanding Sepsis - Frequently Asked Questions.
20. Dharanindra, M., et al. (2026). Tele-Intensive Care Unit-associated Early Recognition of In-hospital Hemodynamic Events: A Multicenter Observational Study. Indian Journal of Critical Care Medicine.
21. Rangappa, R. (2025). Continuous Wireless Monitoring Integrated with Medical Emergency Team Services. Manipal Hospital Sarjapur Road, Bengaluru.
22. India launches world's first Doctor-Led AI healthcare ecosystem iLive Connect. Odisha TV.
23. Sepsis Management in India: The Role of AI-Enhanced Early Warning Systems in Reducing ICU Mortality. Scilit.
24. India carries Asia's heaviest lung disease burden, Lancet study finds. Economic Times Health.
25. Surgical site infection statistics in India. Government of India / PubMed.
26. Elderly fall injuries in India. Longitudinal Aging Study India / MDPI.
27. Pulse oximetry accuracy and skin pigmentation. Indian Dermatology Online Journal / The Wire.
28. ECG interpretation accuracy in Indian primary care. Various sources.

\newpage

# Appendices

## Appendix A: Sensor Specifications

### A.1 ECG — ADS1292R

| Parameter | Specification |
|-----------|---------------|
| Channels | 2 |
| Resolution | 24-bit |
| Data Rate | 125 SPS to 8 kSPS |
| Input Referred Noise | 1 microvolt peak-to-peak |
| Gain | 1–12 |
| Interface | SPI |
| Supply | 2.7–5.5 V |

### A.2 SpO₂ — AFE4490

| Parameter | Specification |
|-----------|---------------|
| Resolution | 22-bit |
| LED Current | 0–50 mA |
| Wavelengths | 660 nm / 940 nm |
| Interface | SPI |
| Supply | 2.7–5.5 V |

### A.3 Temperature — YSI Probe + ADS1115

| Parameter | Specification |
|-----------|---------------|
| Probe | YSI 2252 ohm at 25°C |
| ADC | ADS1115 (16-bit) |
| Interface | I2C |
| Accuracy | ±0.1°C |
| Range | 0–50°C |

### A.4 IMU — MPU6050

| Parameter | Specification |
|-----------|---------------|
| Axes | 6 (3 accel + 3 gyro) |
| Accel Range | ±2g, ±4g, ±8g, ±16g |
| Gyro Range | ±250, ±500, ±1000, ±2000 degrees/s |
| Interface | I2C |
| Supply | 2.375–3.46 V |

### A.5 NIBP — UN300C-Class

| Parameter | Specification |
|-----------|---------------|
| Method | Oscillometric |
| Validation | ISO 81060-2 / AAMI |
| Range | 0–300 mmHg |
| Accuracy | ±5 mmHg |
| Interface | UART |
| Supply | 5 V |

\newpage

## Appendix B: AI Model Details

### B.1 Model Files

| File | Purpose |
|------|---------|
| best_model.pkl | Primary deployed model |
| best_model_v2.pkl | Improved version |
| feature_columns.pkl | Input feature schema |
| label_encoder.pkl | Condition label mapping |

### B.2 Training Models

| Model | File |
|-------|------|
| Gradient Boosting | Gradient_Boosting.pkl |
| LightGBM | LightGBM.pkl |
| Logistic Regression | Logistic_Regression.pkl |
| Random Forest | Random_Forest.pkl |
| SVM | SVM.pkl |
| XGBoost | XGBoost.pkl |
| Stacking Ensemble | Stacking_Ensemble.pkl |

### B.3 Feature Schema

| Feature | Description |
|---------|-------------|
| HR | Heart rate |
| SpO₂ | Oxygen saturation |
| Temp | Body temperature |
| RR | Respiratory rate |
| SBP | Systolic blood pressure |
| DBP | Diastolic blood pressure |
| HRV | Heart rate variability |
| Motion | Activity level |

\newpage

## Appendix C: Clinical Validation Protocols

### C.1 SpO₂ Validation Protocol (India-Specific)

Objective: Validate SpO₂ accuracy across Fitzpatrick skin types I–VI in Indian population.

Method:

1. Recruit 30 healthy volunteers across all skin types
2. Induce controlled desaturation (target SpO₂ 80–100%)
3. Compare MediSync SpO₂ to arterial blood gas (SaO₂) reference
4. Calculate bias and precision (ARMS) per skin type
5. Apply skin-tone-aware calibration if needed

Success Criteria: ARMS less than or equal to 3% across all skin types

### C.2 ECG Validation Protocol

Objective: Validate HR accuracy and rhythm detection.

Method:

1. Compare MediSync ECG to 12-lead ECG in 20 patients
2. Calculate HR error, arrhythmia detection sensitivity/specificity
3. Assess noise rejection during motion

Success Criteria: HR error ±5 bpm; arrhythmia sensitivity greater than 90%

### C.3 NIBP Validation Protocol

Objective: Validate NIBP accuracy against reference sphygmomanometer.

Method:

1. Sequential measurements in 30 patients
2. Compare systolic, diastolic, MAP
3. Assess cuff size effects

Success Criteria: Mean error ±5 mmHg; SD less than or equal to 8 mmHg

\newpage

## Appendix D: Regulatory Checklist

| Requirement | Standard | Status |
|-------------|----------|--------|
| Electrical Safety | IEC 60601-1 | Pending |
| EMC | IEC 60601-1-2 | Pending |
| Software | IEC 62304 | Pending |
| NIBP | ISO 81060-2 | Pending |
| SpO₂ | ISO 80601-2-61 | Pending |
| Risk Management | ISO 14971 | Pending |
| Quality System | ISO 13485 | Pending |
| CDSCO Registration | Medical Device Rules 2017 | Pending |

---

Document Version: 3.0 (Clinical Edition)
Date: 2025
Author: Jinmoyee Thakuria
Target Audience: Healthcare Professionals, Clinical Investigators, Incubator Reviewers
License: For academic and research purposes. Clinical use requires regulatory approval.
