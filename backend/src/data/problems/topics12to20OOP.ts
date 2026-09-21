import { ProblemSeed } from './types';

export const TOPICS_12_TO_20_OOP_PROBLEMS: ProblemSeed[] = [
  // ==========================================
  // TOPIC 12 — METHODS
  // ==========================================
  {
    topicOrder: 12,
    title: 'Method to Check Whether a Number is Prime',
    slug: 'method-check-prime',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Implement a static method `public static boolean isPrime(int n)` that returns true if n is prime and false otherwise. In the main method, read integer N and print "Prime" or "Not Prime".',
    input_format: 'A single integer N.',
    output_format: 'Print "Prime" or "Not Prime".',
    constraints: '-10^6 <= N <= 10^7',
    sample_input: '13',
    sample_output: 'Prime',
    explanation: 'isPrime(13) returns true.',
    hints: ['Define a helper method with boolean return type.'],
    starter_code: `import java.util.Scanner;

public class Main {
    // Implement isPrime method here
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Call isPrime and print
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) return false;
        }
        return true;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (isPrime(n)) System.out.println("Prime");
        else System.out.println("Not Prime");
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '13', expected_output: 'Prime' },
      { input: '1', expected_output: 'Not Prime' },
      { input: '20', expected_output: 'Not Prime' }
    ],
    hidden_tests: [
      { input: '2', expected_output: 'Prime' },
      { input: '-7', expected_output: 'Not Prime' },
      { input: '997', expected_output: 'Prime' }
    ]
  },
  {
    topicOrder: 12,
    title: 'Method to Find Factorial of a Number',
    slug: 'method-find-factorial',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Implement a static method `public static long factorial(int n)` that calculates and returns n!. In the main method, read N and print the returned factorial.',
    input_format: 'A non-negative integer N.',
    output_format: 'Print N! as integer.',
    constraints: '0 <= N <= 20',
    sample_input: '6',
    sample_output: '720',
    explanation: 'factorial(6) = 720.',
    hints: ['Method returns long.'],
    starter_code: `import java.util.Scanner;

public class Main {
    // Implement factorial method
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Call method
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static long factorial(int n) {
        long res = 1;
        for (int i = 1; i <= n; i++) res *= i;
        return res;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(factorial(n));
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '6', expected_output: '720' },
      { input: '0', expected_output: '1' }
    ],
    hidden_tests: [
      { input: '1', expected_output: '1' },
      { input: '10', expected_output: '3628800' },
      { input: '15', expected_output: '1307674368000' }
    ]
  },
  {
    topicOrder: 12,
    title: 'Method to Check String Palindrome',
    slug: 'method-check-string-palindrome',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Implement a method `public static boolean isPalindrome(String s)` that returns true if s is a palindrome and false otherwise. In the main method, read string S and print "YES" or "NO".',
    input_format: 'A string S.',
    output_format: 'Print "YES" or "NO".',
    constraints: '1 <= |S| <= 10^5',
    sample_input: 'radar',
    sample_output: 'YES',
    explanation: '"radar" is a palindrome.',
    hints: ['Compare characters from both ends.'],
    starter_code: `import java.util.Scanner;

public class Main {
    // Implement isPalindrome method
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        // Call isPalindrome and print
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            if (s.charAt(l) != s.charAt(r)) return false;
            l++;
            r--;
        }
        return true;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        if (isPalindrome(s)) System.out.println("YES");
        else System.out.println("NO");
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'radar', expected_output: 'YES' },
      { input: 'coding', expected_output: 'NO' }
    ],
    hidden_tests: [
      { input: 'noon', expected_output: 'YES' },
      { input: 'a', expected_output: 'YES' }
    ]
  },
  {
    topicOrder: 12,
    title: 'Method to Find Largest of Three Numbers',
    slug: 'method-largest-of-three',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Implement a method `public static int findMax(int a, int b, int c)` that returns the largest of three numbers. In the main method, read three numbers and print the result.',
    input_format: 'Three integers separated by space.',
    output_format: 'Print maximum integer.',
    constraints: '-10^9 <= a, b, c <= 10^9',
    sample_input: '15 45 30',
    sample_output: '45',
    explanation: '45 is the largest.',
    hints: ['Math.max(a, Math.max(b, c))'],
    starter_code: `import java.util.Scanner;

public class Main {
    // Implement findMax
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();
        // Call findMax
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static int findMax(int a, int b, int c) {
        return Math.max(a, Math.max(b, c));
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();
        System.out.println(findMax(a, b, c));
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '15 45 30', expected_output: '45' },
      { input: '-1 -5 -2', expected_output: '-1' }
    ],
    hidden_tests: [
      { input: '100 100 100', expected_output: '100' },
      { input: '0 -10 10', expected_output: '10' }
    ]
  },
  {
    topicOrder: 12,
    title: 'Method to Calculate Sum of Digits',
    slug: 'method-sum-of-digits',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Implement a method `public static int getDigitSum(int n)` that returns the sum of digits of n (treating negative numbers as absolute). Print the sum of digits.',
    input_format: 'An integer N.',
    output_format: 'Print digit sum.',
    constraints: '-10^9 <= N <= 10^9',
    sample_input: '987',
    sample_output: '24',
    explanation: '9 + 8 + 7 = 24.',
    hints: ['Use while loop inside getDigitSum.'],
    starter_code: `import java.util.Scanner;

public class Main {
    // Implement getDigitSum
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Call getDigitSum
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static int getDigitSum(int n) {
        long num = Math.abs((long) n);
        int sum = 0;
        while (num > 0) {
            sum += num % 10;
            num /= 10;
        }
        return sum;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(getDigitSum(n));
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '987', expected_output: '24' },
      { input: '0', expected_output: '0' }
    ],
    hidden_tests: [
      { input: '-123', expected_output: '6' },
      { input: '100000000', expected_output: '1' }
    ]
  },

  // ==========================================
  // TOPIC 13 — OOP (CLASSES, OBJECTS, CONSTRUCTORS)
  // ==========================================
  {
    topicOrder: 13,
    title: 'Create Student Class with Fields and Methods',
    slug: 'student-class-fields-methods',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create a class `Student` with fields `int rollNumber` and `String name`. Create a method `void display()` that prints "Roll: <rollNumber>, Name: <name>". In Main, read roll number and name, instantiate a Student object, and call display().',
    input_format: 'An integer rollNumber and string name separated by space.',
    output_format: 'Roll: <rollNumber>, Name: <name>',
    constraints: 'Standard string and integer input.',
    sample_input: '101 Alice',
    sample_output: 'Roll: 101, Name: Alice',
    explanation: 'Student object created and printed.',
    hints: ['class Student { int rollNumber; String name; ... }'],
    starter_code: `import java.util.Scanner;

class Student {
    // Fields and methods
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        String n = sc.next();
        // Instantiate and display
    }
}`,
    reference_solution: `import java.util.Scanner;

class Student {
    int rollNumber;
    String name;
    
    Student(int rollNumber, String name) {
        this.rollNumber = rollNumber;
        this.name = name;
    }
    
    void display() {
        System.out.println("Roll: " + rollNumber + ", Name: " + name);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int r = sc.nextInt();
        String n = sc.next();
        Student s = new Student(r, n);
        s.display();
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '101 Alice', expected_output: 'Roll: 101, Name: Alice' },
      { input: '102 Bob', expected_output: 'Roll: 102, Name: Bob' }
    ],
    hidden_tests: [
      { input: '1 Charlie', expected_output: 'Roll: 1, Name: Charlie' }
    ]
  },
  {
    topicOrder: 13,
    title: 'Demonstrate Default and Parameterized Constructor',
    slug: 'default-and-parameterized-constructor',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create a `Box` class with fields `int width` and `int height`. Provide a default constructor that sets width=10, height=10, and a parameterized constructor `Box(int w, int h)`. In Main, read two integers w and h. Create one Box using default constructor and one using parameterized constructor. Print their areas (width * height) separated by a space.',
    input_format: 'Two integers w and h.',
    output_format: 'Print "DefaultArea ParameterizedArea" separated by space.',
    constraints: '1 <= w, h <= 1000',
    sample_input: '5 6',
    sample_output: '100 30',
    explanation: 'Default box: 10 * 10 = 100. Parameterized box: 5 * 6 = 30.',
    hints: ['Box() { width = 10; height = 10; } Box(int w, int h) { width = w; height = h; }'],
    starter_code: `import java.util.Scanner;

class Box {
    // Constructors and area method
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int w = sc.nextInt();
        int h = sc.nextInt();
        // Create boxes and print areas
    }
}`,
    reference_solution: `import java.util.Scanner;

class Box {
    int width, height;
    Box() {
        this.width = 10;
        this.height = 10;
    }
    Box(int w, int h) {
        this.width = w;
        this.height = h;
    }
    int getArea() {
        return width * height;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int w = sc.nextInt();
        int h = sc.nextInt();
        Box b1 = new Box();
        Box b2 = new Box(w, h);
        System.out.println(b1.getArea() + " " + b2.getArea());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '5 6', expected_output: '100 30' },
      { input: '10 10', expected_output: '100 100' }
    ],
    hidden_tests: [
      { input: '2 8', expected_output: '100 16' }
    ]
  },
  {
    topicOrder: 13,
    title: 'Rectangle Class and Area Calculation Using Constructor',
    slug: 'rectangle-class-area-constructor',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create a `Rectangle` class with constructor `Rectangle(int length, int breadth)` and method `int getArea()`. In Main, read length and breadth, create a Rectangle object, and print the area.',
    input_format: 'Two integers length and breadth.',
    output_format: 'Print the area.',
    constraints: '1 <= length, breadth <= 10^4',
    sample_input: '7 8',
    sample_output: '56',
    explanation: '7 * 8 = 56.',
    hints: ['length * breadth'],
    starter_code: `import java.util.Scanner;

class Rectangle {
    // Implementation
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int l = sc.nextInt(), b = sc.nextInt();
        // Output area
    }
}`,
    reference_solution: `import java.util.Scanner;

