# **OCR-SOL** — Document OCR Engine  
_MERN API + Computer Vision pipeline + optional **LLM post-correction**_

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)](#)
[![Express](https://img.shields.io/badge/Express-^4-000000?logo=express&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?logo=mongodb&logoColor=white)](#)
[![OpenCV](https://img.shields.io/badge/OpenCV-4.x-5C3EE8?logo=opencv&logoColor=white)](#)
[![Tesseract|PaddleOCR](https://img.shields.io/badge/OCR-Tesseract%20%7C%20PaddleOCR-6c3bf5)](#)
[![LLM](https://img.shields.io/badge/AI-Optional%20LLM%20Post--Correction-8A2BE2)](#)
[![License](https://img.shields.io/badge/License-MIT%20or%20Private-999999)](#)

> ✂️ **Zero-friction OCR.** Upload an image/PDF → get **clean, copy-ready text** in one click.  
> Quality is boosted by **pre-processing (deskew/denoise/binarize)** and **confidence-gated post-correction** (optional LLM).

---

## 🔥 Why OCR-SOL?

Most OCR fails on **phone photos, scans, skewed pages, and noisy receipts**. OCR-SOL wraps proven OCR engines with a **CV pipeline** that stabilizes inputs and a **post-correction** stage that fixes numbers, dates, punctuation, and spacing—calling an LLM **only** for low-confidence spans. Result: **cleaner text, fewer artifacts, stable latency**.

---

## 📌 Table of Contents

1. [Features](#-features)  
2. [Architecture](#-architecture)  
3. [Tech Stack](#-tech-stack)  
4. [Monorepo Layout](#-monorepo-layout)  
5. [Quick Start](#-quick-start)  
6. [Configuration](#-configuration)  
7. [Running with Docker](#-running-with-docker)  
8. [API Surface](#-api-surface)  
9. [AI/CV Pipeline](#-aicv-pipeline)  
10. [Security & Privacy](#-security--privacy)  
11. [Testing & Quality](#-testing--quality)  
12. [Observability & Ops](#-observability--ops)  
13. [Roadmap](#-roadmap)  
14. [License](#-license)  
15. [TL;DR](#tldr)

---

## 🚀 Features

- **Multi-format input:** JPG/PNG/TIFF and PDFs (multi-page)  
- **CV pre-processing:** auto-rotate, deskew, denoise, adaptive binarization, contrast boost  
- **Engine routing:** Tesseract/PaddleOCR by language; optional cloud OCR for hard scripts  
- **Post-correction:** locale spell rules, numeric/date normalization, whitespace & punctuation fixes  
- **LLM assist (optional):** only for low-confidence spans with strict edit-distance guards  
- **Structure hints:** paragraphs, bullet normalization, light table extraction → Markdown  
- **Copy-ready output:** plain text + optional Markdown + per-token confidence stats  
- **Privacy by default:** ephemeral processing; opt-in PII redaction in logs

---

## 🧭 Architecture

flowchart LR
  A[Client App / CLI] -->|HTTP Upload| B[API - Node/Express]
  B -->|enqueue| Q[Job Queue]
  Q --> W[Worker - CV + OCR]
  W --> CV[Pre-process (OpenCV)]
  W --> ENG[OCR Engine (Tesseract/PaddleOCR)]
  W --> PC[Post-correct (Rules + Optional LLM)]
  PC --> S[(MongoDB)]
  B --> S
  W --> ST[Storage (Local/S3-like)]
