import json
import os
import sys
import matplotlib.pyplot as plt
import pandas as pd
from dominate import document
from dominate.tags import *
from subprocess import call
import numpy as np


def create_directory(first_commit_hash, second_commit_hash):
    directory_name = f'./graphs/{first_commit_hash}-{second_commit_hash}/'

    if not os.path.exists(directory_name):
        os.makedirs(directory_name)
        print("The new directory is created!")

    return directory_name


def load_json_data(first_commit_hash, second_commit_hash):
    before_optimization_file = f'./results/{first_commit_hash}.json'
    after_optimization_file = f'./results/{second_commit_hash}.json'

    with open(before_optimization_file, 'r') as f:
        before_optimization_data = json.load(f)

    with open(after_optimization_file, 'r') as f:
        after_optimization_data = json.load(f)

    return before_optimization_data, after_optimization_data


def create_bar_chart(x_labels, before_data, after_data, first_commit_hash, second_commit_hash, title, ylabel, file_name):
    n = len(x_labels)
    width = 0.35
    x = range(n)

    fig, ax = plt.subplots()
    ax.bar([i - width / 2 for i in x], before_data, width, label=first_commit_hash)
    ax.bar([i + width / 2 for i in x], after_data, width, label=second_commit_hash)

    for i, (before, after) in enumerate(zip(before_data, after_data)):
        percent_change = ((after - before) / before) * 100
        ax.annotate(f'{percent_change:.2f}%', xy=(i, max(before, after) + 0.05), ha='center', fontsize=8)

    ax.set_title(title)
    ax.set_xticks(x)
    ax.set_xticklabels(x_labels)
    ax.set_ylabel(ylabel)
    ax.legend()

    fig.tight_layout()
    plt.savefig(file_name)


def create_lighthouse_chart(before_optimization_data, after_optimization_data, directory_name, first_commit_hash, second_commit_hash):
    before_optimization_scores = before_optimization_data['lhrResults']['lhrScores']
    after_optimization_scores = after_optimization_data['lhrResults']['lhrScores']

    categories = list(before_optimization_scores.keys())
    before_scores = list(before_optimization_scores.values())
    after_scores = list(after_optimization_scores.values())

    create_bar_chart(categories, before_scores, after_scores, first_commit_hash, second_commit_hash,
                     'Сравнение оценок Lighthouse до и после оптимизации', 'Оценки', directory_name + 'lighthouse_chart.jpeg')


def extract_metric_data(before_optimization_data, after_optimization_data, metric_name):
    before_data = [result['metrics'][metric_name] for result in before_optimization_data['averageStoryResults']]
    after_data = [result['metrics'][metric_name] for result in after_optimization_data['averageStoryResults']]

    return before_data, after_data


def extract_timing_data(before_optimization_data, after_optimization_data):
    before_optimization_timings = [result['timings'] for result in before_optimization_data['averageStoryResults']]
    after_optimization_timings = [result['timings'] for result in after_optimization_data['averageStoryResults']]

    before_optimization_df = pd.DataFrame(before_optimization_timings)
    after_optimization_df = pd.DataFrame(after_optimization_timings)

    metrics = ['domContentLoadedEventStart',    'responseStart',    'domInteractive',    'responseEnd',    'domLoading',    'domComplete']
    before_optimization_means = before_optimization_df[metrics].mean()
    after_optimization_means = after_optimization_df[metrics].mean()

    return before_optimization_means, after_optimization_means

def create_timings_bar_chart(before_optimization_data, after_optimization_data, metric_name, file_name):
    before_optimization_timings = [result['timings'][metric_name] for result in before_optimization_data['averageStoryResults']]
    after_optimization_timings = [result['timings'][metric_name] for result in after_optimization_data['averageStoryResults']]
    labels = [result['title'] for result in before_optimization_data['averageStoryResults']]

    x = np.arange(len(labels))
    width = 0.35

    fig, ax = plt.subplots()
    rects1 = ax.bar(x - width/2, before_optimization_timings, width, label='Before optimization')
    rects2 = ax.bar(x + width/2, after_optimization_timings, width, label='After optimization')

    ax.set_ylabel(metric_name.capitalize())
    ax.set_title(f'{metric_name.capitalize()} by story and optimization status')
    ax.set_xticks(x)
    ax.set_xticklabels(labels)
    ax.legend()

    fig.tight_layout()

    plt.savefig(directoryName + 'task_duration_chart.jpeg')


