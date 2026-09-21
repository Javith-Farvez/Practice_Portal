import { ProblemSeed } from './types';

export const TOPIC_11_STRINGS_PROBLEMS: ProblemSeed[] = [
  // ==========================================
  // PART A — STRINGS
  // ==========================================
  {
    topicOrder: 11,
    title: 'Reverse a String Without Built-in Methods',
    slug: 'reverse-string-no-builtin',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given a string S, reverse the string without using built-in reverse methods (such as StringBuilder.reverse()). Print the reversed string.',
    input_format: 'A single string S (may contain letters, digits, and symbols without spaces).',
    output_format: 'Print the reversed string.',
    constraints: '1 <= |S| <= 10^5',
    sample_input: 'hello',
    sample_output: 'olleh',
    explanation: 'Characters in reverse order: o, l, l, e, h.',
    hints: ['Loop from S.length() - 1 down to 0 and append to char array or StringBuilder.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        // Reverse string
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        char[] chars = s.toCharArray();
        int l = 0, r = chars.length - 1;
        while (l < r) {
            char t = chars[l];
            chars[l] = chars[r];
            chars[r] = t;
            l++;
            r--;
        }
        System.out.println(new String(chars));
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'hello', expected_output: 'olleh' },
      { input: 'Java', expected_output: 'avaJ' },
      { input: 'a', expected_output: 'a' }
    ],
    hidden_tests: [
      { input: 'racecar', expected_output: 'racecar' },
      { input: '123456789', expected_output: '987654321' },
      { input: 'PlacementPortal', expected_output: 'latroPtnemecalP' }
    ]
  },
  {
    topicOrder: 11,
    title: 'Check Whether a String is a Palindrome',
    slug: 'check-string-palindrome',
    difficulty: 'EASY',
    placement_importance: 'VERY_IMPORTANT',
    level: 'BEGINNER',
    description: 'Given a string S, check whether it is a Palindrome (reads same forward and backward). Case-sensitive comparison. Print "Palindrome" or "Not Palindrome".',
    input_format: 'A single string S without whitespace.',
    output_format: 'Print "Palindrome" or "Not Palindrome".',
    constraints: '1 <= |S| <= 10^5',
    sample_input: 'madam',
    sample_output: 'Palindrome',
    explanation: 'madam reads the same forward and backward.',
    hints: ['Compare charAt(i) with charAt(len - 1 - i).'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        // Check palindrome
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int l = 0, r = s.length() - 1;
        boolean pal = true;
        while (l < r) {
            if (s.charAt(l) != s.charAt(r)) {
                pal = false;
                break;
            }
            l++;
            r--;
        }
        if (pal) System.out.println("Palindrome");
        else System.out.println("Not Palindrome");
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'madam', expected_output: 'Palindrome' },
      { input: 'Madam', expected_output: 'Not Palindrome' },
      { input: 'hello', expected_output: 'Not Palindrome' }
    ],
    hidden_tests: [
      { input: 'a', expected_output: 'Palindrome' },
      { input: 'abccba', expected_output: 'Palindrome' },
      { input: 'abcdecba', expected_output: 'Not Palindrome' }
    ]
  },
  {
    topicOrder: 11,
    title: 'Count Vowels, Consonants, Digits, and Spaces',
    slug: 'count-vowels-consonants-digits-spaces',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given a line of text S, count the number of vowels (A, E, I, O, U case-insensitive), consonants (alphabetical characters that are not vowels), digits (0-9), and space characters. Print "Vowels: V Consonants: C Digits: D Spaces: S".',
    input_format: 'A line of text S (can include spaces).',
    output_format: 'Print "Vowels: V Consonants: C Digits: D Spaces: S".',
    constraints: '1 <= |S| <= 10^5',
    sample_input: 'Java 2026 is awesome!',
    sample_output: 'Vowels: 7 Consonants: 7 Digits: 4 Spaces: 3',
    explanation: 'Vowels: a, a, i, a, e, o, e (7). Consonants: J, v, s, w, s, m, ! is symbol not consonant (7). Digits: 2, 0, 2, 6 (4). Spaces: 3.',
    hints: ['Check Character.isLetter(ch) for alphabets. Check vowel set.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        // Count categories
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String s = sc.nextLine();
        int v = 0, c = 0, d = 0, sp = 0;
        String vowels = "aeiouAEIOU";
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            if (vowels.indexOf(ch) != -1) {
                v++;
            } else if (Character.isLetter(ch)) {
                c++;
            } else if (Character.isDigit(ch)) {
                d++;
            } else if (ch == ' ') {
                sp++;
            }
        }
        System.out.println("Vowels: " + v + " Consonants: " + c + " Digits: " + d + " Spaces: " + sp);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'Java 2026 is awesome!', expected_output: 'Vowels: 7 Consonants: 7 Digits: 4 Spaces: 3' },
      { input: 'Hello World', expected_output: 'Vowels: 3 Consonants: 7 Digits: 0 Spaces: 1' }
    ],
    hidden_tests: [
      { input: '12345', expected_output: 'Vowels: 0 Consonants: 0 Digits: 5 Spaces: 0' },
      { input: 'aeiou', expected_output: 'Vowels: 5 Consonants: 0 Digits: 0 Spaces: 0' },
      { input: 'bcdfgh', expected_output: 'Vowels: 0 Consonants: 6 Digits: 0 Spaces: 0' }
    ]
  },
  {
    topicOrder: 11,
    title: 'Find String Length Without Using length()',
    slug: 'string-length-without-length-method',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given a string S, determine its length without calling S.length(). Print the length.',
    input_format: 'A single string S without whitespace.',
    output_format: 'Print integer length.',
    constraints: '1 <= |S| <= 10^5',
    sample_input: 'Algorithms',
    sample_output: '10',
    explanation: 'Count characters by converting toCharArray() or catching IndexOutOfBoundsException.',
    hints: ['char[] arr = s.toCharArray(); count elements in a for-each loop.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        // Calculate length
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int count = 0;
        for (char ch : s.toCharArray()) {
            count++;
        }
        System.out.println(count);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'Algorithms', expected_output: '10' },
      { input: 'Java', expected_output: '4' }
    ],
    hidden_tests: [
      { input: 'a', expected_output: '1' },
      { input: 'abcdefghijklmnopqrstuvwxyz', expected_output: '26' }
    ]
  },
  {
    topicOrder: 11,
    title: 'Convert Lowercase to Uppercase Without toUpperCase()',
    slug: 'lowercase-to-uppercase-without-builtin',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given a string S, convert all lowercase English letters (a-z) to uppercase (A-Z) without using built-in toUpperCase() method. Non-lowercase characters remain unchanged.',
    input_format: 'A single string S.',
    output_format: 'Print transformed uppercase string.',
    constraints: '1 <= |S| <= 10^5',
    sample_input: 'java123',
    sample_output: 'JAVA123',
    explanation: 'Subtract 32 from ASCII code if ch >= \'a\' && ch <= \'z\'.',
    hints: ['(char)(ch - \'a\' + \'A\') or (char)(ch - 32).'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        // Convert to uppercase
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        char[] chars = s.toCharArray();
        for (int i = 0; i < chars.length; i++) {
            if (chars[i] >= 'a' && chars[i] <= 'z') {
                chars[i] = (char)(chars[i] - 32);
            }
        }
        System.out.println(new String(chars));
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'java123', expected_output: 'JAVA123' },
      { input: 'Hello_World', expected_output: 'HELLO_WORLD' }
    ],
    hidden_tests: [
      { input: 'ALREADY_UPPER', expected_output: 'ALREADY_UPPER' },
      { input: 'xyz', expected_output: 'XYZ' }
    ]
  },
  {
    topicOrder: 11,
    title: 'Check Whether Two Strings Are Anagrams',
    slug: 'check-valid-anagram',
    difficulty: 'EASY',
    placement_importance: 'VERY_IMPORTANT',
    level: 'BEGINNER',
    description: 'Two strings are anagrams if they contain the exact same characters with the exact same frequencies, ignoring character order. Given two strings S1 and S2 (lowercase English letters only), print "Anagram" or "Not Anagram".',
    input_format: 'Two strings S1 and S2 separated by space.',
    output_format: 'Print "Anagram" or "Not Anagram".',
    constraints: '1 <= |S1|, |S2| <= 10^5',
    sample_input: 'listen silent',
    sample_output: 'Anagram',
    explanation: '"listen" and "silent" contain same letters.',
    hints: ['Count frequency of each of 26 characters.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s1 = sc.next();
        String s2 = sc.next();
        // Check anagram
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s1 = sc.next();
        String s2 = sc.next();
        if (s1.length() != s2.length()) {
            System.out.println("Not Anagram");
            return;
        }
        int[] freq = new int[26];
        for (int i = 0; i < s1.length(); i++) {
            freq[s1.charAt(i) - 'a']++;
            freq[s2.charAt(i) - 'a']--;
        }
        boolean isAnagram = true;
        for (int c : freq) {
            if (c != 0) {
                isAnagram = false;
                break;
            }
        }
        if (isAnagram) System.out.println("Anagram");
        else System.out.println("Not Anagram");
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'listen silent', expected_output: 'Anagram' },
      { input: 'hello world', expected_output: 'Not Anagram' },
      { input: 'anagram nagaram', expected_output: 'Anagram' }
    ],
    hidden_tests: [
      { input: 'rat car', expected_output: 'Not Anagram' },
      { input: 'a a', expected_output: 'Anagram' },
      { input: 'ab ba', expected_output: 'Anagram' }
    ]
  },
  {
    topicOrder: 11,
    title: 'Find Frequency of Each Character in a String',
    slug: 'frequency-of-characters-string',
    difficulty: 'EASY',
    placement_importance: 'VERY_IMPORTANT',
    level: 'BEGINNER',
    description: 'Given a string S of lowercase English letters, find the frequency of each distinct character and print in alphabetical order: char: count on separate lines.',
    input_format: 'A single string S.',
    output_format: 'Print "char: count" for each present character in ascending order.',
    constraints: '1 <= |S| <= 10^5',
    sample_input: 'success',
    sample_output: 'c: 2\ne: 1\ns: 3\nu: 1',
    explanation: 'c appears 2 times, e 1 time, s 3 times, u 1 time.',
    hints: ['int[] count = new int[26]; count[s.charAt(i) - \'a\']++;'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        // Print character frequencies
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int[] freq = new int[26];
        for (int i = 0; i < s.length(); i++) {
            freq[s.charAt(i) - 'a']++;
        }
        for (int i = 0; i < 26; i++) {
            if (freq[i] > 0) {
                System.out.println((char)(i + 'a') + ": " + freq[i]);
            }
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'success', expected_output: 'c: 2\ne: 1\ns: 3\nu: 1' },
      { input: 'banana', expected_output: 'a: 3\nb: 1\nn: 2' }
    ],
    hidden_tests: [
      { input: 'z', expected_output: 'z: 1' },
      { input: 'mississippi', expected_output: 'i: 4\nm: 1\np: 2\ns: 4' }
    ]
  },
  {
    topicOrder: 11,
    title: 'Find First Non-Repeating Character in a String',
    slug: 'first-non-repeating-character',
    difficulty: 'EASY',
    placement_importance: 'VERY_IMPORTANT',
    level: 'BEGINNER',
    description: 'Given a string S of lowercase English letters, find and print the first non-repeating character. If all characters repeat, print "$".',
    input_format: 'A single string S.',
    output_format: 'Print the first non-repeating character or "$".',
    constraints: '1 <= |S| <= 10^5',
    sample_input: 'swiss',
    sample_output: 'w',
    hints: ['Count frequencies in array of size 26. Then loop through S to find first with frequency 1.'],
    explanation: 'Character w is the first character with count 1.',
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        // First non-repeating
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int[] freq = new int[26];
        for (int i = 0; i < s.length(); i++) {
            freq[s.charAt(i) - 'a']++;
        }
        char found = '$';
        for (int i = 0; i < s.length(); i++) {
            if (freq[s.charAt(i) - 'a'] == 1) {
                found = s.charAt(i);
                break;
            }
        }
        System.out.println(found);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'swiss', expected_output: 'w' },
      { input: 'aabb', expected_output: '$' },
      { input: 'leetcode', expected_output: 'l' }
    ],
    hidden_tests: [
      { input: 'loveleetcode', expected_output: 'v' },
      { input: 'z', expected_output: 'z' }
    ]
  },
  {
    topicOrder: 11,
    title: 'Remove Duplicate Characters from a String',
    slug: 'remove-duplicate-characters-string',
    difficulty: 'MEDIUM',
    placement_importance: 'IMPORTANT',
    level: 'INTERMEDIATE',
    description: 'Given a string S, remove all duplicate characters, keeping only their first occurrence while preserving the original order. Print the modified string.',
    input_format: 'A single string S.',
    output_format: 'Print the string with duplicates removed.',
    constraints: '1 <= |S| <= 10^5',
    sample_input: 'programming',
    sample_output: 'progamin',
    explanation: 'Subsequent occurrences of r, g, m are skipped.',
    hints: ['Use boolean[] seen = new boolean[256];'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        // Remove duplicates
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        boolean[] seen = new boolean[256];
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            if (!seen[ch]) {
                seen[ch] = true;
                sb.append(ch);
            }
        }
        System.out.println(sb.toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'programming', expected_output: 'progamin' },
      { input: 'aaaaa', expected_output: 'a' },
      { input: 'abcd', expected_output: 'abcd' }
    ],
    hidden_tests: [
      { input: 'banana', expected_output: 'ban' },
      { input: 'Mississippi', expected_output: 'Misp' }
    ]
  },
  {
    topicOrder: 11,
    title: 'Reverse Each Word While Preserving Word Order',
    slug: 'reverse-each-word-in-sentence',
    difficulty: 'MEDIUM',
    placement_importance: 'IMPORTANT',
    level: 'INTERMEDIATE',
    description: 'Given a sentence S containing words separated by single spaces, reverse the characters of each individual word while preserving the order of the words.',
    input_format: 'A single line containing words separated by space.',
    output_format: 'Print the sentence with each word reversed.',
    constraints: '1 <= |S| <= 10^5',
    sample_input: 'hello world java',
    sample_output: 'olleh dlrow avaj',
    explanation: 'hello -> olleh, world -> dlrow, java -> avaj.',
    hints: ['Split by " ", reverse each token using StringBuilder.reverse().'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        // Reverse each word
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String line = sc.nextLine();
        String[] words = line.split(" ");
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < words.length; i++) {
            if (i > 0) sb.append(" ");
            sb.append(new StringBuilder(words[i]).reverse().toString());
        }
        System.out.println(sb.toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'hello world java', expected_output: 'olleh dlrow avaj' },
      { input: 'Placement Portal', expected_output: 'tnemecalP latroP' }
    ],
    hidden_tests: [
      { input: 'a b c', expected_output: 'a b c' },
      { input: 'Algorithms', expected_output: 'smhtiroglA' }
    ]
  },
  {
    topicOrder: 11,
    title: 'Find the Longest Word in a Sentence',
    slug: 'longest-word-in-sentence',
    difficulty: 'MEDIUM',
    placement_importance: 'IMPORTANT',
    level: 'INTERMEDIATE',
    description: 'Given a sentence S with words separated by spaces, find and print the longest word. If multiple words have the same maximum length, print the first one encountered.',
    input_format: 'A single line containing space-separated words.',
    output_format: 'Print the longest word.',
    constraints: '1 <= |S| <= 10^5',
    sample_input: 'I love learning Java programming',
    sample_output: 'programming',
    explanation: '"programming" has length 11, which is the longest.',
    hints: ['Split words by space and track max word by length.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine();
        // Longest word
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String line = sc.nextLine();
        String[] words = line.split("\\\\s+");
        String longest = "";
        for (String w : words) {
            if (w.length() > longest.length()) {
                longest = w;
            }
        }
        System.out.println(longest);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'I love learning Java programming', expected_output: 'programming' },
      { input: 'Placement Practice Portal', expected_output: 'Placement' }
    ],
    hidden_tests: [
      { input: 'One two three', expected_output: 'three' },
      { input: 'Solo', expected_output: 'Solo' }
    ]
  },
  {
    topicOrder: 11,
    title: 'Count Number of Words in a Sentence',
    slug: 'count-words-sentence',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given a line of text, count and print the total number of words separated by spaces.',
    input_format: 'A line of text.',
    output_format: 'Print word count.',
    constraints: '1 <= |S| <= 10^5',
    sample_input: 'Java is very popular in industry',
    sample_output: '6',
    explanation: 'Sentence contains 6 words.',
    hints: ['Split by "\\\\s+" and filter empty tokens.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        // Count words
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String line = sc.nextLine().trim();
        if (line.isEmpty()) {
            System.out.println(0);
            return;
        }
        String[] words = line.split("\\\\s+");
        System.out.println(words.length);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'Java is very popular in industry', expected_output: '6' },
      { input: 'Hello', expected_output: '1' }
    ],
    hidden_tests: [
      { input: '  Multiple   spaces   between  ', expected_output: '3' },
      { input: 'A B C D E', expected_output: '5' }
    ]
  },
  {
    topicOrder: 11,
    title: 'Check Whether One String is a Rotation of Another',
    slug: 'check-string-rotation',
    difficulty: 'MEDIUM',
    placement_importance: 'IMPORTANT',
    level: 'INTERMEDIATE',
    description: 'Given two strings S1 and S2 of equal length, check whether S2 is a rotation of S1 (e.g. "waterbottle" rotated is "erbottlewat"). Print "Rotation" or "Not Rotation".',
    input_format: 'Two strings S1 and S2 separated by space.',
    output_format: 'Print "Rotation" or "Not Rotation".',
    constraints: '1 <= |S1|, |S2| <= 10^5',
    sample_input: 'waterbottle erbottlewat',
    sample_output: 'Rotation',
    explanation: '"erbottlewat" is a valid rotation of "waterbottle".',
    hints: ['Check if (S1 + S1).contains(S2) and lengths are equal.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s1 = sc.next();
        String s2 = sc.next();
        // Check rotation
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s1 = sc.next();
        String s2 = sc.next();
        if (s1.length() == s2.length() && (s1 + s1).contains(s2)) {
            System.out.println("Rotation");
        } else {
            System.out.println("Not Rotation");
        }
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'waterbottle erbottlewat', expected_output: 'Rotation' },
      { input: 'hello world', expected_output: 'Not Rotation' }
    ],
    hidden_tests: [
      { input: 'abc bca', expected_output: 'Rotation' },
      { input: 'abcd dacb', expected_output: 'Not Rotation' }
    ]
  },
  {
    topicOrder: 11,
    title: 'Find Longest Common Prefix in an Array of Strings',
    slug: 'longest-common-prefix',
    difficulty: 'MEDIUM',
    placement_importance: 'IMPORTANT',
    level: 'INTERMEDIATE',
    description: 'Given N strings, find the longest common prefix string among them. If there is no common prefix, print "".',
    input_format: 'First line: N. Following N lines: one string each.',
    output_format: 'Print the longest common prefix string.',
    constraints: '1 <= N <= 1000',
    sample_input: '3\nflower\nflow\nflight',
    sample_output: 'fl',
    explanation: '"fl" is the longest common prefix of flower, flow, flight.',
    hints: ['Compare characters position by position across all strings.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Longest common prefix
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n == 0) return;
        String[] arr = new String[n];
        for (int i = 0; i < n; i++) arr[i] = sc.next();
        
        String prefix = arr[0];
        for (int i = 1; i < n; i++) {
            while (arr[i].indexOf(prefix) != 0) {
                prefix = prefix.substring(0, prefix.length() - 1);
                if (prefix.isEmpty()) break;
            }
        }
        System.out.println(prefix);
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '3\nflower\nflow\nflight', expected_output: 'fl' },
      { input: '3\ndog\nracecar\ncar', expected_output: '' }
    ],
    hidden_tests: [
      { input: '2\ninterview\nintermediate', expected_output: 'inter' },
      { input: '1\nalone', expected_output: 'alone' }
    ]
  },
  {
    topicOrder: 11,
    title: 'Compress a String Using Character Counts',
    slug: 'compress-string-character-counts',
    difficulty: 'MEDIUM',
    placement_importance: 'NORMAL',
    level: 'INTERMEDIATE',
    description: 'Given a string S containing consecutive repeated characters, compress it such that each character is immediately followed by its count (e.g. aaabbc -> a3b2c1).',
    input_format: 'A single string S of lowercase English letters.',
    output_format: 'Print the compressed string.',
    constraints: '1 <= |S| <= 10^5',
    sample_input: 'aaabbc',
    sample_output: 'a3b2c1',
    explanation: '3 a\'s, 2 b\'s, 1 c -> a3b2c1.',
    hints: ['Count consecutive identical characters in a loop.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        // Compress string
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        if (s.isEmpty()) return;
        
        StringBuilder sb = new StringBuilder();
        int count = 1;
        for (int i = 1; i < s.length(); i++) {
            if (s.charAt(i) == s.charAt(i - 1)) {
                count++;
            } else {
                sb.append(s.charAt(i - 1)).append(count);
                count = 1;
            }
        }
        sb.append(s.charAt(s.length() - 1)).append(count);
        System.out.println(sb.toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'aaabbc', expected_output: 'a3b2c1' },
      { input: 'abcd', expected_output: 'a1b1c1d1' },
      { input: 'aaaaa', expected_output: 'a5' }
    ],
    hidden_tests: [
      { input: 'a', expected_output: 'a1' },
      { input: 'aabbbccccdd', expected_output: 'a2b3c4d2' }
    ]
  },

  // ==========================================
  // PART B — STRINGBUILDER
  // ==========================================
  {
    topicOrder: 11,
    title: 'Reverse a String Using StringBuilder',
    slug: 'reverse-string-stringbuilder',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given a string S, use the StringBuilder class and its reverse() method to reverse the string. Print the result.',
    input_format: 'A single string S.',
    output_format: 'Print reversed string.',
    constraints: '1 <= |S| <= 10^5',
    sample_input: 'StringBuilder',
    sample_output: 'redliuBgnirtS',
    explanation: 'Using new StringBuilder(s).reverse().toString().',
    hints: ['new StringBuilder(s).reverse().toString()'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        // Use StringBuilder.reverse()
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        StringBuilder sb = new StringBuilder(s);
        System.out.println(sb.reverse().toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'StringBuilder', expected_output: 'redliuBgnirtS' },
      { input: 'abc', expected_output: 'cba' }
    ],
    hidden_tests: [
      { input: 'madam', expected_output: 'madam' }
    ]
  },
  {
    topicOrder: 11,
    title: 'Append Multiple Strings Using StringBuilder',
    slug: 'append-strings-stringbuilder',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given N strings, use StringBuilder.append() to concatenate them into a single sentence separated by single spaces. Print the final sentence.',
    input_format: 'First line: N. Following line: N strings separated by space.',
    output_format: 'Print concatenated sentence.',
    constraints: '1 <= N <= 10^4',
    sample_input: '3\nJava Is Powerful',
    sample_output: 'Java Is Powerful',
    explanation: 'Append each word with space.',
    hints: ['sb.append(word);'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Append strings
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (i > 0) sb.append(" ");
            sb.append(sc.next());
        }
        System.out.println(sb.toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: '3\nJava Is Powerful', expected_output: 'Java Is Powerful' },
      { input: '2\nHello World', expected_output: 'Hello World' }
    ],
    hidden_tests: [
      { input: '1\nSingle', expected_output: 'Single' }
    ]
  },
  {
    topicOrder: 11,
    title: 'Insert a Character at a Specified Index Using StringBuilder',
    slug: 'insert-char-index-stringbuilder',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given a string S, an integer index idx, and a character C, insert C into S at index idx using StringBuilder.insert(). Print the resulting string.',
    input_format: 'String S, integer idx, character C separated by space.',
    output_format: 'Print modified string.',
    constraints: '0 <= idx <= S.length() <= 10^4',
    sample_input: 'Jva 1 a',
    sample_output: 'Java',
    explanation: 'Inserting \'a\' at index 1 in "Jva" gives "Java".',
    hints: ['sb.insert(idx, c);'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int idx = sc.nextInt();
        char c = sc.next().charAt(0);
        // Insert character
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int idx = sc.nextInt();
        char c = sc.next().charAt(0);
        StringBuilder sb = new StringBuilder(s);
        sb.insert(idx, c);
        System.out.println(sb.toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'Jva 1 a', expected_output: 'Java' },
      { input: 'cat 0 s', expected_output: 'scat' }
    ],
    hidden_tests: [
      { input: 'abc 3 d', expected_output: 'abcd' }
    ]
  },
  {
    topicOrder: 11,
    title: 'Delete Character or Substring Using StringBuilder',
    slug: 'delete-substring-stringbuilder',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given a string S and two indices start and end, delete the substring from start to end (exclusive) using StringBuilder.delete(start, end). Print the modified string.',
    input_format: 'String S, start index, end index.',
    output_format: 'Print modified string.',
    constraints: '0 <= start <= end <= S.length()',
    sample_input: 'JavaScript 4 10',
    sample_output: 'Java',
    explanation: 'Deleting indices 4 to 10 ("Script") leaves "Java".',
    hints: ['sb.delete(start, end);'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int start = sc.nextInt();
        int end = sc.nextInt();
        // Delete substring
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int start = sc.nextInt();
        int end = sc.nextInt();
        StringBuilder sb = new StringBuilder(s);
        sb.delete(start, end);
        System.out.println(sb.toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'JavaScript 4 10', expected_output: 'Java' },
      { input: 'ABCDEF 1 4', expected_output: 'AEF' }
    ],
    hidden_tests: [
      { input: 'Hello 0 5', expected_output: '' }
    ]
  },
  {
    topicOrder: 11,
    title: 'Replace a Portion of String Using StringBuilder',
    slug: 'replace-portion-stringbuilder',
    difficulty: 'EASY',
    placement_importance: 'NORMAL',
    level: 'BEGINNER',
    description: 'Given string S, indices start and end, and a replacement string R, replace the substring S[start..end) with R using StringBuilder.replace(start, end, R). Print the modified string.',
    input_format: 'String S, start, end, replacement string R separated by space.',
    output_format: 'Print modified string.',
    constraints: '0 <= start <= end <= S.length()',
    sample_input: 'Hello_World 6 11 Java',
    sample_output: 'Hello_Java',
    explanation: 'Replacing "World" with "Java".',
    hints: ['sb.replace(start, end, r);'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int start = sc.nextInt();
        int end = sc.nextInt();
        String r = sc.next();
        // Replace
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int start = sc.nextInt();
        int end = sc.nextInt();
        String r = sc.next();
        StringBuilder sb = new StringBuilder(s);
        sb.replace(start, end, r);
        System.out.println(sb.toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'Hello_World 6 11 Java', expected_output: 'Hello_Java' },
      { input: 'abcdef 2 4 XX', expected_output: 'abXXef' }
    ],
    hidden_tests: [
      { input: 'Placement 0 9 Portal', expected_output: 'Portal' }
    ]
  },
  {
    topicOrder: 11,
    title: 'Remove Duplicate Characters Using StringBuilder',
    slug: 'remove-duplicates-using-stringbuilder',
    difficulty: 'MEDIUM',
    placement_importance: 'NORMAL',
    level: 'INTERMEDIATE',
    description: 'Given string S, construct a duplicate-free string using StringBuilder and its indexOf() method. Append a character to StringBuilder only if sb.indexOf(String.valueOf(ch)) == -1.',
    input_format: 'A single string S.',
    output_format: 'Print duplicate-free string.',
    constraints: '1 <= |S| <= 10^4',
    sample_input: 'banana',
    sample_output: 'ban',
    explanation: 'b, a, n appended. Subsequent a, n, a skipped because already in StringBuilder.',
    hints: ['if (sb.indexOf(String.valueOf(ch)) == -1) sb.append(ch);'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        // Remove duplicates using StringBuilder
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            if (sb.indexOf(String.valueOf(ch)) == -1) {
                sb.append(ch);
            }
        }
        System.out.println(sb.toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'banana', expected_output: 'ban' },
      { input: 'mississippi', expected_output: 'misp' }
    ],
    hidden_tests: [
      { input: 'aaaa', expected_output: 'a' }
    ]
  },
  {
    topicOrder: 11,
    title: 'Build String Compression Using StringBuilder',
    slug: 'build-string-compression-stringbuilder',
    difficulty: 'MEDIUM',
    placement_importance: 'NORMAL',
    level: 'INTERMEDIATE',
    description: 'Given string S of consecutive repeated characters, construct its run-length encoded compressed representation using StringBuilder.append() in a loop (e.g. wwwwaaadexxxxxx -> w4a3d1e1x6).',
    input_format: 'A single string S.',
    output_format: 'Print compressed string.',
    constraints: '1 <= |S| <= 10^5',
    sample_input: 'wwwwaaadexxxxxx',
    sample_output: 'w4a3d1e1x6',
    explanation: '4 w, 3 a, 1 d, 1 e, 6 x.',
    hints: ['Loop and append to StringBuilder.'],
    starter_code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        // StringBuilder compression
    }
}`,
    reference_solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        if (s.isEmpty()) return;
        StringBuilder sb = new StringBuilder();
        int count = 1;
        for (int i = 1; i < s.length(); i++) {
            if (s.charAt(i) == s.charAt(i - 1)) {
                count++;
            } else {
                sb.append(s.charAt(i - 1)).append(count);
                count = 1;
            }
        }
        sb.append(s.charAt(s.length() - 1)).append(count);
        System.out.println(sb.toString());
    }
}`,
    validation_type: 'TRIMMED',
    public_tests: [
      { input: 'wwwwaaadexxxxxx', expected_output: 'w4a3d1e1x6' },
      { input: 'aabbcc', expected_output: 'a2b2c2' }
    ],
    hidden_tests: [
      { input: 'x', expected_output: 'x1' }
    ]
  }
];