class Rectangle {
    int length, breadth;
    Rectangle(int length, int breadth) {
        this.length = length;
        this.breadth = breadth;
    }
    int getArea() {
        return length * breadth;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int l = sc.nextInt(), b = sc.nextInt();
        Rectangle r = new Rectangle(l, b);
        System.out.println(r.getArea());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '7 8', expected_output: '56' },
      { input: '12 5', expected_output: '60' }
    ],
    hidden_tests: [
      { input: '1 1', expected_output: '1' },
      { input: '100 200', expected_output: '20000' }
    ]
  },
  {
    topicOrder: 13,
    title: 'Demonstrate Constructor Overloading',
    slug: 'constructor-overloading-demo',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create a `Product` class with constructor overloading:\n1. `Product(String name)` -> sets price to 0\n2. `Product(String name, int price)` -> sets name and price\nIn Main, read a single integer choice:\nIf choice == 1, read name and print "<name>: 0"\nIf choice == 2, read name and price and print "<name>: <price>".',
    input_format: 'Integer choice followed by parameters.',
    output_format: 'Print "<name>: <price>".',
    constraints: 'choice is 1 or 2.',
    sample_input: '2 Laptop 50000',
    sample_output: 'Laptop: 50000',
    explanation: 'Overloaded constructor with two arguments is invoked.',
    hints: ['Define two constructors with different parameter signatures.'],
    starter_code: `import java.util.Scanner;

class Product {
    // Overloaded constructors
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice = sc.nextInt();
        // Instantiate and print
    }
}`,
    reference_solution: `import java.util.Scanner;

class Product {
    String name;
    int price;
    Product(String name) {
        this.name = name;
        this.price = 0;
    }
    Product(String name, int price) {
        this.name = name;
        this.price = price;
    }
    void display() {
        System.out.println(name + ": " + price);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice = sc.nextInt();
        if (choice == 1) {
            String name = sc.next();
            Product p = new Product(name);
            p.display();
        } else {
            String name = sc.next();
            int price = sc.nextInt();
            Product p = new Product(name, price);
            p.display();
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '2 Laptop 50000', expected_output: 'Laptop: 50000' },
      { input: '1 Mouse', expected_output: 'Mouse: 0' }
    ],
    hidden_tests: [
      { input: '2 Keyboard 1500', expected_output: 'Keyboard: 1500' }
    ]
  },
  {
    topicOrder: 13,
    title: 'Employee Class and Salary Calculation',
    slug: 'employee-class-salary-methods',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create an `Employee` class with constructor `Employee(String id, double basicPay)` and method `double getTotalSalary()` where total salary = basicPay + HRA (20% of basic) + DA (10% of basic). In Main, read employee id and basicPay. Print "ID: <id> Total Salary: %.2f".',
    input_format: 'String id and double basicPay.',
    output_format: 'ID: <id> Total Salary: %.2f',
    constraints: '1000 <= basicPay <= 10^7',
    sample_input: 'EMP01 20000.0',
    sample_output: 'ID: EMP01 Total Salary: 26000.00',
    explanation: 'Basic = 20000, HRA = 4000, DA = 2000, Total = 26000.00.',
    hints: ['totalSalary = basicPay * 1.30;'],
    starter_code: `import java.util.Scanner;

class Employee {
    // Implementation
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Employee logic
    }
}`,
    reference_solution: `import java.util.Scanner;

class Employee {
    String id;
    double basicPay;
    Employee(String id, double basicPay) {
        this.id = id;
        this.basicPay = basicPay;
    }
    double getTotalSalary() {
        return basicPay + (0.20 * basicPay) + (0.10 * basicPay);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String id = sc.next();
        double basic = sc.nextDouble();
        Employee emp = new Employee(id, basic);
        System.out.printf("ID: %s Total Salary: %.2f\\n", emp.id, emp.getTotalSalary());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'EMP01 20000.0', expected_output: 'ID: EMP01 Total Salary: 26000.00' },
      { input: 'EMP02 50000.0', expected_output: 'ID: EMP02 Total Salary: 65000.00' }
    ],
    hidden_tests: [
      { input: 'E100 10000.0', expected_output: 'ID: E100 Total Salary: 13000.00' }
    ]
  },

  // ==========================================
  // TOPIC 14 — THIS & STATIC
  // ==========================================
  {
    topicOrder: 14,
    title: 'Demonstrate this Keyword for Variable Disambiguation',
    slug: 'this-keyword-disambiguation',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create a class `Point` with instance variables `int x` and `int y`. In constructor `Point(int x, int y)`, use `this.x = x;` and `this.y = y;` to distinguish instance variables from constructor parameters. In Main, read x and y, create Point, and print "Point(x, y)".',
    input_format: 'Two integers x and y.',
    output_format: 'Print "Point(x, y)".',
    constraints: '-10^4 <= x, y <= 10^4',
    sample_input: '10 20',
    sample_output: 'Point(10, 20)',
    explanation: 'this.x refers to instance field, x refers to parameter.',
    hints: ['this.x = x; this.y = y;'],
    starter_code: `import java.util.Scanner;

class Point {
    int x, y;
    Point(int x, int y) {
        // Use this
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Point
    }
}`,
    reference_solution: `import java.util.Scanner;

class Point {
    int x, y;
    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
    void display() {
        System.out.println("Point(" + this.x + ", " + this.y + ")");
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt(), y = sc.nextInt();
        Point p = new Point(x, y);
        p.display();
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '10 20', expected_output: 'Point(10, 20)' },
      { input: '-5 15', expected_output: 'Point(-5, 15)' }
    ],
    hidden_tests: [
      { input: '0 0', expected_output: 'Point(0, 0)' }
    ]
  },
  {
    topicOrder: 14,
    title: 'Static Variable to Count Created Objects',
    slug: 'static-variable-count-objects',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create a class `Counter` with a static variable `static int count = 0;`. In its constructor, increment count. In Main, read integer N and create N objects of Counter. Print the final static count.',
    input_format: 'An integer N.',
    output_format: 'Print total created object count.',
    constraints: '1 <= N <= 10^5',
    sample_input: '5',
    sample_output: '5',
    explanation: '5 Counter objects instantiated -> count = 5.',
    hints: ['static int count; Counter() { count++; }'],
    starter_code: `import java.util.Scanner;

class Counter {
    // Static count
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Create N objects
    }
}`,
    reference_solution: `import java.util.Scanner;

