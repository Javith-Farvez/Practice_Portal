import { ProblemSeed } from './types';

export const TOPICS_6_TO_9_PROBLEMS: ProblemSeed[] = [
  // ==========================================
  // TOPIC 6 — IF / IF-ELSE / NESTED IF
  // ==========================================
  {
    topicOrder: 6,
    title: 'Check Positive, Negative, or Zero',
    slug: 'check-positive-negative-zero',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given an integer N, determine whether it is Positive, Negative, or Zero. Print "Positive", "Negative", or "Zero".',
    input_format: 'A single integer N.',
    output_format: 'Print "Positive", "Negative", or "Zero".',
    constraints: '-10^9 <= N <= 10^9',
    sample_input: '15',
    sample_output: 'Positive',
    explanation: '15 is strictly greater than 0, so it is Positive.',
    hints: ['Check if n > 0, else if n < 0, else Zero.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Check and print Positive, Negative, or Zero
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n > 0) System.out.println("Positive");
        else if (n < 0) System.out.println("Negative");
        else System.out.println("Zero");
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '15', expected_output: 'Positive' },
      { input: '-7', expected_output: 'Negative' },
      { input: '0', expected_output: 'Zero' }
    ],
    hidden_tests: [
      { input: '1000000', expected_output: 'Positive' },
      { input: '-999999', expected_output: 'Negative' },
      { input: '1', expected_output: 'Positive' },
      { input: '-1', expected_output: 'Negative' }
    ]
  },
  {
    topicOrder: 6,
    title: 'Find the Largest Among Three Numbers',
    slug: 'largest-among-three-numbers',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given three integers A, B, and C, find and print the largest value using if-else statements.',
    input_format: 'Three integers A, B, and C separated by space.',
    output_format: 'Print the maximum integer value.',
    constraints: '-10^9 <= A, B, C <= 10^9',
    sample_input: '12 45 32',
    sample_output: '45',
    explanation: '45 is greater than both 12 and 32.',
    hints: ['Compare a >= b && a >= c, else if b >= c, else c.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        // Print the largest
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        if (a >= b && a >= c) System.out.println(a);
        else if (b >= a && b >= c) System.out.println(b);
        else System.out.println(c);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '12 45 32', expected_output: '45' },
      { input: '-5 -10 -2', expected_output: '-2' },
      { input: '100 100 50', expected_output: '100' }
    ],
    hidden_tests: [
      { input: '10 10 10', expected_output: '10' },
      { input: '50 20 80', expected_output: '80' },
      { input: '0 -100 100', expected_output: '100' },
      { input: '-1 -1 0', expected_output: '0' },
      { input: '9999 10000 9998', expected_output: '10000' }
    ]
  },
  {
    topicOrder: 6,
    title: 'Check Whether a Year is a Leap Year',
    slug: 'check-leap-year',
    difficulty: 'EASY',
    placement_importance: 'IMPORTANT',
    level: 'BEGINNER',
    description: 'Given a year Y, determine if it is a Leap Year according to the Gregorian calendar rules: A year is a leap year if it is divisible by 4, except end-of-century years (divisible by 100) which must also be divisible by 400. Print "Leap Year" or "Not a Leap Year".',
    input_format: 'A positive integer Y representing the year.',
    output_format: 'Print "Leap Year" or "Not a Leap Year".',
    constraints: '1 <= Y <= 10000',
    sample_input: '2024',
    sample_output: 'Leap Year',
    explanation: '2024 is divisible by 4 and not by 100, so it is a Leap Year.',
    hints: ['Condition: (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0)'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int year = sc.nextInt();
        // Check leap year
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int year = sc.nextInt();
        if ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0)) {
            System.out.println("Leap Year");
        } else {
            System.out.println("Not a Leap Year");
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '2024', expected_output: 'Leap Year' },
      { input: '1900', expected_output: 'Not a Leap Year' },
      { input: '2000', expected_output: 'Leap Year' }
    ],
    hidden_tests: [
      { input: '2023', expected_output: 'Not a Leap Year' },
      { input: '1600', expected_output: 'Leap Year' },
      { input: '2100', expected_output: 'Not a Leap Year' },
      { input: '2400', expected_output: 'Leap Year' },
      { input: '4', expected_output: 'Leap Year' },
      { input: '100', expected_output: 'Not a Leap Year' }
    ]
  },
  {
    topicOrder: 6,
    title: 'Check Prime Number Using Conditional Logic',
    slug: 'check-prime-conditional',
    difficulty: 'MEDIUM',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given an integer N, check whether N is a Prime number. A prime number is greater than 1 and has no positive divisors other than 1 and itself. Print "Prime" or "Not Prime".',
    input_format: 'A single integer N.',
    output_format: 'Print "Prime" or "Not Prime".',
    constraints: '-10^6 <= N <= 10^7',
    sample_input: '17',
    sample_output: 'Prime',
    explanation: '17 has no divisors between 2 and sqrt(17), so it is Prime.',
    hints: [
      'If n <= 1, it is Not Prime.',
      'Check divisors up to Math.sqrt(n).'
    ],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Check if n is prime
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n <= 1) {
            System.out.println("Not Prime");
            return;
        }
        boolean isPrime = true;
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) System.out.println("Prime");
        else System.out.println("Not Prime");
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '17', expected_output: 'Prime' },
      { input: '4', expected_output: 'Not Prime' },
      { input: '1', expected_output: 'Not Prime' }
    ],
    hidden_tests: [
      { input: '2', expected_output: 'Prime' },
      { input: '3', expected_output: 'Prime' },
      { input: '0', expected_output: 'Not Prime' },
      { input: '-7', expected_output: 'Not Prime' },
      { input: '97', expected_output: 'Prime' },
      { input: '100', expected_output: 'Not Prime' }
    ]
  },
  {
    topicOrder: 6,
    title: 'Calculate Student Grades Using Nested If-Else',
    slug: 'student-grades-nested-if-else',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given marks M (0 to 100), assign a grade using the following criteria:\n- M >= 90: Grade A\n- 80 <= M < 90: Grade B\n- 70 <= M < 80: Grade C\n- 60 <= M < 70: Grade D\n- 50 <= M < 60: Grade E\n- M < 50: Fail\nPrint the corresponding grade or "Fail".',
    input_format: 'An integer M representing marks.',
    output_format: 'Print "Grade A", "Grade B", "Grade C", "Grade D", "Grade E", or "Fail".',
    constraints: '0 <= M <= 100',
    sample_input: '85',
    sample_output: 'Grade B',
    explanation: '85 is between 80 and 89, so the result is Grade B.',
    hints: ['Check from highest threshold down to 50.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int marks = sc.nextInt();
        // Output grade
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int marks = sc.nextInt();
        if (marks >= 90) System.out.println("Grade A");
        else if (marks >= 80) System.out.println("Grade B");
        else if (marks >= 70) System.out.println("Grade C");
        else if (marks >= 60) System.out.println("Grade D");
        else if (marks >= 50) System.out.println("Grade E");
        else System.out.println("Fail");
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '85', expected_output: 'Grade B' },
      { input: '95', expected_output: 'Grade A' },
      { input: '45', expected_output: 'Fail' }
    ],
    hidden_tests: [
      { input: '90', expected_output: 'Grade A' },
      { input: '80', expected_output: 'Grade B' },
      { input: '70', expected_output: 'Grade C' },
      { input: '60', expected_output: 'Grade D' },
      { input: '50', expected_output: 'Grade E' },
      { input: '49', expected_output: 'Fail' },
      { input: '100', expected_output: 'Grade A' }
    ]
  },
  {
    topicOrder: 6,
    title: 'Check Armstrong Number',
    slug: 'check-armstrong-number-conditional',
    difficulty: 'MEDIUM',
    placement_importance: 'IMPORTANT',
    level: 'INTERMEDIATE',
    description: 'An Armstrong number of order K is a number whose sum of digits raised to the power of K equals the number itself (e.g. 153 = 1^3 + 5^3 + 3^3 = 153). Given an integer N, check whether it is an Armstrong number. Print "Armstrong" or "Not Armstrong".',
    input_format: 'A single positive integer N.',
    output_format: 'Print "Armstrong" or "Not Armstrong".',
    constraints: '1 <= N <= 10^7',
    sample_input: '153',
    sample_output: 'Armstrong',
    explanation: '1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153.',
    hints: [
      'Count digits to find K = String.valueOf(n).length().',
      'Sum the digits raised to power K and compare with original N.'
    ],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Check Armstrong
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int temp = n;
        int k = String.valueOf(n).length();
        long sum = 0;
        while (temp > 0) {
            int digit = temp % 10;
            sum += Math.pow(digit, k);
            temp /= 10;
        }
        if (sum == n) System.out.println("Armstrong");
        else System.out.println("Not Armstrong");
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '153', expected_output: 'Armstrong' },
      { input: '370', expected_output: 'Armstrong' },
      { input: '120', expected_output: 'Not Armstrong' }
    ],
    hidden_tests: [
      { input: '9', expected_output: 'Armstrong' },
      { input: '1634', expected_output: 'Armstrong' },
      { input: '9474', expected_output: 'Armstrong' },
      { input: '500', expected_output: 'Not Armstrong' },
      { input: '371', expected_output: 'Armstrong' }
    ]
  },
  {
    topicOrder: 6,
    title: 'Check Whether Three Sides Form a Valid Triangle',
    slug: 'check-valid-triangle',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given three positive integers a, b, and c representing the side lengths of a triangle, check if they can form a valid triangle using Triangle Inequality Theorem (sum of any two sides must be strictly greater than the third side: a + b > c && a + c > b && b + c > a). Print "Valid" or "Invalid".',
    input_format: 'Three integers a, b, c separated by space.',
    output_format: 'Print "Valid" or "Invalid".',
    constraints: '1 <= a, b, c <= 10^5',
    sample_input: '3 4 5',
    sample_output: 'Valid',
    explanation: '3+4 > 5, 3+5 > 4, 4+5 > 3. All conditions satisfied.',
    hints: ['Check if (a + b > c) && (a + c > b) && (b + c > a).'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        // Check validity
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        if (a + b > c && a + c > b && b + c > a) {
            System.out.println("Valid");
        } else {
            System.out.println("Invalid");
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '3 4 5', expected_output: 'Valid' },
      { input: '1 2 3', expected_output: 'Invalid' },
      { input: '5 5 5', expected_output: 'Valid' }
    ],
    hidden_tests: [
      { input: '10 2 3', expected_output: 'Invalid' },
      { input: '7 10 5', expected_output: 'Valid' },
      { input: '100 100 1', expected_output: 'Valid' },
      { input: '1 1 2', expected_output: 'Invalid' },
      { input: '12 5 13', expected_output: 'Valid' }
    ]
  },
  {
    topicOrder: 6,
    title: 'Identify Triangle Type: Equilateral, Isosceles, or Scalene',
    slug: 'identify-triangle-type',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given three valid side lengths a, b, and c of a triangle, classify the triangle as:\n- "Equilateral" if all three sides are equal\n- "Isosceles" if any two sides are equal\n- "Scalene" if all three sides are distinct',
    input_format: 'Three integers a, b, c separated by space.',
    output_format: 'Print "Equilateral", "Isosceles", or "Scalene".',
    constraints: '1 <= a, b, c <= 10^5 (valid triangle sides guaranteed)',
    sample_input: '5 5 5',
    sample_output: 'Equilateral',
    explanation: 'All three sides are equal to 5.',
    hints: ['Check if a == b && b == c first.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        // Classify triangle
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        if (a == b && b == c) {
            System.out.println("Equilateral");
        } else if (a == b || b == c || a == c) {
            System.out.println("Isosceles");
        } else {
            System.out.println("Scalene");
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '5 5 5', expected_output: 'Equilateral' },
      { input: '5 5 8', expected_output: 'Isosceles' },
      { input: '3 4 5', expected_output: 'Scalene' }
    ],
    hidden_tests: [
      { input: '7 10 7', expected_output: 'Isosceles' },
      { input: '12 13 5', expected_output: 'Scalene' },
      { input: '9 9 9', expected_output: 'Equilateral' },
      { input: '6 8 8', expected_output: 'Isosceles' },
      { input: '100 200 150', expected_output: 'Scalene' }
    ]
  },
  {
    topicOrder: 6,
    title: 'Calculate Electricity Bill Using Slab-Based Conditions',
    slug: 'electricity-bill-slab-based',
    difficulty: 'MEDIUM',
    placement_importance: 'IMPORTANT',
    level: 'INTERMEDIATE',
    description: 'Calculate electricity bill based on consumed units U according to slabs:\n- First 100 units: 1.50 per unit\n- Next 100 units (101-200): 2.50 per unit\n- Next 100 units (201-300): 4.00 per unit\n- Above 300 units: 6.00 per unit\nAn additional fixed charge of 35.00 is added to every bill. Print total bill formatted to 2 decimal places.',
    input_format: 'A non-negative integer U representing units consumed.',
    output_format: 'Print final bill amount formatted to 2 decimal places.',
    constraints: '0 <= U <= 10^5',
    sample_input: '150',
    sample_output: '310.00',
    explanation: 'First 100 units * 1.50 = 150.00. Next 50 units * 2.50 = 125.00. Surcharge = 35.00. Total = 150 + 125 + 35 = 310.00.',
    hints: ['Compute slab by slab.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int units = sc.nextInt();
        // Compute slab bill
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int u = sc.nextInt();
        double bill = 0.0;
        
        if (u <= 100) {
            bill = u * 1.50;
        } else if (u <= 200) {
            bill = (100 * 1.50) + ((u - 100) * 2.50);
        } else if (u <= 300) {
            bill = (100 * 1.50) + (100 * 2.50) + ((u - 200) * 4.00);
        } else {
            bill = (100 * 1.50) + (100 * 2.50) + (100 * 4.00) + ((u - 300) * 6.00);
        }
        
        bill += 35.00;
        System.out.printf("%.2f\\n", bill);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '150', expected_output: '310.00' },
      { input: '50', expected_output: '110.00' },
      { input: '250', expected_output: '635.00' }
    ],
    hidden_tests: [
      { input: '0', expected_output: '35.00' },
      { input: '100', expected_output: '185.00' },
      { input: '200', expected_output: '435.00' },
      { input: '300', expected_output: '835.00' },
      { input: '350', expected_output: '1135.00' },
      { input: '500', expected_output: '2035.00' }
    ]
  },

  // ==========================================
  // TOPIC 7 — SWITCH
  // ==========================================
  {
    topicOrder: 7,
    title: 'Print Day of the Week Based on Number 1 to 7',
    slug: 'day-of-week-switch',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given an integer D (1 to 7), print the corresponding day of the week using a switch statement:\n1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday, 7: Sunday. If outside 1-7, print "Invalid".',
    input_format: 'An integer D.',
    output_format: 'Print day name or "Invalid".',
    constraints: '-100 <= D <= 100',
    sample_input: '3',
    sample_output: 'Wednesday',
    explanation: 'Day 3 corresponds to Wednesday.',
    hints: ['Use switch (d) with case 1 to 7 and default: "Invalid".'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int d = sc.nextInt();
        // Switch case
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int d = sc.nextInt();
        switch (d) {
            case 1: System.out.println("Monday"); break;
            case 2: System.out.println("Tuesday"); break;
            case 3: System.out.println("Wednesday"); break;
            case 4: System.out.println("Thursday"); break;
            case 5: System.out.println("Friday"); break;
            case 6: System.out.println("Saturday"); break;
            case 7: System.out.println("Sunday"); break;
            default: System.out.println("Invalid"); break;
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '3', expected_output: 'Wednesday' },
      { input: '1', expected_output: 'Monday' },
      { input: '9', expected_output: 'Invalid' }
    ],
    hidden_tests: [
      { input: '7', expected_output: 'Sunday' },
      { input: '0', expected_output: 'Invalid' },
      { input: '5', expected_output: 'Friday' },
      { input: '-1', expected_output: 'Invalid' },
      { input: '4', expected_output: 'Thursday' }
    ]
  },
  {
    topicOrder: 7,
    title: 'Print Month Name Based on Number 1 to 12',
    slug: 'month-name-switch',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given an integer M (1 to 12), print the corresponding month name in English using switch-case (January, February, ..., December). If outside 1-12, print "Invalid".',
    input_format: 'An integer M.',
    output_format: 'Print the month name or "Invalid".',
    constraints: '-100 <= M <= 100',
    sample_input: '4',
    sample_output: 'April',
    explanation: 'Month 4 is April.',
    hints: ['Switch on month number.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        // Switch for month
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        switch (m) {
            case 1: System.out.println("January"); break;
            case 2: System.out.println("February"); break;
            case 3: System.out.println("March"); break;
            case 4: System.out.println("April"); break;
            case 5: System.out.println("May"); break;
            case 6: System.out.println("June"); break;
            case 7: System.out.println("July"); break;
            case 8: System.out.println("August"); break;
            case 9: System.out.println("September"); break;
            case 10: System.out.println("October"); break;
            case 11: System.out.println("November"); break;
            case 12: System.out.println("December"); break;
            default: System.out.println("Invalid"); break;
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '4', expected_output: 'April' },
      { input: '12', expected_output: 'December' },
      { input: '15', expected_output: 'Invalid' }
    ],
    hidden_tests: [
      { input: '1', expected_output: 'January' },
      { input: '8', expected_output: 'August' },
      { input: '0', expected_output: 'Invalid' },
      { input: '-5', expected_output: 'Invalid' },
      { input: '11', expected_output: 'November' }
    ]
  },
  {
    topicOrder: 7,
    title: 'Build a Calculator Using Switch-Case',
    slug: 'calculator-switch-case',
    difficulty: 'EASY',
    placement_importance: 'IMPORTANT',
    level: 'BEGINNER',
    description: 'Read two integers A and B, and a character op representing the operation (+, -, *, /, %). Use a switch-case statement to compute and print the result. If the operator is not recognized, print "Invalid Operator".',
    input_format: 'Two integers A and B and a character op separated by space.',
    output_format: 'Print integer result or "Invalid Operator".',
    constraints: '-10^4 <= A, B <= 10^4, B != 0 for / and %',
    sample_input: '15 4 %',
    sample_output: '3',
    explanation: '15 % 4 = 3.',
    hints: ['switch (op) with case \'+\', \'-\', \'*\', \'/\', \'%\', default.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        char op = sc.next().charAt(0);
        // Switch calculator
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        char op = sc.next().charAt(0);
        
        switch (op) {
            case '+': System.out.println(a + b); break;
            case '-': System.out.println(a - b); break;
            case '*': System.out.println(a * b); break;
            case '/': System.out.println(a / b); break;
            case '%': System.out.println(a % b); break;
            default: System.out.println("Invalid Operator"); break;
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '15 4 %', expected_output: '3' },
      { input: '10 20 +', expected_output: '30' },
      { input: '10 5 ^', expected_output: 'Invalid Operator' }
    ],
    hidden_tests: [
      { input: '25 10 -', expected_output: '15' },
      { input: '8 9 *', expected_output: '72' },
      { input: '100 25 /', expected_output: '4' },
      { input: '7 0 +', expected_output: '7' },
      { input: '12 5 %', expected_output: '2' }
    ]
  },
  {
    topicOrder: 7,
    title: 'Menu-Driven Area Calculator for Circle, Rectangle, and Triangle',
    slug: 'menu-driven-area-calculator',
    difficulty: 'MEDIUM',
    placement_importance: 'NORMAL',
    level: 'INTERMEDIATE',
    description: 'Build a menu-driven program where an integer choice represents the shape:\n1: Circle (input: radius r -> Area = Math.PI * r * r)\n2: Rectangle (input: length l, breadth b -> Area = l * b)\n3: Triangle (input: base b, height h -> Area = 0.5 * b * h)\nPrint the area formatted to 2 decimal places. If choice is invalid, print "Invalid Choice".',
    input_format: 'An integer choice followed by shape dimension(s) on the same line.',
    output_format: 'Print calculated area formatted to 2 decimal places or "Invalid Choice".',
    constraints: 'Dimensions are positive doubles <= 1000.0.',
    sample_input: '2 10.0 5.0',
    sample_output: '50.00',
    explanation: 'Choice 2 is Rectangle: 10.0 * 5.0 = 50.00.',
    hints: ['Read choice first with sc.nextInt(), then read dimensions.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice = sc.nextInt();
        // Handle menu choice
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice = sc.nextInt();
        switch (choice) {
            case 1: {
                double r = sc.nextDouble();
                double area = Math.PI * r * r;
                System.out.printf("%.2f\\n", area);
                break;
            }
            case 2: {
                double l = sc.nextDouble();
                double b = sc.nextDouble();
                double area = l * b;
                System.out.printf("%.2f\\n", area);
                break;
            }
            case 3: {
                double b = sc.nextDouble();
                double h = sc.nextDouble();
                double area = 0.5 * b * h;
                System.out.printf("%.2f\\n", area);
                break;
            }
            default: {
                System.out.println("Invalid Choice");
                break;
            }
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '2 10.0 5.0', expected_output: '50.00' },
      { input: '1 7.0', expected_output: '153.94' },
      { input: '3 6.0 4.0', expected_output: '12.00' }
    ],
    hidden_tests: [
      { input: '4', expected_output: 'Invalid Choice' },
      { input: '1 1.0', expected_output: '3.14' },
      { input: '2 15.5 2.0', expected_output: '31.00' },
      { input: '3 10.5 8.0', expected_output: '42.00' },
      { input: '0', expected_output: 'Invalid Choice' }
    ]
  },
  {
    topicOrder: 7,
    title: 'ATM Menu Simulation',
    slug: 'atm-menu-simulation',
    difficulty: 'MEDIUM',
    placement_importance: 'NORMAL',
    level: 'INTERMEDIATE',
    description: 'Simulate an ATM system with starting balance 1000.00. The input gives an operation code:\n1: Check Balance -> print "Balance: %.2f"\n2: Deposit -> followed by deposit amount (double). New balance = balance + amount. Print "Deposited: %.2f New Balance: %.2f"\n3: Withdraw -> followed by withdrawal amount (double). If amount <= balance, new balance = balance - amount, print "Withdrawn: %.2f New Balance: %.2f". If amount > balance, print "Insufficient Funds".\nIf invalid code: print "Invalid Option".',
    input_format: 'An integer operation code (1, 2, or 3) and optional amount.',
    output_format: 'Print operation output message as specified.',
    constraints: 'Starting balance is 1000.00.',
    sample_input: '2 500.00',
    sample_output: 'Deposited: 500.00 New Balance: 1500.00',
    explanation: 'Option 2 deposits 500.00 to initial 1000.00 balance.',
    hints: ['Double balance = 1000.00; switch (code)'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int op = sc.nextInt();
        // ATM menu logic
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int op = sc.nextInt();
        double balance = 1000.00;
        
        switch (op) {
            case 1:
                System.out.printf("Balance: %.2f\\n", balance);
                break;
            case 2: {
                double amt = sc.nextDouble();
                balance += amt;
                System.out.printf("Deposited: %.2f New Balance: %.2f\\n", amt, balance);
                break;
            }
            case 3: {
                double amt = sc.nextDouble();
                if (amt <= balance) {
                    balance -= amt;
                    System.out.printf("Withdrawn: %.2f New Balance: %.2f\\n", amt, balance);
                } else {
                    System.out.println("Insufficient Funds");
                }
                break;
            }
            default:
                System.out.println("Invalid Option");
                break;
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '2 500.00', expected_output: 'Deposited: 500.00 New Balance: 1500.00' },
      { input: '1', expected_output: 'Balance: 1000.00' },
      { input: '3 1200.00', expected_output: 'Insufficient Funds' }
    ],
    hidden_tests: [
      { input: '3 400.00', expected_output: 'Withdrawn: 400.00 New Balance: 600.00' },
      { input: '3 1000.00', expected_output: 'Withdrawn: 1000.00 New Balance: 0.00' },
      { input: '2 123.45', expected_output: 'Deposited: 123.45 New Balance: 1123.45' },
      { input: '9', expected_output: 'Invalid Option' },
      { input: '0', expected_output: 'Invalid Option' }
    ]
  },

  // ==========================================
  // TOPIC 8 — LOOPS (FOR, WHILE)
  // ==========================================
  {
    topicOrder: 8,
    title: 'Print Multiplication Table of a Given Number',
    slug: 'multiplication-table',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given an integer N, print its multiplication table from 1 to 10 in the format: N x i = result.',
    input_format: 'A single integer N.',
    output_format: '10 lines, each formatted as "N x i = result" for i from 1 to 10.',
    constraints: '1 <= N <= 1000',
    sample_input: '5',
    sample_output: '5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50',
    explanation: 'Prints the 5 times table from 1 to 10.',
    hints: ['for (int i = 1; i <= 10; i++) System.out.println(n + " x " + i + " = " + (n * i));'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Print multiplication table
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= 10; i++) {
            System.out.println(n + " x " + i + " = " + (n * i));
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      {
        input: '5',
        expected_output: '5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50'
      },
      {
        input: '2',
        expected_output: '2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n2 x 6 = 12\n2 x 7 = 14\n2 x 8 = 16\n2 x 9 = 18\n2 x 10 = 20'
      }
    ],
    hidden_tests: [
      {
        input: '1',
        expected_output: '1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n1 x 4 = 4\n1 x 5 = 5\n1 x 6 = 6\n1 x 7 = 7\n1 x 8 = 8\n1 x 9 = 9\n1 x 10 = 10'
      },
      {
        input: '12',
        expected_output: '12 x 1 = 12\n12 x 2 = 24\n12 x 3 = 36\n12 x 4 = 48\n12 x 5 = 60\n12 x 6 = 72\n12 x 7 = 84\n12 x 8 = 96\n12 x 9 = 108\n12 x 10 = 120'
      }
    ]
  },
  {
    topicOrder: 8,
    title: 'Find the Factorial of a Number',
    slug: 'factorial-of-number',
    difficulty: 'EASY',
    placement_importance: 'IMPORTANT',
    level: 'BEGINNER',
    description: 'Given a non-negative integer N, calculate and print N! (factorial of N). Factorial of 0 is 1.',
    input_format: 'An integer N.',
    output_format: 'Print N! as a 64-bit integer (long).',
    constraints: '0 <= N <= 20',
    sample_input: '5',
    sample_output: '120',
    explanation: '5! = 5 * 4 * 3 * 2 * 1 = 120.',
    hints: ['Use long to prevent integer overflow since 20! fits inside a 64-bit signed long.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Compute factorial
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long fact = 1;
        for (int i = 1; i <= n; i++) {
            fact *= i;
        }
        System.out.println(fact);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '5', expected_output: '120' },
      { input: '0', expected_output: '1' },
      { input: '10', expected_output: '3628800' }
    ],
    hidden_tests: [
      { input: '1', expected_output: '1' },
      { input: '6', expected_output: '720' },
      { input: '12', expected_output: '479001600' },
      { input: '15', expected_output: '1307674368000' },
      { input: '20', expected_output: '2432902008176640000' }
    ]
  },
  {
    topicOrder: 8,
    title: 'Reverse a Number',
    slug: 'reverse-a-number',
    difficulty: 'EASY',
    placement_importance: 'IMPORTANT',
    level: 'BEGINNER',
    description: 'Given an integer N, reverse its digits. If N is negative, the reversed number should remain negative (e.g. -123 -> -321). Trailing zeros in input should not produce leading zeros (e.g. 120 -> 21).',
    input_format: 'A single integer N.',
    output_format: 'Print the reversed integer.',
    constraints: '-10^9 <= N <= 10^9',
    sample_input: '1234',
    sample_output: '4321',
    explanation: 'Digits 1, 2, 3, 4 reversed gives 4321.',
    hints: ['rev = rev * 10 + (n % 10); n /= 10; Handle negative numbers using sign flag.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Reverse number
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        boolean isNegative = n < 0;
        long num = Math.abs((long) n);
        long rev = 0;
        while (num > 0) {
            rev = rev * 10 + (num % 10);
            num /= 10;
        }
        if (isNegative) rev = -rev;
        System.out.println(rev);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '1234', expected_output: '4321' },
      { input: '-123', expected_output: '-321' },
      { input: '120', expected_output: '21' }
    ],
    hidden_tests: [
      { input: '0', expected_output: '0' },
      { input: '7', expected_output: '7' },
      { input: '-5', expected_output: '-5' },
      { input: '1000000', expected_output: '1' },
      { input: '987654321', expected_output: '123456789' }
    ]
  },
  {
    topicOrder: 8,
    title: 'Check Whether a Number is a Palindrome',
    slug: 'check-palindrome-number',
    difficulty: 'EASY',
    placement_importance: 'IMPORTANT',
    level: 'BEGINNER',
    description: 'An integer is a palindrome if it reads the same backward as forward. Given an integer N, check if it is a palindrome. Negative numbers are not palindromes. Print "Palindrome" or "Not Palindrome".',
    input_format: 'A single integer N.',
    output_format: 'Print "Palindrome" or "Not Palindrome".',
    constraints: '-10^9 <= N <= 10^9',
    sample_input: '121',
    sample_output: 'Palindrome',
    explanation: '121 reversed is 121, so it is a Palindrome.',
    hints: ['Negative numbers cannot be palindromes.', 'Reverse the number and compare with original.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Check palindrome
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n < 0) {
            System.out.println("Not Palindrome");
            return;
        }
        int temp = n;
        long rev = 0;
        while (temp > 0) {
            rev = rev * 10 + (temp % 10);
            temp /= 10;
        }
        if (rev == n) System.out.println("Palindrome");
        else System.out.println("Not Palindrome");
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '121', expected_output: 'Palindrome' },
      { input: '-121', expected_output: 'Not Palindrome' },
      { input: '10', expected_output: 'Not Palindrome' }
    ],
    hidden_tests: [
      { input: '0', expected_output: 'Palindrome' },
      { input: '7', expected_output: 'Palindrome' },
      { input: '12321', expected_output: 'Palindrome' },
      { input: '123456', expected_output: 'Not Palindrome' },
      { input: '1000000001', expected_output: 'Palindrome' }
    ]
  },
  {
    topicOrder: 8,
    title: 'Check Whether a Number is Prime',
    slug: 'check-prime-loops',
    difficulty: 'EASY',
    placement_importance: 'VERY_IMPORTANT',
    level: 'BEGINNER',
    description: 'Given an integer N, check whether it is a Prime number using an efficient loop up to sqrt(N). Print "Prime" or "Not Prime".',
    input_format: 'A single integer N.',
    output_format: 'Print "Prime" or "Not Prime".',
    constraints: '-10^6 <= N <= 10^7',
    sample_input: '29',
    sample_output: 'Prime',
    explanation: '29 has only 1 and 29 as divisors.',
    hints: ['Check up to i * i <= n.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Check prime
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n <= 1) {
            System.out.println("Not Prime");
            return;
        }
        boolean isPrime = true;
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) System.out.println("Prime");
        else System.out.println("Not Prime");
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '29', expected_output: 'Prime' },
      { input: '1', expected_output: 'Not Prime' },
      { input: '35', expected_output: 'Not Prime' }
    ],
    hidden_tests: [
      { input: '2', expected_output: 'Prime' },
      { input: '3', expected_output: 'Prime' },
      { input: '0', expected_output: 'Not Prime' },
      { input: '-17', expected_output: 'Not Prime' },
      { input: '997', expected_output: 'Prime' },
      { input: '1000000', expected_output: 'Not Prime' }
    ]
  },
  {
    topicOrder: 8,
    title: 'Find the Sum of Digits of a Number',
    slug: 'sum-of-digits-loops',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given an integer N, calculate the sum of its digits. If N is negative, consider the absolute value.',
    input_format: 'A single integer N.',
    output_format: 'Print the sum of digits.',
    constraints: '-10^9 <= N <= 10^9',
    sample_input: '12345',
    sample_output: '15',
    explanation: '1 + 2 + 3 + 4 + 5 = 15.',
    hints: ['Extract digits using n % 10 and n /= 10.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Calculate sum of digits
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long num = Math.abs((long) n);
        int sum = 0;
        while (num > 0) {
            sum += num % 10;
            num /= 10;
        }
        System.out.println(sum);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '12345', expected_output: '15' },
      { input: '-99', expected_output: '18' },
      { input: '0', expected_output: '0' }
    ],
    hidden_tests: [
      { input: '1000', expected_output: '1' },
      { input: '9876', expected_output: '30' },
      { input: '5', expected_output: '5' },
      { input: '-1002', expected_output: '3' },
      { input: '999999999', expected_output: '81' }
    ]
  },
  {
    topicOrder: 8,
    title: 'Print the Fibonacci Series Up to N Terms',
    slug: 'fibonacci-series-n-terms',
    difficulty: 'EASY',
    placement_importance: 'IMPORTANT',
    level: 'BEGINNER',
    description: 'Given a positive integer N, print the first N terms of the Fibonacci sequence starting with 0 and 1, separated by spaces. (0, 1, 1, 2, 3, 5, 8, ...)',
    input_format: 'A positive integer N.',
    output_format: 'Print N Fibonacci terms separated by a single space.',
    constraints: '1 <= N <= 40',
    sample_input: '7',
    sample_output: '0 1 1 2 3 5 8',
    explanation: 'First 7 Fibonacci numbers.',
    hints: ['Start with a = 0, b = 1; c = a + b;'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Print N terms
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n <= 0) return;
        
        long a = 0, b = 1;
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= n; i++) {
            if (i == 1) sb.append(a);
            else if (i == 2) sb.append(" ").append(b);
            else {
                long c = a + b;
                sb.append(" ").append(c);
                a = b;
                b = c;
            }
        }
        System.out.println(sb.toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '7', expected_output: '0 1 1 2 3 5 8' },
      { input: '1', expected_output: '0' },
      { input: '2', expected_output: '0 1' }
    ],
    hidden_tests: [
      { input: '3', expected_output: '0 1 1' },
      { input: '5', expected_output: '0 1 1 2 3' },
      { input: '10', expected_output: '0 1 1 2 3 5 8 13 21 34' },
      { input: '15', expected_output: '0 1 1 2 3 5 8 13 21 34 55 89 144 233 377' }
    ]
  },
  {
    topicOrder: 8,
    title: 'Check Armstrong Number Using Loops',
    slug: 'armstrong-number-loops',
    difficulty: 'MEDIUM',
    placement_importance: 'IMPORTANT',
    level: 'INTERMEDIATE',
    description: 'An Armstrong number is an integer such that the sum of its digits raised to the power of the number of digits equals the number itself. Check if N is an Armstrong number and print "Armstrong" or "Not Armstrong".',
    input_format: 'A single positive integer N.',
    output_format: 'Print "Armstrong" or "Not Armstrong".',
    constraints: '1 <= N <= 10^7',
    sample_input: '371',
    sample_output: 'Armstrong',
    explanation: '3^3 + 7^3 + 1^3 = 27 + 343 + 1 = 371.',
    hints: ['Count digits first, then accumulate digit^k.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Check Armstrong
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int temp = n;
        int k = 0;
        int t2 = n;
        while (t2 > 0) {
            k++;
            t2 /= 10;
        }
        
        long sum = 0;
        while (temp > 0) {
            int d = temp % 10;
            long pow = 1;
            for (int i = 0; i < k; i++) pow *= d;
            sum += pow;
            temp /= 10;
        }
        if (sum == n) System.out.println("Armstrong");
        else System.out.println("Not Armstrong");
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '371', expected_output: 'Armstrong' },
      { input: '153', expected_output: 'Armstrong' },
      { input: '123', expected_output: 'Not Armstrong' }
    ],
    hidden_tests: [
      { input: '9474', expected_output: 'Armstrong' },
      { input: '1', expected_output: 'Armstrong' },
      { input: '500', expected_output: 'Not Armstrong' },
      { input: '407', expected_output: 'Armstrong' },
      { input: '1634', expected_output: 'Armstrong' }
    ]
  },
  {
    topicOrder: 8,
    title: 'Count Number of Digits in an Integer',
    slug: 'count-digits-integer',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given an integer N, count and print the total number of digits. 0 has 1 digit. Negative signs do not count as digits.',
    input_format: 'A single integer N.',
    output_format: 'Print the count of digits.',
    constraints: '-10^9 <= N <= 10^9',
    sample_input: '987654',
    sample_output: '6',
    explanation: '987654 has 6 digits.',
    hints: ['If n == 0 return 1. Otherwise divide by 10 in loop.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Count digits
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n == 0) {
            System.out.println(1);
            return;
        }
        long num = Math.abs((long) n);
        int count = 0;
        while (num > 0) {
            count++;
            num /= 10;
        }
        System.out.println(count);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '987654', expected_output: '6' },
      { input: '0', expected_output: '1' },
      { input: '-456', expected_output: '3' }
    ],
    hidden_tests: [
      { input: '7', expected_output: '1' },
      { input: '-1', expected_output: '1' },
      { input: '1000000000', expected_output: '10' },
      { input: '-999999999', expected_output: '9' }
    ]
  },
  {
    topicOrder: 8,
    title: 'Find the GCD of Two Numbers',
    slug: 'find-gcd-two-numbers',
    difficulty: 'MEDIUM',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given two positive integers A and B, find their Greatest Common Divisor (GCD) using the Euclidean algorithm with loops.',
    input_format: 'Two positive integers A and B separated by space.',
    output_format: 'Print the GCD.',
    constraints: '1 <= A, B <= 10^9',
    sample_input: '48 18',
    sample_output: '6',
    explanation: 'Divisors of 48 and 18 have greatest common factor 6.',
    hints: ['while (b != 0) { int temp = b; b = a % b; a = temp; }'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        // Compute GCD
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        System.out.println(a);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '48 18', expected_output: '6' },
      { input: '100 25', expected_output: '25' },
      { input: '7 13', expected_output: '1' }
    ],
    hidden_tests: [
      { input: '50 50', expected_output: '50' },
      { input: '1 9999', expected_output: '1' },
      { input: '1071 462', expected_output: '21' },
      { input: '1000000000 500000000', expected_output: '500000000' }
    ]
  },

  // ==========================================
  // TOPIC 9 — BREAK, CONTINUE
  // ==========================================
  {
    topicOrder: 9,
    title: 'Print Numbers 1 to 20 and Stop at 10 Using Break',
    slug: 'print-1-to-20-break-at-10',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Write a loop from 1 to 20. When the number reaches 10, use the break statement to terminate the loop. Print the printed numbers separated by space.',
    input_format: 'No input needed (optional dummy integer may be ignored).',
    output_format: 'Print numbers 1 through 9 separated by space.',
    constraints: 'Standard loop execution.',
    sample_input: 'No input required',
    sample_output: '1 2 3 4 5 6 7 8 9',
    explanation: 'When i reaches 10, the loop breaks before printing 10.',
    hints: ['if (i == 10) break;'],
    starter_code: `public class Main {
    public static void main(String[] args) {
        // Loop from 1 to 20 with break at 10
    }
}`,
    reference_solution: `public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= 20; i++) {
            if (i == 10) break;
            if (sb.length() > 0) sb.append(" ");
            sb.append(i);
        }
        System.out.println(sb.toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '', expected_output: '1 2 3 4 5 6 7 8 9' }
    ],
    hidden_tests: [
      { input: '0', expected_output: '1 2 3 4 5 6 7 8 9' }
    ]
  },
  {
    topicOrder: 9,
    title: 'Print 1 to 20 Skipping Multiples of 3 Using Continue',
    slug: 'print-1-to-20-skip-multiples-of-3',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Write a loop from 1 to 20. If a number is a multiple of 3, use the continue statement to skip printing it. Print remaining numbers separated by space.',
    input_format: 'No input needed.',
    output_format: 'Print non-multiples of 3 separated by space.',
    constraints: 'Standard loop execution.',
    sample_input: 'No input required',
    sample_output: '1 2 4 5 7 8 10 11 13 14 16 17 19 20',
    explanation: 'Multiples of 3 (3, 6, 9, 12, 15, 18) are skipped with continue.',
    hints: ['if (i % 3 == 0) continue;'],
    starter_code: `public class Main {
    public static void main(String[] args) {
        // Skip multiples of 3
    }
}`,
    reference_solution: `public class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= 20; i++) {
            if (i % 3 == 0) continue;
            if (sb.length() > 0) sb.append(" ");
            sb.append(i);
        }
        System.out.println(sb.toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '', expected_output: '1 2 4 5 7 8 10 11 13 14 16 17 19 20' }
    ],
    hidden_tests: [
      { input: '0', expected_output: '1 2 4 5 7 8 10 11 13 14 16 17 19 20' }
    ]
  },
  {
    topicOrder: 9,
    title: 'Read Numbers Until User Enters 0 Using Break',
    slug: 'read-numbers-until-zero-break',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Read a sequence of integers from input. Use a while loop and break when the number 0 is encountered. Calculate and print the sum of all numbers read prior to 0.',
    input_format: 'A sequence of integers ending with 0.',
    output_format: 'Print the sum of the numbers before 0.',
    constraints: '-10^4 <= each number <= 10^4',
    sample_input: '5 12 3 -4 0 99',
    sample_output: '16',
    explanation: '5 + 12 + 3 + (-4) = 16. Reading stops at 0.',
    hints: ['while (true) { int x = sc.nextInt(); if (x == 0) break; sum += x; }'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read until 0 and print sum
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long sum = 0;
        while (sc.hasNextInt()) {
            int num = sc.nextInt();
            if (num == 0) break;
            sum += num;
        }
        System.out.println(sum);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '5 12 3 -4 0 99', expected_output: '16' },
      { input: '0 10 20', expected_output: '0' },
      { input: '10 20 30 0', expected_output: '60' }
    ],
    hidden_tests: [
      { input: '-10 -20 0', expected_output: '-30' },
      { input: '1 2 3 4 5 6 7 8 9 0', expected_output: '45' },
      { input: '1000 0', expected_output: '1000' }
    ]
  },
  {
    topicOrder: 9,
    title: 'First Number Divisible by 7 and 11 in a Range',
    slug: 'first-number-divisible-7-and-11-range',
    difficulty: 'MEDIUM',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given two positive integers L and R (L <= R), find the first number in the range [L, R] that is divisible by both 7 and 11 (i.e. divisible by 77) and print it using break. If no such number exists, print "None".',
    input_format: 'Two integers L and R separated by space.',
    output_format: 'Print the first number divisible by 77, or "None".',
    constraints: '1 <= L <= R <= 10^6',
    sample_input: '50 200',
    sample_output: '77',
    explanation: '77 is divisible by both 7 and 11 and lies between 50 and 200.',
    hints: ['Loop from L to R. If i % 77 == 0, print i and break.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int l = sc.nextInt();
        int r = sc.nextInt();
        // Find first divisible by 77
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int l = sc.nextInt();
        int r = sc.nextInt();
        int found = -1;
        for (int i = l; i <= r; i++) {
            if (i % 77 == 0) {
                found = i;
                break;
            }
        }
        if (found != -1) System.out.println(found);
        else System.out.println("None");
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '50 200', expected_output: '77' },
      { input: '1 50', expected_output: 'None' },
      { input: '77 150', expected_output: '77' }
    ],
    hidden_tests: [
      { input: '80 150', expected_output: 'None' },
      { input: '150 250', expected_output: '154' },
      { input: '700 800', expected_output: '770' },
      { input: '1000 2000', expected_output: '1001' }
    ]
  },
  {
    topicOrder: 9,
    title: 'Number Guessing Game with 3 Attempts',
    slug: 'number-guessing-game-three-attempts',
    difficulty: 'MEDIUM',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Simulate a guessing game judge. The first integer is target T (1 to 100). Next follow up to 3 guessed integers. For each guess:\n- If guess == T: print "Correct!" and break.\n- Else if guess < T: print "Too Low"\n- Else if guess > T: print "Too High"\nIf 3 guesses are made without guessing correctly, print "Game Over".',
    input_format: 'First integer T, followed by guesses.',
    output_format: 'Print the evaluation for each guess on a new line, and "Game Over" if not found in 3 attempts.',
    constraints: '1 <= T <= 100, up to 3 guesses.',
    sample_input: '50 30 70 50',
    sample_output: 'Too Low\nToo High\nCorrect!',
    explanation: 'Guess 1 (30) is Too Low, Guess 2 (70) is Too High, Guess 3 (50) is Correct!',
    hints: ['Use for (int attempt = 1; attempt <= 3; attempt++) with break on match.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int target = sc.nextInt();
        // Read up to 3 guesses
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int target = sc.nextInt();
        boolean won = false;
        for (int i = 1; i <= 3; i++) {
            if (!sc.hasNextInt()) break;
            int guess = sc.nextInt();
            if (guess == target) {
                System.out.println("Correct!");
                won = true;
                break;
            } else if (guess < target) {
                System.out.println("Too Low");
            } else {
                System.out.println("Too High");
            }
        }
        if (!won) {
            System.out.println("Game Over");
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '50 30 70 50', expected_output: 'Too Low\nToo High\nCorrect!' },
      { input: '40 10 20 30', expected_output: 'Too Low\nToo Low\nToo Low\nGame Over' },
      { input: '25 25', expected_output: 'Correct!' }
    ],
    hidden_tests: [
      { input: '80 90 85 82', expected_output: 'Too High\nToo High\nToo High\nGame Over' },
      { input: '15 10 15', expected_output: 'Too Low\nCorrect!' },
      { input: '99 98 100 99', expected_output: 'Too Low\nToo High\nCorrect!' }
    ]
  }
];
