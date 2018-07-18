#!/bin/sh

# numeric average of an array
average() {
  arr=$1
  sum=0

  for n in "${arr[@]}"
  do
    sum=$(( $sum + $n ))
  done
  avg=$(( sum / ${#arr[@]} ))

  echo $avg
}


# ns to ms ratio is wrong
bench() {
  command=$1
  runs=$2
  perf=()
  nanoToMilli=1000 # ns to ms time conversion

  for i in `seq 1 $runs`
  do
    start=$(date +%s.%N)
    $command # 1> /dev/null
    end=$(date +%s.%N)

    dur=$(echo "($end - $start) * $nanoToMilli" | node -p)
    dur=${dur%.*}

    echo "finished run: $i"
    perf+=($dur)
  done

  avg=$(average $perf)

  echo ""
  echo "Command: $command"
  echo "Runs: $runs"
  echo "avg run time: ${avg}ms"
}

# A 1000-key run
# bench "node --experimental-worker . 1000" 10
# bench "node --experimental-worker . 1000 --no-workers" 10

# A 20000-key run
bench "node --experimental-worker . 20000" 10
bench "node --experimental-worker . 20000 --no-workers" 10
