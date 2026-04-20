import pandas as pd
import matplotlib.pyplot as plt
import os


def load_monolith_cpu(csv_file):
    df = pd.read_csv(csv_file)
    df["sequence"] = df["timestamp"] - df["timestamp"].iloc[0]
    value_column = df.columns[1]  # CPU column
    return df[["sequence", value_column]].rename(columns={value_column: "monolith_cpu"})


def load_microservices_cpu(csv_file):
    df = pd.read_csv(csv_file)
    df["sequence"] = df["timestamp"] - df["timestamp"].iloc[0]
    df["microservices_cpu"] = df.iloc[:, 1:7].sum(axis=1)
    return df[["sequence", "microservices_cpu"]]


def create_comparison_chart(monolith_csv, microservices_csv, output_dir):
    mono_df = load_monolith_cpu(monolith_csv)
    micro_df = load_microservices_cpu(microservices_csv)

    min_len = min(len(mono_df), len(micro_df))
    mono_df = mono_df.iloc[:min_len]
    micro_df = micro_df.iloc[:min_len]

    plt.figure(figsize=(14, 7))
    plt.gcf().set_facecolor((245 / 255, 245 / 255, 245 / 255))
    plt.gca().set_facecolor((245 / 255, 245 / 255, 245 / 255))

    plt.plot(
        mono_df["sequence"],
        mono_df["monolith_cpu"],
        label="Monolit",
        linewidth=1.8,
        color="#2563eb"
    )

    plt.plot(
        micro_df["sequence"],
        micro_df["microservices_cpu"],
        label="Mikroserwisy (suma)",
        linewidth=1.8,
        color="#dc2626"
    )

    plt.xlabel("Czas (s)", fontsize=12)
    plt.ylabel("Zyżycie CPU (%)", fontsize=12)
    # plt.title("Spike Test – Zużycie CPU\nMonolit vs Mikroserwisy", fontsize=14, fontweight="bold")
    plt.legend()
    plt.grid(True, alpha=0.3)

    mono_avg = mono_df["monolith_cpu"].mean()
    mono_max = mono_df["monolith_cpu"].max()
    micro_avg = micro_df["microservices_cpu"].mean()
    micro_max = micro_df["microservices_cpu"].max()

    stats_text = (
        f"Monolit – średnia: {mono_avg:.2f}%, max: {mono_max:.2f}%\n"
        f"Mikroserwisy – średnia: {micro_avg:.2f}%, max: {micro_max:.2f}%"
    )

    plt.text(
        0.02, 0.98, stats_text,
        transform=plt.gca().transAxes,
        verticalalignment="top",
        bbox=dict(boxstyle="round", facecolor="wheat", alpha=0.5)
    )

    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "spike_cpu_comparison.png")

    plt.tight_layout()
    plt.savefig(output_file, dpi=300, bbox_inches="tight")
    plt.close()

    print(f"✔ Wykres zapisany: {output_file}")


if __name__ == "__main__":
    monolith_cpu = "monolith/results/spike/prometheus-data/cpu_usage.csv"
    microservices_cpu = "microservices/results/spike/prometheus-data/cpu_usage.csv"

    output_dir = "comparison_charts"

    if not os.path.exists(monolith_cpu) or not os.path.exists(microservices_cpu):
        print("❌ Brakuje plików CSV dla spike testu")
    else:
        create_comparison_chart(monolith_cpu, microservices_cpu, output_dir)