class Counter {
    static int count = 0;
    Counter() {
        count++;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            new Counter();
        }
        System.out.println(Counter.count);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '5', expected_output: '5' },
      { input: '1', expected_output: '1' }
    ],
    hidden_tests: [
      { input: '100', expected_output: '100' },
      { input: '0', expected_output: '0' }
    ]
  },
  {
    topicOrder: 14,
    title: 'Static vs Instance Methods',
    slug: 'static-vs-instance-methods',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create a class `MathOps` with a static method `static int cube(int x)` and an instance method `int square(int x)`. In Main, read an integer N. Call `MathOps.cube(N)` directly, instantiate `new MathOps().square(N)`, and print "Cube: <cube>, Square: <square>".',
    input_format: 'An integer N.',
    output_format: 'Cube: <cube>, Square: <square>',
    constraints: '1 <= N <= 1000',
    sample_input: '4',
    sample_output: 'Cube: 64, Square: 16',
    explanation: '4^3 = 64, 4^2 = 16.',
    hints: ['Static method called using class name. Instance method called on object.'],
    starter_code: `import java.util.Scanner;

class MathOps {
    // Methods
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Call static and instance
    }
}`,
    reference_solution: `import java.util.Scanner;

class MathOps {
    static int cube(int x) {
        return x * x * x;
    }
    int square(int x) {
        return x * x;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int c = MathOps.cube(n);
        int s = new MathOps().square(n);
        System.out.println("Cube: " + c + ", Square: " + s);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '4', expected_output: 'Cube: 64, Square: 16' },
      { input: '3', expected_output: 'Cube: 27, Square: 9' }
    ],
    hidden_tests: [
      { input: '1', expected_output: 'Cube: 1, Square: 1' },
      { input: '10', expected_output: 'Cube: 1000, Square: 100' }
    ]
  },
  {
    topicOrder: 14,
    title: 'Use this() to Call Another Constructor (Constructor Chaining)',
    slug: 'constructor-chaining-this',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create a class `Account` with constructor `Account()` that calls `this("Guest", 0.0);` using constructor chaining. A parameterized constructor `Account(String user, double balance)` initializes the fields. In Main, read user choice (1 for default constructor, 2 for parameterized constructor with user & balance). Print "User: <user>, Balance: %.2f".',
    input_format: 'Choice 1 or 2 with optional user and balance.',
    output_format: 'User: <user>, Balance: %.2f',
    constraints: 'Standard input.',
    sample_input: '1',
    sample_output: 'User: Guest, Balance: 0.00',
    explanation: 'Default constructor delegates to parameterized constructor via this("Guest", 0.0).',
    hints: ['this(...) must be the very first statement in the constructor body.'],
    starter_code: `import java.util.Scanner;

class Account {
    // Constructor chaining
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Handle choice
    }
}`,
    reference_solution: `import java.util.Scanner;

