import { ProblemSeed } from './types';

export const topics21to22HandlingProblems: ProblemSeed[] = [
  // ==========================================
  // TOPIC 21: Exception Handling (5 problems)
  // ==========================================
  {
    topicOrder: 21,
    title: "Safe Division with Try-Catch",
    slug: "safe-division-try-catch",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "BEGINNER",
    description: "Write a program that takes two integers, numerator and denominator, and divides them. If division by zero occurs, catch the `ArithmeticException` and print `Error: Division by zero`. Otherwise, print the quotient.",
    input_format: "Two integers A and B separated by space or newline.",
    output_format: "Print the quotient or `Error: Division by zero`.",
    constraints: "-10^9 <= A, B <= 10^9",
    sample_input: "20 4",
    sample_output: "5",
    explanation: "20 divided by 4 is 5. If B was 0, it catches ArithmeticException and prints the error message.",
    hints: [
      "Use try { int res = a / b; System.out.println(res); } catch (ArithmeticException e) { System.out.println(\"Error: Division by zero\"); }"
    ],
    starter_code: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your try-catch block here
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int a = sc.nextInt();
        int b = sc.nextInt();
        try {
            int result = a / b;
            System.out.println(result);
        } catch (ArithmeticException e) {
            System.out.println("Error: Division by zero");
        }
    }
}`,
    public_tests: [
      { input: "20 4", expected_output: "5" },
      { input: "10 0", expected_output: "Error: Division by zero" }
    ],
    hidden_tests: [
      { input: "0 5", expected_output: "0" },
      { input: "-15 3", expected_output: "-5" },
      { input: "100 0", expected_output: "Error: Division by zero" },
      { input: "-50 -5", expected_output: "10" },
      { input: "7 2", expected_output: "3" }
    ]
  },
  {
    topicOrder: 21,
    title: "Multiple Catch Blocks",
    slug: "multiple-catch-blocks",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given an array of strings representing numbers and an index: parse the string at that index to an integer and compute `100 / parsedValue`. Handle `ArrayIndexOutOfBoundsException` by printing `Invalid Index`, `NumberFormatException` by printing `Invalid Number`, and `ArithmeticException` by printing `Cannot divide by zero`. If successful, print the result.",
    input_format: "An integer N, followed by N tokens for the array, and finally an integer index K.",
    output_format: "Print the result or the specific caught exception message.",
    constraints: "1 <= N <= 100",
    sample_input: "3 10 0 abc 1",
    sample_output: "Cannot divide by zero",
    explanation: "At index 1, the value is '0'. 100 / 0 throws ArithmeticException.",
    hints: [
      "Order catch blocks from most specific to general: ArrayIndexOutOfBoundsException, NumberFormatException, ArithmeticException."
    ],
    starter_code: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Implement multiple catch blocks
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        String[] arr = new String[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.next();
        }
        int index = sc.nextInt();

        try {
            if (index < 0 || index >= n) {
                throw new ArrayIndexOutOfBoundsException();
            }
            int val = Integer.parseInt(arr[index]);
            int res = 100 / val;
            System.out.println(res);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Invalid Index");
        } catch (NumberFormatException e) {
            System.out.println("Invalid Number");
        } catch (ArithmeticException e) {
            System.out.println("Cannot divide by zero");
        }
    }
}`,
    public_tests: [
      { input: "3 10 0 abc 1", expected_output: "Cannot divide by zero" },
      { input: "3 10 20 abc 0", expected_output: "10" }
    ],
    hidden_tests: [
      { input: "3 10 20 abc 2", expected_output: "Invalid Number" },
      { input: "3 10 20 abc 5", expected_output: "Invalid Index" },
      { input: "3 10 20 abc -1", expected_output: "Invalid Index" },
      { input: "4 2 4 5 10 3", expected_output: "10" },
      { input: "2 hello world 0", expected_output: "Invalid Number" }
    ]
  },
  {
    topicOrder: 21,
    title: "Finally Block Execution Flow",
    slug: "finally-block-execution-flow",
    difficulty: "EASY",
    placement_importance: "NORMAL",
    level: "BEGINNER",
    description: "Demonstrate the execution flow of `try`, `catch`, and `finally`. Read an integer. If the integer is positive, print `Processing`. If non-positive (<= 0), throw an `IllegalArgumentException` caught to print `Caught Exception`. Regardless of whether an exception occurs, print `Finally Executed`.",
    input_format: "A single integer.",
    output_format: "The flow logs line by line.",
    constraints: "-1000 <= N <= 1000",
    sample_input: "5",
    sample_output: "Processing\nFinally Executed",
    explanation: "For positive number, 'Processing' is printed, then 'Finally Executed'.",
    hints: ["Place 'Finally Executed' inside the finally block."],
    starter_code: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Implement try-catch-finally
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        try {
            if (n <= 0) {
                throw new IllegalArgumentException();
            }
            System.out.println("Processing");
        } catch (IllegalArgumentException e) {
            System.out.println("Caught Exception");
        } finally {
            System.out.println("Finally Executed");
        }
    }
}`,
    public_tests: [
      { input: "5", expected_output: "Processing\nFinally Executed" },
      { input: "-3", expected_output: "Caught Exception\nFinally Executed" }
    ],
    hidden_tests: [
      { input: "0", expected_output: "Caught Exception\nFinally Executed" },
      { input: "100", expected_output: "Processing\nFinally Executed" },
      { input: "-50", expected_output: "Caught Exception\nFinally Executed" },
      { input: "1", expected_output: "Processing\nFinally Executed" },
      { input: "-1", expected_output: "Caught Exception\nFinally Executed" }
    ]
  },
  {
    topicOrder: 21,
    title: "Custom Age Validation Exception",
    slug: "custom-age-validation-exception",
    difficulty: "MEDIUM",
    placement_importance: "VERY_IMPORTANT",
    level: "INTERMEDIATE",
    description: "Create a custom exception class `InvalidAgeException extends Exception`. Write a method `validateAge(int age)` that throws `InvalidAgeException` with message `Age must be at least 18` if age < 18. If age >= 18, print `Eligible to vote`. In `main`, call `validateAge` and handle the exception by printing its message.",
    input_format: "An integer representing age.",
    output_format: "Print `Eligible to vote` or the exception message.",
    constraints: "0 <= age <= 150",
    sample_input: "16",
    sample_output: "Age must be at least 18",
    explanation: "16 is under 18, so InvalidAgeException is thrown and its message printed.",
    hints: [
      "Define `class InvalidAgeException extends Exception { public InvalidAgeException(String msg) { super(msg); } }`"
    ],
    starter_code: `import java.util.Scanner;

