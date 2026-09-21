import { ProblemSeed } from './types';

export const topics24to26AdvancedProblems: ProblemSeed[] = [
  // ==========================================
  // TOPIC 24: Generics (1 problem)
  // ==========================================
  {
    topicOrder: 24,
    title: "Generic Box and Array Swapper",
    slug: "generic-box-and-array-swapper",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Write a generic method `<T> void swap(T[] arr, int i, int j)` that swaps elements at indices i and j in an array of any reference type. Then, test it on both an `Integer[]` array and a `String[]` array.\nInput format: integer N1 followed by N1 integers, indices i1 and j1; then integer N2 followed by N2 strings, indices i2 and j2.\nOutput the swapped Integer array on line 1 and swapped String array on line 2.",
    input_format: "N1, N1 integers, i1, j1; then N2, N2 strings, i2, j2.",
    output_format: "Line 1: Swapped integers separated by space. Line 2: Swapped strings separated by space.",
    constraints: "1 <= N1, N2 <= 100",
    sample_input: "3 10 20 30 0 2\n3 apple banana cherry 1 2",
    sample_output: "30 20 10\napple cherry banana",
    explanation: "Integers at index 0 and 2 swapped: [30, 20, 10]. Strings at index 1 and 2 swapped: [apple, cherry, banana].",
    hints: ["Define `public static <T> void swap(T[] arr, int i, int j) { T temp = arr[i]; arr[i] = arr[j]; arr[j] = temp; }`."],
    starter_code: `import java.util.Scanner;

public class Solution {
    // Write generic swap method here

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Test generic swap on Integer and String arrays
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Solution {
    public static <T> void swap(T[] arr, int i, int j) {
        T temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;

        int n1 = sc.nextInt();
        Integer[] intArr = new Integer[n1];
        for (int i = 0; i < n1; i++) intArr[i] = sc.nextInt();
        int i1 = sc.nextInt();
        int j1 = sc.nextInt();
        swap(intArr, i1, j1);

        int n2 = sc.nextInt();
        String[] strArr = new String[n2];
        for (int i = 0; i < n2; i++) strArr[i] = sc.next();
        int i2 = sc.nextInt();
        int j2 = sc.nextInt();
        swap(strArr, i2, j2);

        StringBuilder sb1 = new StringBuilder();
        for (int i = 0; i < n1; i++) {
            if (i > 0) sb1.append(" ");
            sb1.append(intArr[i]);
        }
        System.out.println(sb1.toString());

        StringBuilder sb2 = new StringBuilder();
        for (int i = 0; i < n2; i++) {
            if (i > 0) sb2.append(" ");
            sb2.append(strArr[i]);
        }
        System.out.println(sb2.toString());
    }
}`,
    public_tests: [
      { input: "3 10 20 30 0 2\n3 apple banana cherry 1 2", expected_output: "30 20 10\napple cherry banana" },
      { input: "2 1 2 0 1\n2 cat dog 0 1", expected_output: "2 1\ndog cat" }
    ],
    hidden_tests: [
      { input: "4 1 2 3 4 1 3\n3 a b c 0 0", expected_output: "1 4 3 2\na b c" },
      { input: "1 50 0 0\n1 single 0 0", expected_output: "50\nsingle" },
      { input: "3 9 8 7 0 1\n4 w x y z 2 3", expected_output: "8 9 7\nw x z y" },
      { input: "2 -5 5 0 1\n2 first last 1 0", expected_output: "5 -5\nlast first" },
      { input: "5 1 2 3 4 5 2 4\n2 red blue 0 1", expected_output: "1 2 5 4 3\nblue red" }
    ]
  },

  // ==========================================
  // TOPIC 25: Lambda Expressions (5 problems)
  // ==========================================
  {
    topicOrder: 25,
    title: "Custom Math Operations with Lambdas",
    slug: "custom-math-operations-with-lambdas",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "BEGINNER",
    description: "Define a functional interface `MathOperation` with method `int operate(int a, int b)`. Implement addition, subtraction, and multiplication using lambda expressions. Given an operator (`+`, `-`, `*`) and two integers A and B, evaluate using the corresponding lambda and print the result.",
    input_format: "String op followed by two integers A and B.",
    output_format: "Single integer result.",
    constraints: "-1000 <= A, B <= 1000",
    sample_input: "+ 15 25",
    sample_output: "40",
    explanation: "15 + 25 = 40.",
    hints: [
      "Create functional interface: `@FunctionalInterface interface MathOperation { int operate(int a, int b); }`",
      "Assign: `MathOperation add = (x, y) -> x + y;`"
    ],
    starter_code: `import java.util.Scanner;

// Define functional interface here

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Implement lambda operations
    }
}`,
    reference_solution: `import java.util.Scanner;

@FunctionalInterface
interface MathOperation {
    int operate(int a, int b);
}

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String op = sc.next();
        int a = sc.nextInt();
        int b = sc.nextInt();

        MathOperation add = (x, y) -> x + y;
        MathOperation sub = (x, y) -> x - y;
        MathOperation mul = (x, y) -> x * y;

        int res = 0;
        if ("+".equals(op)) res = add.operate(a, b);
        else if ("-".equals(op)) res = sub.operate(a, b);
        else if ("*".equals(op)) res = mul.operate(a, b);

        System.out.println(res);
    }
}`,
    public_tests: [
      { input: "+ 15 25", expected_output: "40" },
      { input: "* 6 7", expected_output: "42" }
    ],
    hidden_tests: [
      { input: "- 50 20", expected_output: "30" },
      { input: "+ -10 5", expected_output: "-5" },
      { input: "* 0 100", expected_output: "0" },
      { input: "- 10 25", expected_output: "-15" },
      { input: "* -4 -5", expected_output: "20" }
    ]
  },
  {
    topicOrder: 25,
    title: "Filter and Transform Strings with Lambdas",
    slug: "filter-and-transform-strings-with-lambdas",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given N strings and an integer threshold K: use a Lambda / Stream to filter out strings with length less than or equal to K (keep length > K), convert remaining strings to UPPERCASE, and print them separated by space. If no strings remain, print `NONE`.",
    input_format: "Integer N, followed by N words, followed by integer K.",
    output_format: "Transformed strings separated by space or `NONE`.",
    constraints: "1 <= N <= 1000, 0 <= K <= 50",
    sample_input: "5\ncat elephant dog dinosaur bat\n3",
    sample_output: "ELEPHANT DINOSAUR",
    explanation: "Strings with length > 3 are elephant (8) and dinosaur (8), converted to uppercase.",
    hints: ["Use `list.stream().filter(s -> s.length() > k).map(s -> s.toUpperCase()).forEach(...)`."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Filter and transform strings using Stream and Lambda
    }
}`,
    reference_solution: `import java.util.*;
import java.util.stream.Collectors;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        List<String> list = new ArrayList<>();
        for (int i = 0; i < n; i++) list.add(sc.next());
        int k = sc.nextInt();

        List<String> filtered = list.stream()
            .filter(s -> s.length() > k)
            .map(String::toUpperCase)
            .collect(Collectors.toList());

        if (filtered.isEmpty()) {
            System.out.println("NONE");
        } else {
            System.out.println(String.join(" ", filtered));
        }
    }
}`,
    public_tests: [
      { input: "5\ncat elephant dog dinosaur bat\n3", expected_output: "ELEPHANT DINOSAUR" },
      { input: "3\nhi my ox\n4", expected_output: "NONE" }
    ],
    hidden_tests: [
      { input: "4\napple banana kiwi mango\n4", expected_output: "APPLE BANANA MANGO" },
      { input: "2\na bb\n1", expected_output: "BB" },
      { input: "3\njava python rust\n3", expected_output: "JAVA PYTHON RUST" },
      { input: "1\nhello\n0", expected_output: "HELLO" },
      { input: "3\none two six\n3", expected_output: "NONE" }
    ]
  },
  {
    topicOrder: 25,
    title: "Custom Comparator Sorting using Lambda",
    slug: "custom-comparator-sorting-using-lambda",
    difficulty: "EASY",
    placement_importance: "VERY_IMPORTANT",
    level: "INTERMEDIATE",
    description: "Read N student records (Name and Marks). Sort the students primarily by marks descending. If marks are tied, sort alphabetically by name ascending. Implement the comparator using a lambda expression. Print each student in format `name marks` on a new line.",
    input_format: "Integer N followed by N pairs of (String name, int marks).",
    output_format: "Sorted students, one per line.",
    constraints: "1 <= N <= 500",
    sample_input: "4\nAlice 85\nBob 92\nCharlie 85\nDave 78",
    sample_output: "Bob 92\nAlice 85\nCharlie 85\nDave 78",
    explanation: "Bob is 1st (92). Alice and Charlie tie at 85; 'Alice' comes before 'Charlie'. Dave is last (78).",
    hints: ["Use `students.sort((s1, s2) -> s1.marks != s2.marks ? Integer.compare(s2.marks, s1.marks) : s1.name.compareTo(s2.name));`"],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Implement lambda comparator
    }
}`,
    reference_solution: `import java.util.*;

class Student {
    String name;
    int marks;
    Student(String name, int marks) {
        this.name = name;
        this.marks = marks;
    }
}

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        List<Student> list = new ArrayList<>(n);
        for (int i = 0; i < n; i++) {
            list.add(new Student(sc.next(), sc.nextInt()));
        }

        list.sort((s1, s2) -> {
            if (s1.marks != s2.marks) {
                return Integer.compare(s2.marks, s1.marks);
            }
            return s1.name.compareTo(s2.name);
        });

        for (Student s : list) {
            System.out.println(s.name + " " + s.marks);
        }
    }
}`,
    public_tests: [
      { input: "4\nAlice 85\nBob 92\nCharlie 85\nDave 78", expected_output: "Bob 92\nAlice 85\nCharlie 85\nDave 78" },
      { input: "2\nJohn 90\nJane 90", expected_output: "Jane 90\nJohn 90" }
    ],
    hidden_tests: [
      { input: "1\nSolo 100", expected_output: "Solo 100" },
      { input: "3\nA 50\nB 60\nC 70", expected_output: "C 70\nB 60\nA 50" },
      { input: "4\nZara 80\nAdam 80\nBob 80\nClara 80", expected_output: "Adam 80\nBob 80\nClara 80\nZara 80" },
      { input: "3\nTom 10\nJerry 20\nSpike 15", expected_output: "Jerry 20\nSpike 15\nTom 10" },
      { input: "2\nAlpha 40\nBeta 50", expected_output: "Beta 50\nAlpha 40" }
    ]
  },
  {
    topicOrder: 25,
    title: "Predicate Chaining for Number Validation",
    slug: "predicate-chaining-for-number-validation",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given an array of N integers, count how many numbers satisfy ALL three of the following conditions using chained `java.util.function.Predicate<Integer>`:\n1. Positive (`> 0`)\n2. Even (`% 2 == 0`)\n3. Less than 100 (`< 100`)\nPrint the count of matching numbers.",
    input_format: "Integer N followed by N integers.",
    output_format: "Single integer count.",
    constraints: "1 <= N <= 1000",
    sample_input: "6\n-4 12 100 24 35 8",
    sample_output: "3",
    explanation: "12, 24, 8 satisfy: positive, even, < 100 (100 is not < 100, -4 is not positive). Count = 3.",
    hints: ["Use `Predicate<Integer> p = isPositive.and(isEven).and(isLessThan100);`"],
    starter_code: `import java.util.*;
import java.util.function.Predicate;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Implement Predicate chaining
    }
}`,
    reference_solution: `import java.util.*;
import java.util.function.Predicate;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();

        Predicate<Integer> isPositive = x -> x > 0;
        Predicate<Integer> isEven = x -> x % 2 == 0;
        Predicate<Integer> isLessThan100 = x -> x < 100;

        Predicate<Integer> combined = isPositive.and(isEven).and(isLessThan100);

        int count = 0;
        for (int i = 0; i < n; i++) {
            if (combined.test(sc.nextInt())) {
                count++;
            }
        }
        System.out.println(count);
    }
}`,
    public_tests: [
      { input: "6\n-4 12 100 24 35 8", expected_output: "3" },
      { input: "3\n1 3 5", expected_output: "0" }
    ],
    hidden_tests: [
      { input: "4\n2 4 6 8", expected_output: "4" },
      { input: "3\n-2 -4 -6", expected_output: "0" },
      { input: "3\n100 102 104", expected_output: "0" },
      { input: "5\n0 2 50 98 100", expected_output: "3" },
      { input: "1\n42", expected_output: "1" }
    ]
  },
  {
    topicOrder: 25,
    title: "Stream Map-Reduce Sum of Squares of Evens",
    slug: "stream-map-reduce-sum-of-squares-of-evens",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given N integers, use Java Streams to filter all even numbers, square each of them, and compute their sum using `reduce` or `sum()`. Print the total sum (0 if no even numbers).",
    input_format: "Integer N followed by N integers.",
    output_format: "A single long integer.",
    constraints: "1 <= N <= 1000, -1000 <= elements <= 1000",
    sample_input: "5\n1 2 3 4 5",
    sample_output: "20",
    explanation: "Even numbers are 2 and 4. Squares: 2^2 = 4, 4^2 = 16. Sum = 4 + 16 = 20.",
    hints: ["Use `list.stream().filter(x -> x % 2 == 0).mapToLong(x -> (long) x * x).sum()`."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Stream filter-map-reduce
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        List<Integer> list = new ArrayList<>(n);
        for (int i = 0; i < n; i++) list.add(sc.nextInt());

        long sum = list.stream()
            .filter(x -> x % 2 == 0)
            .mapToLong(x -> (long) x * x)
            .sum();

        System.out.println(sum);
    }
}`,
    public_tests: [
      { input: "5\n1 2 3 4 5", expected_output: "20" },
      { input: "3\n1 3 5", expected_output: "0" }
    ],
    hidden_tests: [
      { input: "4\n2 4 6 8", expected_output: "120" },
      { input: "3\n-2 0 2", expected_output: "8" },
      { input: "1\n10", expected_output: "100" },
      { input: "5\n-4 -2 0 2 4", expected_output: "40" },
      { input: "2\n7 9", expected_output: "0" }
    ]
  },

  // ==========================================
  // TOPIC 26: Multithreading (5 problems)
  // ==========================================
  {
    topicOrder: 26,
    title: "Thread Creation with Runnable Interface",
    slug: "thread-creation-with-runnable-interface",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Demonstrate thread creation using `Runnable`. Create two threads:\n- Thread 1 prints `Thread 1: <word1>`\n- Thread 2 prints `Thread 2: <word2>`\nEnsure Thread 1 completes before Thread 2 starts using `join()`. Finally, the main thread prints `All threads completed`.",
    input_format: "Two words separated by space.",
    output_format: "Three lines of output showing sequential execution.",
    constraints: "Words contain alphanumeric characters.",
    sample_input: "Hello World",
    sample_output: "Thread 1: Hello\nThread 2: World\nAll threads completed",
    explanation: "Thread 1 runs first, finishes via join, Thread 2 runs next and finishes, then main completes.",
    hints: ["Call `t1.start(); t1.join(); t2.start(); t2.join();`"],
    starter_code: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Create and join threads
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String w1 = sc.next();
        String w2 = sc.next();

        Thread t1 = new Thread(() -> System.out.println("Thread 1: " + w1));
        Thread t2 = new Thread(() -> System.out.println("Thread 2: " + w2));

        try {
            t1.start();
            t1.join();
            t2.start();
            t2.join();
        } catch (InterruptedException e) {
            return;
        }

        System.out.println("All threads completed");
    }
}`,
    public_tests: [
      { input: "Hello World", expected_output: "Thread 1: Hello\nThread 2: World\nAll threads completed" },
      { input: "Java Multithreading", expected_output: "Thread 1: Java\nThread 2: Multithreading\nAll threads completed" }
    ],
    hidden_tests: [
      { input: "Alpha Beta", expected_output: "Thread 1: Alpha\nThread 2: Beta\nAll threads completed" },
      { input: "One Two", expected_output: "Thread 1: One\nThread 2: Two\nAll threads completed" },
      { input: "Start Finish", expected_output: "Thread 1: Start\nThread 2: Finish\nAll threads completed" },
      { input: "Ping Pong", expected_output: "Thread 1: Ping\nThread 2: Pong\nAll threads completed" },
      { input: "Foo Bar", expected_output: "Thread 1: Foo\nThread 2: Bar\nAll threads completed" }
    ]
  },
  {
    topicOrder: 26,
    title: "Thread-Safe Counter with Synchronized Method",
    slug: "thread-safe-counter-with-synchronized-method",
    difficulty: "MEDIUM",
    placement_importance: "VERY_IMPORTANT",
    level: "INTERMEDIATE",
    description: "Demonstrate race condition prevention using `synchronized`. Create a class `Counter` with a `synchronized void increment()` method. Start two threads, where each thread calls `increment()` exactly N times. After joining both threads, print the final counter value (which should be exactly `2 * N`).",
    input_format: "A single integer N.",
    output_format: "The final counter value.",
    constraints: "1 <= N <= 50000",
    sample_input: "1000",
    sample_output: "2000",
    explanation: "Two threads each incremented 1000 times safely -> 2000.",
    hints: ["Use `synchronized public void increment() { count++; }`."],
    starter_code: `import java.util.Scanner;

// Define Counter class with synchronized increment

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Start two threads incrementing shared Counter
    }
}`,
    reference_solution: `import java.util.Scanner;

class Counter {
    private int count = 0;
    public synchronized void increment() {
        count++;
    }
    public int getCount() {
        return count;
    }
}

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();

        Counter counter = new Counter();
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < n; i++) counter.increment();
        });
        Thread t2 = new Thread(() -> {
            for (int i = 0; i < n; i++) counter.increment();
        });

        try {
            t1.start();
            t2.start();
            t1.join();
            t2.join();
        } catch (InterruptedException e) {
            return;
        }

        System.out.println(counter.getCount());
    }
}`,
    public_tests: [
      { input: "1000", expected_output: "2000" },
      { input: "50", expected_output: "100" }
    ],
    hidden_tests: [
      { input: "1", expected_output: "2" },
      { input: "5000", expected_output: "10000" },
      { input: "10000", expected_output: "20000" },
      { input: "25000", expected_output: "50000" },
      { input: "500", expected_output: "1000" }
    ]
  },
  {
    topicOrder: 26,
    title: "Parallel Array Sum with Thread Join",
    slug: "parallel-array-sum-with-thread-join",
    difficulty: "MEDIUM",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given an array of N integers, divide the array into two halves (first half 0 to N/2 - 1, second half N/2 to N - 1). Compute the sum of each half using two separate threads. Join both threads and print the sum computed by Thread 1, the sum computed by Thread 2, and the total sum.",
    input_format: "Integer N followed by N integers.",
    output_format: "Line 1: `Thread 1 Sum: <sum1>`. Line 2: `Thread 2 Sum: <sum2>`. Line 3: `Total Sum: <total>`.",
    constraints: "2 <= N <= 10^5",
    sample_input: "6\n1 2 3 4 5 6",
    sample_output: "Thread 1 Sum: 6\nThread 2 Sum: 15\nTotal Sum: 21",
    explanation: "Half 1: [1, 2, 3] -> sum 6. Half 2: [4, 5, 6] -> sum 15. Total = 21.",
    hints: ["Pass array slice to each thread, join threads before computing total."],
    starter_code: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Parallel array sum
    }
}`,
    reference_solution: `import java.util.Scanner;