class Account {
    String user;
    double balance;
    Account() {
        this("Guest", 0.0);
    }
    Account(String user, double balance) {
        this.user = user;
        this.balance = balance;
    }
    void display() {
        System.out.printf("User: %s, Balance: %.2f\\n", user, balance);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int ch = sc.nextInt();
        if (ch == 1) {
            new Account().display();
        } else {
            String u = sc.next();
            double b = sc.nextDouble();
            new Account(u, b).display();
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '1', expected_output: 'User: Guest, Balance: 0.00' },
      { input: '2 Alice 500.50', expected_output: 'User: Alice, Balance: 500.50' }
    ],
    hidden_tests: [
      { input: '2 Bob 1000.00', expected_output: 'User: Bob, Balance: 1000.00' }
    ]
  },
  {
    topicOrder: 14,
    title: 'Static Method to Calculate Square of a Number',
    slug: 'static-method-calculate-square',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Implement a utility class `Calculator` with a static method `public static long square(int n)`. In Main, read integer N and print `Calculator.square(N)`.',
    input_format: 'An integer N.',
    output_format: 'Print N * N.',
    constraints: '-10^6 <= N <= 10^6',
    sample_input: '9',
    sample_output: '81',
    explanation: '9 * 9 = 81.',
    hints: ['public static long square(int n) { return (long) n * n; }'],
    starter_code: `import java.util.Scanner;

class Calculator {
    // Static square method
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Call square
    }
}`,
    reference_solution: `import java.util.Scanner;

class Calculator {
    public static long square(int n) {
        return (long) n * n;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(Calculator.square(n));
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '9', expected_output: '81' },
      { input: '-12', expected_output: '144' }
    ],
    hidden_tests: [
      { input: '0', expected_output: '0' },
      { input: '1000', expected_output: '1000000' }
    ]
  },

  // ==========================================
  // TOPIC 15 — INHERITANCE
  // ==========================================
  {
    topicOrder: 15,
    title: 'Single Inheritance: Animal -> Dog',
    slug: 'single-inheritance-animal-dog',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create a base class `Animal` with method `void eat()` printing "Animal eats". Create a derived class `Dog` extending `Animal` with method `void bark()` printing "Dog barks". In Main, instantiate a `Dog` object, call `eat()`, then call `bark()`.',
    input_format: 'No input needed (dummy input ignored).',
    output_format: 'Animal eats\nDog barks',
    constraints: 'Standard single inheritance.',
    sample_input: '',
    sample_output: 'Animal eats\nDog barks',
    explanation: 'Dog inherits eat() from Animal and has its own bark() method.',
    hints: ['class Dog extends Animal { ... }'],
    starter_code: `class Animal {
    void eat() { System.out.println("Animal eats"); }
}

class Dog extends Animal {
    // Bark method
}

public class Main {
    public static void main(String[] args) {
        // Create Dog and call eat and bark
    }
}`,
    reference_solution: `class Animal {
    void eat() { System.out.println("Animal eats"); }
}

class Dog extends Animal {
    void bark() { System.out.println("Dog barks"); }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.eat();
        d.bark();
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '', expected_output: 'Animal eats\nDog barks' }
    ],
    hidden_tests: [
      { input: '0', expected_output: 'Animal eats\nDog barks' }
    ]
  },
  {
    topicOrder: 15,
    title: 'Multilevel Inheritance: Vehicle -> Car -> SportsCar',
    slug: 'multilevel-inheritance-vehicle-car-sportscar',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create a 3-level inheritance hierarchy:\n- `Vehicle`: method `void start()` printing "Vehicle starts"\n- `Car` extending `Vehicle`: method `void drive()` printing "Car drives"\n- `SportsCar` extending `Car`: method `void turbo()` printing "SportsCar turbo active"\nIn Main, instantiate `SportsCar` and call `start()`, `drive()`, and `turbo()`.',
    input_format: 'No input needed.',
    output_format: 'Vehicle starts\nCar drives\nSportsCar turbo active',
    constraints: 'Standard multilevel inheritance.',
    sample_input: '',
    sample_output: 'Vehicle starts\nCar drives\nSportsCar turbo active',
    explanation: 'SportsCar inherits methods across two ancestor levels.',
    hints: ['Vehicle -> Car -> SportsCar'],
    starter_code: `// Multilevel inheritance
public class Main {
    public static void main(String[] args) {
        // Instantiate SportsCar
    }
}`,
    reference_solution: `class Vehicle {
    void start() { System.out.println("Vehicle starts"); }
}

class Car extends Vehicle {
    void drive() { System.out.println("Car drives"); }
}

class SportsCar extends Car {
    void turbo() { System.out.println("SportsCar turbo active"); }
}

public class Main {
    public static void main(String[] args) {
        SportsCar sc = new SportsCar();
        sc.start();
        sc.drive();
        sc.turbo();
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '', expected_output: 'Vehicle starts\nCar drives\nSportsCar turbo active' }
    ],
    hidden_tests: [
      { input: '0', expected_output: 'Vehicle starts\nCar drives\nSportsCar turbo active' }
    ]
  },
  {
    topicOrder: 15,
    title: 'Hierarchical Inheritance: Animal -> Dog and Cat',
    slug: 'hierarchical-inheritance-animal-dog-cat',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create base class `Animal` with method `void eat()` printing "Animal eats". Create derived classes `Dog` with `void bark()` printing "Dog barks" and `Cat` with `void meow()` printing "Cat meows". In Main, read a string ("dog" or "cat"). If "dog", create Dog and call eat() then bark(). If "cat", create Cat and call eat() then meow().',
    input_format: 'A string ("dog" or "cat").',
    output_format: 'Two lines of output.',
    constraints: 'Input is "dog" or "cat".',
    sample_input: 'dog',
    sample_output: 'Animal eats\nDog barks',
    explanation: 'Dog inherits eat() from Animal and barks.',
    hints: ['Both Dog and Cat extend Animal.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Hierarchical inheritance
    }
}`,
    reference_solution: `import java.util.Scanner;

class Animal {
    void eat() { System.out.println("Animal eats"); }
}

class Dog extends Animal {
    void bark() { System.out.println("Dog barks"); }
}

class Cat extends Animal {
    void meow() { System.out.println("Cat meows"); }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String pet = sc.next();
        if (pet.equalsIgnoreCase("dog")) {
            Dog d = new Dog();
            d.eat();
            d.bark();
        } else {
            Cat c = new Cat();
            c.eat();
            c.meow();
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'dog', expected_output: 'Animal eats\nDog barks' },
      { input: 'cat', expected_output: 'Animal eats\nCat meows' }
    ],
    hidden_tests: [
      { input: 'DOG', expected_output: 'Animal eats\nDog barks' }
    ]
  },
  {
    topicOrder: 15,
    title: 'Constructor Execution Order in Inheritance',
    slug: 'constructor-execution-order-inheritance',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create class `Parent` whose constructor prints "Parent Constructor". Create class `Child` extending `Parent` whose constructor prints "Child Constructor". In Main, instantiate an object of `Child` and observe constructor execution order.',
    input_format: 'No input needed.',
    output_format: 'Parent Constructor\nChild Constructor',
    constraints: 'Standard constructor chaining.',
    sample_input: '',
    sample_output: 'Parent Constructor\nChild Constructor',
    explanation: 'Parent constructor executes before child constructor.',
    hints: ['new Child(); triggers super() automatically.'],
    starter_code: `class Parent {
    // Constructor
}

class Child extends Parent {
    // Constructor
}

public class Main {
    public static void main(String[] args) {
        new Child();
    }
}`,
    reference_solution: `class Parent {
    Parent() {
        System.out.println("Parent Constructor");
    }
}

class Child extends Parent {
    Child() {
        System.out.println("Child Constructor");
    }
}

public class Main {
    public static void main(String[] args) {
        new Child();
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '', expected_output: 'Parent Constructor\nChild Constructor' }
    ],
    hidden_tests: [
      { input: '0', expected_output: 'Parent Constructor\nChild Constructor' }
    ]
  },
  {
    topicOrder: 15,
    title: 'Access Parent Variables and Methods Using super',
    slug: 'super-keyword-parent-access',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create class `Base` with string variable `String msg = "Base Message"`. Create class `Sub` extending `Base` with `String msg = "Sub Message"`. In `Sub`, write method `void display()` that prints `super.msg` and `this.msg` on two lines. In Main, instantiate Sub and call display().',
    input_format: 'No input needed.',
    output_format: 'Base Message\nSub Message',
    constraints: 'Standard super keyword usage.',
    sample_input: '',
    sample_output: 'Base Message\nSub Message',
    explanation: 'super.msg accesses parent field, this.msg accesses child field.',
    hints: ['Use super.msg and this.msg.'],
    starter_code: `// Use super to access parent variable
public class Main {
    public static void main(String[] args) {
        // Output base and sub message
    }
}`,
    reference_solution: `class Base {
    String msg = "Base Message";
}

class Sub extends Base {
    String msg = "Sub Message";
    void display() {
        System.out.println(super.msg);
        System.out.println(this.msg);
    }
}

public class Main {
    public static void main(String[] args) {
        new Sub().display();
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '', expected_output: 'Base Message\nSub Message' }
    ],
    hidden_tests: [
      { input: '0', expected_output: 'Base Message\nSub Message' }
    ]
  },

  // ==========================================
  // TOPIC 16 — POLYMORPHISM
  // ==========================================
  {
    topicOrder: 16,
    title: 'Method Overloading with Different Parameters',
    slug: 'method-overloading-parameters',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create a class `Calculator` with two overloaded methods `add`:\n1. `int add(int a, int b)`\n2. `int add(int a, int b, int c)`\nIn Main, read an integer count (2 or 3). If 2, read two integers and call 2-argument add. If 3, read three integers and call 3-argument add. Print the result.',
    input_format: 'First integer count (2 or 3), followed by count integers.',
    output_format: 'Print integer sum.',
    constraints: 'count is 2 or 3.',
    sample_input: '2 10 20',
    sample_output: '30',
    explanation: 'Calls add(10, 20) -> 30.',
    hints: ['Overload add method with 2 and 3 parameters.'],
    starter_code: `import java.util.Scanner;

class Calculator {
    // Overloaded add methods
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Call appropriate add
    }
}`,
    reference_solution: `import java.util.Scanner;

