import { ProblemSeed } from './types';

export const TOPIC_10_ARRAYS_PROBLEMS: ProblemSeed[] = [
  // ==========================================
  // PART A — 1D ARRAYS
  // ==========================================
  {
    topicOrder: 10,
    title: 'Find the Largest and Smallest Element in an Array',
    slug: 'largest-and-smallest-in-array',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given an integer N followed by N integers representing an array, find and print the largest and smallest element separated by a space.',
    input_format: 'First line contains integer N. Second line contains N integers separated by space.',
    output_format: 'Print "Max Min" separated by a space.',
    constraints: '1 <= N <= 10^5, -10^9 <= A[i] <= 10^9',
    sample_input: '5\n12 45 2 89 34',
    sample_output: '89 2',
    explanation: 'Maximum element is 89 and minimum element is 2.',
    hints: ['Initialize max and min to A[0] and iterate through the array.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        // Find max and min
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n <= 0) return;
        int max = Integer.MIN_VALUE;
        int min = Integer.MAX_VALUE;
        for (int i = 0; i < n; i++) {
            int val = sc.nextInt();
            if (val > max) max = val;
            if (val < min) min = val;
        }
        System.out.println(max + " " + min);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '5\n12 45 2 89 34', expected_output: '89 2' },
      { input: '1\n100', expected_output: '100 100' },
      { input: '4\n-10 -5 -20 -1', expected_output: '-1 -20' }
    ],
    hidden_tests: [
      { input: '6\n0 0 0 0 0 0', expected_output: '0 0' },
      { input: '5\n10 20 30 40 50', expected_output: '50 10' },
      { input: '5\n50 40 30 20 10', expected_output: '50 10' },
      { input: '3\n-1000000 0 1000000', expected_output: '1000000 -1000000' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Calculate Sum and Average of Array Elements',
    slug: 'sum-and-average-of-array',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given an integer N followed by N integers, calculate the sum and average of all elements. Print the sum as integer and average formatted to 2 decimal places separated by space.',
    input_format: 'First line contains integer N. Second line contains N integers.',
    output_format: 'Print "Sum Average" separated by space.',
    constraints: '1 <= N <= 10^5, -10^6 <= A[i] <= 10^6',
    sample_input: '5\n10 20 30 40 50',
    sample_output: '150 30.00',
    explanation: 'Sum = 150, Average = 150 / 5.0 = 30.00.',
    hints: ['Accumulate into a long sum to prevent overflow, then divide by (double) N.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Compute sum and average
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long sum = 0;
        for (int i = 0; i < n; i++) {
            sum += sc.nextInt();
        }
        double avg = (double) sum / n;
        System.out.printf("%d %.2f\\n", sum, avg);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '5\n10 20 30 40 50', expected_output: '150 30.00' },
      { input: '4\n1 2 3 5', expected_output: '11 2.75' },
      { input: '1\n42', expected_output: '42 42.00' }
    ],
    hidden_tests: [
      { input: '3\n-10 0 10', expected_output: '0 0.00' },
      { input: '5\n-5 -15 -25 -35 -45', expected_output: '-125 -25.00' },
      { input: '4\n100 200 300 401', expected_output: '1001 250.25' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Reverse an Array Without Using Another Array',
    slug: 'reverse-array-in-place',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given an array of N integers, reverse the array in place using the two-pointer approach (without allocating a new array) and print the reversed elements separated by space.',
    input_format: 'First line contains integer N. Second line contains N integers.',
    output_format: 'Print reversed array elements separated by space.',
    constraints: '1 <= N <= 10^5, -10^9 <= A[i] <= 10^9',
    sample_input: '5\n1 2 3 4 5',
    sample_output: '5 4 3 2 1',
    explanation: 'Swap A[0] with A[4], A[1] with A[3].',
    hints: ['int left = 0, right = n - 1; while (left < right) swap(left++, right--);'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        // Reverse array in place
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        
        int l = 0, r = n - 1;
        while (l < r) {
            int temp = arr[l];
            arr[l] = arr[r];
            arr[r] = temp;
            l++;
            r--;
        }
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (i > 0) sb.append(" ");
            sb.append(arr[i]);
        }
        System.out.println(sb.toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '5\n1 2 3 4 5', expected_output: '5 4 3 2 1' },
      { input: '4\n10 20 30 40', expected_output: '40 30 20 10' },
      { input: '1\n99', expected_output: '99' }
    ],
    hidden_tests: [
      { input: '2\n100 200', expected_output: '200 100' },
      { input: '6\n-1 -2 -3 -4 -5 -6', expected_output: '-6 -5 -4 -3 -2 -1' },
      { input: '5\n0 0 0 1 0', expected_output: '0 1 0 0 0' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Count Even and Odd Numbers in an Array',
    slug: 'count-even-odd-array',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given an array of N integers, count how many elements are even and how many are odd. Print "Even: X Odd: Y".',
    input_format: 'First line contains integer N. Second line contains N integers.',
    output_format: 'Print "Even: X Odd: Y".',
    constraints: '1 <= N <= 10^5, -10^9 <= A[i] <= 10^9',
    sample_input: '6\n1 2 3 4 5 6',
    sample_output: 'Even: 3 Odd: 3',
    explanation: '2, 4, 6 are even (3). 1, 3, 5 are odd (3).',
    hints: ['Check if arr[i] % 2 == 0 for even.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Count even and odd
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int even = 0, odd = 0;
        for (int i = 0; i < n; i++) {
            int x = sc.nextInt();
            if (x % 2 == 0) even++;
            else odd++;
        }
        System.out.println("Even: " + even + " Odd: " + odd);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '6\n1 2 3 4 5 6', expected_output: 'Even: 3 Odd: 3' },
      { input: '4\n2 4 6 8', expected_output: 'Even: 4 Odd: 0' },
      { input: '3\n1 3 5', expected_output: 'Even: 0 Odd: 3' }
    ],
    hidden_tests: [
      { input: '5\n0 -2 -4 1 -3', expected_output: 'Even: 3 Odd: 2' },
      { input: '1\n0', expected_output: 'Even: 1 Odd: 0' },
      { input: '1\n-7', expected_output: 'Even: 0 Odd: 1' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Search for an Element Using Linear Search',
    slug: 'linear-search-array',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given an array of N integers and a target value K, find the first 0-based index where K appears. If K is not present, print -1.',
    input_format: 'First line contains integer N and target K separated by space. Second line contains N integers.',
    output_format: 'Print 0-based index or -1.',
    constraints: '1 <= N <= 10^5, -10^9 <= A[i], K <= 10^9',
    sample_input: '5 30\n10 20 30 40 50',
    sample_output: '2',
    explanation: '30 is found at index 2.',
    hints: ['Iterate from 0 to N-1 and return index upon match.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        // Linear search
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        int found = -1;
        for (int i = 0; i < n; i++) {
            int val = sc.nextInt();
            if (val == k && found == -1) {
                found = i;
            }
        }
        System.out.println(found);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '5 30\n10 20 30 40 50', expected_output: '2' },
      { input: '4 99\n1 2 3 4', expected_output: '-1' },
      { input: '5 10\n10 20 10 30 10', expected_output: '0' }
    ],
    hidden_tests: [
      { input: '1 5\n5', expected_output: '0' },
      { input: '1 5\n6', expected_output: '-1' },
      { input: '6 -10\n0 1 -10 2 -10 3', expected_output: '2' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Find the Second Largest Element in an Array',
    slug: 'second-largest-element-array',
    difficulty: 'MEDIUM',
    placement_importance: 'IMPORTANT',
    level: 'INTERMEDIATE',
    description: 'Given an array of N integers, find the second largest distinct element. If there is no second largest distinct element (e.g. all elements are identical or array size < 2), print -1.',
    input_format: 'First line contains integer N. Second line contains N integers.',
    output_format: 'Print the second largest distinct integer or -1.',
    constraints: '1 <= N <= 10^5, -10^9 <= A[i] <= 10^9',
    sample_input: '6\n12 35 1 10 34 1',
    sample_output: '34',
    explanation: 'Largest is 35, second largest is 34.',
    hints: ['Maintain max1 and max2. Update max2 when finding a new max1 or an element between max1 and max2.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Find second largest
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n < 2) {
            System.out.println(-1);
            return;
        }
        long max1 = Long.MIN_VALUE;
        long max2 = Long.MIN_VALUE;
        for (int i = 0; i < n; i++) {
            long x = sc.nextLong();
            if (x > max1) {
                max2 = max1;
                max1 = x;
            } else if (x < max1 && x > max2) {
                max2 = x;
            }
        }
        if (max2 == Long.MIN_VALUE) System.out.println(-1);
        else System.out.println(max2);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '6\n12 35 1 10 34 1', expected_output: '34' },
      { input: '3\n10 10 10', expected_output: '-1' },
      { input: '2\n5 10', expected_output: '5' }
    ],
    hidden_tests: [
      { input: '1\n100', expected_output: '-1' },
      { input: '5\n-10 -20 -3 -40 -50', expected_output: '-10' },
      { input: '5\n1 2 3 4 5', expected_output: '4' },
      { input: '4\n5 5 4 4', expected_output: '4' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Remove Duplicate Elements from a Sorted Array',
    slug: 'remove-duplicates-sorted-array',
    difficulty: 'MEDIUM',
    placement_importance: 'IMPORTANT',
    level: 'INTERMEDIATE',
    description: 'Given a sorted integer array of size N, remove duplicate elements in-place such that each unique element appears only once. Print the unique elements separated by space.',
    input_format: 'First line contains integer N. Second line contains N sorted integers.',
    output_format: 'Print unique elements separated by space.',
    constraints: '1 <= N <= 10^5, -10^9 <= A[i] <= 10^9',
    sample_input: '6\n1 1 2 2 3 4',
    sample_output: '1 2 3 4',
    explanation: 'Duplicate 1 and 2 are removed.',
    hints: ['Keep index j for unique elements. If arr[i] != arr[j], increment j and assign arr[j] = arr[i].'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        // Remove duplicates
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n == 0) return;
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        
        int j = 0;
        for (int i = 1; i < n; i++) {
            if (arr[i] != arr[j]) {
                j++;
                arr[j] = arr[i];
            }
        }
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i <= j; i++) {
            if (i > 0) sb.append(" ");
            sb.append(arr[i]);
        }
        System.out.println(sb.toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '6\n1 1 2 2 3 4', expected_output: '1 2 3 4' },
      { input: '3\n5 5 5', expected_output: '5' },
      { input: '4\n1 2 3 4', expected_output: '1 2 3 4' }
    ],
    hidden_tests: [
      { input: '1\n42', expected_output: '42' },
      { input: '7\n-5 -5 0 0 2 2 3', expected_output: '-5 0 2 3' },
      { input: '5\n10 20 20 30 30', expected_output: '10 20 30' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Find Missing Number from 1 to N',
    slug: 'find-missing-number-1-to-n',
    difficulty: 'EASY',
    placement_importance: 'VERY_IMPORTANT',
    level: 'BEGINNER',
    description: 'Given an array containing N - 1 distinct integers from the range 1 to N, find the missing number.',
    input_format: 'First line contains integer N. Second line contains N - 1 space-separated integers.',
    output_format: 'Print the single missing number.',
    constraints: '2 <= N <= 10^5',
    sample_input: '5\n1 2 4 5',
    sample_output: '3',
    explanation: 'Numbers from 1 to 5 are expected. 3 is missing.',
    hints: ['Expected sum = N * (N + 1) / 2. Subtract all array elements from expected sum.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Find missing number
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        long expected = n * (n + 1) / 2;
        long actual = 0;
        for (int i = 0; i < n - 1; i++) {
            actual += sc.nextLong();
        }
        System.out.println(expected - actual);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '5\n1 2 4 5', expected_output: '3' },
      { input: '4\n1 2 3', expected_output: '4' },
      { input: '2\n2', expected_output: '1' }
    ],
    hidden_tests: [
      { input: '6\n2 3 4 5 6', expected_output: '1' },
      { input: '10\n1 2 3 4 5 6 7 8 10', expected_output: '9' },
      { input: '7\n1 3 4 5 6 7', expected_output: '2' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Find Duplicate Elements in an Array',
    slug: 'find-duplicate-elements-array',
    difficulty: 'MEDIUM',
    placement_importance: 'IMPORTANT',
    level: 'INTERMEDIATE',
    description: 'Given an array of N integers, find all elements that appear more than once. Print the duplicate elements in ascending sorted order separated by space. If no duplicates exist, print -1.',
    input_format: 'First line contains integer N. Second line contains N integers.',
    output_format: 'Print duplicate integers in ascending order, or -1.',
    constraints: '1 <= N <= 10^5, -10^6 <= A[i] <= 10^6',
    sample_input: '7\n4 3 2 7 8 2 3',
    sample_output: '2 3',
    explanation: '2 and 3 appear twice.',
    hints: ['Use a frequency map or count duplicates after sorting.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Print duplicates in ascending order
    }
}`,
    reference_solution: `import java.util.Scanner;
import java.util.Arrays;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        
        Arrays.sort(arr);
        ArrayList<Integer> duplicates = new ArrayList<>();
        for (int i = 1; i < n; i++) {
            if (arr[i] == arr[i - 1]) {
                if (duplicates.isEmpty() || duplicates.get(duplicates.size() - 1) != arr[i]) {
                    duplicates.add(arr[i]);
                }
            }
        }
        
        if (duplicates.isEmpty()) {
            System.out.println(-1);
        } else {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < duplicates.size(); i++) {
                if (i > 0) sb.append(" ");
                sb.append(duplicates.get(i));
            }
            System.out.println(sb.toString());
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '7\n4 3 2 7 8 2 3', expected_output: '2 3' },
      { input: '4\n1 2 3 4', expected_output: '-1' },
      { input: '5\n2 2 2 2 2', expected_output: '2' }
    ],
    hidden_tests: [
      { input: '6\n10 -5 20 -5 10 30', expected_output: '-5 10' },
      { input: '1\n10', expected_output: '-1' },
      { input: '4\n0 0 1 1', expected_output: '0 1' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Move All Zeros to the End While Maintaining Order',
    slug: 'move-zeros-to-end',
    difficulty: 'MEDIUM',
    placement_importance: 'VERY_IMPORTANT',
    level: 'INTERMEDIATE',
    description: 'Given an array of N integers, move all 0s to the end of the array while maintaining the relative order of the non-zero elements. Modify the array in-place.',
    input_format: 'First line contains integer N. Second line contains N integers.',
    output_format: 'Print array elements separated by space.',
    constraints: '1 <= N <= 10^5, -10^6 <= A[i] <= 10^6',
    sample_input: '5\n0 1 0 3 12',
    sample_output: '1 3 12 0 0',
    explanation: 'Non-zero elements 1, 3, 12 maintain their order, zeros moved to end.',
    hints: ['Keep index pos = 0. Whenever A[i] != 0, A[pos++] = A[i]. Fill remaining with 0.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Move zeros to end
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        
        int insertPos = 0;
        for (int i = 0; i < n; i++) {
            if (arr[i] != 0) {
                arr[insertPos++] = arr[i];
            }
        }
        while (insertPos < n) {
            arr[insertPos++] = 0;
        }
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (i > 0) sb.append(" ");
            sb.append(arr[i]);
        }
        System.out.println(sb.toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '5\n0 1 0 3 12', expected_output: '1 3 12 0 0' },
      { input: '3\n0 0 1', expected_output: '1 0 0' },
      { input: '4\n1 2 3 4', expected_output: '1 2 3 4' }
    ],
    hidden_tests: [
      { input: '1\n0', expected_output: '0' },
      { input: '5\n0 0 0 0 0', expected_output: '0 0 0 0 0' },
      { input: '6\n-1 0 -2 0 -3 0', expected_output: '-1 -2 -3 0 0 0' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Find Frequency of Each Element in an Array',
    slug: 'frequency-of-elements-array',
    difficulty: 'MEDIUM',
    placement_importance: 'IMPORTANT',
    level: 'INTERMEDIATE',
    description: 'Given an array of N integers, find the frequency of each distinct element. Print each distinct element and its frequency in ascending sorted order of the elements, in the format: element: count (each on a new line).',
    input_format: 'First line contains integer N. Second line contains N integers.',
    output_format: 'Print "element: count" for each distinct element in ascending order.',
    constraints: '1 <= N <= 10^5, -10^6 <= A[i] <= 10^6',
    sample_input: '6\n2 3 2 5 3 2',
    sample_output: '2: 3\n3: 2\n5: 1',
    explanation: '2 appears 3 times, 3 appears 2 times, 5 appears 1 time.',
    hints: ['Sort array or use TreeMap to maintain ascending order.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Print frequencies
    }
}`,
    reference_solution: `import java.util.Scanner;
import java.util.TreeMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        TreeMap<Integer, Integer> map = new TreeMap<>();
        for (int i = 0; i < n; i++) {
            int x = sc.nextInt();
            map.put(x, map.getOrDefault(x, 0) + 1);
        }
        for (Map.Entry<Integer, Integer> e : map.entrySet()) {
            System.out.println(e.getKey() + ": " + e.getValue());
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '6\n2 3 2 5 3 2', expected_output: '2: 3\n3: 2\n5: 1' },
      { input: '3\n1 1 1', expected_output: '1: 3' },
      { input: '4\n4 3 2 1', expected_output: '1: 1\n2: 1\n3: 1\n4: 1' }
    ],
    hidden_tests: [
      { input: '5\n-5 10 -5 10 0', expected_output: '-5: 2\n0: 1\n10: 2' },
      { input: '1\n100', expected_output: '100: 1' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Find Intersection of Two Arrays',
    slug: 'intersection-of-two-arrays',
    difficulty: 'MEDIUM',
    placement_importance: 'IMPORTANT',
    level: 'INTERMEDIATE',
    description: 'Given two integer arrays A of size N and B of size M, find their intersection (distinct common elements). Print the common elements in ascending order separated by space. If no intersection, print -1.',
    input_format: 'First line: N and M. Second line: N integers of A. Third line: M integers of B.',
    output_format: 'Print distinct common elements in ascending order, or -1.',
    constraints: '1 <= N, M <= 10^5, -10^6 <= elements <= 10^6',
    sample_input: '4 5\n1 2 2 1\n2 2 3 4 1',
    sample_output: '1 2',
    explanation: 'Common distinct elements between the two arrays are 1 and 2.',
    hints: ['Store elements of A in a HashSet. Check against B into a TreeSet for sorted output.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        // Compute intersection
    }
}`,
    reference_solution: `import java.util.Scanner;
import java.util.HashSet;
import java.util.TreeSet;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        HashSet<Integer> setA = new HashSet<>();
        for (int i = 0; i < n; i++) setA.add(sc.nextInt());
        
        TreeSet<Integer> intersection = new TreeSet<>();
        for (int i = 0; i < m; i++) {
            int val = sc.nextInt();
            if (setA.contains(val)) {
                intersection.add(val);
            }
        }
        
        if (intersection.isEmpty()) {
            System.out.println(-1);
        } else {
            StringBuilder sb = new StringBuilder();
            int idx = 0;
            for (int val : intersection) {
                if (idx++ > 0) sb.append(" ");
                sb.append(val);
            }
            System.out.println(sb.toString());
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '4 5\n1 2 2 1\n2 2 3 4 1', expected_output: '1 2' },
      { input: '3 3\n1 2 3\n4 5 6', expected_output: '-1' },
      { input: '3 3\n5 10 15\n15 5 20', expected_output: '5 15' }
    ],
    hidden_tests: [
      { input: '2 2\n-1 -2\n-2 -3', expected_output: '-2' },
      { input: '1 1\n7\n7', expected_output: '7' },
      { input: '5 5\n10 20 30 40 50\n50 40 30 20 10', expected_output: '10 20 30 40 50' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Rotate an Array Left by K Positions',
    slug: 'rotate-array-left-k-positions',
    difficulty: 'MEDIUM',
    placement_importance: 'IMPORTANT',
    level: 'INTERMEDIATE',
    description: 'Given an array of N integers, rotate the array left by K positions. K can be greater than N. Print the rotated array separated by space.',
    input_format: 'First line: N and K. Second line: N integers.',
    output_format: 'Print rotated array elements separated by space.',
    constraints: '1 <= N <= 10^5, 0 <= K <= 10^9, -10^6 <= A[i] <= 10^6',
    sample_input: '5 2\n1 2 3 4 5',
    sample_output: '3 4 5 1 2',
    explanation: 'Left rotation by 1: 2 3 4 5 1. Left rotation by 2: 3 4 5 1 2.',
    hints: ['K = K % N. Reverse first K elements, reverse remaining N-K elements, then reverse whole array.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        // Rotate left by K
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    private static void reverse(int[] arr, int l, int r) {
        while (l < r) {
            int t = arr[l];
            arr[l] = arr[r];
            arr[r] = t;
            l++;
            r--;
        }
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        
        k = k % n;
        reverse(arr, 0, k - 1);
        reverse(arr, k, n - 1);
        reverse(arr, 0, n - 1);
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (i > 0) sb.append(" ");
            sb.append(arr[i]);
        }
        System.out.println(sb.toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '5 2\n1 2 3 4 5', expected_output: '3 4 5 1 2' },
      { input: '4 4\n10 20 30 40', expected_output: '10 20 30 40' },
      { input: '3 1\n7 8 9', expected_output: '8 9 7' }
    ],
    hidden_tests: [
      { input: '5 7\n1 2 3 4 5', expected_output: '3 4 5 1 2' },
      { input: '1 10\n42', expected_output: '42' },
      { input: '4 0\n1 2 3 4', expected_output: '1 2 3 4' }
    ]
  },
  {
    topicOrder: 10,
    title: "Maximum Subarray Sum Using Kadane's Algorithm",
    slug: 'maximum-subarray-sum-kadane',
    difficulty: 'MEDIUM',
    placement_importance: 'VERY_IMPORTANT',
    level: 'PLACEMENT',
    description: 'Given an array of N integers, find the maximum sum of a contiguous non-empty subarray using Kadane\'s Algorithm.',
    input_format: 'First line contains integer N. Second line contains N integers.',
    output_format: 'Print maximum subarray sum as integer.',
    constraints: '1 <= N <= 10^5, -10^4 <= A[i] <= 10^4',
    sample_input: '8\n-2 -3 4 -1 -2 1 5 -3',
    sample_output: '7',
    explanation: 'The contiguous subarray [4, -1, -2, 1, 5] has the largest sum = 7.',
    hints: ['Keep maxSoFar and maxEndingHere. If maxEndingHere < 0, reset it.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Kadane algorithm
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long maxSoFar = Long.MIN_VALUE;
        long currentMax = 0;
        for (int i = 0; i < n; i++) {
            long val = sc.nextLong();
            currentMax += val;
            if (currentMax > maxSoFar) {
                maxSoFar = currentMax;
            }
            if (currentMax < 0) {
                currentMax = 0;
            }
        }
        System.out.println(maxSoFar);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '8\n-2 -3 4 -1 -2 1 5 -3', expected_output: '7' },
      { input: '4\n-1 -2 -3 -4', expected_output: '-1' },
      { input: '5\n1 2 3 4 5', expected_output: '15' }
    ],
    hidden_tests: [
      { input: '1\n100', expected_output: '100' },
      { input: '1\n-50', expected_output: '-50' },
      { input: '5\n-2 1 -3 4 -1', expected_output: '4' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Two Sum: Two Elements Whose Sum Equals Target',
    slug: 'two-sum-array',
    difficulty: 'MEDIUM',
    placement_importance: 'VERY_IMPORTANT',
    level: 'PLACEMENT',
    description: 'Given an array of N integers and a target sum T, determine whether there exist two distinct indices i and j (i != j) such that A[i] + A[j] == T. Print "YES" if such a pair exists, otherwise print "NO".',
    input_format: 'First line: N and T. Second line: N integers.',
    output_format: 'Print "YES" or "NO".',
    constraints: '2 <= N <= 10^5, -10^9 <= A[i], T <= 10^9',
    sample_input: '5 9\n2 7 11 15 3',
    sample_output: 'YES',
    explanation: '2 + 7 = 9. Output is YES.',
    hints: ['Use a HashSet to store seen elements. For each x, check if set contains T - x.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long target = sc.nextLong();
        // Two sum check
    }
}`,
    reference_solution: `import java.util.Scanner;
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long target = sc.nextLong();
        HashSet<Long> seen = new HashSet<>();
        boolean found = false;
        for (int i = 0; i < n; i++) {
            long x = sc.nextLong();
            if (seen.contains(target - x)) {
                found = true;
            }
            seen.add(x);
        }
        if (found) System.out.println("YES");
        else System.out.println("NO");
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '5 9\n2 7 11 15 3', expected_output: 'YES' },
      { input: '3 10\n1 2 3', expected_output: 'NO' },
      { input: '4 6\n3 1 3 5', expected_output: 'YES' }
    ],
    hidden_tests: [
      { input: '2 10\n5 5', expected_output: 'YES' },
      { input: '2 10\n5 4', expected_output: 'NO' },
      { input: '4 0\n-5 5 1 2', expected_output: 'YES' }
    ]
  },

  // ==========================================
  // PART B — 2D ARRAYS (MATRICES)
  // ==========================================
  {
    topicOrder: 10,
    title: 'Read and Print a Matrix',
    slug: 'read-and-print-matrix',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given dimensions R (rows) and C (columns), followed by R * C integers, read the 2D matrix and print each row on a new line with elements separated by space.',
    input_format: 'First line contains R and C. Next R lines contain C integers each.',
    output_format: 'Print the matrix row by row.',
    constraints: '1 <= R, C <= 100, -10^4 <= M[i][j] <= 10^4',
    sample_input: '2 3\n1 2 3\n4 5 6',
    sample_output: '1 2 3\n4 5 6',
    explanation: 'A 2x3 matrix printed as entered.',
    hints: ['Nested loops: for i 0 to R-1, for j 0 to C-1.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        // Print matrix
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        for (int i = 0; i < r; i++) {
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < c; j++) {
                if (j > 0) sb.append(" ");
                sb.append(sc.nextInt());
            }
            System.out.println(sb.toString());
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '2 3\n1 2 3\n4 5 6', expected_output: '1 2 3\n4 5 6' },
      { input: '1 1\n42', expected_output: '42' },
      { input: '2 2\n-1 -2\n-3 -4', expected_output: '-1 -2\n-3 -4' }
    ],
    hidden_tests: [
      { input: '3 2\n10 20\n30 40\n50 60', expected_output: '10 20\n30 40\n50 60' },
      { input: '1 3\n7 8 9', expected_output: '7 8 9' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Find the Sum of All Elements in a Matrix',
    slug: 'sum-of-matrix-elements',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given dimensions R and C of a matrix, find and print the sum of all elements in the matrix.',
    input_format: 'First line: R and C. Following R lines: C integers each.',
    output_format: 'Print total sum as integer.',
    constraints: '1 <= R, C <= 100, -10^4 <= M[i][j] <= 10^4',
    sample_input: '2 2\n1 2\n3 4',
    sample_output: '10',
    explanation: '1 + 2 + 3 + 4 = 10.',
    hints: ['Accumulate sum over all elements.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        // Compute matrix sum
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        long sum = 0;
        for (int i = 0; i < r * c; i++) {
            sum += sc.nextLong();
        }
        System.out.println(sum);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '2 2\n1 2\n3 4', expected_output: '10' },
      { input: '1 3\n5 10 15', expected_output: '30' },
      { input: '2 3\n-1 -2 -3\n1 2 3', expected_output: '0' }
    ],
    hidden_tests: [
      { input: '1 1\n100', expected_output: '100' },
      { input: '3 3\n1 1 1\n1 1 1\n1 1 1', expected_output: '9' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Add Two Matrices',
    slug: 'add-two-matrices',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given dimensions R and C, followed by elements of Matrix A and Matrix B, calculate and print their matrix sum (A + B).',
    input_format: 'First line: R and C. Next R lines: Matrix A. Next R lines: Matrix B.',
    output_format: 'Print resulting R x C matrix.',
    constraints: '1 <= R, C <= 100, -10^4 <= elements <= 10^4',
    sample_input: '2 2\n1 2\n3 4\n5 6\n7 8',
    sample_output: '6 8\n10 12',
    explanation: '1+5=6, 2+6=8, 3+7=10, 4+8=12.',
    hints: ['C[i][j] = A[i][j] + B[i][j].'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        // Add two matrices
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        int[][] a = new int[r][c];
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) a[i][j] = sc.nextInt();
        }
        for (int i = 0; i < r; i++) {
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < c; j++) {
                int bVal = sc.nextInt();
                if (j > 0) sb.append(" ");
                sb.append(a[i][j] + bVal);
            }
            System.out.println(sb.toString());
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '2 2\n1 2\n3 4\n5 6\n7 8', expected_output: '6 8\n10 12' },
      { input: '1 2\n10 20\n-5 5', expected_output: '5 25' }
    ],
    hidden_tests: [
      { input: '2 1\n1\n2\n3\n4', expected_output: '4\n6' },
      { input: '1 1\n0\n0', expected_output: '0' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Find the Transpose of a Matrix',
    slug: 'transpose-of-matrix',
    difficulty: 'MEDIUM',
    placement_importance: 'IMPORTANT',
    level: 'INTERMEDIATE',
    description: 'Given an R x C matrix, calculate and print its Transpose (C x R matrix where rows become columns).',
    input_format: 'First line: R and C. Next R lines: C integers each.',
    output_format: 'Print transposed matrix of size C x R.',
    constraints: '1 <= R, C <= 100',
    sample_input: '2 3\n1 2 3\n4 5 6',
    sample_output: '1 4\n2 5\n3 6',
    explanation: 'Rows become columns in transposed matrix.',
    hints: ['T[j][i] = M[i][j]. Print outer loop j 0 to C-1, inner loop i 0 to R-1.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        // Compute transpose
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        int[][] mat = new int[r][c];
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) mat[i][j] = sc.nextInt();
        }
        for (int j = 0; j < c; j++) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < r; i++) {
                if (i > 0) sb.append(" ");
                sb.append(mat[i][j]);
            }
            System.out.println(sb.toString());
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '2 3\n1 2 3\n4 5 6', expected_output: '1 4\n2 5\n3 6' },
      { input: '2 2\n1 2\n3 4', expected_output: '1 3\n2 4' }
    ],
    hidden_tests: [
      { input: '1 3\n10 20 30', expected_output: '10\n20\n30' },
      { input: '3 1\n10\n20\n30', expected_output: '10 20 30' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Calculate Sum of Primary and Secondary Diagonals',
    slug: 'sum-primary-secondary-diagonals',
    difficulty: 'MEDIUM',
    placement_importance: 'IMPORTANT',
    level: 'INTERMEDIATE',
    description: 'Given a square matrix of size N x N, calculate and print the sum of its Primary Diagonal (M[i][i]) and Secondary Diagonal (M[i][N - 1 - i]) separated by space.',
    input_format: 'First line: N. Following N lines: N integers each.',
    output_format: 'Print "PrimarySum SecondarySum" separated by space.',
    constraints: '1 <= N <= 100',
    sample_input: '3\n1 2 3\n4 5 6\n7 8 9',
    sample_output: '15 15',
    explanation: 'Primary: 1 + 5 + 9 = 15. Secondary: 3 + 5 + 7 = 15.',
    hints: ['Primary is [i][i], Secondary is [i][N-1-i].'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Diagonal sums
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] m = new int[n][n];
        long pSum = 0, sSum = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                m[i][j] = sc.nextInt();
                if (i == j) pSum += m[i][j];
                if (i + j == n - 1) sSum += m[i][j];
            }
        }
        System.out.println(pSum + " " + sSum);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '3\n1 2 3\n4 5 6\n7 8 9', expected_output: '15 15' },
      { input: '2\n1 2\n3 4', expected_output: '5 5' },
      { input: '1\n10', expected_output: '10 10' }
    ],
    hidden_tests: [
      { input: '3\n1 0 0\n0 2 0\n0 0 3', expected_output: '6 2' },
      { input: '4\n1 2 3 4\n5 6 7 8\n9 1 2 3\n4 5 6 7', expected_output: '16 20' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Find the Largest Element in Each Row',
    slug: 'largest-element-each-row',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given an R x C matrix, find and print the maximum element of each row separated by space.',
    input_format: 'First line: R and C. Following R lines: C integers each.',
    output_format: 'Print max element of each row separated by space.',
    constraints: '1 <= R, C <= 100',
    sample_input: '3 3\n1 2 3\n9 5 6\n7 8 4',
    sample_output: '3 9 8',
    explanation: 'Row 1 max is 3, Row 2 max is 9, Row 3 max is 8.',
    hints: ['Find max for each row independently.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        // Row max
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < r; i++) {
            int max = Integer.MIN_VALUE;
            for (int j = 0; j < c; j++) {
                int x = sc.nextInt();
                if (x > max) max = x;
            }
            if (i > 0) sb.append(" ");
            sb.append(max);
        }
        System.out.println(sb.toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '3 3\n1 2 3\n9 5 6\n7 8 4', expected_output: '3 9 8' },
      { input: '2 2\n10 20\n30 5', expected_output: '20 30' }
    ],
    hidden_tests: [
      { input: '1 4\n5 12 3 8', expected_output: '12' },
      { input: '3 1\n-5\n-1\n-10', expected_output: '-5 -1 -10' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Find the Largest Element in Each Column',
    slug: 'largest-element-each-column',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given an R x C matrix, find and print the maximum element of each column separated by space.',
    input_format: 'First line: R and C. Following R lines: C integers each.',
    output_format: 'Print max element of each column separated by space.',
    constraints: '1 <= R, C <= 100',
    sample_input: '3 3\n1 8 3\n9 2 6\n7 5 4',
    sample_output: '9 8 6',
    explanation: 'Col 1 max is 9, Col 2 max is 8, Col 3 max is 6.',
    hints: ['Store matrix in memory, then loop outer column j, inner row i.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        // Column max
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        int[][] m = new int[r][c];
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) m[i][j] = sc.nextInt();
        }
        StringBuilder sb = new StringBuilder();
        for (int j = 0; j < c; j++) {
            int max = Integer.MIN_VALUE;
            for (int i = 0; i < r; i++) {
                if (m[i][j] > max) max = m[i][j];
            }
            if (j > 0) sb.append(" ");
            sb.append(max);
        }
        System.out.println(sb.toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '3 3\n1 8 3\n9 2 6\n7 5 4', expected_output: '9 8 6' },
      { input: '2 2\n10 5\n20 15', expected_output: '20 15' }
    ],
    hidden_tests: [
      { input: '3 1\n4\n12\n3', expected_output: '12' },
      { input: '1 3\n5 10 15', expected_output: '5 10 15' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Search for an Element in a Matrix',
    slug: 'search-element-in-matrix',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given an R x C matrix and a target integer X, search for X in the matrix. If found, print "Found at (row, col)" with 0-based indexing (first occurrence). Otherwise, print "Not Found".',
    input_format: 'First line: R, C, and X. Following R lines: C integers each.',
    output_format: 'Print "Found at (r, c)" or "Not Found".',
    constraints: '1 <= R, C <= 100',
    sample_input: '2 3 5\n1 2 3\n4 5 6',
    sample_output: 'Found at (1, 1)',
    explanation: '5 is located at row 1, col 1.',
    hints: ['Check m[i][j] == X.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        int x = sc.nextInt();
        // Search in matrix
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        int x = sc.nextInt();
        int foundR = -1, foundC = -1;
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                int val = sc.nextInt();
                if (val == x && foundR == -1) {
                    foundR = i;
                    foundC = j;
                }
            }
        }
        if (foundR != -1) {
            System.out.println("Found at (" + foundR + ", " + foundC + ")");
        } else {
            System.out.println("Not Found");
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '2 3 5\n1 2 3\n4 5 6', expected_output: 'Found at (1, 1)' },
      { input: '2 2 9\n1 2\n3 4', expected_output: 'Not Found' }
    ],
    hidden_tests: [
      { input: '1 1 42\n42', expected_output: 'Found at (0, 0)' },
      { input: '3 3 -5\n1 2 3\n4 -5 6\n7 8 9', expected_output: 'Found at (1, 1)' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Print Boundary Elements of a Matrix',
    slug: 'boundary-elements-of-matrix',
    difficulty: 'MEDIUM',
    placement_importance: 'NORMAL',
    level: 'INTERMEDIATE',
    description: 'Given an R x C matrix, print all boundary elements in clockwise order starting from top-left (top row -> right column -> bottom row -> left column).',
    input_format: 'First line: R and C. Following R lines: C integers each.',
    output_format: 'Print boundary integers separated by space.',
    constraints: '1 <= R, C <= 100',
    sample_input: '3 3\n1 2 3\n4 5 6\n7 8 9',
    sample_output: '1 2 3 6 9 8 7 4',
    explanation: 'Boundary elements traversed clockwise.',
    hints: ['Handle 1x1, 1xC, and Rx1 edge cases carefully.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        // Print boundary elements
    }
}`,
    reference_solution: `import java.util.Scanner;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        int[][] m = new int[r][c];
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) m[i][j] = sc.nextInt();
        }
        ArrayList<Integer> boundary = new ArrayList<>();
        if (r == 1) {
            for (int j = 0; j < c; j++) boundary.add(m[0][j]);
        } else if (c == 1) {
            for (int i = 0; i < r; i++) boundary.add(m[i][0]);
        } else {
            for (int j = 0; j < c; j++) boundary.add(m[0][j]);
            for (int i = 1; i < r; i++) boundary.add(m[i][c - 1]);
            for (int j = c - 2; j >= 0; j--) boundary.add(m[r - 1][j]);
            for (int i = r - 2; i >= 1; i--) boundary.add(m[i][0]);
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < boundary.size(); i++) {
            if (i > 0) sb.append(" ");
            sb.append(boundary.get(i));
        }
        System.out.println(sb.toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '3 3\n1 2 3\n4 5 6\n7 8 9', expected_output: '1 2 3 6 9 8 7 4' },
      { input: '2 2\n1 2\n3 4', expected_output: '1 2 4 3' }
    ],
    hidden_tests: [
      { input: '1 3\n10 20 30', expected_output: '10 20 30' },
      { input: '3 1\n1\n2\n3', expected_output: '1 2 3' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Print a Matrix in Spiral Order',
    slug: 'spiral-matrix-order',
    difficulty: 'MEDIUM',
    placement_importance: 'VERY_IMPORTANT',
    level: 'PLACEMENT',
    description: 'Given an R x C matrix, print all elements of the matrix in clockwise spiral order starting from top-left.',
    input_format: 'First line: R and C. Following R lines: C integers each.',
    output_format: 'Print matrix elements in spiral order separated by space.',
    constraints: '1 <= R, C <= 100',
    sample_input: '3 3\n1 2 3\n4 5 6\n7 8 9',
    sample_output: '1 2 3 6 9 8 7 4 5',
    explanation: 'Spiral traversal visits: 1, 2, 3, 6, 9, 8, 7, 4, 5.',
    hints: ['Maintain top, bottom, left, right bounds.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        // Print in spiral order
    }
}`,
    reference_solution: `import java.util.Scanner;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        int[][] m = new int[r][c];
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) m[i][j] = sc.nextInt();
        }
        
        int top = 0, bottom = r - 1, left = 0, right = c - 1;
        ArrayList<Integer> res = new ArrayList<>();
        
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) res.add(m[top][j]);
            top++;
            for (int i = top; i <= bottom; i++) res.add(m[i][right]);
            right--;
            if (top <= bottom) {
                for (int j = right; j >= left; j--) res.add(m[bottom][j]);
                bottom--;
            }
            if (left <= right) {
                for (int i = bottom; i >= top; i--) res.add(m[i][left]);
                left++;
            }
        }
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < res.size(); i++) {
            if (i > 0) sb.append(" ");
            sb.append(res.get(i));
        }
        System.out.println(sb.toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '3 3\n1 2 3\n4 5 6\n7 8 9', expected_output: '1 2 3 6 9 8 7 4 5' },
      { input: '2 3\n1 2 3\n4 5 6', expected_output: '1 2 3 6 5 4' },
      { input: '1 1\n7', expected_output: '7' }
    ],
    hidden_tests: [
      { input: '4 4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16', expected_output: '1 2 3 4 8 12 16 15 14 13 9 5 6 7 11 10' },
      { input: '3 1\n1\n2\n3', expected_output: '1 2 3' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Rotate Square Matrix by 90 Degrees Clockwise',
    slug: 'rotate-matrix-90-degrees-clockwise',
    difficulty: 'MEDIUM',
    placement_importance: 'VERY_IMPORTANT',
    level: 'PLACEMENT',
    description: 'Given an N x N square matrix, rotate the matrix by 90 degrees clockwise in-place and print the rotated matrix.',
    input_format: 'First line: N. Following N lines: N integers each.',
    output_format: 'Print rotated N x N matrix.',
    constraints: '1 <= N <= 100',
    sample_input: '3\n1 2 3\n4 5 6\n7 8 9',
    sample_output: '7 4 1\n8 5 2\n9 6 3',
    explanation: 'Transpose matrix, then reverse each row.',
    hints: ['1. Transpose: swap M[i][j] with M[j][i]. 2. Reverse each row.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Rotate 90 deg clockwise
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] m = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) m[i][j] = sc.nextInt();
        }
        
        // Transpose
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                int temp = m[i][j];
                m[i][j] = m[j][i];
                m[j][i] = temp;
            }
        }
        
        // Reverse each row
        for (int i = 0; i < n; i++) {
            int l = 0, r = n - 1;
            while (l < r) {
                int temp = m[i][l];
                m[i][l] = m[i][r];
                m[i][r] = temp;
                l++;
                r--;
            }
        }
        
        for (int i = 0; i < n; i++) {
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < n; j++) {
                if (j > 0) sb.append(" ");
                sb.append(m[i][j]);
            }
            System.out.println(sb.toString());
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '3\n1 2 3\n4 5 6\n7 8 9', expected_output: '7 4 1\n8 5 2\n9 6 3' },
      { input: '2\n1 2\n3 4', expected_output: '3 1\n4 2' }
    ],
    hidden_tests: [
      { input: '1\n10', expected_output: '10' },
      { input: '4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16', expected_output: '13 9 5 1\n14 10 6 2\n15 11 7 3\n16 12 8 4' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Multiply Two Matrices',
    slug: 'multiply-two-matrices',
    difficulty: 'MEDIUM',
    placement_importance: 'IMPORTANT',
    level: 'INTERMEDIATE',
    description: 'Given Matrix A of size R1 x C1 and Matrix B of size R2 x C2 (with C1 == R2 guaranteed), calculate and print the matrix product A * B (of size R1 x C2).',
    input_format: 'First line: R1, C1. Next R1 lines: Matrix A. Next line: R2, C2. Next R2 lines: Matrix B.',
    output_format: 'Print resulting R1 x C2 matrix.',
    constraints: '1 <= R1, C1, R2, C2 <= 50',
    sample_input: '2 3\n1 2 3\n4 5 6\n3 2\n7 8\n9 1\n2 3',
    sample_output: '31 19\n85 55',
    explanation: 'Row 1 * Col 1 = 1*7 + 2*9 + 3*2 = 31.',
    hints: ['C[i][j] = sum over k from 0 to C1-1 of (A[i][k] * B[k][j]).'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Multiply matrices
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r1 = sc.nextInt();
        int c1 = sc.nextInt();
        int[][] a = new int[r1][c1];
        for (int i = 0; i < r1; i++) {
            for (int j = 0; j < c1; j++) a[i][j] = sc.nextInt();
        }
        int r2 = sc.nextInt();
        int c2 = sc.nextInt();
        int[][] b = new int[r2][c2];
        for (int i = 0; i < r2; i++) {
            for (int j = 0; j < c2; j++) b[i][j] = sc.nextInt();
        }
        
        int[][] c = new int[r1][c2];
        for (int i = 0; i < r1; i++) {
            for (int j = 0; j < c2; j++) {
                for (int k = 0; k < c1; k++) {
                    c[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        
        for (int i = 0; i < r1; i++) {
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < c2; j++) {
                if (j > 0) sb.append(" ");
                sb.append(c[i][j]);
            }
            System.out.println(sb.toString());
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '2 3\n1 2 3\n4 5 6\n3 2\n7 8\n9 1\n2 3', expected_output: '31 19\n85 55' },
      { input: '2 2\n1 0\n0 1\n2 2\n4 5\n6 7', expected_output: '4 5\n6 7' }
    ],
    hidden_tests: [
      { input: '1 2\n2 3\n2 1\n4\n5', expected_output: '23' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Check Whether a Matrix is Symmetric',
    slug: 'check-symmetric-matrix',
    difficulty: 'MEDIUM',
    placement_importance: 'IMPORTANT',
    level: 'INTERMEDIATE',
    description: 'A square matrix is symmetric if it is equal to its transpose (M[i][j] == M[j][i] for all i and j). Given an N x N matrix, print "Symmetric" or "Not Symmetric".',
    input_format: 'First line: N. Following N lines: N integers each.',
    output_format: 'Print "Symmetric" or "Not Symmetric".',
    constraints: '1 <= N <= 100',
    sample_input: '3\n1 2 3\n2 4 5\n3 5 6',
    sample_output: 'Symmetric',
    explanation: 'M[i][j] == M[j][i] for all indices.',
    hints: ['Check if any m[i][j] != m[j][i].'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Check symmetric
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] m = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) m[i][j] = sc.nextInt();
        }
        boolean symmetric = true;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (m[i][j] != m[j][i]) {
                    symmetric = false;
                    break;
                }
            }
        }
        if (symmetric) System.out.println("Symmetric");
        else System.out.println("Not Symmetric");
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '3\n1 2 3\n2 4 5\n3 5 6', expected_output: 'Symmetric' },
      { input: '3\n1 2 3\n4 5 6\n7 8 9', expected_output: 'Not Symmetric' }
    ],
    hidden_tests: [
      { input: '1\n10', expected_output: 'Symmetric' },
      { input: '2\n1 5\n5 2', expected_output: 'Symmetric' },
      { input: '2\n1 2\n3 4', expected_output: 'Not Symmetric' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Count the Number of Zeros in a Matrix',
    slug: 'count-zeros-in-matrix',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given an R x C matrix, count and print the total number of zero elements (0).',
    input_format: 'First line: R and C. Following R lines: C integers each.',
    output_format: 'Print the count of zeros.',
    constraints: '1 <= R, C <= 100',
    sample_input: '3 3\n1 0 2\n0 0 3\n4 5 0',
    sample_output: '4',
    explanation: 'There are 4 zeros in the matrix.',
    hints: ['Increment count whenever element == 0.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        // Count zeros
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        int count = 0;
        for (int i = 0; i < r * c; i++) {
            if (sc.nextInt() == 0) count++;
        }
        System.out.println(count);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '3 3\n1 0 2\n0 0 3\n4 5 0', expected_output: '4' },
      { input: '2 2\n1 2\n3 4', expected_output: '0' }
    ],
    hidden_tests: [
      { input: '2 2\n0 0\n0 0', expected_output: '4' },
      { input: '1 1\n0', expected_output: '1' }
    ]
  },
  {
    topicOrder: 10,
    title: 'Find the Row with the Maximum Sum',
    slug: 'row-with-maximum-sum',
    difficulty: 'MEDIUM',
    placement_importance: 'IMPORTANT',
    level: 'INTERMEDIATE',
    description: 'Given an R x C matrix, calculate the sum of elements in each row. Print the 0-based row index that has the maximum sum. In case of a tie, print the smallest row index.',
    input_format: 'First line: R and C. Following R lines: C integers each.',
    output_format: 'Print 0-based row index.',
    constraints: '1 <= R, C <= 100',
    sample_input: '3 3\n1 2 3\n4 5 6\n1 0 2',
    sample_output: '1',
    explanation: 'Row 0 sum = 6, Row 1 sum = 15, Row 2 sum = 3. Max sum is in Row 1.',
    hints: ['Compute each row sum and track bestRow index.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        // Find row with max sum
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        int c = sc.nextInt();
        long maxSum = Long.MIN_VALUE;
        int bestRow = 0;
        for (int i = 0; i < r; i++) {
            long rowSum = 0;
            for (int j = 0; j < c; j++) rowSum += sc.nextLong();
            if (rowSum > maxSum) {
                maxSum = rowSum;
                bestRow = i;
            }
        }
        System.out.println(bestRow);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '3 3\n1 2 3\n4 5 6\n1 0 2', expected_output: '1' },
      { input: '2 2\n10 20\n30 40', expected_output: '1' },
      { input: '2 2\n50 50\n10 20', expected_output: '0' }
    ],
    hidden_tests: [
      { input: '3 2\n5 5\n5 5\n1 1', expected_output: '0' },
      { input: '1 3\n10 20 30', expected_output: '0' }
    ]
  }
];
