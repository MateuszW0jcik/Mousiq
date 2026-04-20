import pandas as pd
import matplotlib.pyplot as plt
import os
from pathlib import Path


def create_performance_charts(csv_file, metric_name, output_dir):
    df = pd.read_csv(csv_file)

    df["sequence"] = df["timestamp"] - df["timestamp"].iloc[0]

    value_column = df.columns[1]

    plt.figure(figsize=(12, 6))
    plt.plot(df['sequence'], df[value_column], linewidth=1.5, color='#2563eb')

    plt.xlabel('Czas (s)', fontsize=12)
    plt.ylabel(metric_name, fontsize=12)
    plt.title(f'{metric_name} - Monolit', fontsize=14, fontweight='bold')
    plt.grid(True, alpha=0.3)

    avg_value = df[value_column].mean()
    max_value = df[value_column].max()
    min_value = df[value_column].min()

    stats_text = f'Średnia: {avg_value:.2f}\nMax: {max_value:.2f}\nMin: {min_value:.2f}'
    plt.text(0.02, 0.98, stats_text, transform=plt.gca().transAxes,
             verticalalignment='top', bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))

    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, f'{metric_name.replace(" ", "_").lower()}_chart.png')
    plt.tight_layout()
    plt.savefig(output_file, dpi=300, bbox_inches='tight')
    plt.close()

    return df


def create_all_charts(cpu_csv, heap_csv, nonheap_csv, output_dir):
    create_performance_charts(cpu_csv, 'CPU Usage (%)', output_dir)
    create_performance_charts(heap_csv, 'Heap Memory (MB)', output_dir)
    create_performance_charts(nonheap_csv, 'Non-Heap Memory (MB)', output_dir)


if __name__ == "__main__":
    test_types = ['endurance', 'load', 'spike', 'stress']

    for test_type in test_types:
        test_dir = os.path.join("results", test_type)
        prometheus_dir = os.path.join(test_dir, 'prometheus-data')

        cpu_csv = os.path.join(prometheus_dir, 'cpu_usage.csv')
        heap_csv = os.path.join(prometheus_dir, 'heap_mb.csv')
        nonheap_csv = os.path.join(prometheus_dir, 'nonheap_mb.csv')

        if not os.path.exists(prometheus_dir):
            continue

        missing_files = []
        for file_path, file_name in [(cpu_csv, 'cpu_usage.csv'),
                                     (heap_csv, 'heap_mb.csv'),
                                     (nonheap_csv, 'nonheap_mb.csv')]:
            if not os.path.exists(file_path):
                missing_files.append(file_name)

        if missing_files:
            continue

        charts_dir = os.path.join(test_dir, 'charts')

        create_all_charts(cpu_csv, heap_csv, nonheap_csv, charts_dir)
