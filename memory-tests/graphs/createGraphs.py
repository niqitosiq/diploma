import json
import pandas as pd
import sys
import matplotlib.pyplot as plt
import os 


def create_lighthouse_chart(before_optimization_data, after_optimization_data, directoryName):
    before_optimization_scores = before_optimization_data['lhrResults']['lhrScores']
    after_optimization_scores = after_optimization_data['lhrResults']['lhrScores']

    categories = list(before_optimization_scores.keys())
    before_scores = list(before_optimization_scores.values())
    after_scores = list(after_optimization_scores.values())

    n = len(categories)
    width = 0.35
    x_scores = range(n)

    fig, ax = plt.subplots()
    ax.bar([i - width / 2 for i in x_scores], before_scores, width, label='До оптимизации')
    ax.bar([i + width / 2 for i in x_scores], after_scores, width, label='После оптимизации')

    ax.set_title('Сравнение оценок Lighthouse до и после оптимизации')
    ax.set_xticks(x_scores)
    ax.set_xticklabels(categories)
    ax.set_ylabel('Оценки')
    ax.set_ylim(0, 1)
    ax.legend()

    fig.tight_layout()
    plt.savefig(directoryName + 'lighthouse_chart.jpeg')


def create_timings_bar_chart(before_optimization_data, after_optimization_data, directoryName):
    before_optimization_heap = [result['heap'] for result in before_optimization_data['storyResults']]
    after_optimization_heap = [result['heap'] for result in after_optimization_data['storyResults']]
    before_optimization_titles = [result.get('title', f"Index {i}") for i, result in enumerate(before_optimization_data['storyResults'])]

    n = min(len(before_optimization_heap), len(after_optimization_heap))
    before_optimization_heap = before_optimization_heap[:n]
    after_optimization_heap = after_optimization_heap[:n]
    x_heap = range(n)
    titles = before_optimization_titles[:n]

    before_optimization_timings = [result['timings'] for result in before_optimization_data['storyResults']]
    after_optimization_timings = [result['timings'] for result in after_optimization_data['storyResults']]
    

    before_optimization_df = pd.DataFrame(before_optimization_timings)
    after_optimization_df = pd.DataFrame(after_optimization_timings)

    metrics = [
        'domContentLoadedEventStart',
        'responseStart',
        'domInteractive',
        'responseEnd',
        'domLoading',
        'domComplete'
    ]

    before_optimization_means = before_optimization_df[metrics].mean()
    after_optimization_means = after_optimization_df[metrics].mean()

    x = range(len(metrics))
    width = 0.3

    fig, ax = plt.subplots()
    ax.bar([i - width / 2 for i in x], before_optimization_means, width, label='До оптимизации')
    ax.bar([i + width / 2 for i in x], after_optimization_means, width, label='После оптимизации')

    ax.set_title('Сравнение времени загрузки до и после оптимизации')
    ax.set_xticks(x)
    ax.set_xticklabels(metrics)
    ax.legend()

    fig.tight_layout()
    plt.savefig(directoryName + 'timings_chart.jpeg')

    fig2, ax2 = plt.subplots()
    ax2.bar([i - width / 2 for i in x_heap], before_optimization_heap, width, label='До оптимизации')
    ax2.bar([i + width / 2 for i in x_heap], after_optimization_heap, width, label='После оптимизации')

    ax2.set_title('Сравнение использования памяти до и после оптимизации')
    ax2.set_xticks(x_heap)
    ax2.set_xticklabels(titles)
    ax2.set_ylabel('Использование памяти (KB)')
    ax2.legend()

    fig2.tight_layout()
    plt.savefig(directoryName + 'heap_chart.jpeg')


    before_optimization_nodes = [result['metrics']['Nodes'] for result in before_optimization_data['storyResults']]
    after_optimization_nodes = [result['metrics']['Nodes'] for result in after_optimization_data['storyResults']]

    n = min(len(before_optimization_nodes), len(after_optimization_nodes))
    before_optimization_nodes = before_optimization_nodes[:n]
    after_optimization_nodes = after_optimization_nodes[:n]
    x_nodes = range(n)

    fig3, ax3 = plt.subplots()
    ax3.bar([i - width / 2 for i in x_nodes], before_optimization_nodes, width, label='До оптимизации')
    ax3.bar([i + width / 2 for i in x_nodes], after_optimization_nodes, width, label='После оптимизации')

    ax3.set_title('Сравнение количества элементов на странице до и после оптимизации')
    ax3.set_xticks(x_nodes)
    ax3.set_xticklabels(titles)
    ax3.set_ylabel('Количество элементов')
    ax3.legend()

    fig3.tight_layout()
    plt.savefig(directoryName + 'nodes_chart.jpeg')

    before_optimization_task_duration = [result['metrics']['TaskDuration'] for result in before_optimization_data['storyResults']]
    after_optimization_task_duration = [result['metrics']['TaskDuration'] for result in after_optimization_data['storyResults']]

    n = min(len(before_optimization_task_duration), len(after_optimization_task_duration))
    before_optimization_task_duration = before_optimization_task_duration[:n]
    after_optimization_task_duration = after_optimization_task_duration[:n]
    x_task_duration = range(n)

    fig4, ax4 = plt.subplots()
    ax4.bar([i - width / 2 for i in x_task_duration], before_optimization_task_duration, width, label='До оптимизации')
    ax4.bar([i + width / 2 for i in x_task_duration], after_optimization_task_duration, width, label='После оптимизации')

    ax4.set_title('Сравнение количества выполненных операций до и после оптимизации')
    ax4.set_xticks(x_task_duration)
    ax4.set_xticklabels(titles)
    ax4.set_ylabel('Количество выполненных операций')
    ax4.legend()

    fig4.tight_layout()
    plt.savefig(directoryName + 'task_duration_chart.jpeg')



def main():
    if len(sys.argv) != 3:
        print("Usage: python3 createGraphs.py <before_optimization_file> <after_optimization_file>")
        return
    
    directoryName = './' + sys.argv[1] + '-' + sys.argv[2] + '/'

    isExist = os.path.exists(directoryName)

    if not isExist:
      os.makedirs(directoryName) 
      print("The new directory is created!")

    before_optimization_file = '../results/' + sys.argv[1] + '.json'
    after_optimization_file = '../results/' + sys.argv[2] + '.json'

    with open(before_optimization_file, 'r') as f:
        before_optimization_data = json.load(f)

    with open(after_optimization_file, 'r') as f:
        after_optimization_data = json.load(f)

    create_timings_bar_chart(before_optimization_data, after_optimization_data, directoryName)
    create_lighthouse_chart(before_optimization_data, after_optimization_data, directoryName)

if __name__ == '__main__':
    main()