class SumWorker extends Thread {
    int[] arr;
    int start, end;
    long sum = 0;

    SumWorker(int[] arr, int start, int end) {
        this.arr = arr;
        this.start = start;
        this.end = end;
    }

    public void run() {
        for (int i = start; i < end; i++) {
            sum += arr[i];
        }
    }
}

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();

        int mid = n / 2;
        SumWorker w1 = new SumWorker(arr, 0, mid);
        SumWorker w2 = new SumWorker(arr, mid, n);

        try {
            w1.start();
            w2.start();
            w1.join();
            w2.join();
        } catch (InterruptedException e) {
            return;
        }

        System.out.println("Thread 1 Sum: " + w1.sum);
        System.out.println("Thread 2 Sum: " + w2.sum);
        System.out.println("Total Sum: " + (w1.sum + w2.sum));
    }
}`,
    public_tests: [
      { input: "6\n1 2 3 4 5 6", expected_output: "Thread 1 Sum: 6\nThread 2 Sum: 15\nTotal Sum: 21" },
      { input: "4\n10 20 30 40", expected_output: "Thread 1 Sum: 30\nThread 2 Sum: 70\nTotal Sum: 100" }
    ],
    hidden_tests: [
      { input: "2\n5 10", expected_output: "Thread 1 Sum: 5\nThread 2 Sum: 10\nTotal Sum: 15" },
      { input: "5\n1 1 1 1 1", expected_output: "Thread 1 Sum: 2\nThread 2 Sum: 3\nTotal Sum: 5" },
      { input: "4\n-5 5 -10 10", expected_output: "Thread 1 Sum: 0\nThread 2 Sum: 0\nTotal Sum: 0" },
      { input: "3\n100 200 300", expected_output: "Thread 1 Sum: 100\nThread 2 Sum: 500\nTotal Sum: 600" },
      { input: "6\n2 4 6 8 10 12", expected_output: "Thread 1 Sum: 12\nThread 2 Sum: 30\nTotal Sum: 42" }
    ]
  },
  {
    topicOrder: 26,
    title: "Producer-Consumer Coordination with Wait and Notify",
    slug: "producer-consumer-coordination-with-wait-and-notify",
    difficulty: "HARD",
    placement_importance: "VERY_IMPORTANT",
    level: "PLACEMENT",
    description: "Implement a classic single-item buffer using `wait()` and `notify()`. The Producer deposits numbers 1 through N into the buffer. The Consumer removes numbers from the buffer and adds them to a running sum. After all N numbers are produced and consumed, print `Consumed total: <sum>`.",
    input_format: "A single integer N.",
    output_format: "Print `Consumed total: <sum>`.",
    constraints: "1 <= N <= 100",
    sample_input: "5",
    sample_output: "Consumed total: 15",
    explanation: "Numbers 1, 2, 3, 4, 5 are produced and consumed. Sum = 1 + 2 + 3 + 4 + 5 = 15.",
    hints: [
      "Use a boolean flag `hasData` and a shared lock. In put: `while(hasData) wait();`. In get: `while(!hasData) wait();`."
    ],
    starter_code: `import java.util.Scanner;

