# Formatted output from ./bench.sh

| # cores | 1,000 keys | 20,000 keys |
| ------- | ---------- | ----------- |
| 1       | 8.7s       | 140.3s      |
| 6       | 3.0s       | 38.7s       |

The multi-threaded workload has some overhead but saves overall compute time
