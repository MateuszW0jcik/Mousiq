import sys
import time
import os
import csv
import requests
import json

if len(sys.argv) != 2:
    print("Usage: python export_prometheus_data.py {load|stress|spike|endurance}")
    sys.exit(1)

TEST_TYPE = sys.argv[1]

PROMETHEUS_URL = "http://localhost:9090"
OUTPUT_DIR = os.path.join("results", TEST_TYPE)
PROM_DIR = os.path.join(OUTPUT_DIR, "prometheus-data")

os.makedirs(PROM_DIR, exist_ok=True)

END_TIME = int(time.time())

if TEST_TYPE == "load":
    START_TIME = END_TIME - 900
    STEP = "15s"
elif TEST_TYPE == "stress":
    START_TIME = END_TIME - 900
    STEP = "15s"
elif TEST_TYPE == "spike":
    START_TIME = END_TIME - 600
    STEP = "10s"
elif TEST_TYPE == "endurance":
    START_TIME = END_TIME - 3600
    STEP = "60s"
else:
    print(f"Unknown test type: {TEST_TYPE}")
    sys.exit(1)


def query_range(query, filename):
    r = requests.get(
        f"{PROMETHEUS_URL}/api/v1/query_range",
        params={
            "query": query,
            "start": START_TIME,
            "end": END_TIME,
            "step": STEP,
        },
        timeout=30,
    )
    r.raise_for_status()
    with open(os.path.join(PROM_DIR, f"{filename}_range.json"), "w") as f:
        f.write(r.text)
    return r.json()


def json_to_csv_microservices(json_data, csv_file, metric_name):
    app_names = [
        result["metric"]["application"]
        for result in json_data.get("data", {}).get("result", [])
    ]

    if not app_names:
        return

    timestamps = [ts for ts, _ in json_data["data"]["result"][0]["values"]]

    rows = []
    for i, ts in enumerate(timestamps):
        row = {"timestamp": ts}

        for app in app_names:
            row[f"{app}_{metric_name}"] = 0.0

        for result in json_data.get("data", {}).get("result", []):
            app = result["metric"]["application"]
            value = result["values"][i][1]
            row[f"{app}_{metric_name}"] += value
        rows.append(row)

    fieldnames = ["timestamp"] + [f"{app}_{metric_name}" for app in app_names]
    with open(csv_file, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


# CPU
cpu_data = query_range("process_cpu_usage * 100", "cpu_usage")
json_to_csv_microservices(cpu_data, os.path.join(PROM_DIR, "cpu_usage.csv"), "cpu_percent")

# HEAP
heap_data = query_range('jvm_memory_used_bytes{area="heap"} / 1024 / 1024', "heap_used_mb")
json_to_csv_microservices(heap_data, os.path.join(PROM_DIR, "heap_mb.csv"), "heap_mb")

# NON-HEAP
nonheap_data = query_range('jvm_memory_used_bytes{area="nonheap"} / 1024 / 1024', "nonheap_used_mb")
json_to_csv_microservices(nonheap_data, os.path.join(PROM_DIR, "nonheap_mb.csv"), "nonheap_mb")