class Calculator {
    int add(int a, int b) {
        return a + b;
    }
    int add(int a, int b, int c) {
        return a + b + c;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int count = sc.nextInt();
        Calculator calc = new Calculator();
        if (count == 2) {
            System.out.println(calc.add(sc.nextInt(), sc.nextInt()));
        } else {
            System.out.println(calc.add(sc.nextInt(), sc.nextInt(), sc.nextInt()));
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '2 10 20', expected_output: '30' },
      { input: '3 5 10 15', expected_output: '30' }
    ],
    hidden_tests: [
      { input: '2 -5 5', expected_output: '0' },
      { input: '3 100 200 300', expected_output: '600' }
    ]
  },
  {
    topicOrder: 16,
    title: 'Overloaded Area Methods for Circle, Rectangle, and Square',
    slug: 'overloaded-area-methods',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create an `AreaHelper` class with overloaded `area` methods:\n1. `double area(double r)` -> Circle: Math.PI * r * r\n2. `int area(int l, int b)` -> Rectangle: l * b\n3. `int area(int side)` -> Square: side * side\nIn Main, read choice: 1 (radius double), 2 (l and b int), 3 (side int). Print calculated area (format double with 2 decimal places).',
    input_format: 'Choice (1, 2, or 3) followed by dimensions.',
    output_format: 'Print calculated area.',
    constraints: 'Valid dimensions.',
    sample_input: '2 4 5',
    sample_output: '20',
    explanation: 'Rectangle area: 4 * 5 = 20.',
    hints: ['area(double), area(int, int), area(int).'],
    starter_code: `import java.util.Scanner;

class AreaHelper {
    // Overloaded area methods
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Call area
    }
}`,
    reference_solution: `import java.util.Scanner;

class AreaHelper {
    double area(double r) {
        return Math.PI * r * r;
    }
    int area(int l, int b) {
        return l * b;
    }
    int area(int side) {
        return side * side;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int ch = sc.nextInt();
        AreaHelper ah = new AreaHelper();
        if (ch == 1) {
            double r = sc.nextDouble();
            System.out.printf("%.2f\\n", ah.area(r));
        } else if (ch == 2) {
            int l = sc.nextInt();
            int b = sc.nextInt();
            System.out.println(ah.area(l, b));
        } else {
            int s = sc.nextInt();
            System.out.println(ah.area(s));
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '2 4 5', expected_output: '20' },
      { input: '3 6', expected_output: '36' },
      { input: '1 7.0', expected_output: '153.94' }
    ],
    hidden_tests: [
      { input: '1 1.0', expected_output: '3.14' }
    ]
  },
  {
    topicOrder: 16,
    title: 'Method Overriding Using Animal and Dog',
    slug: 'method-overriding-animal-dog',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create base class `Animal` with method `void makeSound()` printing "Animal sound". Create derived class `Dog` extending `Animal` that overrides `makeSound()` printing "Woof Woof". In Main, instantiate a `Dog` and call `makeSound()`.',
    input_format: 'No input needed.',
    output_format: 'Woof Woof',
    constraints: 'Method overriding with @Override.',
    sample_input: '',
    sample_output: 'Woof Woof',
    explanation: 'Dog overrides the makeSound method of Animal.',
    hints: ['@Override void makeSound() { System.out.println("Woof Woof"); }'],
    starter_code: `class Animal {
    void makeSound() { System.out.println("Animal sound"); }
}

class Dog extends Animal {
    // Override makeSound
}

public class Main {
    public static void main(String[] args) {
        new Dog().makeSound();
    }
}`,
    reference_solution: `class Animal {
    void makeSound() { System.out.println("Animal sound"); }
}

class Dog extends Animal {
    @Override
    void makeSound() { System.out.println("Woof Woof"); }
}

public class Main {
    public static void main(String[] args) {
        Animal a = new Dog();
        a.makeSound();
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '', expected_output: 'Woof Woof' }
    ],
    hidden_tests: [
      { input: '0', expected_output: 'Woof Woof' }
    ]
  },
  {
    topicOrder: 16,
    title: 'Runtime Polymorphism Using Parent Reference',
    slug: 'runtime-polymorphism-parent-reference',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create class `Shape` with method `void draw()` printing "Drawing Shape". Create subclasses `Circle` (draw() prints "Drawing Circle") and `Square` (draw() prints "Drawing Square"). In Main, read choice: 1 for Circle, 2 for Square. Create the object with reference type `Shape s` (e.g. `Shape s = new Circle();`) and call `s.draw()`.',
    input_format: 'An integer choice (1 or 2).',
    output_format: 'Print drawing message.',
    constraints: 'Choice is 1 or 2.',
    sample_input: '1',
    sample_output: 'Drawing Circle',
    explanation: 'Runtime dynamic method dispatch resolves Circle.draw() through Shape reference.',
    hints: ['Shape s; if (ch == 1) s = new Circle(); else s = new Square(); s.draw();'],
    starter_code: `import java.util.Scanner;

class Shape {
    void draw() { System.out.println("Drawing Shape"); }
}

class Circle extends Shape {
    // Override draw
}

class Square extends Shape {
    // Override draw
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Runtime polymorphism
    }
}`,
    reference_solution: `import java.util.Scanner;

class Shape {
    void draw() { System.out.println("Drawing Shape"); }
}

class Circle extends Shape {
    @Override
    void draw() { System.out.println("Drawing Circle"); }
}

class Square extends Shape {
    @Override
    void draw() { System.out.println("Drawing Square"); }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int ch = sc.nextInt();
        Shape s;
        if (ch == 1) s = new Circle();
        else s = new Square();
        s.draw();
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '1', expected_output: 'Drawing Circle' },
      { input: '2', expected_output: 'Drawing Square' }
    ],
    hidden_tests: [
      { input: '1', expected_output: 'Drawing Circle' }
    ]
  },
  {
    topicOrder: 16,
    title: 'Demonstrate Compile-Time and Runtime Polymorphism',
    slug: 'compile-time-runtime-polymorphism-demo',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Demonstrate both types of polymorphism:\n- Compile-time: class `Printer` with overloaded `print(int x)` printing "Integer: <x>" and `print(String s)` printing "String: <s>"\n- Runtime: class `Base` with `info()` overridden by `Derived`\nIn Main, read an integer x and string s. Print compile-time calls, then print derived info.',
    input_format: 'An integer x and string s.',
    output_format: 'Integer: <x>\nString: <s>\nDerived Info',
    constraints: 'Standard input.',
    sample_input: '42 Java',
    sample_output: 'Integer: 42\nString: Java\nDerived Info',
    explanation: 'Printer demonstrates overloading (compile-time) and Base->Derived demonstrates overriding (runtime).',
    hints: ['Show overloaded print and overridden info.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Polymorphism demo
    }
}`,
    reference_solution: `import java.util.Scanner;

class Printer {
    void print(int x) { System.out.println("Integer: " + x); }
    void print(String s) { System.out.println("String: " + s); }
}

class Base {
    void info() { System.out.println("Base Info"); }
}

class Derived extends Base {
    @Override
    void info() { System.out.println("Derived Info"); }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        String s = sc.next();
        Printer p = new Printer();
        p.print(x);
        p.print(s);
        Base b = new Derived();
        b.info();
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '42 Java', expected_output: 'Integer: 42\nString: Java\nDerived Info' }
    ],
    hidden_tests: [
      { input: '100 OOP', expected_output: 'Integer: 100\nString: OOP\nDerived Info' }
    ]
  },

  // ==========================================
  // TOPIC 17 — ABSTRACTION
  // ==========================================
  {
    topicOrder: 17,
    title: 'Abstract Shape with area()',
    slug: 'abstract-shape-area',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create an abstract class `Shape` with abstract method `abstract double calculateArea()`. Create a subclass `Circle` extending Shape with radius r. In Main, read double radius, instantiate Circle, and print area formatted to 2 decimal places.',
    input_format: 'A double radius r.',
    output_format: 'Print area formatted to 2 decimal places.',
    constraints: '0.1 <= r <= 1000.0',
    sample_input: '5.0',
    sample_output: '78.54',
    explanation: 'Math.PI * 25 = 78.54.',
    hints: ['abstract class Shape { abstract double calculateArea(); }'],
    starter_code: `import java.util.Scanner;

abstract class Shape {
    abstract double calculateArea();
}

class Circle extends Shape {
    // Implementation
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double r = sc.nextDouble();
        // Print area
    }
}`,
    reference_solution: `import java.util.Scanner;

abstract class Shape {
    abstract double calculateArea();
}

