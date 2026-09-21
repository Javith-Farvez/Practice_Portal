import { ProblemSeed } from './types';

export const TOPICS_1_TO_5_PROBLEMS: ProblemSeed[] = [
  // ==========================================
  // TOPIC 1 — VARIABLES
  // ==========================================
  {
    topicOrder: 1,
    title: 'Swap Two Numbers Using a Third Variable',
    slug: 'swap-two-numbers-third-variable',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given two integers A and B, swap their values using a third temporary variable and print the swapped values separated by a space.',
    input_format: 'Two integers A and B separated by a space.',
    output_format: 'Print the swapped values of A and B separated by a space.',
    constraints: '-10^9 <= A, B <= 10^9',
    sample_input: '10 20',
    sample_output: '20 10',
    explanation: 'Initial values: A = 10, B = 20. Storing A in temporary variable temp = 10, then A = B (A becomes 20), B = temp (B becomes 10). Output is 20 10.',
    hints: [
      'Declare a third variable named temp.',
      'Assign A to temp, then assign B to A, and finally temp to B.',
      'Print A and B with a single space in between.'
    ],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        
        // Write your code here to swap using a third variable
        
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        
        int temp = a;
        a = b;
        b = temp;
        
        System.out.println(a + " " + b);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '10 20', expected_output: '20 10' },
      { input: '-5 15', expected_output: '15 -5' },
      { input: '0 100', expected_output: '100 0' }
    ],
    hidden_tests: [
      { input: '0 0', expected_output: '0 0' },
      { input: '-50 -100', expected_output: '-100 -50' },
      { input: '1000000 -1000000', expected_output: '-1000000 1000000' },
      { input: '7 7', expected_output: '7 7' },
      { input: '-2147483648 2147483647', expected_output: '2147483647 -2147483648' },
      { input: '42 99', expected_output: '99 42' }
    ]
  },
  {
    topicOrder: 1,
    title: 'Swap Two Numbers Without Using a Third Variable',
    slug: 'swap-two-numbers-without-third-variable',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given two integers A and B, swap their values without using any additional temporary variable and print the swapped values separated by a space.',
    input_format: 'Two integers A and B separated by a space.',
    output_format: 'Print the swapped values of A and B separated by a space.',
    constraints: '-10^6 <= A, B <= 10^6',
    sample_input: '5 12',
    sample_output: '12 5',
    explanation: 'Using arithmetic operators: A = A + B (17), B = A - B (5), A = A - B (12). Now A has 12 and B has 5.',
    hints: [
      'You can use addition and subtraction or bitwise XOR (^).',
      'If using arithmetic: a = a + b; b = a - b; a = a - b;',
      'Ensure you do not declare any third variable.'
    ],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        
        // Swap without a third variable
        
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        
        a = a + b;
        b = a - b;
        a = a - b;
        
        System.out.println(a + " " + b);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '5 12', expected_output: '12 5' },
      { input: '-10 20', expected_output: '20 -10' },
      { input: '100 200', expected_output: '200 100' }
    ],
    hidden_tests: [
      { input: '0 0', expected_output: '0 0' },
      { input: '-50 -30', expected_output: '-30 -50' },
      { input: '0 45', expected_output: '45 0' },
      { input: '99999 1', expected_output: '1 99999' },
      { input: '88 88', expected_output: '88 88' },
      { input: '-12345 67890', expected_output: '67890 -12345' }
    ]
  },
  {
    topicOrder: 1,
    title: 'Calculate Total and Average of 5 Subject Marks',
    slug: 'total-and-average-five-subjects',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Read 5 integer marks obtained in 5 subjects. Calculate and print their total sum and exact average (formatted to 2 decimal places) separated by a space.',
    input_format: 'Five integers separated by spaces representing subject marks.',
    output_format: 'Print the total sum (integer) and average (floating point rounded to 2 decimal places) separated by a space.',
    constraints: '0 <= marks <= 100',
    sample_input: '80 85 90 75 95',
    sample_output: '425 85.00',
    explanation: 'Total = 80 + 85 + 90 + 75 + 95 = 425. Average = 425 / 5.0 = 85.00.',
    hints: [
      'Store all 5 marks in integer variables.',
      'Sum them up in a variable total.',
      'Cast total to double before dividing by 5: (double) total / 5.0.',
      'Use String.format("%.2f", average) or printf.'
    ],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read 5 marks and calculate total and average
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m1 = sc.nextInt();
        int m2 = sc.nextInt();
        int m3 = sc.nextInt();
        int m4 = sc.nextInt();
        int m5 = sc.nextInt();
        
        int total = m1 + m2 + m3 + m4 + m5;
        double avg = (double) total / 5.0;
        
        System.out.printf("%d %.2f\\n", total, avg);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '80 85 90 75 95', expected_output: '425 85.00' },
      { input: '100 100 100 100 100', expected_output: '500 100.00' },
      { input: '70 72 74 76 77', expected_output: '369 73.80' }
    ],
    hidden_tests: [
      { input: '0 0 0 0 0', expected_output: '0 0.00' },
      { input: '50 50 50 50 51', expected_output: '251 50.20' },
      { input: '63 71 89 92 55', expected_output: '370 74.00' },
      { input: '10 20 30 40 50', expected_output: '150 30.00' },
      { input: '99 98 97 96 94', expected_output: '484 96.80' }
    ]
  },
  {
    topicOrder: 1,
    title: 'Convert Total Seconds into Hours, Minutes, and Seconds',
    slug: 'convert-seconds-to-hours-minutes-seconds',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given an integer representing total elapsed seconds, convert it into hours, minutes, and remaining seconds in the format: H:M:S.',
    input_format: 'A single non-negative integer representing total seconds.',
    output_format: 'Print in the format: H:M:S where H is hours, M is minutes, and S is remaining seconds.',
    constraints: '0 <= totalSeconds <= 10^7',
    sample_input: '3665',
    sample_output: '1:1:5',
    explanation: '3665 seconds = 1 hour (3600s), leaving 65 seconds = 1 minute (60s) and 5 seconds. Output: 1:1:5.',
    hints: [
      'Hours = totalSeconds / 3600.',
      'Remaining seconds after hours = totalSeconds % 3600.',
      'Minutes = remainingSeconds / 60.',
      'Seconds = remainingSeconds % 60.'
    ],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int totalSeconds = sc.nextInt();
        // Compute hours, minutes, and seconds
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int totalSeconds = sc.nextInt();
        
        int hours = totalSeconds / 3600;
        int remaining = totalSeconds % 3600;
        int minutes = remaining / 60;
        int seconds = remaining % 60;
        
        System.out.println(hours + ":" + minutes + ":" + seconds);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '3665', expected_output: '1:1:5' },
      { input: '7200', expected_output: '2:0:0' },
      { input: '59', expected_output: '0:0:59' }
    ],
    hidden_tests: [
      { input: '0', expected_output: '0:0:0' },
      { input: '60', expected_output: '0:1:0' },
      { input: '3600', expected_output: '1:0:0' },
      { input: '86400', expected_output: '24:0:0' },
      { input: '123456', expected_output: '34:17:36' },
      { input: '999999', expected_output: '277:46:39' }
    ]
  },
  {
    topicOrder: 1,
    title: 'Calculate Electricity Bill Using Units and Rate',
    slug: 'calculate-electricity-bill-units-rate',
    difficulty: 'MEDIUM',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given units consumed (integer) and rate per unit (double), calculate the total bill amount. A fixed meter surcharge of 50.00 is added to every bill. Formula: Bill = (units * rate) + 50.00. Print the final bill amount formatted to 2 decimal places.',
    input_format: 'An integer units and a double rate separated by space.',
    output_format: 'Print the final bill amount formatted to 2 decimal places.',
    constraints: '0 <= units <= 10^5, 0.5 <= rate <= 50.0',
    sample_input: '150 6.50',
    sample_output: '1025.00',
    explanation: 'Energy charge = 150 * 6.50 = 975.00. Surcharge = 50.00. Total = 975.00 + 50.00 = 1025.00.',
    hints: [
      'Multiply units by rate using double arithmetic.',
      'Add the fixed charge of 50.00.',
      'Format output using System.out.printf("%.2f\\n", bill);'
    ],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int units = sc.nextInt();
        double rate = sc.nextDouble();
        // Calculate and print bill
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int units = sc.nextInt();
        double rate = sc.nextDouble();
        
        double bill = (units * rate) + 50.00;
        System.out.printf("%.2f\\n", bill);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '150 6.50', expected_output: '1025.00' },
      { input: '0 5.00', expected_output: '50.00' },
      { input: '200 4.25', expected_output: '900.00' }
    ],
    hidden_tests: [
      { input: '10 7.50', expected_output: '125.00' },
      { input: '500 8.75', expected_output: '4425.00' },
      { input: '1000 10.00', expected_output: '10050.00' },
      { input: '73 3.14', expected_output: '279.22' },
      { input: '350 5.55', expected_output: '1992.50' }
    ]
  },

  // ==========================================
  // TOPIC 2 — DATA TYPES
  // ==========================================
  {
    topicOrder: 2,
    title: 'Calculate Area of a Circle Using Double',
    slug: 'area-of-circle-double',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Read a double value representing the radius of a circle. Calculate the area using the formula: Area = PI * r * r with PI = 3.141592653589793 (or Math.PI). Print the area formatted to 4 decimal places.',
    input_format: 'A single positive double radius.',
    output_format: 'Print the area of the circle formatted to 4 decimal places.',
    constraints: '0.1 <= radius <= 10000.0',
    sample_input: '5.0',
    sample_output: '78.5398',
    explanation: 'Area = Math.PI * 5.0 * 5.0 = 78.539816... Formatted to 4 decimal places is 78.5398.',
    hints: [
      'Use double for radius and area.',
      'Use Math.PI for precision.',
      'System.out.printf("%.4f\\n", area);'
    ],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double r = sc.nextDouble();
        // Calculate circle area
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double r = sc.nextDouble();
        double area = Math.PI * r * r;
        System.out.printf("%.4f\\n", area);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '5.0', expected_output: '78.5398' },
      { input: '1.0', expected_output: '3.1416' },
      { input: '10.5', expected_output: '346.3606' }
    ],
    hidden_tests: [
      { input: '0.5', expected_output: '0.7854' },
      { input: '100.0', expected_output: '31415.9265' },
      { input: '2.5', expected_output: '19.6350' },
      { input: '7.0', expected_output: '153.9380' },
      { input: '50.25', expected_output: '7932.7275' }
    ]
  },
  {
    topicOrder: 2,
    title: 'Convert Celsius to Fahrenheit',
    slug: 'celsius-to-fahrenheit',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Read a double value C representing temperature in Celsius. Convert it into Fahrenheit using formula: F = (C * 9.0 / 5.0) + 32.0. Print the temperature in Fahrenheit formatted to 2 decimal places.',
    input_format: 'A double value representing temperature in Celsius.',
    output_format: 'Print Fahrenheit temperature formatted to 2 decimal places.',
    constraints: '-273.15 <= C <= 1000.0',
    sample_input: '25.0',
    sample_output: '77.00',
    explanation: 'F = (25.0 * 9 / 5) + 32 = 45 + 32 = 77.00.',
    hints: [
      'Be careful with integer division: write 9.0 / 5.0 instead of 9 / 5.',
      'Multiply first then add 32.0.'
    ],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double c = sc.nextDouble();
        // Convert to Fahrenheit
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double c = sc.nextDouble();
        double f = (c * 9.0 / 5.0) + 32.0;
        System.out.printf("%.2f\\n", f);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '25.0', expected_output: '77.00' },
      { input: '0.0', expected_output: '32.00' },
      { input: '100.0', expected_output: '212.00' }
    ],
    hidden_tests: [
      { input: '-40.0', expected_output: '-40.00' },
      { input: '37.0', expected_output: '98.60' },
      { input: '-10.5', expected_output: '13.10' },
      { input: '18.4', expected_output: '65.12' },
      { input: '300.0', expected_output: '572.00' }
    ]
  },
  {
    topicOrder: 2,
    title: 'Calculate Simple Interest',
    slug: 'simple-interest-data-types',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given principal P (double), annual interest rate R (double), and time in years T (double), calculate the Simple Interest using formula: SI = (P * R * T) / 100.0. Print the interest formatted to 2 decimal places.',
    input_format: 'Three double values P, R, T separated by space.',
    output_format: 'Print the simple interest formatted to 2 decimal places.',
    constraints: '1.0 <= P <= 10^7, 0.1 <= R <= 50.0, 0.1 <= T <= 50.0',
    sample_input: '10000 5.5 2',
    sample_output: '1100.00',
    explanation: 'SI = (10000 * 5.5 * 2) / 100 = 1100.00.',
    hints: [
      'Read principal, rate, time as double.',
      'Multiply and divide by 100.0.',
      'Print with System.out.printf("%.2f\\n", si);'
    ],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double p = sc.nextDouble();
        double r = sc.nextDouble();
        double t = sc.nextDouble();
        // Compute and print simple interest
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double p = sc.nextDouble();
        double r = sc.nextDouble();
        double t = sc.nextDouble();
        double si = (p * r * t) / 100.0;
        System.out.printf("%.2f\\n", si);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '10000 5.5 2', expected_output: '1100.00' },
      { input: '5000 7.0 3.5', expected_output: '1225.00' },
      { input: '1200 4.5 1', expected_output: '54.00' }
    ],
    hidden_tests: [
      { input: '25000 8.25 5', expected_output: '10312.50' },
      { input: '1000 10.0 0.5', expected_output: '50.00' },
      { input: '100000 6.0 10', expected_output: '60000.00' },
      { input: '7500.50 5.0 2.5', expected_output: '937.56' },
      { input: '3200 9.75 3', expected_output: '936.00' }
    ]
  },
  {
    topicOrder: 2,
    title: 'Find and Print ASCII Value of a Character',
    slug: 'ascii-value-character',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Read a single character from the input and print its corresponding integer ASCII value.',
    input_format: 'A single non-whitespace character.',
    output_format: 'Print the ASCII integer value.',
    constraints: 'Standard ASCII character (32 <= ASCII <= 126).',
    sample_input: 'A',
    sample_output: '65',
    explanation: 'The character A has ASCII code 65.',
    hints: [
      'Read string using sc.next() and get first character via .charAt(0).',
      'Cast char to int: int ascii = (int) ch;'
    ],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        char ch = sc.next().charAt(0);
        // Print ASCII value
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        char ch = sc.next().charAt(0);
        int ascii = (int) ch;
        System.out.println(ascii);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'A', expected_output: '65' },
      { input: 'a', expected_output: '97' },
      { input: '0', expected_output: '48' }
    ],
    hidden_tests: [
      { input: 'Z', expected_output: '90' },
      { input: 'z', expected_output: '122' },
      { input: '9', expected_output: '57' },
      { input: '$', expected_output: '36' },
      { input: '#', expected_output: '35' },
      { input: '!', expected_output: '33' }
    ]
  },
  {
    topicOrder: 2,
    title: 'Calculate Final Bill with Price, Quantity, Discount, and Tax',
    slug: 'final-bill-price-qty-discount-tax',
    difficulty: 'MEDIUM',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given item unit price (double), quantity (int), discount percentage (double), and tax percentage (double): calculate the subtotal = price * quantity, apply discount = subtotal * (discount / 100.0), then apply tax on discounted amount = discountedAmount * (tax / 100.0). Final Bill = discountedAmount + taxAmount. Print the final bill formatted to 2 decimal places.',
    input_format: 'Four values: price (double), quantity (int), discount (double), tax (double) separated by space.',
    output_format: 'Print the final bill amount formatted to 2 decimal places.',
    constraints: '1.0 <= price <= 10^5, 1 <= quantity <= 1000, 0 <= discount <= 100, 0 <= tax <= 50',
    sample_input: '50.0 4 10.0 5.0',
    sample_output: '189.00',
    explanation: 'Subtotal = 50.0 * 4 = 200.00. Discount (10%) = 20.00 -> After discount = 180.00. Tax (5% of 180) = 9.00. Total = 189.00.',
    hints: [
      'subtotal = price * quantity',
      'discounted = subtotal - (subtotal * discount / 100.0)',
      'finalBill = discounted + (discounted * tax / 100.0)'
    ],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double price = sc.nextDouble();
        int qty = sc.nextInt();
        double discount = sc.nextDouble();
        double tax = sc.nextDouble();
        // Compute and print final bill
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double price = sc.nextDouble();
        int qty = sc.nextInt();
        double discount = sc.nextDouble();
        double tax = sc.nextDouble();
        
        double subtotal = price * qty;
        double discounted = subtotal - (subtotal * (discount / 100.0));
        double finalBill = discounted + (discounted * (tax / 100.0));
        
        System.out.printf("%.2f\\n", finalBill);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '50.0 4 10.0 5.0', expected_output: '189.00' },
      { input: '100.0 1 0.0 18.0', expected_output: '118.00' },
      { input: '25.5 2 20.0 10.0', expected_output: '44.88' }
    ],
    hidden_tests: [
      { input: '10.0 10 0.0 0.0', expected_output: '100.00' },
      { input: '250.0 5 15.0 12.0', expected_output: '1190.00' },
      { input: '15.75 8 5.0 8.0', expected_output: '129.28' },
      { input: '999.99 2 50.0 18.0', expected_output: '1179.99' },
      { input: '80.0 10 25.0 5.0', expected_output: '630.00' }
    ]
  },

  // ==========================================
  // TOPIC 3 — OPERATORS
  // ==========================================
  {
    topicOrder: 3,
    title: 'Check Even or Odd Using Modulus Operator',
    slug: 'check-even-or-odd-modulus',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Read an integer N. Check whether the number is Even or Odd using the modulus operator (%). Print "Even" or "Odd".',
    input_format: 'A single integer N.',
    output_format: 'Print "Even" if N is divisible by 2, otherwise print "Odd".',
    constraints: '-10^9 <= N <= 10^9',
    sample_input: '14',
    sample_output: 'Even',
    explanation: '14 % 2 == 0, so it is Even.',
    hints: ['Check if n % 2 == 0. Notice negative even numbers also satisfy n % 2 == 0.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Print Even or Odd
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n % 2 == 0) {
            System.out.println("Even");
        } else {
            System.out.println("Odd");
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '14', expected_output: 'Even' },
      { input: '7', expected_output: 'Odd' },
      { input: '0', expected_output: 'Even' }
    ],
    hidden_tests: [
      { input: '-8', expected_output: 'Even' },
      { input: '-15', expected_output: 'Odd' },
      { input: '1000000', expected_output: 'Even' },
      { input: '1000001', expected_output: 'Odd' },
      { input: '-1', expected_output: 'Odd' }
    ]
  },
  {
    topicOrder: 3,
    title: 'Find Largest of Two Numbers Using Ternary Operator',
    slug: 'largest-of-two-ternary-operator',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given two integers A and B, determine the larger number using the ternary operator (?:) and print it. If both are equal, print either.',
    input_format: 'Two integers A and B separated by space.',
    output_format: 'Print the largest integer.',
    constraints: '-10^9 <= A, B <= 10^9',
    sample_input: '25 40',
    sample_output: '40',
    explanation: '40 is strictly greater than 25.',
    hints: ['Use: int max = (a >= b) ? a : b;'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        // Use ternary operator to find and print max
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int max = (a >= b) ? a : b;
        System.out.println(max);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '25 40', expected_output: '40' },
      { input: '-10 -5', expected_output: '-5' },
      { input: '100 100', expected_output: '100' }
    ],
    hidden_tests: [
      { input: '0 -50', expected_output: '0' },
      { input: '-999999 100000', expected_output: '100000' },
      { input: '45 12', expected_output: '45' },
      { input: '-1 -1', expected_output: '-1' },
      { input: '789 790', expected_output: '790' }
    ]
  },
  {
    topicOrder: 3,
    title: 'Check Divisibility by 5 and 11',
    slug: 'check-divisibility-5-and-11',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given an integer N, check whether N is divisible by both 5 and 11 using logical operators. Print "YES" if it is divisible by both, otherwise print "NO".',
    input_format: 'A single integer N.',
    output_format: 'Print "YES" or "NO".',
    constraints: '1 <= N <= 10^9',
    sample_input: '55',
    sample_output: 'YES',
    explanation: '55 is divisible by 5 (55 % 5 == 0) and by 11 (55 % 11 == 0). Output is YES.',
    hints: ['Use the logical AND operator (&&): if (n % 5 == 0 && n % 11 == 0)'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Check divisibility by 5 and 11
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n % 5 == 0 && n % 11 == 0) {
            System.out.println("YES");
        } else {
            System.out.println("NO");
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '55', expected_output: 'YES' },
      { input: '110', expected_output: 'YES' },
      { input: '50', expected_output: 'NO' }
    ],
    hidden_tests: [
      { input: '11', expected_output: 'NO' },
      { input: '550', expected_output: 'YES' },
      { input: '12345', expected_output: 'NO' },
      { input: '5500', expected_output: 'YES' },
      { input: '100', expected_output: 'NO' }
    ]
  },
  {
    topicOrder: 3,
    title: 'Check Voting Eligibility Using Relational Operators',
    slug: 'voting-eligibility-relational-operators',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given the age of a person as an integer, determine if they are eligible to vote. A person is eligible if age is 18 or older. Print "Eligible" or "Not Eligible".',
    input_format: 'A single integer representing age.',
    output_format: 'Print "Eligible" if age >= 18, otherwise print "Not Eligible".',
    constraints: '1 <= age <= 120',
    sample_input: '19',
    sample_output: 'Eligible',
    explanation: '19 is greater than or equal to 18, so the person is Eligible.',
    hints: ['Use the greater-than-or-equal-to relational operator: age >= 18.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int age = sc.nextInt();
        // Check eligibility
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int age = sc.nextInt();
        if (age >= 18) {
            System.out.println("Eligible");
        } else {
            System.out.println("Not Eligible");
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '19', expected_output: 'Eligible' },
      { input: '18', expected_output: 'Eligible' },
      { input: '17', expected_output: 'Not Eligible' }
    ],
    hidden_tests: [
      { input: '1', expected_output: 'Not Eligible' },
      { input: '100', expected_output: 'Eligible' },
      { input: '12', expected_output: 'Not Eligible' },
      { input: '25', expected_output: 'Eligible' },
      { input: '50', expected_output: 'Eligible' }
    ]
  },
  {
    topicOrder: 3,
    title: 'Build a Simple Calculator Using Arithmetic Operators',
    slug: 'simple-calculator-arithmetic-operators',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Read two integers A and B, and a character op representing an operator (+, -, *, /). Perform the operation on A and B and print the integer result. For division (/), assume B != 0 and use integer division.',
    input_format: 'Two integers A and B and a character op (+, -, *, /) separated by space.',
    output_format: 'Print the calculated integer result.',
    constraints: '-10^4 <= A, B <= 10^4, B != 0 for division',
    sample_input: '12 4 *',
    sample_output: '48',
    explanation: '12 * 4 = 48.',
    hints: [
      'Read char using sc.next().charAt(0).',
      'Check if op == \'+\', \'-\', \'*\', or \'/\'.'
    ],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        char op = sc.next().charAt(0);
        // Calculate and print result
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        char op = sc.next().charAt(0);
        
        if (op == '+') System.out.println(a + b);
        else if (op == '-') System.out.println(a - b);
        else if (op == '*') System.out.println(a * b);
        else if (op == '/') System.out.println(a / b);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '12 4 *', expected_output: '48' },
      { input: '10 5 +', expected_output: '15' },
      { input: '20 7 /', expected_output: '2' }
    ],
    hidden_tests: [
      { input: '15 25 -', expected_output: '-10' },
      { input: '-10 -5 +', expected_output: '-15' },
      { input: '100 25 /', expected_output: '4' },
      { input: '0 5 *', expected_output: '0' },
      { input: '50 50 -', expected_output: '0' },
      { input: '-6 3 /', expected_output: '-2' }
    ]
  },

  // ==========================================
  // TOPIC 4 — USER INPUT
  // ==========================================
  {
    topicOrder: 4,
    title: 'Sum, Difference, Product, and Quotient of Two Numbers',
    slug: 'sum-diff-product-quotient',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Read two integers A and B from standard input using Scanner. Print their sum, difference (A - B), product (A * B), and quotient (integer division A / B) each on a new line. Assume B != 0.',
    input_format: 'Two integers A and B separated by space.',
    output_format: 'Print 4 lines: Sum, Difference, Product, Quotient.',
    constraints: '-10^4 <= A, B <= 10^4, B != 0',
    sample_input: '20 5',
    sample_output: '25\n15\n100\n4',
    explanation: '20 + 5 = 25, 20 - 5 = 15, 20 * 5 = 100, 20 / 5 = 4.',
    hints: ['Use Scanner to read both numbers and perform standard arithmetic operations.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        // Print sum, diff, product, quotient on separate lines
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        
        System.out.println(a + b);
        System.out.println(a - b);
        System.out.println(a * b);
        System.out.println(a / b);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '20 5', expected_output: '25\n15\n100\n4' },
      { input: '10 2', expected_output: '12\n8\n20\n5' },
      { input: '7 3', expected_output: '10\n4\n21\n2' }
    ],
    hidden_tests: [
      { input: '100 10', expected_output: '110\n90\n1000\n10' },
      { input: '-8 2', expected_output: '-6\n-10\n-16\n-4' },
      { input: '50 5', expected_output: '55\n45\n250\n10' },
      { input: '0 4', expected_output: '4\n-4\n0\n0' },
      { input: '9 9', expected_output: '18\n0\n81\n1' }
    ]
  },
  {
    topicOrder: 4,
    title: '5 Subject Marks Total, Average, and Percentage',
    slug: 'marks-total-average-percentage',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Read 5 subject marks (maximum 100 per subject). Calculate and print the Total, Average, and Percentage. Since each subject is out of 100, Average and Percentage are numerically identical. Print Total as integer, Average with 2 decimal places, and Percentage with 2 decimal places separated by space.',
    input_format: 'Five integers separated by space.',
    output_format: 'Total Average Percentage (e.g. "450 90.00 90.00%")',
    constraints: '0 <= marks <= 100',
    sample_input: '80 90 85 95 100',
    sample_output: '450 90.00 90.00%',
    explanation: 'Total = 450. Average = 450/5 = 90.00. Percentage = 450/500 * 100 = 90.00%.',
    hints: ['Format percentage with %% to escape percentage sign in printf.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read 5 marks
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m1 = sc.nextInt();
        int m2 = sc.nextInt();
        int m3 = sc.nextInt();
        int m4 = sc.nextInt();
        int m5 = sc.nextInt();
        
        int total = m1 + m2 + m3 + m4 + m5;
        double avg = (double) total / 5.0;
        double pct = ((double) total / 500.0) * 100.0;
        
        System.out.printf("%d %.2f %.2f%%\\n", total, avg, pct);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '80 90 85 95 100', expected_output: '450 90.00 90.00%' },
      { input: '50 50 50 50 50', expected_output: '250 50.00 50.00%' },
      { input: '100 100 100 100 100', expected_output: '500 100.00 100.00%' }
    ],
    hidden_tests: [
      { input: '0 0 0 0 0', expected_output: '0 0.00 0.00%' },
      { input: '65 75 85 95 70', expected_output: '390 78.00 78.00%' },
      { input: '40 50 60 70 80', expected_output: '300 60.00 60.00%' },
      { input: '91 92 93 94 95', expected_output: '465 93.00 93.00%' },
      { input: '33 45 67 89 54', expected_output: '288 57.60 57.60%' }
    ]
  },
  {
    topicOrder: 4,
    title: 'Print the Last Digit of a Number',
    slug: 'print-last-digit-of-number',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Read an integer N. Extract and print its last digit. The last digit should always be positive (e.g. last digit of -47 is 7).',
    input_format: 'A single integer N.',
    output_format: 'Print the last digit (0-9).',
    constraints: '-10^9 <= N <= 10^9',
    sample_input: '1234',
    sample_output: '4',
    explanation: 'The last digit of 1234 is 4.',
    hints: ['Use Math.abs(n) % 10.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Print last digit
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int lastDigit = Math.abs(n) % 10;
        System.out.println(lastDigit);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '1234', expected_output: '4' },
      { input: '-47', expected_output: '7' },
      { input: '0', expected_output: '0' }
    ],
    hidden_tests: [
      { input: '9', expected_output: '9' },
      { input: '-9', expected_output: '9' },
      { input: '100', expected_output: '0' },
      { input: '987654321', expected_output: '1' },
      { input: '-1000000008', expected_output: '8' }
    ]
  },
  {
    topicOrder: 4,
    title: 'Area and Circumference of a Circle from User Input',
    slug: 'area-circumference-circle-user-input',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Read radius r (double). Calculate and print the Area and Circumference of the circle separated by a space, formatted to 2 decimal places. Formula: Area = Math.PI * r * r, Circumference = 2 * Math.PI * r.',
    input_format: 'A double radius r.',
    output_format: 'Print "Area Circumference" rounded to 2 decimal places.',
    constraints: '0.1 <= r <= 10000.0',
    sample_input: '7.0',
    sample_output: '153.94 43.98',
    explanation: 'Area = PI * 49 = 153.938..., Circumference = 2 * PI * 7 = 43.982... Rounded to 2 decimal places is 153.94 43.98.',
    hints: ['Use Math.PI for accurate PI value.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double r = sc.nextDouble();
        // Calculate and print area and circumference
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double r = sc.nextDouble();
        double area = Math.PI * r * r;
        double circ = 2.0 * Math.PI * r;
        System.out.printf("%.2f %.2f\\n", area, circ);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '7.0', expected_output: '153.94 43.98' },
      { input: '1.0', expected_output: '3.14 6.28' },
      { input: '10.0', expected_output: '314.16 62.83' }
    ],
    hidden_tests: [
      { input: '2.5', expected_output: '19.63 15.71' },
      { input: '50.0', expected_output: '7853.98 314.16' },
      { input: '0.5', expected_output: '0.79 3.14' },
      { input: '12.34', expected_output: '478.39 77.53' },
      { input: '100.0', expected_output: '31415.93 628.32' }
    ]
  },
  {
    topicOrder: 4,
    title: 'Sum of Digits of a Three-Digit Number',
    slug: 'sum-of-digits-three-digit-number',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Read a positive three-digit integer N (100 to 999). Extract its hundreds, tens, and units digits and print their sum.',
    input_format: 'A positive three-digit integer N.',
    output_format: 'Print the sum of the three digits.',
    constraints: '100 <= N <= 999',
    sample_input: '382',
    sample_output: '13',
    explanation: 'Hundreds = 3, Tens = 8, Units = 2. Sum = 3 + 8 + 2 = 13.',
    hints: [
      'Hundreds = n / 100',
      'Tens = (n / 10) % 10',
      'Units = n % 10'
    ],
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
        int d1 = n / 100;
        int d2 = (n / 10) % 10;
        int d3 = n % 10;
        System.out.println(d1 + d2 + d3);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '382', expected_output: '13' },
      { input: '100', expected_output: '1' },
      { input: '999', expected_output: '27' }
    ],
    hidden_tests: [
      { input: '555', expected_output: '15' },
      { input: '204', expected_output: '6' },
      { input: '482', expected_output: '14' },
      { input: '719', expected_output: '17' },
      { input: '123', expected_output: '6' }
    ]
  },

  // ==========================================
  // TOPIC 5 — TYPE CASTING
  // ==========================================
  {
    topicOrder: 5,
    title: 'Convert Integer to Double Using Widening Casting',
    slug: 'convert-int-to-double-widening',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Read an integer value N. Convert it to double using widening (implicit) casting and print the double value formatted to 2 decimal places.',
    input_format: 'A single integer N.',
    output_format: 'Print the double value formatted to 2 decimal places.',
    constraints: '-10^6 <= N <= 10^6',
    sample_input: '42',
    sample_output: '42.00',
    explanation: 'Converting integer 42 to double produces 42.00.',
    hints: ['double d = n; System.out.printf("%.2f\\n", d);'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Convert to double and print
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        double d = n;
        System.out.printf("%.2f\\n", d);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '42', expected_output: '42.00' },
      { input: '0', expected_output: '0.00' },
      { input: '-15', expected_output: '-15.00' }
    ],
    hidden_tests: [
      { input: '1000', expected_output: '1000.00' },
      { input: '-99999', expected_output: '-99999.00' },
      { input: '1', expected_output: '1.00' },
      { input: '500', expected_output: '500.00' },
      { input: '7', expected_output: '7.00' }
    ]
  },
  {
    topicOrder: 5,
    title: 'Convert Double to Integer and Observe Truncation',
    slug: 'convert-double-to-int-truncation',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Read a double value D. Convert D to an integer using explicit narrowing type casting (int) D and print the resulting integer. Observe how fractional digits are truncated.',
    input_format: 'A single double D.',
    output_format: 'Print the truncated integer value.',
    constraints: '-10^6 <= D <= 10^6',
    sample_input: '45.89',
    sample_output: '45',
    explanation: 'Explicit narrowing casting (int) 45.89 drops .89, resulting in integer 45.',
    hints: ['int res = (int) d;'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double d = sc.nextDouble();
        // Cast to int and print
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double d = sc.nextDouble();
        int res = (int) d;
        System.out.println(res);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '45.89', expected_output: '45' },
      { input: '99.1', expected_output: '99' },
      { input: '-12.75', expected_output: '-12' }
    ],
    hidden_tests: [
      { input: '0.999', expected_output: '0' },
      { input: '-0.5', expected_output: '0' },
      { input: '100.0', expected_output: '100' },
      { input: '5432.1', expected_output: '5432' },
      { input: '-999.99', expected_output: '-999' }
    ]
  },
  {
    topicOrder: 5,
    title: 'Calculate Exact Average of Two Integers Using Type Casting',
    slug: 'exact-average-two-integers-casting',
    difficulty: 'EASY',
    placement_importance: 'IMPORTANT',
    level: 'BEGINNER',
    description: 'Read two integers A and B. Calculate their exact average using type casting to prevent integer division truncation. Print the average formatted to 1 decimal place.',
    input_format: 'Two integers A and B separated by space.',
    output_format: 'Print the average formatted to 1 decimal place.',
    constraints: '-10^6 <= A, B <= 10^6',
    sample_input: '5 6',
    sample_output: '5.5',
    explanation: 'Without type casting, (5 + 6) / 2 would yield integer 5. With casting ((double)(a + b)) / 2.0, the exact average is 5.5.',
    hints: ['Cast the sum to double before dividing by 2: (double)(a + b) / 2.0.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        // Calculate exact average using casting
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        double avg = (double)(a + b) / 2.0;
        System.out.printf("%.1f\\n", avg);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '5 6', expected_output: '5.5' },
      { input: '10 20', expected_output: '15.0' },
      { input: '-3 4', expected_output: '0.5' }
    ],
    hidden_tests: [
      { input: '0 1', expected_output: '0.5' },
      { input: '-5 -6', expected_output: '-5.5' },
      { input: '99 100', expected_output: '99.5' },
      { input: '50 50', expected_output: '50.0' },
      { input: '1000 1001', expected_output: '1000.5' }
    ]
  },
  {
    topicOrder: 5,
    title: 'Convert Character to ASCII Using Type Casting',
    slug: 'char-to-ascii-type-casting',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Read a character from input. Explicitly cast the char variable into an int variable and print the integer ASCII code.',
    input_format: 'A single character.',
    output_format: 'Print the integer ASCII code.',
    constraints: 'Standard ASCII character.',
    sample_input: 'B',
    sample_output: '66',
    explanation: '(int) \'B\' produces 66.',
    hints: ['char ch = sc.next().charAt(0); int code = (int) ch;'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        char ch = sc.next().charAt(0);
        // Cast char to int and print
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        char ch = sc.next().charAt(0);
        int code = (int) ch;
        System.out.println(code);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'B', expected_output: '66' },
      { input: 'b', expected_output: '98' },
      { input: '*', expected_output: '42' }
    ],
    hidden_tests: [
      { input: '@', expected_output: '64' },
      { input: '1', expected_output: '49' },
      { input: 'M', expected_output: '77' },
      { input: 'm', expected_output: '109' },
      { input: '~', expected_output: '126' }
    ]
  },
  {
    topicOrder: 5,
    title: 'Calculate Percentage of 5 Subjects Without Precision Loss',
    slug: 'percentage-five-subjects-casting-precision',
    difficulty: 'EASY',
    placement_importance: 'IMPORTANT',
    level: 'BEGINNER',
    description: 'Read 5 integer marks obtained in 5 subjects out of 100 each (maximum total = 500). Calculate the exact percentage using double type casting to avoid integer truncation. Print the percentage formatted to 2 decimal places with a "%" suffix.',
    input_format: 'Five integers separated by space.',
    output_format: 'Print the percentage formatted to 2 decimal places with a % symbol (e.g., "78.40%").',
    constraints: '0 <= marks <= 100',
    sample_input: '78 82 74 91 88',
    sample_output: '82.60%',
    explanation: 'Total = 413. Percentage = (413.0 / 500.0) * 100.0 = 82.60%.',
    hints: ['double pct = ((double) total / 500.0) * 100.0; System.out.printf("%.2f%%\\n", pct);'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Calculate exact percentage
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m1 = sc.nextInt();
        int m2 = sc.nextInt();
        int m3 = sc.nextInt();
        int m4 = sc.nextInt();
        int m5 = sc.nextInt();
        
        int total = m1 + m2 + m3 + m4 + m5;
        double pct = ((double) total / 500.0) * 100.0;
        System.out.printf("%.2f%%\\n", pct);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '78 82 74 91 88', expected_output: '82.60%' },
      { input: '100 100 100 100 100', expected_output: '100.00%' },
      { input: '0 0 0 0 0', expected_output: '0.00%' }
    ],
    hidden_tests: [
      { input: '50 50 50 50 51', expected_output: '50.20%' },
      { input: '85 92 78 88 95', expected_output: '87.60%' },
      { input: '60 70 80 90 65', expected_output: '73.00%' },
      { input: '45 55 65 75 85', expected_output: '65.00%' },
      { input: '99 98 97 96 95', expected_output: '97.00%' }
    ]
  }
];