def create_heap_chart(titles, before_optimization_data, after_optimization_data, first_commit_hash, second_commit_hash, directoryName):
    fig2, ax2 = plt.subplots()
    width = 0.35
    before_optimization_heap = [result['heap'] for result in before_optimization_data['averageStoryResults']]
    after_optimization_heap = [result['heap'] for result in after_optimization_data['averageStoryResults']]
    n = min(len(before_optimization_heap), len(after_optimization_heap))
    x_heap = range(n)

    ax2.bar([i - width / 2 for i in x_heap], before_optimization_heap, width, label=first_commit_hash)
    ax2.bar([i + width / 2 for i in x_heap], after_optimization_heap, width, label=second_commit_hash)

    for i, (before, after) in enumerate(zip(before_optimization_heap, after_optimization_heap)):
        percent_change = ((after - before) / before) * 100
        ax2.annotate(f'{percent_change:.2f}%', xy=(i, max(before, after) + 0.05), ha='center', fontsize=8)

    ax2.set_title('Сравнение использования памяти до и после оптимизации')
    ax2.set_xticks(x_heap)
    ax2.set_xticklabels(titles)
    ax2.set_ylabel('Использование памяти (KB)')
    ax2.legend()

    fig2.tight_layout()
    plt.savefig(directoryName + 'heap_chart.jpeg')


def generate_report(directory_name, first_commit_hash, second_commit_hash):
    code_comparing_link = f'https://github.com/niqitosiq/diploma/compare/{first_commit_hash}..{second_commit_hash}'

    with document(title=f'Отчет {first_commit_hash}-{second_commit_hash}', style="font-family: Arial;") as doc:
        with div(style="width: 100%; display: flex; flex-wrap: wrap"):
            with div(height="500px"): 
                h1(f'Сравнение производительности сайта до ({first_commit_hash}) и после ({second_commit_hash})')
                p(f'Ссылка на сравнение изменений в коде: ', a(code_comparing_link, href=code_comparing_link))
                iframe(src="./git-diffs.html", width="100%", height="300px")
            with div():
                img(src=f'./lighthouse_chart.jpeg', style='max-width: 100%;')
                img(src=f'./timings_chart.jpeg', style='max-width: 100%;')
                img(src=f'./nodes_chart.jpeg', style='max-width: 100%;')
                img(src=f'./task_duration_chart.jpeg', style='max-width: 100%;')
                img(src=f'./heap_chart.jpeg', style='max-width: 100%;')
            

    with open(directory_name + 'report.html', 'w') as f:
        f.write(doc.render())

    print("Report generated successfully!")


def create_timings_bar_chart(before_optimization_data, after_optimization_data, directory_name, first_commit_hash, second_commit_hash):
    before_optimization_means, after_optimization_means = extract_timing_data(before_optimization_data, after_optimization_data)
    metrics = [
        'domContentLoadedEventStart',
        'responseStart',
        'domInteractive',
        'responseEnd',
        'domLoading',
        'domComplete'
    ]
    create_bar_chart(metrics, before_optimization_means, after_optimization_means, first_commit_hash, second_commit_hash,
                 'Сравнение времени загрузки до и после оптимизации', 'Время (мс)', directory_name + 'timings_chart.jpeg')
       

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 createGraphs.py <before_optimization_file> <after_optimization_file>")
        return

    first_commit_hash = sys.argv[1][0:7]
    second_commit_hash = sys.argv[2][0:7]

    directory_name = create_directory(first_commit_hash, second_commit_hash)
    before_optimization_data, after_optimization_data = load_json_data(first_commit_hash, second_commit_hash)

    create_timings_bar_chart(before_optimization_data, after_optimization_data, directory_name, first_commit_hash, second_commit_hash)
    create_lighthouse_chart(before_optimization_data, after_optimization_data, directory_name, first_commit_hash, second_commit_hash)

    for metric_name, title, ylabel, file_name_suffix in [
            ('Nodes', 'Сравнение количества элементов на странице до и после оптимизации', 'Количество элементов', 'nodes_chart.jpeg'),    
            ('TaskDuration', 'Сравнение количества выполненных операций до и после оптимизации', 'Количество выполненных операций', 'task_duration_chart.jpeg'),
            ('heap', 'Сравнение использования памяти до и после оптимизации', 'Использование памяти (KB)', 'heap_chart.jpeg')
        ]:
        titles = [result.get('title', f"Index {i}") for i, result in enumerate(before_optimization_data['averageStoryResults'])]
        if (metric_name == 'heap'):
            create_heap_chart(titles, before_optimization_data, after_optimization_data, first_commit_hash, second_commit_hash, directory_name)
            continue

        before_data, after_data = extract_metric_data(before_optimization_data, after_optimization_data, metric_name)
        create_bar_chart(titles, before_data, after_data, first_commit_hash, second_commit_hash, title, ylabel, directory_name + file_name_suffix)

    generate_report(directory_name, first_commit_hash, second_commit_hash)

    call(["open", directory_name])
    os.system("git diff  --color-words " + first_commit_hash + " " + second_commit_hash + " -p ../my-app/src | /tmp/ansi2html.sh > " + directory_name + "git-diffs.html")

if __name__ == '__main__':
    main()