class Circle extends Shape {
    double r;
    Circle(double r) { this.r = r; }
    @Override
    double calculateArea() {
        return Math.PI * r * r;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double r = sc.nextDouble();
        Shape s = new Circle(r);
        System.out.printf("%.2f\\n", s.calculateArea());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '5.0', expected_output: '78.54' },
      { input: '1.0', expected_output: '3.14' }
    ],
    hidden_tests: [
      { input: '10.0', expected_output: '314.16' }
    ]
  },
  {
    topicOrder: 17,
    title: 'Circle and Rectangle Extending Abstract Shape',
    slug: 'circle-rectangle-extending-shape',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create an abstract class `Shape` with `abstract double area()`. Create `Circle` (field radius) and `Rectangle` (fields length, breadth). In Main, read choice: 1 for Circle (reads radius) or 2 for Rectangle (reads length, breadth). Print area formatted to 2 decimal places.',
    input_format: 'Choice 1 or 2 followed by dimensions.',
    output_format: 'Print area formatted to 2 decimal places.',
    constraints: 'Valid dimensions.',
    sample_input: '2 10.0 4.0',
    sample_output: '40.00',
    explanation: '10.0 * 4.0 = 40.00.',
    hints: ['Use Shape reference pointing to Circle or Rectangle.'],
    starter_code: `import java.util.Scanner;

abstract class Shape {
    abstract double area();
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Shape logic
    }
}`,
    reference_solution: `import java.util.Scanner;

abstract class Shape {
    abstract double area();
}

class Circle extends Shape {
    double r;
    Circle(double r) { this.r = r; }
    double area() { return Math.PI * r * r; }
}

class Rectangle extends Shape {
    double l, b;
    Rectangle(double l, double b) { this.l = l; this.b = b; }
    double area() { return l * b; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int ch = sc.nextInt();
        Shape s;
        if (ch == 1) {
            s = new Circle(sc.nextDouble());
        } else {
            s = new Rectangle(sc.nextDouble(), sc.nextDouble());
        }
        System.out.printf("%.2f\\n", s.area());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '2 10.0 4.0', expected_output: '40.00' },
      { input: '1 7.0', expected_output: '153.94' }
    ],
    hidden_tests: [
      { input: '2 5.5 2.0', expected_output: '11.00' }
    ]
  },
  {
    topicOrder: 17,
    title: 'Abstract and Concrete Methods in Abstract Class',
    slug: 'abstract-concrete-methods-class',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create an abstract class `Appliance` with a concrete method `void plugIn()` printing "Appliance plugged in" and an abstract method `abstract void operate()`. Create subclass `Fan` where operate() prints "Fan is rotating". In Main, instantiate Fan, call plugIn() then operate().',
    input_format: 'No input needed.',
    output_format: 'Appliance plugged in\nFan is rotating',
    constraints: 'Standard abstract class usage.',
    sample_input: '',
    sample_output: 'Appliance plugged in\nFan is rotating',
    explanation: 'Concrete method is inherited, abstract method is implemented.',
    hints: ['Subclass inherits non-abstract methods and implements abstract ones.'],
    starter_code: `abstract class Appliance {
    void plugIn() { System.out.println("Appliance plugged in"); }
    abstract void operate();
}

public class Main {
    public static void main(String[] args) {
        // Appliance demo
    }
}`,
    reference_solution: `abstract class Appliance {
    void plugIn() { System.out.println("Appliance plugged in"); }
    abstract void operate();
}

class Fan extends Appliance {
    @Override
    void operate() {
        System.out.println("Fan is rotating");
    }
}

public class Main {
    public static void main(String[] args) {
        Fan f = new Fan();
        f.plugIn();
        f.operate();
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '', expected_output: 'Appliance plugged in\nFan is rotating' }
    ],
    hidden_tests: [
      { input: '0', expected_output: 'Appliance plugged in\nFan is rotating' }
    ]
  },
  {
    topicOrder: 17,
    title: 'Abstract Vehicle with start() Method',
    slug: 'abstract-vehicle-start-method',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create an abstract class `Vehicle` with abstract method `abstract void start()`. Create subclass `Bike` (prints "Bike starts with kick") and `Car` (prints "Car starts with key"). In Main, read "bike" or "car" and call start() on the appropriate Vehicle.',
    input_format: 'A string ("bike" or "car").',
    output_format: 'Print starting message.',
    constraints: 'Input is "bike" or "car".',
    sample_input: 'bike',
    sample_output: 'Bike starts with kick',
    explanation: 'Bike start method executed.',
    hints: ['Vehicle v; if (input == "bike") v = new Bike();'],
    starter_code: `import java.util.Scanner;

abstract class Vehicle {
    abstract void start();
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Vehicle start
    }
}`,
    reference_solution: `import java.util.Scanner;

abstract class Vehicle {
    abstract void start();
}

class Bike extends Vehicle {
    @Override
    void start() { System.out.println("Bike starts with kick"); }
}

class Car extends Vehicle {
    @Override
    void start() { System.out.println("Car starts with key"); }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        Vehicle v = type.equalsIgnoreCase("bike") ? new Bike() : new Car();
        v.start();
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'bike', expected_output: 'Bike starts with kick' },
      { input: 'car', expected_output: 'Car starts with key' }
    ],
    hidden_tests: [
      { input: 'BIKE', expected_output: 'Bike starts with kick' }
    ]
  },
  {
    topicOrder: 17,
    title: 'Abstract Bank Example with Rate of Interest',
    slug: 'abstract-bank-rate-of-interest',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create an abstract class `Bank` with abstract method `abstract double getRateOfInterest()`. Create subclasses:\n- `SBI`: returns 6.5\n- `HDFC`: returns 7.0\nIn Main, read bank name ("SBI" or "HDFC") and print "Rate: <rate>%".',
    input_format: 'A string ("SBI" or "HDFC").',
    output_format: 'Print "Rate: <rate>%".',
    constraints: 'Input is "SBI" or "HDFC".',
    sample_input: 'SBI',
    sample_output: 'Rate: 6.5%',
    explanation: 'SBI interest rate is 6.5%.',
    hints: ['Bank b = name.equals("SBI") ? new SBI() : new HDFC();'],
    starter_code: `import java.util.Scanner;

abstract class Bank {
    abstract double getRateOfInterest();
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Bank rate
    }
}`,
    reference_solution: `import java.util.Scanner;

abstract class Bank {
    abstract double getRateOfInterest();
}

class SBI extends Bank {
    double getRateOfInterest() { return 6.5; }
}

class HDFC extends Bank {
    double getRateOfInterest() { return 7.0; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        Bank b = name.equalsIgnoreCase("SBI") ? new SBI() : new HDFC();
        System.out.println("Rate: " + b.getRateOfInterest() + "%");
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'SBI', expected_output: 'Rate: 6.5%' },
      { input: 'HDFC', expected_output: 'Rate: 7.0%' }
    ],
    hidden_tests: [
      { input: 'sbi', expected_output: 'Rate: 6.5%' }
    ]
  },

  // ==========================================
  // TOPIC 18 — ENCAPSULATION
  // ==========================================
  {
    topicOrder: 18,
    title: 'Student Class with Private Fields and Getters/Setters',
    slug: 'encapsulated-student-getters-setters',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create a class `Student` with private fields `private int id` and `private String name`. Provide public getters and setters for both. In Main, read id and name, set them using setters, then print them using getters in the format: "ID: <id>, Name: <name>".',
    input_format: 'An integer id and string name separated by space.',
    output_format: 'Print "ID: <id>, Name: <name>".',
    constraints: 'Standard input.',
    sample_input: '101 John',
    sample_output: 'ID: 101, Name: John',
    explanation: 'Private fields accessed solely via getters and setters.',
    hints: ['public int getId() { return id; } public void setId(int id) { this.id = id; }'],
    starter_code: `import java.util.Scanner;

class Student {
    // Private fields and getters/setters
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Student encapsulation
    }
}`,
    reference_solution: `import java.util.Scanner;

class Student {
    private int id;
    private String name;
    
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int id = sc.nextInt();
        String name = sc.next();
        Student s = new Student();
        s.setId(id);
        s.setName(name);
        System.out.println("ID: " + s.getId() + ", Name: " + s.getName());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '101 John', expected_output: 'ID: 101, Name: John' },
      { input: '202 Emma', expected_output: 'ID: 202, Name: Emma' }
    ],
    hidden_tests: [
      { input: '1 Solo', expected_output: 'ID: 1, Name: Solo' }
    ]
  },
  {
    topicOrder: 18,
    title: 'Encapsulated BankAccount Class',
    slug: 'encapsulated-bank-account',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create an encapsulated `BankAccount` class with `private double balance`. Provide method `void deposit(double amount)` and `double getBalance()`. Starting with 0.0 balance, read a deposit amount, deposit it, and print "Balance: %.2f".',
    input_format: 'A double amount.',
    output_format: 'Print "Balance: %.2f".',
    constraints: '0 <= amount <= 10^7',
    sample_input: '1250.75',
    sample_output: 'Balance: 1250.75',
    explanation: 'Deposit added to encapsulated balance.',
    hints: ['balance is private.'],
    starter_code: `import java.util.Scanner;

class BankAccount {
    // Encapsulated balance
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // BankAccount
    }
}`,
    reference_solution: `import java.util.Scanner;

