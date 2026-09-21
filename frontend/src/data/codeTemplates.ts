export interface CodeTemplate {
  language: 'JAVA';
  monacoLang: string;
  defaultCode: string;
}

export const DEFAULT_TEMPLATES: Record<'JAVA', string> = {
  JAVA: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your code here
        
    }
}
`,
};
