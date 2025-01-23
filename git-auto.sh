#!/bin/bash
git add .
timestamp=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "Auto-update: $timestamp"
git push origin main