class BankAccount {
    private double balance = 0.0;
    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
    public double getBalance() {
        return balance;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double amt = sc.nextDouble();
        BankAccount acc = new BankAccount();
        acc.deposit(amt);
        System.out.printf("Balance: %.2f\\n", acc.getBalance());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '1250.75', expected_output: 'Balance: 1250.75' },
      { input: '0', expected_output: 'Balance: 0.00' }
    ],
    hidden_tests: [
      { input: '100000', expected_output: 'Balance: 100000.00' }
    ]
  },
  {
    topicOrder: 18,
    title: 'Validate Age and Salary Using Setters',
    slug: 'validate-age-salary-setters',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create an `Employee` class with private `int age` and private `double salary`. The setter `setAge(int age)` should only update age if age >= 18 (otherwise leave age as 0). The setter `setSalary(double salary)` should only update if salary > 0 (otherwise leave salary as 0.0). In Main, read age and salary, apply setters, and print "Age: <age>, Salary: %.2f".',
    input_format: 'An integer age and double salary.',
    output_format: 'Print "Age: <age>, Salary: %.2f".',
    constraints: '-100 <= age <= 200, -10^5 <= salary <= 10^7',
    sample_input: '25 45000.0',
    sample_output: 'Age: 25, Salary: 45000.00',
    explanation: 'Valid age and salary are set.',
    hints: ['Validation inside setters.'],
    starter_code: `import java.util.Scanner;

class Employee {
    // Validating setters
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Employee validation
    }
}`,
    reference_solution: `import java.util.Scanner;

class Employee {
    private int age = 0;
    private double salary = 0.0;
    
    public void setAge(int age) {
        if (age >= 18) this.age = age;
    }
    public int getAge() { return age; }
    
    public void setSalary(double salary) {
        if (salary > 0) this.salary = salary;
    }
    public double getSalary() { return salary; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int age = sc.nextInt();
        double sal = sc.nextDouble();
        Employee emp = new Employee();
        emp.setAge(age);
        emp.setSalary(sal);
        System.out.printf("Age: %d, Salary: %.2f\\n", emp.getAge(), emp.getSalary());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '25 45000.0', expected_output: 'Age: 25, Salary: 45000.00' },
      { input: '15 -500.0', expected_output: 'Age: 0, Salary: 0.00' }
    ],
    hidden_tests: [
      { input: '18 100.0', expected_output: 'Age: 18, Salary: 100.00' },
      { input: '17 2000.0', expected_output: 'Age: 0, Salary: 2000.00' }
    ]
  },
  {
    topicOrder: 18,
    title: 'Prevent Negative Balance in Bank Account',
    slug: 'prevent-negative-balance-encapsulation',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'In an encapsulated `Account` class with private `double balance`, implement `boolean withdraw(double amount)`. If amount <= balance, subtract amount and return true. If amount > balance, reject withdrawal (leave balance unchanged) and return false. In Main, start with balance 1000.00, read withdrawal amount, perform withdrawal, and print "Status: <Approved/Rejected>, Balance: %.2f".',
    input_format: 'A double amount.',
    output_format: 'Status: <Approved/Rejected>, Balance: %.2f',
    constraints: '0 <= amount <= 10^5',
    sample_input: '300.0',
    sample_output: 'Status: Approved, Balance: 700.00',
    explanation: '300.0 <= 1000.0 so approved.',
    hints: ['if (amount <= balance) { balance -= amount; return true; } return false;'],
    starter_code: `import java.util.Scanner;

class Account {
    // Encapsulated balance with withdraw check
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Withdraw logic
    }
}`,
    reference_solution: `import java.util.Scanner;

class Account {
    private double balance = 1000.00;
    public boolean withdraw(double amount) {
        if (amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }
    public double getBalance() { return balance; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double amt = sc.nextDouble();
        Account acc = new Account();
        boolean ok = acc.withdraw(amt);
        System.out.printf("Status: %s, Balance: %.2f\\n", ok ? "Approved" : "Rejected", acc.getBalance());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '300.0', expected_output: 'Status: Approved, Balance: 700.00' },
      { input: '1200.0', expected_output: 'Status: Rejected, Balance: 1000.00' }
    ],
    hidden_tests: [
      { input: '1000.0', expected_output: 'Status: Approved, Balance: 0.00' },
      { input: '0.0', expected_output: 'Status: Approved, Balance: 1000.00' }
    ]
  },
  {
    topicOrder: 18,
    title: 'Demonstrate Data Hiding with Encapsulation',
    slug: 'data-hiding-encapsulation-demo',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create a class `SecretVault` with a private field `private String secretKey`. The key can only be read if the caller provides the correct PIN "9999" via `String getSecret(String pin)`. If correct, return the secretKey; otherwise return "Access Denied". In Main, initialize with secretKey "SUPER_SECRET". Read user PIN and print the returned secret.',
    input_format: 'A string PIN.',
    output_format: 'Print secret key or "Access Denied".',
    constraints: 'PIN is 4 characters.',
    sample_input: '9999',
    sample_output: 'SUPER_SECRET',
    explanation: 'Correct PIN grants access to private data.',
    hints: ['Private data accessed only with security validation.'],
    starter_code: `import java.util.Scanner;

class SecretVault {
    // Private field and gated getter
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String pin = sc.next();
        // Access vault
    }
}`,
    reference_solution: `import java.util.Scanner;

class SecretVault {
    private String secretKey = "SUPER_SECRET";
    public String getSecret(String pin) {
        if ("9999".equals(pin)) return secretKey;
        return "Access Denied";
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String pin = sc.next();
        SecretVault vault = new SecretVault();
        System.out.println(vault.getSecret(pin));
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '9999', expected_output: 'SUPER_SECRET' },
      { input: '1234', expected_output: 'Access Denied' }
    ],
    hidden_tests: [
      { input: '0000', expected_output: 'Access Denied' }
    ]
  },

  // ==========================================
  // TOPIC 19 — INTERFACES
  // ==========================================
  {
    topicOrder: 19,
    title: 'Printable Interface Implementation',
    slug: 'printable-interface-implementation',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create an interface `Printable` with method `void print()`. Create class `Document` implementing `Printable` with field `String text`. Its `print()` method prints "Document: <text>". In Main, read text, instantiate Document through a Printable reference (`Printable p = new Document(text);`), and call `p.print()`.',
    input_format: 'A string text.',
    output_format: 'Print "Document: <text>".',
    constraints: '1 <= |text| <= 100',
    sample_input: 'Resume',
    sample_output: 'Document: Resume',
    explanation: 'Interface Printable implemented by Document.',
    hints: ['interface Printable { void print(); }'],
    starter_code: `import java.util.Scanner;

interface Printable {
    void print();
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Interface implementation
    }
}`,
    reference_solution: `import java.util.Scanner;

interface Printable {
    void print();
}