// Implement Producer-Consumer with wait/notify

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
    }
}`,
    reference_solution: `import java.util.Scanner;

class SharedBuffer {
    private int data;
    private boolean hasData = false;

    public synchronized void put(int val) {
        while (hasData) {
            try { wait(); } catch (InterruptedException ignored) {}
        }
        data = val;
        hasData = true;
        notify();
    }

    public synchronized int get() {
        while (!hasData) {
            try { wait(); } catch (InterruptedException ignored) {}
        }
        int val = data;
        hasData = false;
        notify();
        return val;
    }
}

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();

        SharedBuffer buffer = new SharedBuffer();
        long[] total = new long[1];

        Thread producer = new Thread(() -> {
            for (int i = 1; i <= n; i++) {
                buffer.put(i);
            }
        });

        Thread consumer = new Thread(() -> {
            for (int i = 1; i <= n; i++) {
                total[0] += buffer.get();
            }
        });

        try {
            producer.start();
            consumer.start();
            producer.join();
            consumer.join();
        } catch (InterruptedException e) {
            return;
        }

        System.out.println("Consumed total: " + total[0]);
    }
}`,
    public_tests: [
      { input: "5", expected_output: "Consumed total: 15" },
      { input: "10", expected_output: "Consumed total: 55" }
    ],
    hidden_tests: [
      { input: "1", expected_output: "Consumed total: 1" },
      { input: "20", expected_output: "Consumed total: 210" },
      { input: "50", expected_output: "Consumed total: 1275" },
      { input: "100", expected_output: "Consumed total: 5050" },
      { input: "3", expected_output: "Consumed total: 6" }
    ]
  },
  {
    topicOrder: 26,
    title: "Callable and Future with ExecutorService",
    slug: "callable-and-future-with-executorservice",
    difficulty: "MEDIUM",
    placement_importance: "IMPORTANT",
    level: "PLACEMENT",
    description: "Given two integers A and B: create an `ExecutorService` with a fixed thread pool of 2 threads. Submit two `Callable<Long>` tasks:\n- Task 1 computes factorial of A (`A!`)\n- Task 2 computes `2^B`\nRetrieve results using `Future.get()`, shut down the executor, and print `Factorial: <A!>` on line 1 and `Power: <2^B>` on line 2.",
    input_format: "Two integers A and B.",
    output_format: "Line 1: `Factorial: <res1>`. Line 2: `Power: <res2>`.",
    constraints: "0 <= A <= 20, 0 <= B <= 30",
    sample_input: "5 4",
    sample_output: "Factorial: 120\nPower: 16",
    explanation: "5! = 120, 2^4 = 16.",
    hints: [
      "Use `ExecutorService executor = Executors.newFixedThreadPool(2);`",
      "Submit callables returning long, call `.get()`, and always invoke `executor.shutdown()`."
    ],
    starter_code: `import java.util.Scanner;
