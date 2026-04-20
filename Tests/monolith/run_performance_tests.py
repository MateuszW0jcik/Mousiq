import subprocess
import time
import os
import sys

TESTS = ["load", "stress", "spike", "endurance"]

EXPORT_SCRIPT = "export_prometheus_data.py"
JMETER_PATH = r"C:\ProgramData\chocolatey\bin\jmeter.cmd"

for test in TESTS:
    print(f"Running {test} test...")

    subprocess.run(
        ["docker-compose", "-f", "../../BackendMonolit/Mousiq/docker-compose.yml", "up", "-d"],
        check=True,
    )

    time.sleep(60)

    subprocess.run(
        [JMETER_PATH, "-n", "-t", "../test-plans/warmup.jmx"],
        check=True,
    )
    time.sleep(60)

    os.makedirs(f"results/{test}", exist_ok=True)

    subprocess.run(
        [
            JMETER_PATH,
            "-n",
            "-t",
            f"../test-plans/{test}-test.jmx",
            "-l",
            f"results/{test}/{test}-results.csv",
            "-e",
            "-o",
            f"results/{test}/{test}-report",
        ],
        check=True,
    )

    subprocess.run(
        ["python", EXPORT_SCRIPT, test],
        check=True,
    )

    subprocess.run(
        ["docker-compose", "-f", "../../BackendMonolit/Mousiq/docker-compose.yml", "down", "-v"],
        check=True,
    )

    time.sleep(180)