class Document implements Printable {
    String text;
    Document(String text) { this.text = text; }
    @Override
    public void print() {
        System.out.println("Document: " + text);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String t = sc.next();
        Printable p = new Document(t);
        p.print();
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'Resume', expected_output: 'Document: Resume' },
      { input: 'Report', expected_output: 'Document: Report' }
    ],
    hidden_tests: [
      { input: 'Letter', expected_output: 'Document: Letter' }
    ]
  },
  {
    topicOrder: 19,
    title: 'Multiple Inheritance Using Two Interfaces',
    slug: 'multiple-inheritance-two-interfaces',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Java supports multiple inheritance through interfaces. Create interface `Flyable` with `void fly()` printing "Flying" and interface `Swimmable` with `void swim()` printing "Swimming". Create class `Duck` implementing both. In Main, instantiate Duck and call both methods.',
    input_format: 'No input needed.',
    output_format: 'Flying\nSwimming',
    constraints: 'Standard interface multiple inheritance.',
    sample_input: '',
    sample_output: 'Flying\nSwimming',
    explanation: 'Duck implements both Flyable and Swimmable.',
    hints: ['class Duck implements Flyable, Swimmable'],
    starter_code: `interface Flyable { void fly(); }
interface Swimmable { void swim(); }

public class Main {
    public static void main(String[] args) {
        // Implement Duck
    }
}`,
    reference_solution: `interface Flyable { void fly(); }
interface Swimmable { void swim(); }

class Duck implements Flyable, Swimmable {
    public void fly() { System.out.println("Flying"); }
    public void swim() { System.out.println("Swimming"); }
}

public class Main {
    public static void main(String[] args) {
        Duck d = new Duck();
        d.fly();
        d.swim();
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '', expected_output: 'Flying\nSwimming' }
    ],
    hidden_tests: [
      { input: '0', expected_output: 'Flying\nSwimming' }
    ]
  },
  {
    topicOrder: 19,
    title: 'Animal Interface with sound() Method',
    slug: 'animal-interface-sound-method',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create interface `Animal` with method `void sound()`. Create classes `Dog` (prints "Bark") and `Cat` (prints "Meow") implementing `Animal`. In Main, read "dog" or "cat", assign to `Animal a`, and call `a.sound()`.',
    input_format: 'String "dog" or "cat".',
    output_format: 'Print sound.',
    constraints: 'Input is "dog" or "cat".',
    sample_input: 'dog',
    sample_output: 'Bark',
    explanation: 'Dog implements Animal interface.',
    hints: ['Animal a = pet.equalsIgnoreCase("dog") ? new Dog() : new Cat();'],
    starter_code: `import java.util.Scanner;

interface Animal {
    void sound();
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Interface sound
    }
}`,
    reference_solution: `import java.util.Scanner;

interface Animal {
    void sound();
}

class Dog implements Animal {
    public void sound() { System.out.println("Bark"); }
}

class Cat implements Animal {
    public void sound() { System.out.println("Meow"); }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        Animal a = s.equalsIgnoreCase("dog") ? new Dog() : new Cat();
        a.sound();
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'dog', expected_output: 'Bark' },
      { input: 'cat', expected_output: 'Meow' }
    ],
    hidden_tests: [
      { input: 'DOG', expected_output: 'Bark' }
    ]
  },
  {
    topicOrder: 19,
    title: 'Payment Interface with UPI and CreditCard',
    slug: 'payment-interface-upi-creditcard',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Create interface `Payment` with method `void pay(double amount)`. Create classes:\n- `UPI`: prints "Paid %.2f using UPI"\n- `CreditCard`: prints "Paid %.2f using Credit Card"\nIn Main, read payment type ("UPI" or "CARD") and amount. Process payment through the Payment interface.',
    input_format: 'Type ("UPI" or "CARD") and double amount.',
    output_format: 'Paid %.2f using <Method>',
    constraints: 'Valid amount.',
    sample_input: 'UPI 450.00',
    sample_output: 'Paid 450.00 using UPI',
    explanation: 'UPI implementation of Payment interface invoked.',
    hints: ['Payment p = type.equals("UPI") ? new UPI() : new CreditCard(); p.pay(amount);'],
    starter_code: `import java.util.Scanner;

interface Payment {
    void pay(double amount);
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Process payment
    }
}`,
    reference_solution: `import java.util.Scanner;

interface Payment {
    void pay(double amount);
}

class UPI implements Payment {
    public void pay(double amount) {
        System.out.printf("Paid %.2f using UPI\\n", amount);
    }
}

class CreditCard implements Payment {
    public void pay(double amount) {
        System.out.printf("Paid %.2f using Credit Card\\n", amount);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        double amt = sc.nextDouble();
        Payment p = type.equalsIgnoreCase("UPI") ? new UPI() : new CreditCard();
        p.pay(amt);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'UPI 450.00', expected_output: 'Paid 450.00 using UPI' },
      { input: 'CARD 1200.50', expected_output: 'Paid 1200.50 using Credit Card' }
    ],
    hidden_tests: [
      { input: 'upi 100.00', expected_output: 'Paid 100.00 using UPI' }
    ]
  },
  {
    topicOrder: 19,
    title: 'Default and Static Interface Methods (Java 8+)',
    slug: 'default-static-interface-methods',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Demonstrate Java 8 interface capabilities. Create interface `Greeter` with:\n- a static method `static void info()` that prints "Greeter v1.0"\n- a default method `default void greet(String name)` that prints "Hello, <name>!"\nCreate class `UserGreeting` implementing `Greeter`. In Main, read a name, call `Greeter.info()`, then call `greet(name)` on an instance of UserGreeting.',
    input_format: 'A string name.',
    output_format: 'Greeter v1.0\nHello, <name>!',
    constraints: 'Standard string.',
    sample_input: 'Antigravity',
    sample_output: 'Greeter v1.0\nHello, Antigravity!',
    explanation: 'Static interface method called on interface; default method called on implementing instance.',
    hints: ['Greeter.info(); new UserGreeting().greet(name);'],
    starter_code: `import java.util.Scanner;

interface Greeter {
    // Static and default methods
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        // Call methods
    }
}`,
    reference_solution: `import java.util.Scanner;

interface Greeter {
    static void info() {
        System.out.println("Greeter v1.0");
    }
    default void greet(String name) {
        System.out.println("Hello, " + name + "!");
    }
}

class UserGreeting implements Greeter {}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        Greeter.info();
        new UserGreeting().greet(name);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'Antigravity', expected_output: 'Greeter v1.0\nHello, Antigravity!' },
      { input: 'Developer', expected_output: 'Greeter v1.0\nHello, Developer!' }
    ],
    hidden_tests: [
      { input: 'Java', expected_output: 'Greeter v1.0\nHello, Java!' }
    ]
  },

  // ==========================================
  // TOPIC 20 — PACKAGES
  // ==========================================
  {
    topicOrder: 20,
    title: 'Create and Access User-Defined Package Class Structure',
    slug: 'packages-class-access',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'In Java, packages provide modular namespaces. In this online judge problem, demonstrate packaging and access specifier rules by creating a helper class `MessageHelper` with public static method `public static String getMessage(String topic)` that returns "Topic: " + topic. In Main, read a topic name and print `MessageHelper.getMessage(topic)`.',
    input_format: 'A string topic.',
    output_format: 'Print "Topic: <topic>".',
    constraints: 'Standard string.',
    sample_input: 'JavaPackages',
    sample_output: 'Topic: JavaPackages',
    explanation: 'Modular class access simulates packaged class interaction in single-file compilable judge environment.',
    hints: ['public static String getMessage(String topic) { return "Topic: " + topic; }'],
    starter_code: `import java.util.Scanner;

class MessageHelper {
    public static String getMessage(String topic) {
        return "Topic: " + topic;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String topic = sc.next();
        System.out.println(MessageHelper.getMessage(topic));
    }
}`,
    reference_solution: `import java.util.Scanner;

class MessageHelper {
    public static String getMessage(String topic) {
        return "Topic: " + topic;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String topic = sc.next();
        System.out.println(MessageHelper.getMessage(topic));
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'JavaPackages', expected_output: 'Topic: JavaPackages' },
      { input: 'Modules', expected_output: 'Topic: Modules' }
    ],
    hidden_tests: [
      { input: 'PlacementPractice', expected_output: 'Topic: PlacementPractice' }
    ]
  }
];