// Define custom exception here

public class Solution {
    // Implement validateAge method
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
    }
}`,
    reference_solution: `import java.util.Scanner;

class InvalidAgeException extends Exception {
    public InvalidAgeException(String msg) {
        super(msg);
    }
}

public class Solution {
    public static void validateAge(int age) throws InvalidAgeException {
        if (age < 18) {
            throw new InvalidAgeException("Age must be at least 18");
        }
        System.out.println("Eligible to vote");
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int age = sc.nextInt();
        try {
            validateAge(age);
        } catch (InvalidAgeException e) {
            System.out.println(e.getMessage());
        }
    }
}`,
    public_tests: [
      { input: "16", expected_output: "Age must be at least 18" },
      { input: "21", expected_output: "Eligible to vote" }
    ],
    hidden_tests: [
      { input: "18", expected_output: "Eligible to vote" },
      { input: "0", expected_output: "Age must be at least 18" },
      { input: "17", expected_output: "Age must be at least 18" },
      { input: "65", expected_output: "Eligible to vote" },
      { input: "100", expected_output: "Eligible to vote" }
    ]
  },
  {
    topicOrder: 21,
    title: "Throws Keyword and Exception Propagation",
    slug: "throws-keyword-and-exception-propagation",
    difficulty: "MEDIUM",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Demonstrate exception propagation using `throws`. Method `compute(int n)` throws `ArithmeticException` if `n <= 0`. Method `wrapper(int n)` calls `compute(n)` and declares `throws ArithmeticException`. Method `main` calls `wrapper(n)` inside a try-catch block and catches `ArithmeticException`, printing `Handled in main: Non-positive input`. If `n > 0`, print `Result: ` followed by `n * 10`.",
    input_format: "An integer N.",
    output_format: "Result string or handler message.",
    constraints: "-1000 <= N <= 1000",
    sample_input: "-5",
    sample_output: "Handled in main: Non-positive input",
    explanation: "Negative input causes compute to throw ArithmeticException, propagated to main.",
    hints: ["Declare throws ArithmeticException on compute and wrapper."],
    starter_code: `import java.util.Scanner;

