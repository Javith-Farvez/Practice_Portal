import { ProblemSeed } from './types';

export const topic23CollectionsProblems: ProblemSeed[] = [
  // ==========================================
  // TOPIC 23: Collections Framework (36 problems)
  // Section A: ArrayList (6 problems)
  // ==========================================
  {
    topicOrder: 23,
    title: "ArrayList Dynamic CRUD Operations",
    slug: "arraylist-dynamic-crud-operations",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "BEGINNER",
    description: "Perform basic operations on an `ArrayList<Integer>`: start with an empty list, read Q queries. Queries can be:\n- `ADD X`: append integer X\n- `SET i X`: update index i to value X\n- `REMOVE i`: remove element at index i\nAt the end, print the size of the list on one line, and the list elements separated by spaces on the next line (or `EMPTY` if empty).",
    input_format: "Integer Q followed by Q queries.",
    output_format: "Line 1: size. Line 2: elements separated by space or `EMPTY`.",
    constraints: "1 <= Q <= 100",
    sample_input: "5\nADD 10\nADD 20\nADD 30\nSET 1 25\nREMOVE 0",
    sample_output: "2\n25 30",
    explanation: "Add 10,20,30 -> [10,20,30]. Set index 1 to 25 -> [10,25,30]. Remove index 0 -> [25,30]. Size is 2.",
    hints: ["Use ArrayList methods: .add(), .set(), .remove(int index), .size()."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Implement ArrayList CRUD
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int q = sc.nextInt();
        ArrayList<Integer> list = new ArrayList<>();
        for (int k = 0; k < q; k++) {
            String op = sc.next();
            if ("ADD".equals(op)) {
                list.add(sc.nextInt());
            } else if ("SET".equals(op)) {
                int idx = sc.nextInt();
                int val = sc.nextInt();
                list.set(idx, val);
            } else if ("REMOVE".equals(op)) {
                int idx = sc.nextInt();
                list.remove(idx);
            }
        }
        System.out.println(list.size());
        if (list.isEmpty()) {
            System.out.println("EMPTY");
        } else {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < list.size(); i++) {
                if (i > 0) sb.append(" ");
                sb.append(list.get(i));
            }
            System.out.println(sb.toString());
        }
    }
}`,
    public_tests: [
      { input: "5\nADD 10\nADD 20\nADD 30\nSET 1 25\nREMOVE 0", expected_output: "2\n25 30" },
      { input: "2\nADD 5\nREMOVE 0", expected_output: "0\nEMPTY" }
    ],
    hidden_tests: [
      { input: "4\nADD 1\nADD 2\nADD 3\nADD 4", expected_output: "4\n1 2 3 4" },
      { input: "6\nADD 100\nADD 200\nADD 300\nREMOVE 1\nSET 1 999\nADD 500", expected_output: "3\n100 999 500" },
      { input: "1\nADD 42", expected_output: "1\n42" },
      { input: "3\nADD 7\nSET 0 14\nADD 21", expected_output: "2\n14 21" },
      { input: "4\nADD 10\nADD 20\nREMOVE 1\nREMOVE 0", expected_output: "0\nEMPTY" }
    ]
  },
  {
    topicOrder: 23,
    title: "Reverse ArrayList Elements",
    slug: "reverse-arraylist-elements",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "BEGINNER",
    description: "Read N integers into an `ArrayList<Integer>`. Reverse the list using `Collections.reverse()` and print the reversed elements separated by space.",
    input_format: "Integer N followed by N integers.",
    output_format: "The reversed elements separated by space.",
    constraints: "1 <= N <= 1000",
    sample_input: "5\n1 2 3 4 5",
    sample_output: "5 4 3 2 1",
    explanation: "Reversing [1, 2, 3, 4, 5] yields [5, 4, 3, 2, 1].",
    hints: ["Use Collections.reverse(list)."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Reverse ArrayList
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        ArrayList<Integer> list = new ArrayList<>(n);
        for (int i = 0; i < n; i++) {
            list.add(sc.nextInt());
        }
        Collections.reverse(list);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(" ");
            sb.append(list.get(i));
        }
        System.out.println(sb.toString());
    }
}`,
    public_tests: [
      { input: "5\n1 2 3 4 5", expected_output: "5 4 3 2 1" },
      { input: "3\n10 20 30", expected_output: "30 20 10" }
    ],
    hidden_tests: [
      { input: "1\n99", expected_output: "99" },
      { input: "4\n-1 -2 -3 -4", expected_output: "-4 -3 -2 -1" },
      { input: "6\n2 4 6 8 10 12", expected_output: "12 10 8 6 4 2" },
      { input: "2\n100 200", expected_output: "200 100" },
      { input: "5\n5 5 5 5 5", expected_output: "5 5 5 5 5" }
    ]
  },
  {
    topicOrder: 23,
    title: "Filter Even Numbers from ArrayList",
    slug: "filter-even-numbers-from-arraylist",
    difficulty: "EASY",
    placement_importance: "NORMAL",
    level: "BEGINNER",
    description: "Given N integers in an ArrayList, remove all odd numbers so that only even numbers remain. Print the remaining even numbers separated by spaces, or `EMPTY` if no even numbers exist.",
    input_format: "Integer N followed by N integers.",
    output_format: "Filtered even numbers or `EMPTY`.",
    constraints: "1 <= N <= 1000",
    sample_input: "6\n1 2 3 4 5 6",
    sample_output: "2 4 6",
    explanation: "Even numbers are 2, 4, 6.",
    hints: ["Use Iterator or `list.removeIf(x -> x % 2 != 0)`."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Filter even numbers
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        ArrayList<Integer> list = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            list.add(sc.nextInt());
        }
        list.removeIf(x -> x % 2 != 0);
        if (list.isEmpty()) {
            System.out.println("EMPTY");
        } else {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < list.size(); i++) {
                if (i > 0) sb.append(" ");
                sb.append(list.get(i));
            }
            System.out.println(sb.toString());
        }
    }
}`,
    public_tests: [
      { input: "6\n1 2 3 4 5 6", expected_output: "2 4 6" },
      { input: "3\n1 3 5", expected_output: "EMPTY" }
    ],
    hidden_tests: [
      { input: "4\n2 4 6 8", expected_output: "2 4 6 8" },
      { input: "5\n-2 -1 0 1 2", expected_output: "-2 0 2" },
      { input: "1\n7", expected_output: "EMPTY" },
      { input: "1\n10", expected_output: "10" },
      { input: "4\n11 13 17 19", expected_output: "EMPTY" }
    ]
  },
  {
    topicOrder: 23,
    title: "Sort Strings by Length then Alphabetical",
    slug: "sort-strings-by-length-then-alphabetical",
    difficulty: "MEDIUM",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Read N strings into an `ArrayList<String>`. Sort them primarily by string length in ascending order. If two strings have the same length, sort them lexicographically (alphabetical order). Print each string on a new line.",
    input_format: "Integer N followed by N words.",
    output_format: "Sorted strings, one per line.",
    constraints: "1 <= N <= 500",
    sample_input: "5\nbanana cat apple dog elephant",
    sample_output: "cat\ndog\napple\nbanana\nelephant",
    explanation: "cat and dog (length 3, cat < dog), apple (length 5), banana (length 6), elephant (length 8).",
    hints: ["Use Collections.sort(list, (a, b) -> a.length() != b.length() ? a.length() - b.length() : a.compareTo(b))."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Sort strings by length and lexicographically
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        ArrayList<String> list = new ArrayList<>(n);
        for (int i = 0; i < n; i++) {
            list.add(sc.next());
        }
        Collections.sort(list, (a, b) -> {
            if (a.length() != b.length()) {
                return Integer.compare(a.length(), b.length());
            }
            return a.compareTo(b);
        });
        for (String s : list) {
            System.out.println(s);
        }
    }
}`,
    public_tests: [
      { input: "5\nbanana cat apple dog elephant", expected_output: "cat\ndog\napple\nbanana\nelephant" },
      { input: "3\nbb a ccc", expected_output: "a\nbb\nccc" }
    ],
    hidden_tests: [
      { input: "4\nbeta alpha gamma delta", expected_output: "beta\nalpha\ndelta\ngamma" },
      { input: "2\nzoo ant", expected_output: "ant\nzoo" },
      { input: "4\nsame size test here", expected_output: "here\nsame\nsize\ntest" },
      { input: "1\nsolo", expected_output: "solo" },
      { input: "3\naaa aa a", expected_output: "a\naa\naaa" }
    ]
  },
  {
    topicOrder: 23,
    title: "Remove Duplicates Maintaining Insertion Order",
    slug: "remove-duplicates-maintaining-insertion-order",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given N integers in an ArrayList, remove all duplicate elements while strictly preserving the first appearance of each element. Print the resulting list elements separated by spaces.",
    input_format: "Integer N followed by N integers.",
    output_format: "Unique elements in order of first appearance.",
    constraints: "1 <= N <= 1000",
    sample_input: "8\n4 5 4 2 1 2 5 3",
    sample_output: "4 5 2 1 3",
    explanation: "Duplicates of 4, 2, 5 after their first occurrences are eliminated.",
    hints: ["Use a LinkedHashSet to preserve insertion order or an ArrayList checking `seen.add(x)`."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Remove duplicates preserving order
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        ArrayList<Integer> result = new ArrayList<>();
        HashSet<Integer> seen = new HashSet<>();
        for (int i = 0; i < n; i++) {
            int val = sc.nextInt();
            if (seen.add(val)) {
                result.add(val);
            }
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < result.size(); i++) {
            if (i > 0) sb.append(" ");
            sb.append(result.get(i));
        }
        System.out.println(sb.toString());
    }
}`,
    public_tests: [
      { input: "8\n4 5 4 2 1 2 5 3", expected_output: "4 5 2 1 3" },
      { input: "4\n1 1 1 1", expected_output: "1" }
    ],
    hidden_tests: [
      { input: "5\n1 2 3 4 5", expected_output: "1 2 3 4 5" },
      { input: "6\n10 20 10 30 20 40", expected_output: "10 20 30 40" },
      { input: "3\n-1 -1 0", expected_output: "-1 0" },
      { input: "1\n999", expected_output: "999" },
      { input: "5\n2 3 2 3 2", expected_output: "2 3" }
    ]
  },
  {
    topicOrder: 23,
    title: "ArrayList SubList Sum",
    slug: "arraylist-sublist-sum",
    difficulty: "EASY",
    placement_importance: "NORMAL",
    level: "BEGINNER",
    description: "Read N integers into an ArrayList. Then read two indices L and R (0-based, inclusive). Create a sublist from index L to R using `list.subList(L, R + 1)` and compute the sum of all elements in this sublist. Print the sum.",
    input_format: "Integer N, followed by N integers, followed by two integers L and R.",
    output_format: "An integer representing the sum.",
    constraints: "1 <= N <= 1000, 0 <= L <= R < N",
    sample_input: "5\n10 20 30 40 50\n1 3",
    sample_output: "90",
    explanation: "Sublist from index 1 to 3 contains [20, 30, 40]. Sum = 20 + 30 + 40 = 90.",
    hints: ["Use `list.subList(l, r + 1)` and iterate over it."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Calculate sublist sum
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        ArrayList<Integer> list = new ArrayList<>(n);
        for (int i = 0; i < n; i++) {
            list.add(sc.nextInt());
        }
        int l = sc.nextInt();
        int r = sc.nextInt();
        List<Integer> sub = list.subList(l, r + 1);
        long sum = 0;
        for (int val : sub) {
            sum += val;
        }
        System.out.println(sum);
    }
}`,
    public_tests: [
      { input: "5\n10 20 30 40 50\n1 3", expected_output: "90" },
      { input: "3\n5 10 15\n0 0", expected_output: "5" }
    ],
    hidden_tests: [
      { input: "4\n1 2 3 4\n0 3", expected_output: "10" },
      { input: "5\n-5 5 -10 10 0\n1 3", expected_output: "5" },
      { input: "3\n100 200 300\n2 2", expected_output: "300" },
      { input: "5\n1 1 1 1 1\n0 4", expected_output: "5" },
      { input: "6\n2 4 6 8 10 12\n2 4", expected_output: "24" }
    ]
  },

  // ==========================================
  // Section B: LinkedList (6 problems)
  // ==========================================
  {
    topicOrder: 23,
    title: "LinkedList Head and Tail Operations",
    slug: "linkedlist-head-and-tail-operations",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "BEGINNER",
    description: "Simulate a `LinkedList<Integer>` with the following operations:\n- `ADD_FIRST X`: add element at beginning\n- `ADD_LAST X`: add element at end\n- `REMOVE_FIRST`: remove element from head\n- `REMOVE_LAST`: remove element from tail\nAfter Q queries, print first element, last element, and the full list separated by space (or `EMPTY` if list has no elements).",
    input_format: "Integer Q followed by Q operations.",
    output_format: "Line 1: first element or EMPTY. Line 2: last element or EMPTY. Line 3: elements separated by space or EMPTY.",
    constraints: "1 <= Q <= 100",
    sample_input: "5\nADD_LAST 10\nADD_FIRST 20\nADD_LAST 30\nREMOVE_FIRST\nADD_FIRST 40",
    sample_output: "40\n30\n40 10 30",
    explanation: "After all ops: list is [40, 10, 30]. First is 40, last is 30.",
    hints: ["Use LinkedList methods addFirst, addLast, removeFirst, removeLast, getFirst, getLast."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Implement LinkedList operations
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int q = sc.nextInt();
        LinkedList<Integer> list = new LinkedList<>();
        for (int k = 0; k < q; k++) {
            String op = sc.next();
            if ("ADD_FIRST".equals(op)) {
                list.addFirst(sc.nextInt());
            } else if ("ADD_LAST".equals(op)) {
                list.addLast(sc.nextInt());
            } else if ("REMOVE_FIRST".equals(op)) {
                if (!list.isEmpty()) list.removeFirst();
            } else if ("REMOVE_LAST".equals(op)) {
                if (!list.isEmpty()) list.removeLast();
            }
        }
        if (list.isEmpty()) {
            System.out.println("EMPTY\nEMPTY\nEMPTY");
        } else {
            System.out.println(list.getFirst());
            System.out.println(list.getLast());
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < list.size(); i++) {
                if (i > 0) sb.append(" ");
                sb.append(list.get(i));
            }
            System.out.println(sb.toString());
        }
    }
}`,
    public_tests: [
      { input: "5\nADD_LAST 10\nADD_FIRST 20\nADD_LAST 30\nREMOVE_FIRST\nADD_FIRST 40", expected_output: "40\n30\n40 10 30" },
      { input: "2\nADD_FIRST 5\nREMOVE_LAST", expected_output: "EMPTY\nEMPTY\nEMPTY" }
    ],
    hidden_tests: [
      { input: "3\nADD_FIRST 1\nADD_FIRST 2\nADD_FIRST 3", expected_output: "3\n1\n3 2 1" },
      { input: "4\nADD_LAST 10\nADD_LAST 20\nREMOVE_FIRST\nREMOVE_LAST", expected_output: "EMPTY\nEMPTY\nEMPTY" },
      { input: "1\nADD_LAST 100", expected_output: "100\n100\n100" },
      { input: "4\nADD_FIRST 5\nADD_LAST 15\nADD_FIRST 1\nADD_LAST 20", expected_output: "1\n20\n1 5 15 20" },
      { input: "3\nADD_FIRST 10\nADD_LAST 20\nREMOVE_LAST", expected_output: "10\n10\n10" }
    ]
  },
  {
    topicOrder: 23,
    title: "Remove All Occurrences from LinkedList",
    slug: "remove-all-occurrences-from-linkedlist",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "BEGINNER",
    description: "Given a `LinkedList<Integer>` of size N and a key value K, remove all occurrences of K from the list. Print the remaining elements separated by space, or `EMPTY` if all elements are removed.",
    input_format: "Integer N, followed by N integers, followed by integer K.",
    output_format: "Elements separated by space or `EMPTY`.",
    constraints: "1 <= N <= 1000",
    sample_input: "6\n1 2 3 2 4 2\n2",
    sample_output: "1 3 4",
    explanation: "All instances of 2 are removed.",
    hints: ["Use `list.removeIf(x -> x == k)`."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Remove all occurrences
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        LinkedList<Integer> list = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            list.add(sc.nextInt());
        }
        int k = sc.nextInt();
        list.removeIf(x -> x == k);
        if (list.isEmpty()) {
            System.out.println("EMPTY");
        } else {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < list.size(); i++) {
                if (i > 0) sb.append(" ");
                sb.append(list.get(i));
            }
            System.out.println(sb.toString());
        }
    }
}`,
    public_tests: [
      { input: "6\n1 2 3 2 4 2\n2", expected_output: "1 3 4" },
      { input: "3\n5 5 5\n5", expected_output: "EMPTY" }
    ],
    hidden_tests: [
      { input: "4\n1 2 3 4\n5", expected_output: "1 2 3 4" },
      { input: "5\n10 20 10 20 10\n10", expected_output: "20 20" },
      { input: "1\n7\n7", expected_output: "EMPTY" },
      { input: "1\n7\n3", expected_output: "7" },
      { input: "4\n-1 -2 -1 -3\n-1", expected_output: "-2 -3" }
    ]
  },
  {
    topicOrder: 23,
    title: "Find Middle Element of LinkedList",
    slug: "find-middle-element-of-linkedlist",
    difficulty: "EASY",
    placement_importance: "VERY_IMPORTANT",
    level: "BEGINNER",
    description: "Given N elements in a LinkedList, find and print the middle element. If there are two middle elements (i.e. even N), print the second middle element (at index N / 2).",
    input_format: "Integer N followed by N integers.",
    output_format: "Print the middle element.",
    constraints: "1 <= N <= 10^5",
    sample_input: "5\n1 2 3 4 5",
    sample_output: "3",
    explanation: "The elements are 1, 2, 3, 4, 5. The middle element is 3.",
    hints: ["In 0-indexed list, middle is at index n / 2."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Find middle element
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        LinkedList<Integer> list = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            list.add(sc.nextInt());
        }
        int midIdx = n / 2;
        System.out.println(list.get(midIdx));
    }
}`,
    public_tests: [
      { input: "5\n1 2 3 4 5", expected_output: "3" },
      { input: "6\n10 20 30 40 50 60", expected_output: "40" }
    ],
    hidden_tests: [
      { input: "1\n42", expected_output: "42" },
      { input: "2\n10 20", expected_output: "20" },
      { input: "3\n100 200 300", expected_output: "200" },
      { input: "4\n1 2 3 4", expected_output: "3" },
      { input: "7\n7 6 5 4 3 2 1", expected_output: "4" }
    ]
  },
  {
    topicOrder: 23,
    title: "Palindrome Check on LinkedList",
    slug: "palindrome-check-on-linkedlist",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given N characters in a `LinkedList<Character>`, check whether the elements form a palindrome. Print `YES` if palindrome, otherwise `NO`.",
    input_format: "Integer N followed by N characters separated by space.",
    output_format: "`YES` or `NO`.",
    constraints: "1 <= N <= 1000",
    sample_input: "5\nr a d a r",
    sample_output: "YES",
    explanation: "r-a-d-a-r is identical forwards and backwards.",
    hints: ["Compare elements from start and end moving towards center."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Palindrome check
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        LinkedList<Character> list = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            list.add(sc.next().charAt(0));
        }
        boolean isPal = true;
        int l = 0, r = n - 1;
        while (l < r) {
            if (!list.get(l).equals(list.get(r))) {
                isPal = false;
                break;
            }
            l++;
            r--;
        }
        System.out.println(isPal ? "YES" : "NO");
    }
}`,
    public_tests: [
      { input: "5\nr a d a r", expected_output: "YES" },
      { input: "4\nj a v a", expected_output: "NO" }
    ],
    hidden_tests: [
      { input: "1\nz", expected_output: "YES" },
      { input: "4\na b b a", expected_output: "YES" },
      { input: "2\na b", expected_output: "NO" },
      { input: "6\na b c c b a", expected_output: "YES" },
      { input: "3\na b a", expected_output: "YES" }
    ]
  },
  {
    topicOrder: 23,
    title: "Rotate LinkedList Right by K Positions",
    slug: "rotate-linkedlist-right-by-k-positions",
    difficulty: "MEDIUM",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given a LinkedList of N integers and an integer K, rotate the list to the right by K positions. For example, rotating [1, 2, 3, 4, 5] by 2 positions yields [4, 5, 1, 2, 3]. Print the rotated elements separated by space.",
    input_format: "Integer N, followed by N integers, followed by integer K.",
    output_format: "Rotated list elements separated by space.",
    constraints: "1 <= N <= 1000, 0 <= K <= 10^5",
    sample_input: "5\n1 2 3 4 5\n2",
    sample_output: "4 5 1 2 3",
    explanation: "Rotate right by 2 moves 4 and 5 to the front.",
    hints: ["Effective rotation is `k % n`. You can repeatedly pop from tail and push to head."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Rotate LinkedList right
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        LinkedList<Integer> list = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            list.add(sc.nextInt());
        }
        int k = sc.nextInt();
        if (n > 0) {
            k = k % n;
            for (int i = 0; i < k; i++) {
                int last = list.removeLast();
                list.addFirst(last);
            }
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(" ");
            sb.append(list.get(i));
        }
        System.out.println(sb.toString());
    }
}`,
    public_tests: [
      { input: "5\n1 2 3 4 5\n2", expected_output: "4 5 1 2 3" },
      { input: "3\n10 20 30\n0", expected_output: "10 20 30" }
    ],
    hidden_tests: [
      { input: "4\n1 2 3 4\n4", expected_output: "1 2 3 4" },
      { input: "4\n1 2 3 4\n1", expected_output: "4 1 2 3" },
      { input: "1\n99\n5", expected_output: "99" },
      { input: "3\n1 2 3\n5", expected_output: "2 3 1" },
      { input: "5\n10 20 30 40 50\n7", expected_output: "40 50 10 20 30" }
    ]
  },
  {
    topicOrder: 23,
    title: "Merge Two Sorted LinkedLists",
    slug: "merge-two-sorted-linkedlists",
    difficulty: "MEDIUM",
    placement_importance: "VERY_IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given two sorted LinkedLists of sizes N and M, merge them into a single sorted LinkedList. Print the merged elements separated by space.",
    input_format: "Integer N followed by N sorted integers, then integer M followed by M sorted integers.",
    output_format: "Merged sorted elements separated by space.",
    constraints: "0 <= N, M <= 1000",
    sample_input: "3\n1 3 5\n3\n2 4 6",
    sample_output: "1 2 3 4 5 6",
    explanation: "Merged sorted list is 1, 2, 3, 4, 5, 6.",
    hints: ["Use two pointers advancing through each list picking the smaller element."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Merge two sorted LinkedLists
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        LinkedList<Integer> l1 = new LinkedList<>();
        for (int i = 0; i < n; i++) l1.add(sc.nextInt());
        int m = sc.nextInt();
        LinkedList<Integer> l2 = new LinkedList<>();
        for (int i = 0; i < m; i++) l2.add(sc.nextInt());

        LinkedList<Integer> merged = new LinkedList<>();
        int i = 0, j = 0;
        while (i < n && j < m) {
            if (l1.get(i) <= l2.get(j)) {
                merged.add(l1.get(i++));
            } else {
                merged.add(l2.get(j++));
            }
        }
        while (i < n) merged.add(l1.get(i++));
        while (j < m) merged.add(l2.get(j++));

        StringBuilder sb = new StringBuilder();
        for (int k = 0; k < merged.size(); k++) {
            if (k > 0) sb.append(" ");
            sb.append(merged.get(k));
        }
        System.out.println(sb.toString());
    }
}`,
    public_tests: [
      { input: "3\n1 3 5\n3\n2 4 6", expected_output: "1 2 3 4 5 6" },
      { input: "2\n1 2\n2\n3 4", expected_output: "1 2 3 4" }
    ],
    hidden_tests: [
      { input: "1\n5\n1\n3", expected_output: "3 5" },
      { input: "3\n10 20 30\n1\n15", expected_output: "10 15 20 30" },
      { input: "4\n1 1 2 3\n2\n2 4", expected_output: "1 1 2 2 3 4" },
      { input: "2\n-5 0\n2\n-10 10", expected_output: "-10 -5 0 10" },
      { input: "3\n2 2 2\n2\n2 2", expected_output: "2 2 2 2 2" }
    ]
  },

  // ==========================================
  // Section C: HashSet (6 problems)
  // ==========================================
  {
    topicOrder: 23,
    title: "Count Unique Elements with HashSet",
    slug: "count-unique-elements-with-hashset",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "BEGINNER",
    description: "Given N integers, insert each into a `HashSet<Integer>` and print the number of unique elements.",
    input_format: "Integer N followed by N integers.",
    output_format: "Single integer representing unique count.",
    constraints: "1 <= N <= 10^5",
    sample_input: "6\n1 2 2 3 3 3",
    sample_output: "3",
    explanation: "Unique elements are 1, 2, 3 -> count is 3.",
    hints: ["HashSet eliminates duplicates automatically. Print `set.size()`."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Count unique elements using HashSet
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        HashSet<Integer> set = new HashSet<>();
        for (int i = 0; i < n; i++) {
            set.add(sc.nextInt());
        }
        System.out.println(set.size());
    }
}`,
    public_tests: [
      { input: "6\n1 2 2 3 3 3", expected_output: "3" },
      { input: "4\n5 5 5 5", expected_output: "1" }
    ],
    hidden_tests: [
      { input: "5\n10 20 30 40 50", expected_output: "5" },
      { input: "1\n42", expected_output: "1" },
      { input: "7\n1 2 1 2 1 2 3", expected_output: "3" },
      { input: "4\n-1 -2 -1 0", expected_output: "3" },
      { input: "6\n0 0 0 1 1 2", expected_output: "3" }
    ]
  },
  {
    topicOrder: 23,
    title: "Intersection of Two Arrays",
    slug: "intersection-of-two-arrays",
    difficulty: "EASY",
    placement_importance: "VERY_IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given two integer arrays of size N and M, find their common elements (intersection). Output each unique common element in ascending sorted order separated by space, or `EMPTY` if no common elements.",
    input_format: "Integer N followed by N integers, then integer M followed by M integers.",
    output_format: "Sorted common elements separated by space or `EMPTY`.",
    constraints: "1 <= N, M <= 10^4",
    sample_input: "4\n1 2 2 1\n2\n2 2",
    sample_output: "2",
    explanation: "2 is the only common element.",
    hints: ["Add first array to HashSet, iterate second array checking `set.contains()`."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Find intersection of two arrays
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        HashSet<Integer> setA = new HashSet<>();
        for (int i = 0; i < n; i++) setA.add(sc.nextInt());
        int m = sc.nextInt();
        HashSet<Integer> common = new HashSet<>();
        for (int i = 0; i < m; i++) {
            int val = sc.nextInt();
            if (setA.contains(val)) {
                common.add(val);
            }
        }
        if (common.isEmpty()) {
            System.out.println("EMPTY");
        } else {
            ArrayList<Integer> res = new ArrayList<>(common);
            Collections.sort(res);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < res.size(); i++) {
                if (i > 0) sb.append(" ");
                sb.append(res.get(i));
            }
            System.out.println(sb.toString());
        }
    }
}`,
    public_tests: [
      { input: "4\n1 2 2 1\n2\n2 2", expected_output: "2" },
      { input: "3\n4 9 5\n5\n9 4 9 8 4", expected_output: "4 9" }
    ],
    hidden_tests: [
      { input: "3\n1 2 3\n3\n4 5 6", expected_output: "EMPTY" },
      { input: "2\n10 20\n2\n20 10", expected_output: "10 20" },
      { input: "1\n7\n1\n7", expected_output: "7" },
      { input: "4\n-1 -2 -3 -4\n3\n-2 -4 0", expected_output: "-4 -2" },
      { input: "3\n5 10 15\n1\n10", expected_output: "10" }
    ]
  },
  {
    topicOrder: 23,
    title: "Set Union and Set Difference",
    slug: "set-union-and-set-difference",
    difficulty: "EASY",
    placement_importance: "NORMAL",
    level: "BEGINNER",
    description: "Given two sets of integers A and B of sizes N and M: calculate the size of their Union (all distinct elements across both) and the size of their Difference A \\ B (elements in A but not in B). Print Union size on line 1, Difference size on line 2.",
    input_format: "Integer N followed by N integers, then M followed by M integers.",
    output_format: "Line 1: Union size. Line 2: Difference size.",
    constraints: "1 <= N, M <= 10^4",
    sample_input: "4\n1 2 3 4\n3\n3 4 5",
    sample_output: "5\n2",
    explanation: "Union is {1,2,3,4,5} (size 5). Difference A \\ B is {1,2} (size 2).",
    hints: ["Use `addAll()` for union and `removeAll()` for difference."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Union and difference sizes
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        HashSet<Integer> a = new HashSet<>();
        for (int i = 0; i < n; i++) a.add(sc.nextInt());
        int m = sc.nextInt();
        HashSet<Integer> b = new HashSet<>();
        for (int i = 0; i < m; i++) b.add(sc.nextInt());

        HashSet<Integer> union = new HashSet<>(a);
        union.addAll(b);

        HashSet<Integer> diff = new HashSet<>(a);
        diff.removeAll(b);

        System.out.println(union.size());
        System.out.println(diff.size());
    }
}`,
    public_tests: [
      { input: "4\n1 2 3 4\n3\n3 4 5", expected_output: "5\n2" },
      { input: "2\n1 2\n2\n1 2", expected_output: "2\n0" }
    ],
    hidden_tests: [
      { input: "3\n10 20 30\n3\n40 50 60", expected_output: "6\n3" },
      { input: "1\n5\n1\n10", expected_output: "2\n1" },
      { input: "4\n1 1 1 1\n2\n1 2", expected_output: "2\n0" },
      { input: "3\n-1 0 1\n2\n0 2", expected_output: "4\n2" },
      { input: "2\n5 10\n4\n1 2 5 10", expected_output: "4\n0" }
    ]
  },
  {
    topicOrder: 23,
    title: "First Repeating Element in Array",
    slug: "first-repeating-element-in-array",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given an array of N integers, find the first element that appears more than once (the first element whose duplicate has been encountered). Print the repeating element. If no element repeats, print `-1`.",
    input_format: "Integer N followed by N integers.",
    output_format: "The first repeating element or `-1`.",
    constraints: "1 <= N <= 10^5",
    sample_input: "7\n10 5 3 4 3 5 6",
    sample_output: "3",
    explanation: "As we iterate: 10, 5, 3, 4 are new. 3 is the first element whose value is already in the set.",
    hints: ["Iterate through the array; if `!seen.add(x)`, then x is the first repeated element."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Find first repeating element
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        HashSet<Integer> seen = new HashSet<>();
        int ans = -1;
        for (int i = 0; i < n; i++) {
            int val = sc.nextInt();
            if (ans == -1 && !seen.add(val)) {
                ans = val;
            }
        }
        System.out.println(ans);
    }
}`,
    public_tests: [
      { input: "7\n10 5 3 4 3 5 6", expected_output: "3" },
      { input: "4\n1 2 3 4", expected_output: "-1" }
    ],
    hidden_tests: [
      { input: "5\n2 1 3 5 3", expected_output: "3" },
      { input: "2\n10 10", expected_output: "10" },
      { input: "1\n5", expected_output: "-1" },
      { input: "6\n-1 -2 -3 -2 -1 0", expected_output: "-2" },
      { input: "5\n9 8 7 6 9", expected_output: "9" }
    ]
  },
  {
    topicOrder: 23,
    title: "Check if Array B is Subset of Array A",
    slug: "check-if-array-b-is-subset-of-array-a",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "BEGINNER",
    description: "Given two arrays A (size N) and B (size M), check if array B is a subset of array A (every element in B is present in A). Print `YES` or `NO`.",
    input_format: "Integer N followed by N integers, then integer M followed by M integers.",
    output_format: "`YES` or `NO`.",
    constraints: "1 <= N, M <= 10^5",
    sample_input: "5\n11 1 13 21 3 7\n4\n11 3 7 1",
    sample_output: "YES",
    explanation: "All elements of B {11, 3, 7, 1} exist in A.",
    hints: ["Add all elements of A into HashSet. Then check if every element of B is in the set."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Check subset
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        HashSet<Integer> setA = new HashSet<>();
        for (int i = 0; i < n; i++) setA.add(sc.nextInt());
        int m = sc.nextInt();
        boolean isSubset = true;
        for (int i = 0; i < m; i++) {
            int val = sc.nextInt();
            if (!setA.contains(val)) {
                isSubset = false;
            }
        }
        System.out.println(isSubset ? "YES" : "NO");
    }
}`,
    public_tests: [
      { input: "6\n11 1 13 21 3 7\n4\n11 3 7 1", expected_output: "YES" },
      { input: "3\n1 2 3\n2\n2 4", expected_output: "NO" }
    ],
    hidden_tests: [
      { input: "4\n10 20 30 40\n1\n20", expected_output: "YES" },
      { input: "2\n5 6\n3\n5 6 7", expected_output: "NO" },
      { input: "1\n100\n1\n100", expected_output: "YES" },
      { input: "3\n-5 0 5\n2\n0 -5", expected_output: "YES" },
      { input: "4\n2 4 6 8\n2\n6 9", expected_output: "NO" }
    ]
  },
  {
    topicOrder: 23,
    title: "Pair with Target Sum using HashSet",
    slug: "pair-with-target-sum-using-hashset",
    difficulty: "EASY",
    placement_importance: "VERY_IMPORTANT",
    level: "BEGINNER",
    description: "Given an array of N integers and a target sum K, determine whether there exist two distinct indices i != j such that `arr[i] + arr[j] == K`. Print `YES` if such a pair exists, otherwise `NO`.",
    input_format: "Integer N followed by N integers, then integer K.",
    output_format: "`YES` or `NO`.",
    constraints: "2 <= N <= 10^5",
    sample_input: "5\n0 -1 2 -3 1\n-2",
    sample_output: "YES",
    explanation: "Pair 1 and -3 sums to -2.",
    hints: ["As you scan x, check if set contains `K - x`. If yes, answer is YES; else add x to set."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Find pair with sum K
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int k = sc.nextInt();
        HashSet<Integer> seen = new HashSet<>();
        boolean found = false;
        for (int x : arr) {
            if (seen.contains(k - x)) {
                found = true;
                break;
            }
            seen.add(x);
        }
        System.out.println(found ? "YES" : "NO");
    }
}`,
    public_tests: [
      { input: "5\n0 -1 2 -3 1\n-2", expected_output: "YES" },
      { input: "4\n1 2 3 9\n8", expected_output: "NO" }
    ],
    hidden_tests: [
      { input: "2\n5 5\n10", expected_output: "YES" },
      { input: "3\n1 4 45\n16", expected_output: "NO" },
      { input: "5\n10 20 35 50 75\n70", expected_output: "YES" },
      { input: "4\n-10 20 -30 40\n10", expected_output: "YES" },
      { input: "3\n2 4 6\n5", expected_output: "NO" }
    ]
  },

  // ==========================================
  // Section D: HashMap (6 problems)
  // ==========================================
  {
    topicOrder: 23,
    title: "Word Frequency Counter with HashMap",
    slug: "word-frequency-counter-with-hashmap",
    difficulty: "EASY",
    placement_importance: "VERY_IMPORTANT",
    level: "BEGINNER",
    description: "Given N words, count the occurrence frequency of each unique word using a `HashMap<String, Integer>`. Print the unique words in alphabetical order with their count in the format `word: count`.",
    input_format: "Integer N followed by N words.",
    output_format: "Sorted words and frequencies, one per line.",
    constraints: "1 <= N <= 1000",
    sample_input: "6\napple banana apple orange banana apple",
    sample_output: "apple: 3\nbanana: 2\norange: 1",
    explanation: "apple appears 3 times, banana 2 times, orange 1 time.",
    hints: ["Use TreeMap or sort HashMap keys."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Count frequencies and print sorted
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        TreeMap<String, Integer> map = new TreeMap<>();
        for (int i = 0; i < n; i++) {
            String word = sc.next();
            map.put(word, map.getOrDefault(word, 0) + 1);
        }
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}`,
    public_tests: [
      { input: "6\napple banana apple orange banana apple", expected_output: "apple: 3\nbanana: 2\norange: 1" },
      { input: "3\ncat dog bird", expected_output: "bird: 1\ncat: 1\ndog: 1" }
    ],
    hidden_tests: [
      { input: "4\njava java java java", expected_output: "java: 4" },
      { input: "1\nsolo", expected_output: "solo: 1" },
      { input: "5\nz a b a z", expected_output: "a: 2\nb: 1\nz: 2" },
      { input: "6\nred green blue red green red", expected_output: "blue: 1\ngreen: 2\nred: 3" },
      { input: "2\nhello world", expected_output: "hello: 1\nworld: 1" }
    ]
  },
  {
    topicOrder: 23,
    title: "First Non-Repeating Character",
    slug: "first-non-repeating-character",
    difficulty: "EASY",
    placement_importance: "VERY_IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given a string S, find the first character that does not repeat anywhere in the string using a HashMap. If all characters repeat, print `-1`.",
    input_format: "A single string S.",
    output_format: "The character or `-1`.",
    constraints: "1 <= length(S) <= 10^5",
    sample_input: "swiss",
    sample_output: "w",
    explanation: "s appears 3 times, w appears 1 time, i appears 1 time. First non-repeating character is 'w'.",
    hints: ["First build frequency map, then loop string from left to right checking for frequency == 1."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // First non-repeating character
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String s = sc.next();
        HashMap<Character, Integer> freq = new HashMap<>();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            freq.put(c, freq.getOrDefault(c, 0) + 1);
        }
        char ans = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (freq.get(c) == 1) {
                ans = c;
                break;
            }
        }
        if (ans != 0) {
            System.out.println(ans);
        } else {
            System.out.println("-1");
        }
    }
}`,
    public_tests: [
      { input: "swiss", expected_output: "w" },
      { input: "aabbcc", expected_output: "-1" }
    ],
    hidden_tests: [
      { input: "leetcode", expected_output: "l" },
      { input: "loveleetcode", expected_output: "v" },
      { input: "z", expected_output: "z" },
      { input: "abacabad", expected_output: "c" },
      { input: "programming", expected_output: "p" }
    ]
  },
  {
    topicOrder: 23,
    title: "Two Sum Indices with HashMap",
    slug: "two-sum-indices-with-hashmap",
    difficulty: "EASY",
    placement_importance: "VERY_IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given an array of N integers and an integer target, return the 0-based indices of the two numbers such that they add up to target. Return the smaller index first, separated by space. If no pair exists, print `-1 -1`. You may assume at most one valid answer exists.",
    input_format: "Integer N, followed by N integers, followed by target.",
    output_format: "Two indices separated by space, or `-1 -1`.",
    constraints: "2 <= N <= 10^5",
    sample_input: "4\n2 7 11 15\n9",
    sample_output: "0 1",
    explanation: "nums[0] + nums[1] = 2 + 7 = 9.",
    hints: ["Map each number to its index. Check if `target - num` already exists in map."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Two Sum Indices
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int target = sc.nextInt();

        HashMap<Integer, Integer> map = new HashMap<>();
        int idx1 = -1, idx2 = -1;
        for (int i = 0; i < n; i++) {
            int comp = target - arr[i];
            if (map.containsKey(comp)) {
                idx1 = map.get(comp);
                idx2 = i;
                break;
            }
            map.put(arr[i], i);
        }
        if (idx1 != -1) {
            System.out.println(idx1 + " " + idx2);
        } else {
            System.out.println("-1 -1");
        }
    }
}`,
    public_tests: [
      { input: "4\n2 7 11 15\n9", expected_output: "0 1" },
      { input: "3\n3 2 4\n6", expected_output: "1 2" }
    ],
    hidden_tests: [
      { input: "2\n3 3\n6", expected_output: "0 1" },
      { input: "3\n1 2 3\n10", expected_output: "-1 -1" },
      { input: "5\n-1 -2 -3 -4 -5\n-8", expected_output: "2 4" },
      { input: "4\n10 20 30 40\n50", expected_output: "0 3" },
      { input: "3\n5 15 25\n30", expected_output: "0 2" }
    ]
  },
  {
    topicOrder: 23,
    title: "Group Anagrams Count",
    slug: "group-anagrams-count",
    difficulty: "MEDIUM",
    placement_importance: "VERY_IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given N lowercase words, group them into anagram groups using a `HashMap`. Count how many words are in each group, and print these group sizes in ascending order separated by space.",
    input_format: "Integer N followed by N words.",
    output_format: "Group sizes in ascending order separated by space.",
    constraints: "1 <= N <= 1000",
    sample_input: "6\neat tea tan ate nat bat",
    sample_output: "1 2 3",
    explanation: "Groups are ['bat'] (size 1), ['tan', 'nat'] (size 2), ['eat', 'tea', 'ate'] (size 3). Sizes sorted: 1 2 3.",
    hints: ["Sort the characters of each string to use as the HashMap key."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Group anagrams and print sorted group sizes
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        HashMap<String, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String s = sc.next();
            char[] ch = s.toCharArray();
            Arrays.sort(ch);
            String key = new String(ch);
            map.put(key, map.getOrDefault(key, 0) + 1);
        }
        ArrayList<Integer> counts = new ArrayList<>(map.values());
        Collections.sort(counts);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < counts.size(); i++) {
            if (i > 0) sb.append(" ");
            sb.append(counts.get(i));
        }
        System.out.println(sb.toString());
    }
}`,
    public_tests: [
      { input: "6\neat tea tan ate nat bat", expected_output: "1 2 3" },
      { input: "1\na", expected_output: "1" }
    ],
    hidden_tests: [
      { input: "4\nab ba cd dc", expected_output: "2 2" },
      { input: "3\na b c", expected_output: "1 1 1" },
      { input: "4\naaa aaa aaa aaa", expected_output: "4" },
      { input: "5\nrat tar art car cat", expected_output: "1 1 3" },
      { input: "2\nlisten silent", expected_output: "2" }
    ]
  },
  {
    topicOrder: 23,
    title: "Majority Element with HashMap",
    slug: "majority-element-with-hashmap",
    difficulty: "EASY",
    placement_importance: "VERY_IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given an array of size N, find the majority element. The majority element is the element that appears strictly more than `N / 2` times. If no such element exists, print `No Majority`.",
    input_format: "Integer N followed by N integers.",
    output_format: "The majority element or `No Majority`.",
    constraints: "1 <= N <= 10^5",
    sample_input: "7\n3 3 4 2 4 4 2 4 4",
    sample_output: "4",
    explanation: "4 appears 5 times out of 9, which is > 9 / 2.",
    hints: ["Count element frequencies with HashMap, check if `entry.getValue() > N / 2`."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Majority element
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int val = sc.nextInt();
            map.put(val, map.getOrDefault(val, 0) + 1);
        }
        int majority = Integer.MIN_VALUE;
        for (Map.Entry<Integer, Integer> entry : map.entrySet()) {
            if (entry.getValue() > n / 2) {
                majority = entry.getKey();
                break;
            }
        }
        if (majority != Integer.MIN_VALUE) {
            System.out.println(majority);
        } else {
            System.out.println("No Majority");
        }
    }
}`,
    public_tests: [
      { input: "9\n3 3 4 2 4 4 2 4 4", expected_output: "4" },
      { input: "4\n1 2 3 4", expected_output: "No Majority" }
    ],
    hidden_tests: [
      { input: "1\n99", expected_output: "99" },
      { input: "3\n2 2 1", expected_output: "2" },
      { input: "6\n1 1 2 2 3 3", expected_output: "No Majority" },
      { input: "5\n-1 -1 -1 2 3", expected_output: "-1" },
      { input: "4\n7 7 7 8", expected_output: "7" }
    ]
  },
  {
    topicOrder: 23,
    title: "Sort Map Entries by Value then Key",
    slug: "sort-map-entries-by-value-then-key",
    difficulty: "MEDIUM",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given N key-value pairs (string key, integer value), aggregate by key (summing values for duplicate keys). Then print all pairs sorted by value in descending order. If values are equal, sort alphabetically by key. Format: `key: value` on each line.",
    input_format: "Integer N followed by N pairs of (String, Integer).",
    output_format: "Sorted pairs, one per line.",
    constraints: "1 <= N <= 1000",
    sample_input: "4\nAlice 50\nBob 75\nAlice 25\nCharlie 75",
    sample_output: "Alice: 75\nBob: 75\nCharlie: 75",
    explanation: "Alice total = 75, Bob = 75, Charlie = 75. All values equal, sorted alphabetically by name.",
    hints: ["Aggregate into HashMap, convert entrySet to List, and sort with custom Comparator."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Sort map entries by value then key
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        HashMap<String, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String k = sc.next();
            int v = sc.nextInt();
            map.put(k, map.getOrDefault(k, 0) + v);
        }
        List<Map.Entry<String, Integer>> list = new ArrayList<>(map.entrySet());
        list.sort((e1, e2) -> {
            int cmp = Integer.compare(e2.getValue(), e1.getValue());
            if (cmp != 0) return cmp;
            return e1.getKey().compareTo(e2.getKey());
        });
        for (Map.Entry<String, Integer> e : list) {
            System.out.println(e.getKey() + ": " + e.getValue());
        }
    }
}`,
    public_tests: [
      { input: "4\nAlice 50\nBob 75\nAlice 25\nCharlie 75", expected_output: "Alice: 75\nBob: 75\nCharlie: 75" },
      { input: "3\nA 10\nB 20\nC 15", expected_output: "B: 20\nC: 15\nA: 10" }
    ],
    hidden_tests: [
      { input: "1\nX 100", expected_output: "X: 100" },
      { input: "4\nBanana 5\nApple 5\nOrange 10\nMango 10", expected_output: "Mango: 10\nOrange: 10\nApple: 5\nBanana: 5" },
      { input: "3\nK 5\nK 5\nK 5", expected_output: "K: 15" },
      { input: "2\nZ 1\nA 2", expected_output: "A: 2\nZ: 1" },
      { input: "5\nP 10\nQ 20\nR 30\nS 40\nT 50", expected_output: "T: 50\nS: 40\nR: 30\nQ: 20\nP: 10" }
    ]
  },

  // ==========================================
  // Section E: Queue (6 problems)
  // ==========================================
  {
    topicOrder: 23,
    title: "Queue Basic Simulation",
    slug: "queue-basic-simulation",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "BEGINNER",
    description: "Implement a queue simulation using `ArrayDeque<Integer>` or `LinkedList<Integer>` for Q queries:\n- `ENQUEUE X`: add integer X to back\n- `DEQUEUE`: remove from front and print its value (or `EMPTY` if queue is empty)\n- `PEEK`: print front value without removing (or `EMPTY` if queue is empty)",
    input_format: "Integer Q followed by Q operations.",
    output_format: "The output of each DEQUEUE and PEEK operation, one per line.",
    constraints: "1 <= Q <= 100",
    sample_input: "6\nENQUEUE 10\nENQUEUE 20\nPEEK\nDEQUEUE\nDEQUEUE\nDEQUEUE",
    sample_output: "10\n10\n20\nEMPTY",
    explanation: "10 and 20 are enqueued. Peek shows 10. First dequeue gives 10, second gives 20, third gives EMPTY.",
    hints: ["Use `Queue<Integer> q = new ArrayDeque<>()` with offer, poll, and peek."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Implement Queue operations
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int q = sc.nextInt();
        Queue<Integer> queue = new ArrayDeque<>();
        for (int k = 0; k < q; k++) {
            String op = sc.next();
            if ("ENQUEUE".equals(op)) {
                queue.offer(sc.nextInt());
            } else if ("DEQUEUE".equals(op)) {
                Integer val = queue.poll();
                System.out.println(val == null ? "EMPTY" : val);
            } else if ("PEEK".equals(op)) {
                Integer val = queue.peek();
                System.out.println(val == null ? "EMPTY" : val);
            }
        }
    }
}`,
    public_tests: [
      { input: "6\nENQUEUE 10\nENQUEUE 20\nPEEK\nDEQUEUE\nDEQUEUE\nDEQUEUE", expected_output: "10\n10\n20\nEMPTY" },
      { input: "2\nPEEK\nDEQUEUE", expected_output: "EMPTY\nEMPTY" }
    ],
    hidden_tests: [
      { input: "4\nENQUEUE 1\nENQUEUE 2\nDEQUEUE\nPEEK", expected_output: "1\n2" },
      { input: "5\nENQUEUE 100\nPEEK\nENQUEUE 200\nDEQUEUE\nDEQUEUE", expected_output: "100\n100\n200" },
      { input: "3\nENQUEUE 5\nDEQUEUE\nDEQUEUE", expected_output: "5\nEMPTY" },
      { input: "4\nENQUEUE 7\nPEEK\nPEEK\nDEQUEUE", expected_output: "7\n7\n7" },
      { input: "2\nENQUEUE 42\nDEQUEUE", expected_output: "42" }
    ]
  },
  {
    topicOrder: 23,
    title: "Generate Binary Numbers from 1 to N using Queue",
    slug: "generate-binary-numbers-from-1-to-n-using-queue",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given an integer N, generate binary representations of all numbers from 1 to N using a Queue. Print the binary strings separated by space.",
    input_format: "A single integer N.",
    output_format: "Binary strings from 1 to N separated by space.",
    constraints: "1 <= N <= 1000",
    sample_input: "5",
    sample_output: "1 10 11 100 101",
    explanation: "Binary of 1 is 1, 2 is 10, 3 is 11, 4 is 100, 5 is 101.",
    hints: [
      "Initialize queue with \"1\". For each i from 1 to N: dequeue string s, print it, and enqueue s + \"0\" and s + \"1\"."
    ],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Generate binary numbers using Queue
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        Queue<String> q = new ArrayDeque<>();
        q.offer("1");
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            String curr = q.poll();
            if (i > 0) sb.append(" ");
            sb.append(curr);
            q.offer(curr + "0");
            q.offer(curr + "1");
        }
        System.out.println(sb.toString());
    }
}`,
    public_tests: [
      { input: "5", expected_output: "1 10 11 100 101" },
      { input: "2", expected_output: "1 10" }
    ],
    hidden_tests: [
      { input: "1", expected_output: "1" },
      { input: "6", expected_output: "1 10 11 100 101 110" },
      { input: "8", expected_output: "1 10 11 100 101 110 111 1000" },
      { input: "3", expected_output: "1 10 11" },
      { input: "10", expected_output: "1 10 11 100 101 110 111 1000 1001 1010" }
    ]
  },
  {
    topicOrder: 23,
    title: "Reverse First K Elements of Queue",
    slug: "reverse-first-k-elements-of-queue",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given a Queue of N integers and an integer K (where K <= N), reverse the first K elements of the queue, leaving the remaining elements in the same relative order. Print the resulting queue elements separated by space.",
    input_format: "Integer N, followed by N integers, followed by integer K.",
    output_format: "Queue elements separated by space.",
    constraints: "1 <= K <= N <= 10^4",
    sample_input: "5\n1 2 3 4 5\n3",
    sample_output: "3 2 1 4 5",
    explanation: "First 3 elements (1, 2, 3) are reversed to (3, 2, 1); 4 and 5 remain in order.",
    hints: ["Use a helper Stack: push first K elements into Stack, then enqueue them back, then move (N - K) elements from front to rear."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Reverse first K elements of Queue
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) q.offer(sc.nextInt());
        int k = sc.nextInt();

        Stack<Integer> st = new Stack<>();
        for (int i = 0; i < k; i++) {
            st.push(q.poll());
        }
        while (!st.isEmpty()) {
            q.offer(st.pop());
        }
        for (int i = 0; i < n - k; i++) {
            q.offer(q.poll());
        }

        StringBuilder sb = new StringBuilder();
        int idx = 0;
        for (int val : q) {
            if (idx++ > 0) sb.append(" ");
            sb.append(val);
        }
        System.out.println(sb.toString());
    }
}`,
    public_tests: [
      { input: "5\n1 2 3 4 5\n3", expected_output: "3 2 1 4 5" },
      { input: "4\n10 20 30 40\n4", expected_output: "40 30 20 10" }
    ],
    hidden_tests: [
      { input: "3\n1 2 3\n1", expected_output: "1 2 3" },
      { input: "5\n5 10 15 20 25\n2", expected_output: "10 5 15 20 25" },
      { input: "1\n99\n1", expected_output: "99" },
      { input: "6\n1 2 3 4 5 6\n5", expected_output: "5 4 3 2 1 6" },
      { input: "4\n2 4 6 8\n3", expected_output: "6 4 2 8" }
    ]
  },
  {
    topicOrder: 23,
    title: "First Negative Integer in Every Window of Size K",
    slug: "first-negative-integer-in-every-window-of-size-k",
    difficulty: "MEDIUM",
    placement_importance: "VERY_IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given an array of N integers and a window size K, find the first negative integer for each and every contiguous window of size K. If a window does not contain a negative integer, print `0` for that window. Print the results separated by space.",
    input_format: "Integer N, followed by N integers, followed by integer K.",
    output_format: "N - K + 1 integers separated by space.",
    constraints: "1 <= K <= N <= 10^5",
    sample_input: "5\n-8 2 3 -6 10\n2",
    sample_output: "-8 0 -6 -6",
    explanation: "Windows: [-8, 2] -> -8, [2, 3] -> 0, [3, -6] -> -6, [-6, 10] -> -6.",
    hints: ["Use a Queue to store indices of negative numbers within the current window."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // First negative in window of size K
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int k = sc.nextInt();

        Queue<Integer> q = new ArrayDeque<>();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < n; i++) {
            if (arr[i] < 0) q.offer(i);

            if (i >= k - 1) {
                while (!q.isEmpty() && q.peek() <= i - k) {
                    q.poll();
                }
                if (sb.length() > 0) sb.append(" ");
                if (!q.isEmpty()) {
                    sb.append(arr[q.peek()]);
                } else {
                    sb.append("0");
                }
            }
        }
        System.out.println(sb.toString());
    }
}`,
    public_tests: [
      { input: "5\n-8 2 3 -6 10\n2", expected_output: "-8 0 -6 -6" },
      { input: "4\n12 -1 -7 8\n3", expected_output: "-1 -1" }
    ],
    hidden_tests: [
      { input: "3\n1 2 3\n2", expected_output: "0 0" },
      { input: "4\n-1 -2 -3 -4\n2", expected_output: "-1 -2 -3" },
      { input: "5\n0 -5 10 -2 3\n3", expected_output: "-5 -5 -2" },
      { input: "2\n-5 5\n1", expected_output: "-5 0" },
      { input: "4\n1 2 3 -4\n2", expected_output: "0 0 -4" }
    ]
  },
  {
    topicOrder: 23,
    title: "Interleave the First Half of Queue with Second Half",
    slug: "interleave-first-half-of-queue-with-second-half",
    difficulty: "MEDIUM",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given a queue of even size 2*N, interleave the first half of the queue with the second half. For example, given [1, 2, 3, 4] where the first half is [1, 2] and second half is [3, 4], the interleaved queue is [1, 3, 2, 4]. Print the interleaved elements separated by space.",
    input_format: "An even integer 2*N followed by 2*N integers.",
    output_format: "Interleaved elements separated by space.",
    constraints: "2 <= 2*N <= 1000",
    sample_input: "4\n1 2 3 4",
    sample_output: "1 3 2 4",
    explanation: "First half: [1, 2], second half: [3, 4]. Interleaved: 1 3 2 4.",
    hints: ["Use a helper queue or list to hold the first half, then alternate offering."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Interleave halves of queue
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int size = sc.nextInt();
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < size; i++) q.offer(sc.nextInt());

        int half = size / 2;
        Queue<Integer> firstHalf = new ArrayDeque<>();
        for (int i = 0; i < half; i++) {
            firstHalf.offer(q.poll());
        }

        StringBuilder sb = new StringBuilder();
        int count = 0;
        while (!firstHalf.isEmpty()) {
            if (count++ > 0) sb.append(" ");
            sb.append(firstHalf.poll());
            sb.append(" ").append(q.poll());
        }
        System.out.println(sb.toString());
    }
}`,
    public_tests: [
      { input: "4\n1 2 3 4", expected_output: "1 3 2 4" },
      { input: "6\n11 12 13 14 15 16", expected_output: "11 14 12 15 13 16" }
    ],
    hidden_tests: [
      { input: "2\n10 20", expected_output: "10 20" },
      { input: "4\n5 10 15 20", expected_output: "5 15 10 20" },
      { input: "8\n1 2 3 4 5 6 7 8", expected_output: "1 5 2 6 3 7 4 8" },
      { input: "2\n-1 1", expected_output: "-1 1" },
      { input: "6\n2 4 6 8 10 12", expected_output: "2 8 4 10 6 12" }
    ]
  },
  {
    topicOrder: 23,
    title: "Sliding Window Maximum with Deque",
    slug: "sliding-window-maximum-with-deque",
    difficulty: "HARD",
    placement_importance: "VERY_IMPORTANT",
    level: "PLACEMENT",
    description: "Given an array of N integers and a sliding window size K, find the maximum value in each window as the window slides from left to right. Print the maximums separated by space.",
    input_format: "Integer N followed by N integers, followed by integer K.",
    output_format: "N - K + 1 maximums separated by space.",
    constraints: "1 <= K <= N <= 10^5",
    sample_input: "8\n1 3 -1 -3 5 3 6 7\n3",
    sample_output: "3 3 5 5 6 7",
    explanation: "Windows of size 3: [1, 3, -1] max 3; [3, -1, -3] max 3; [-1, -3, 5] max 5; [-3, 5, 3] max 5; [5, 3, 6] max 6; [3, 6, 7] max 7.",
    hints: ["Use a monotonic decreasing Deque storing indices of useful elements."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Sliding window maximum using Deque
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int k = sc.nextInt();

        Deque<Integer> dq = new ArrayDeque<>();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < n; i++) {
            while (!dq.isEmpty() && dq.peekFirst() <= i - k) {
                dq.pollFirst();
            }
            while (!dq.isEmpty() && arr[dq.peekLast()] <= arr[i]) {
                dq.pollLast();
            }
            dq.offerLast(i);

            if (i >= k - 1) {
                if (sb.length() > 0) sb.append(" ");
                sb.append(arr[dq.peekFirst()]);
            }
        }
        System.out.println(sb.toString());
    }
}`,
    public_tests: [
      { input: "8\n1 3 -1 -3 5 3 6 7\n3", expected_output: "3 3 5 5 6 7" },
      { input: "3\n1 -1 2\n1", expected_output: "1 -1 2" }
    ],
    hidden_tests: [
      { input: "4\n4 3 2 1\n2", expected_output: "4 3 2" },
      { input: "5\n1 2 3 4 5\n3", expected_output: "3 4 5" },
      { input: "1\n99\n1", expected_output: "99" },
      { input: "6\n7 2 4 1 5 3\n3", expected_output: "7 4 4 5" },
      { input: "4\n-1 -5 -2 -4\n2", expected_output: "-1 -2 -2" }
    ]
  },

  // ==========================================
  // Section F: Stack (6 problems)
  // ==========================================
  {
    topicOrder: 23,
    title: "Balanced Parentheses with Stack",
    slug: "balanced-parentheses-with-stack",
    difficulty: "EASY",
    placement_importance: "VERY_IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given a string containing only brackets `()`, `{}`, and `[]`, determine if the input string has balanced parentheses. Print `YES` if balanced, otherwise `NO`.",
    input_format: "A single string of brackets.",
    output_format: "`YES` or `NO`.",
    constraints: "1 <= length <= 10^5",
    sample_input: "{[()]}",
    sample_output: "YES",
    explanation: "Every open bracket is closed in the correct order by the corresponding closing bracket.",
    hints: ["Push opening brackets on stack. On closing bracket, check top of stack."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Check balanced parentheses
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String s = sc.next();
        Stack<Character> st = new Stack<>();
        boolean ok = true;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(' || c == '{' || c == '[') {
                st.push(c);
            } else {
                if (st.isEmpty()) {
                    ok = false;
                    break;
                }
                char top = st.pop();
                if ((c == ')' && top != '(') ||
                    (c == '}' && top != '{') ||
                    (c == ']' && top != '[')) {
                    ok = false;
                    break;
                }
            }
        }
        if (!st.isEmpty()) ok = false;
        System.out.println(ok ? "YES" : "NO");
    }
}`,
    public_tests: [
      { input: "{[()]}", expected_output: "YES" },
      { input: "{[(])}", expected_output: "NO" }
    ],
    hidden_tests: [
      { input: "()", expected_output: "YES" },
      { input: "(", expected_output: "NO" },
      { input: "]", expected_output: "NO" },
      { input: "()[]{}", expected_output: "YES" },
      { input: "({[()]})", expected_output: "YES" }
    ]
  },
  {
    topicOrder: 23,
    title: "Reverse Words in Sentence using Stack",
    slug: "reverse-words-in-sentence-using-stack",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "BEGINNER",
    description: "Given a sentence of whitespace-delimited words, push each word onto a `Stack<String>`, then pop words to print the sentence with reversed word order.",
    input_format: "A single line containing words separated by space.",
    output_format: "Reversed words separated by single space.",
    constraints: "1 <= words <= 1000",
    sample_input: "the sky is blue",
    sample_output: "blue is sky the",
    explanation: "Stack pops in LIFO order: blue, is, sky, the.",
    hints: ["Split line by whitespace, push all words, pop until empty."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Reverse words using Stack
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String line = sc.nextLine().trim();
        if (line.isEmpty()) return;
        String[] words = line.split("\\\\s+");
        Stack<String> st = new Stack<>();
        for (String w : words) st.push(w);
        StringBuilder sb = new StringBuilder();
        boolean first = true;
        while (!st.isEmpty()) {
            if (!first) sb.append(" ");
            sb.append(st.pop());
            first = false;
        }
        System.out.println(sb.toString());
    }
}`,
    public_tests: [
      { input: "the sky is blue", expected_output: "blue is sky the" },
      { input: "hello world", expected_output: "world hello" }
    ],
    hidden_tests: [
      { input: "placement portal java", expected_output: "java portal placement" },
      { input: "single", expected_output: "single" },
      { input: "one two three four five", expected_output: "five four three two one" },
      { input: "apple banana cherry", expected_output: "cherry banana apple" },
      { input: "code write run test", expected_output: "test run write code" }
    ]
  },
  {
    topicOrder: 23,
    title: "Next Greater Element using Monotonic Stack",
    slug: "next-greater-element-using-monotonic-stack",
    difficulty: "MEDIUM",
    placement_importance: "VERY_IMPORTANT",
    level: "PLACEMENT",
    description: "Given an array of N integers, find the Next Greater Element (NGE) for every element. The NGE of an element x is the first element greater than x to its right. If no greater element exists, the NGE is `-1`. Print the NGE for all elements separated by space.",
    input_format: "Integer N followed by N integers.",
    output_format: "NGE values separated by space.",
    constraints: "1 <= N <= 10^5",
    sample_input: "4\n4 5 2 25",
    sample_output: "5 25 25 -1",
    explanation: "Next greater for 4 is 5, for 5 is 25, for 2 is 25, for 25 is -1.",
    hints: ["Traverse array from right to left maintaining a monotonic decreasing stack."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Next greater element
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();

        int[] nge = new int[n];
        Stack<Integer> st = new Stack<>();

        for (int i = n - 1; i >= 0; i--) {
            while (!st.isEmpty() && st.peek() <= arr[i]) {
                st.pop();
            }
            nge[i] = st.isEmpty() ? -1 : st.peek();
            st.push(arr[i]);
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (i > 0) sb.append(" ");
            sb.append(nge[i]);
        }
        System.out.println(sb.toString());
    }
}`,
    public_tests: [
      { input: "4\n4 5 2 25", expected_output: "5 25 25 -1" },
      { input: "4\n13 7 6 12", expected_output: "-1 12 12 -1" }
    ],
    hidden_tests: [
      { input: "1\n5", expected_output: "-1" },
      { input: "3\n1 2 3", expected_output: "2 3 -1" },
      { input: "3\n3 2 1", expected_output: "-1 -1 -1" },
      { input: "5\n6 8 0 1 3", expected_output: "8 -1 1 3 -1" },
      { input: "4\n2 2 2 2", expected_output: "-1 -1 -1 -1" }
    ]
  },
  {
    topicOrder: 23,
    title: "Evaluate Postfix Expression with Stack",
    slug: "evaluate-postfix-expression-with-stack",
    difficulty: "MEDIUM",
    placement_importance: "VERY_IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given a postfix expression consisting of integer operands and operators `+`, `-`, `*`, `/` separated by spaces, evaluate the expression using a Stack and print the resulting integer.",
    input_format: "A single line containing tokens separated by space.",
    output_format: "The evaluated integer result.",
    constraints: "Valid postfix expression, division by zero will not occur.",
    sample_input: "2 3 1 * + 9 -",
    sample_output: "-4",
    explanation: "3 * 1 = 3 -> 2 + 3 = 5 -> 5 - 9 = -4.",
    hints: ["Push operands to stack. On operator, pop two operands (b = pop(), a = pop()), compute `a op b`, push result."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Evaluate postfix expression
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String line = sc.nextLine().trim();
        String[] tokens = line.split("\\\\s+");
        Stack<Integer> st = new Stack<>();

        for (String t : tokens) {
            if ("+".equals(t)) {
                int b = st.pop();
                int a = st.pop();
                st.push(a + b);
            } else if ("-".equals(t)) {
                int b = st.pop();
                int a = st.pop();
                st.push(a - b);
            } else if ("*".equals(t)) {
                int b = st.pop();
                int a = st.pop();
                st.push(a * b);
            } else if ("/".equals(t)) {
                int b = st.pop();
                int a = st.pop();
                st.push(a / b);
            } else {
                st.push(Integer.parseInt(t));
            }
        }
        System.out.println(st.pop());
    }
}`,
    public_tests: [
      { input: "2 3 1 * + 9 -", expected_output: "-4" },
      { input: "10 2 8 * + 3 -", expected_output: "23" }
    ],
    hidden_tests: [
      { input: "5", expected_output: "5" },
      { input: "4 2 /", expected_output: "2" },
      { input: "3 4 + 2 * 7 /", expected_output: "2" },
      { input: "15 7 1 1 + - / 3 * 2 1 1 + + -", expected_output: "5" },
      { input: "10 5 -", expected_output: "5" }
    ]
  },
  {
    topicOrder: 23,
    title: "Min Stack Design O(1) Time",
    slug: "min-stack-design-o1-time",
    difficulty: "MEDIUM",
    placement_importance: "VERY_IMPORTANT",
    level: "PLACEMENT",
    description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time O(1).\nCommands:\n- `PUSH X`: push integer X\n- `POP`: remove top element\n- `TOP`: print top element (or `EMPTY`)\n- `GETMIN`: print minimum element in stack (or `EMPTY`)",
    input_format: "Integer Q followed by Q operations.",
    output_format: "Output of each TOP and GETMIN operation.",
    constraints: "1 <= Q <= 100",
    sample_input: "6\nPUSH -2\nPUSH 0\nPUSH -3\nGETMIN\nPOP\nGETMIN",
    sample_output: "-3\n-2",
    explanation: "Min initially is -3. After popping -3, min becomes -2.",
    hints: ["Maintain an auxiliary stack for minimums or store pairs (val, currentMin)."],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Implement Min Stack
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int q = sc.nextInt();
        Stack<Integer> valSt = new Stack<>();
        Stack<Integer> minSt = new Stack<>();

        for (int k = 0; k < q; k++) {
            String op = sc.next();
            if ("PUSH".equals(op)) {
                int x = sc.nextInt();
                valSt.push(x);
                if (minSt.isEmpty() || x <= minSt.peek()) {
                    minSt.push(x);
                } else {
                    minSt.push(minSt.peek());
                }
            } else if ("POP".equals(op)) {
                if (!valSt.isEmpty()) {
                    valSt.pop();
                    minSt.pop();
                }
            } else if ("TOP".equals(op)) {
                System.out.println(valSt.isEmpty() ? "EMPTY" : valSt.peek());
            } else if ("GETMIN".equals(op)) {
                System.out.println(minSt.isEmpty() ? "EMPTY" : minSt.peek());
            }
        }
    }
}`,
    public_tests: [
      { input: "6\nPUSH -2\nPUSH 0\nPUSH -3\nGETMIN\nPOP\nGETMIN", expected_output: "-3\n-2" },
      { input: "4\nPUSH 5\nTOP\nGETMIN\nPOP", expected_output: "5\n5" }
    ],
    hidden_tests: [
      { input: "5\nPUSH 10\nPUSH 20\nGETMIN\nPOP\nGETMIN", expected_output: "10\n10" },
      { input: "2\nTOP\nGETMIN", expected_output: "EMPTY\nEMPTY" },
      { input: "6\nPUSH 3\nPUSH 3\nGETMIN\nPOP\nGETMIN\nTOP", expected_output: "3\n3\n3" },
      { input: "4\nPUSH -1\nPUSH -5\nGETMIN\nTOP", expected_output: "-5\n-5" },
      { input: "5\nPUSH 1\nPUSH 2\nPUSH 0\nGETMIN\nPOP", expected_output: "0" }
    ]
  },
  {
    topicOrder: 23,
    title: "Sort a Stack using Temporary Stack",
    slug: "sort-a-stack-using-temporary-stack",
    difficulty: "MEDIUM",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given a stack of N integers, sort the stack such that the smallest elements are at the top (ascending order when popped). You may use only one additional temporary stack. Print the elements from top to bottom separated by space.",
    input_format: "Integer N followed by N integers pushed onto initial stack.",
    output_format: "Sorted elements popped from top to bottom separated by space.",
    constraints: "1 <= N <= 1000",
    sample_input: "5\n34 3 31 98 92",
    sample_output: "3 31 34 92 98",
    explanation: "Smallest element 3 is popped first, then 31, 34, 92, 98.",
    hints: [
      "While input stack is not empty: pop x. While temp stack not empty and temp.peek() > x: pop from temp and push to input. Push x to temp."
    ],
    starter_code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Sort stack using temporary stack
    }
}`,
    reference_solution: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        Stack<Integer> input = new Stack<>();
        for (int i = 0; i < n; i++) input.push(sc.nextInt());

        Stack<Integer> tmp = new Stack<>();
        while (!input.isEmpty()) {
            int x = input.pop();
            while (!tmp.isEmpty() && tmp.peek() < x) {
                input.push(tmp.pop());
            }
            tmp.push(x);
        }

        StringBuilder sb = new StringBuilder();
        boolean first = true;
        while (!tmp.isEmpty()) {
            if (!first) sb.append(" ");
            sb.append(tmp.pop());
            first = false;
        }
        System.out.println(sb.toString());
    }
}`,
    public_tests: [
      { input: "5\n34 3 31 98 92", expected_output: "3 31 34 92 98" },
      { input: "3\n1 2 3", expected_output: "1 2 3" }
    ],
    hidden_tests: [
      { input: "4\n10 5 20 15", expected_output: "5 10 15 20" },
      { input: "1\n42", expected_output: "42" },
      { input: "5\n-1 -5 0 10 2", expected_output: "-5 -1 0 2 10" },
      { input: "4\n4 4 2 2", expected_output: "2 2 4 4" },
      { input: "3\n100 50 25", expected_output: "25 50 100" }
    ]
  }
];