import java.util.concurrent.*;

public class Solution {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        // Implement Callable and Future
    }
}`,
    reference_solution: `import java.util.Scanner;
import java.util.concurrent.*;

public class Solution {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int a = sc.nextInt();
        int b = sc.nextInt();

        ExecutorService executor = Executors.newFixedThreadPool(2);

        Callable<Long> factorialTask = () -> {
            long fact = 1;
            for (int i = 1; i <= a; i++) fact *= i;
            return fact;
        };

        Callable<Long> powerTask = () -> {
            long pow = 1;
            for (int i = 0; i < b; i++) pow *= 2;
            return pow;
        };

        Future<Long> f1 = executor.submit(factorialTask);
        Future<Long> f2 = executor.submit(powerTask);

        long res1 = f1.get();
        long res2 = f2.get();

        executor.shutdown();

        System.out.println("Factorial: " + res1);
        System.out.println("Power: " + res2);
    }
}`,
    public_tests: [
      { input: "5 4", expected_output: "Factorial: 120\nPower: 16" },
      { input: "3 3", expected_output: "Factorial: 6\nPower: 8" }
    ],
    hidden_tests: [
      { input: "0 0", expected_output: "Factorial: 1\nPower: 1" },
      { input: "6 5", expected_output: "Factorial: 720\nPower: 32" },
      { input: "10 10", expected_output: "Factorial: 3628800\nPower: 1024" },
      { input: "1 1", expected_output: "Factorial: 1\nPower: 2" },
      { input: "4 8", expected_output: "Factorial: 24\nPower: 256" }
    ]
  }
];