public class Solution {
    // implement compute and wrapper
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Solution {
    public static void compute(int n) throws ArithmeticException {
        if (n <= 0) {
            throw new ArithmeticException("Non-positive input");
        }
        System.out.println("Result: " + (n * 10));
    }

    public static void wrapper(int n) throws ArithmeticException {
        compute(n);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        try {
            wrapper(n);
        } catch (ArithmeticException e) {
            System.out.println("Handled in main: " + e.getMessage());
        }
    }
}`,
    public_tests: [
      { input: "-5", expected_output: "Handled in main: Non-positive input" },
      { input: "7", expected_output: "Result: 70" }
    ],
    hidden_tests: [
      { input: "0", expected_output: "Handled in main: Non-positive input" },
      { input: "1", expected_output: "Result: 10" },
      { input: "12", expected_output: "Result: 120" },
      { input: "-100", expected_output: "Handled in main: Non-positive input" },
      { input: "50", expected_output: "Result: 500" }
    ]
  },

  // ==========================================
  // TOPIC 22: File Handling (5 problems)
  // ==========================================
  {
    topicOrder: 22,
    title: "Write and Read Text File",
    slug: "write-and-read-text-file",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Given an integer N followed by N lines of text, write these lines to a file named `output.txt` using `FileWriter` or `PrintWriter`. Then, open `output.txt` with `Scanner` or `BufferedReader`, read the lines back, and print each line prefixed with its 1-based line number (e.g. `1: line_content`).",
    input_format: "Integer N on the first line, followed by N lines of text.",
    output_format: "Print each line read from the file with `line_number: content`.",
    constraints: "1 <= N <= 50",
    sample_input: "2\nHello World\nJava Programming",
    sample_output: "1: Hello World\n2: Java Programming",
    explanation: "The lines are written to output.txt and read back with line numbers.",
    hints: [
      "Use try-with-resources: `try (FileWriter fw = new FileWriter(\"output.txt\")) { ... }`",
      "Then read with `try (Scanner fileSc = new Scanner(new File(\"output.txt\"))) { ... }`"
    ],
    starter_code: `import java.io.*;
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write to output.txt and read back
    }
}`,
    reference_solution: `import java.io.*;
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = Integer.parseInt(sc.nextLine().trim());
        File file = new File("output.txt");

        try (PrintWriter pw = new PrintWriter(new FileWriter(file))) {
            for (int i = 0; i < n; i++) {
                pw.println(sc.nextLine());
            }
        } catch (IOException e) {
            System.out.println("Write error: " + e.getMessage());
            return;
        }

        try (Scanner fileSc = new Scanner(file)) {
            int lineNum = 1;
            while (fileSc.hasNextLine()) {
                System.out.println(lineNum + ": " + fileSc.nextLine());
                lineNum++;
            }
        } catch (IOException e) {
            System.out.println("Read error: " + e.getMessage());
        }
    }
}`,
    public_tests: [
      { input: "2\nHello World\nJava Programming", expected_output: "1: Hello World\n2: Java Programming" },
      { input: "1\nSingle Line Test", expected_output: "1: Single Line Test" }
    ],
    hidden_tests: [
      { input: "3\nApple\nBanana\nCherry", expected_output: "1: Apple\n2: Banana\n3: Cherry" },
      { input: "4\nLine 1\nLine 2\nLine 3\nLine 4", expected_output: "1: Line 1\n2: Line 2\n3: Line 3\n4: Line 4" },
      { input: "1\nFile Handling in Java", expected_output: "1: File Handling in Java" },
      { input: "2\nData Structures\nAlgorithms", expected_output: "1: Data Structures\n2: Algorithms" },
      { input: "3\nRed\nGreen\nBlue", expected_output: "1: Red\n2: Green\n3: Blue" }
    ]
  },
  {
    topicOrder: 22,
    title: "Count Words in File",
    slug: "count-words-in-file",
    difficulty: "EASY",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Write input text to a temporary file `document.txt`. Read the file and count the total number of words (whitespace-delimited tokens) contained in it. Print the word count.",
    input_format: "An integer N indicating number of lines, followed by N lines.",
    output_format: "Print `Total words: <count>`.",
    constraints: "1 <= N <= 50",
    sample_input: "2\nThe quick brown fox\njumps over the lazy dog",
    sample_output: "Total words: 9",
    explanation: "Line 1 has 4 words, line 2 has 5 words, total = 9 words.",
    hints: ["Split each line with `line.trim().split(\"\\\\s+\")` or use `Scanner` word tokens."],
    starter_code: `import java.io.*;
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write to document.txt and count words
    }
}`,
    reference_solution: `import java.io.*;
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = Integer.parseInt(sc.nextLine().trim());
        File file = new File("document.txt");

        try (PrintWriter pw = new PrintWriter(new FileWriter(file))) {
            for (int i = 0; i < n; i++) {
                pw.println(sc.nextLine());
            }
        } catch (IOException e) {
            return;
        }

        int count = 0;
        try (Scanner fileSc = new Scanner(file)) {
            while (fileSc.hasNext()) {
                fileSc.next();
                count++;
            }
        } catch (IOException e) {
            return;
        }
        System.out.println("Total words: " + count);
    }
}`,
    public_tests: [
      { input: "2\nThe quick brown fox\njumps over the lazy dog", expected_output: "Total words: 9" },
      { input: "1\nOne two three four five", expected_output: "Total words: 5" }
    ],
    hidden_tests: [
      { input: "3\nHello world\nWelcome to Java\nPlacement portal", expected_output: "Total words: 7" },
      { input: "1\nSingleWord", expected_output: "Total words: 1" },
      { input: "2\nLine with four words\nAnother three words", expected_output: "Total words: 7" },
      { input: "4\na b c\nd e f\ng h i\nj k l", expected_output: "Total words: 12" },
      { input: "1\n   Spaces   around   words   ", expected_output: "Total words: 3" }
    ]
  },
  {
    topicOrder: 22,
    title: "Append Content to Existing File",
    slug: "append-content-to-existing-file",
    difficulty: "MEDIUM",
    placement_importance: "NORMAL",
    level: "INTERMEDIATE",
    description: "Given initial text lines and additional append lines, first write the initial lines to `log.txt`. Then, reopen `log.txt` in append mode (`new FileWriter(\"log.txt\", true)`), append the second set of lines. Finally, read and print the full file content.",
    input_format: "Integer N1 followed by N1 lines, then integer N2 followed by N2 lines.",
    output_format: "The entire content of the file line by line.",
    constraints: "1 <= N1, N2 <= 20",
    sample_input: "2\nLOG: Server started\nLOG: User logged in\n1\nLOG: Server stopped",
    sample_output: "LOG: Server started\nLOG: User logged in\nLOG: Server stopped",
    explanation: "Two lines are written initially, one line appended. All 3 lines printed.",
    hints: ["Use `new FileWriter(\"log.txt\", true)` to enable appending."],
    starter_code: `import java.io.*;
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write initial, then append, then read back
    }
}`,
    reference_solution: `import java.io.*;
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n1 = Integer.parseInt(sc.nextLine().trim());
        File file = new File("log.txt");

        try (PrintWriter pw = new PrintWriter(new FileWriter(file, false))) {
            for (int i = 0; i < n1; i++) {
                pw.println(sc.nextLine());
            }
        } catch (IOException e) {
            return;
        }

        int n2 = Integer.parseInt(sc.nextLine().trim());
        try (PrintWriter pw = new PrintWriter(new FileWriter(file, true))) {
            for (int i = 0; i < n2; i++) {
                pw.println(sc.nextLine());
            }
        } catch (IOException e) {
            return;
        }

        try (Scanner fileSc = new Scanner(file)) {
            while (fileSc.hasNextLine()) {
                System.out.println(fileSc.nextLine());
            }
        } catch (IOException e) {
            return;
        }
    }
}`,
    public_tests: [
      { input: "2\nLOG: Server started\nLOG: User logged in\n1\nLOG: Server stopped", expected_output: "LOG: Server started\nLOG: User logged in\nLOG: Server stopped" },
      { input: "1\nAlpha\n1\nBeta", expected_output: "Alpha\nBeta" }
    ],
    hidden_tests: [
      { input: "1\nStart\n2\nStep 1\nStep 2", expected_output: "Start\nStep 1\nStep 2" },
      { input: "3\nA\nB\nC\n2\nD\nE", expected_output: "A\nB\nC\nD\nE" },
      { input: "2\nFirst\nSecond\n2\nThird\nFourth", expected_output: "First\nSecond\nThird\nFourth" },
      { input: "1\nHeader\n1\nFooter", expected_output: "Header\nFooter" },
      { input: "2\n100\n200\n1\n300", expected_output: "100\n200\n300" }
    ]
  },
  {
    topicOrder: 22,
    title: "Check File Existence and Attributes",
    slug: "check-file-existence-and-attributes",
    difficulty: "EASY",
    placement_importance: "NORMAL",
    level: "BEGINNER",
    description: "Read a string fileName and a string content. Create a `File` object for fileName. If content is `CREATE`, write a single line `Hello` into the file. Then inspect the file: print `Exists: ` followed by `true` or `false`. If it exists, print `Is File: ` followed by `true` or `false`.",
    input_format: "Two strings: fileName and action (`CREATE` or `SKIP`).",
    output_format: "Attributes printed line by line.",
    constraints: "fileName is valid name like `sample.txt` or `missing.txt`",
    sample_input: "test.txt CREATE",
    sample_output: "Exists: true\nIs File: true",
    explanation: "The file is created so exists returns true and isFile returns true.",
    hints: ["Use `file.exists()` and `file.isFile()`."],
    starter_code: `import java.io.*;
import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Check file existence
    }
}`,
    reference_solution: `import java.io.*;
import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String fileName = sc.next();
        String action = sc.next();
        File file = new File(fileName);

        if ("CREATE".equals(action)) {
            try (FileWriter fw = new FileWriter(file)) {
                fw.write("Hello");
            } catch (IOException ignored) {}
        } else {
            if (file.exists()) file.delete();
        }

        System.out.println("Exists: " + file.exists());
        if (file.exists()) {
            System.out.println("Is File: " + file.isFile());
        }
    }
}`,
    public_tests: [
      { input: "test.txt CREATE", expected_output: "Exists: true\nIs File: true" },
      { input: "nonexistent.txt SKIP", expected_output: "Exists: false" }
    ],
    hidden_tests: [
      { input: "sample.txt CREATE", expected_output: "Exists: true\nIs File: true" },
      { input: "data.log CREATE", expected_output: "Exists: true\nIs File: true" },
      { input: "missing123.bin SKIP", expected_output: "Exists: false" },
      { input: "dummy.txt CREATE", expected_output: "Exists: true\nIs File: true" },
      { input: "nofile.dat SKIP", expected_output: "Exists: false" }
    ]
  },
  {
    topicOrder: 22,
    title: "Copy File Content",
    slug: "copy-file-content",
    difficulty: "MEDIUM",
    placement_importance: "IMPORTANT",
    level: "INTERMEDIATE",
    description: "Write input text to `source.txt`. Then write a copy mechanism that reads from `source.txt` using `BufferedReader` and writes to `destination.txt` using `BufferedWriter`. Finally, read `destination.txt` and print its content.",
    input_format: "Integer N followed by N lines of text.",
    output_format: "The content read from destination.txt.",
    constraints: "1 <= N <= 50",
    sample_input: "2\nSource line 1\nSource line 2",
    sample_output: "Source line 1\nSource line 2",
    explanation: "Content is copied from source.txt to destination.txt and read back.",
    hints: ["Use BufferedReader and BufferedWriter inside try-with-resources."],
    starter_code: `import java.io.*;
import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Implement copy file
    }
}`,
    reference_solution: `import java.io.*;
import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = Integer.parseInt(sc.nextLine().trim());
        File src = new File("source.txt");
        File dest = new File("destination.txt");

        try (PrintWriter pw = new PrintWriter(new FileWriter(src))) {
            for (int i = 0; i < n; i++) {
                pw.println(sc.nextLine());
            }
        } catch (IOException e) {
            return;
        }

        try (BufferedReader br = new BufferedReader(new FileReader(src));
             BufferedWriter bw = new BufferedWriter(new FileWriter(dest))) {
            String line;
            boolean first = true;
            while ((line = br.readLine()) != null) {
                if (!first) bw.newLine();
                bw.write(line);
                first = false;
            }
        } catch (IOException e) {
            return;
        }

        try (Scanner fileSc = new Scanner(dest)) {
            while (fileSc.hasNextLine()) {
                System.out.println(fileSc.nextLine());
            }
        } catch (IOException e) {
            return;
        }
    }
}`,
    public_tests: [
      { input: "2\nSource line 1\nSource line 2", expected_output: "Source line 1\nSource line 2" },
      { input: "1\nSingle Line to Copy", expected_output: "Single Line to Copy" }
    ],
    hidden_tests: [
      { input: "3\nAlpha\nBeta\nGamma", expected_output: "Alpha\nBeta\nGamma" },
      { input: "4\n1\n2\n3\n4", expected_output: "1\n2\n3\n4" },
      { input: "1\nTesting file copy operation", expected_output: "Testing file copy operation" },
      { input: "2\nLine One\nLine Two", expected_output: "Line One\nLine Two" },
      { input: "3\nRed\nGreen\nBlue", expected_output: "Red\nGreen\nBlue" }
    ]
  }
];
