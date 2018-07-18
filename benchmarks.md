# Formatted output of ./bench.sh

The multi-threaded workload has some overhead but saves time if you've got the cores

| # cores | 1,000 keys | 20,000 keys |
| ------- | ---------- | ----------- |
| 1       | 8.7s       | 140.3s      |
| 6       | 3.0s       | 38.7s       |

> tested with commit 4b3276a
