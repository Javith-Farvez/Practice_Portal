import React, { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { ErrorBoundary } from './ErrorBoundary';
import {
  Play,
  Send,
  RotateCcw,
  Sparkles,
  Loader2,
  Code2,
  Coffee,
} from 'lucide-react';

interface ProblemCodeEditorProps {
  language?: 'JAVA';
  onLanguageChange?: (lang: 'JAVA') => void;
  code: string;
  onCodeChange: (value: string | undefined) => void;
  onResetCode: () => void;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
}

export const ProblemCodeEditor: React.FC<ProblemCodeEditorProps> = ({
  language = 'JAVA',
  code,
  onCodeChange,
  onResetCode,
  onRun,
  onSubmit,
  isRunning,
  isSubmitting,
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define light educational SaaS theme matching website palette
    monaco.editor.defineTheme('placement-warm', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '7B8A7E', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'B95F3C', fontStyle: 'bold' },
        { token: 'string', foreground: '24543F' },
        { token: 'number', foreground: 'A8752D' },
        { token: 'type', foreground: '8D789E', fontStyle: 'bold' },
        { token: 'identifier', foreground: '26352D' },
        { token: 'delimiter', foreground: '627066' },
      ],
      colors: {
        'editor.background': '#FAF8F2',
        'editor.foreground': '#26352D',
        'editorLineNumber.foreground': '#A39A8C',
        'editorLineNumber.activeForeground': '#24543F',
        'editorCursor.foreground': '#24543F',
        'editor.selectionBackground': '#E6DCCF',
        'editor.inactiveSelectionBackground': '#EFE7DC',
        'editor.lineHighlightBackground': '#F4EEE4',
        'editorIndentGuide.background': '#E8E0D4',
        'editorIndentGuide.activeBackground': '#DDD4C6',
      },
    });

    monaco.editor.setTheme('placement-warm');

    // Register Ctrl+Enter to Run and Ctrl+Shift+Enter to Submit
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      onSubmit();
    });
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF8F2] border border-[#DDD4C6] rounded-3xl overflow-hidden shadow-xs">
      {/* Editor Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#F3EEE5] border-b border-[#DDD4C6] shrink-0">
        {/* Left: Language Selector (Java 8) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFDF9] border border-[#DDD4C6] text-[#26352D] text-xs font-bold shadow-xs">
            <Coffee className="w-3.5 h-3.5 text-[#B95F3C]" />
            <span>Java 8</span>
          </div>
          <span className="text-[11px] text-[#6E756D] hidden sm:inline-block font-mono">
            Main.java
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Format Code */}
          <button
            type="button"
            onClick={handleFormatCode}
            disabled={isRunning || isSubmitting}
            title="Format Code"
            className="p-1.5 text-xs text-[#6E756D] hover:text-[#18251F] hover:bg-[#EAE3D6] rounded-xl transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          {/* Reset Code */}
          <button
            type="button"
            onClick={onResetCode}
            disabled={isRunning || isSubmitting}
            title="Reset to Template"
            className="p-1.5 text-xs text-[#6E756D] hover:text-[#B95F3C] hover:bg-[#EAE3D6] rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-[#DDD4C6] mx-1" />

          {/* Run Button (Ctrl+Enter) - Forest Green */}
          <button
            type="button"
            onClick={onRun}
            disabled={isRunning || isSubmitting}
            title="Run Public Test Cases (Ctrl+Enter)"
            className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-[#24543F] hover:bg-[#1C4332] text-white shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-200" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-emerald-200" />
                <span>Run</span>
              </>
            )}
          </button>

          {/* Submit Button (Ctrl+Shift+Enter) - Warm Ochre */}
          <button
            type="button"
            onClick={onSubmit}
            disabled={isRunning || isSubmitting}
            title="Submit to Judge (Ctrl+Shift+Enter)"
            className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-[#A8752D] hover:bg-[#916424] text-white shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-200" />
                <span>Judging...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Monaco Editor Container with Robust Fallback */}
      <div className="flex-1 w-full min-h-[350px] relative">
        <ErrorBoundary
          fallback={
            <div className="w-full h-full p-4 flex flex-col bg-[#FAF8F2]">
              <div className="text-xs text-[#6E756D] mb-2 font-semibold flex items-center justify-between">
                <span>Standard Code Workspace</span>
                <span className="text-[10px] text-[#A39A8C]">Plaintext Mode</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => onCodeChange(e.target.value)}
                className="flex-1 w-full font-mono text-xs p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#DDD4C6] text-[#26352D] resize-none outline-none focus:border-[#24543F] leading-relaxed shadow-inner"
                spellCheck={false}
              />
            </div>
          }
        >
          <Editor
            height="100%"
            language="java"
            value={code}
            onChange={onCodeChange}
            onMount={handleEditorDidMount}
            theme="placement-warm"
            options={{
              fontSize: 13.5,
              fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace",
              fontLigatures: true,
              lineNumbers: 'on',
              minimap: { enabled: false },
              automaticLayout: true,
              tabSize: 4,
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              lineDecorationsWidth: 6,
              lineNumbersMinChars: 3,
              padding: { top: 12, bottom: 12 },
              renderLineHighlight: 'all',
              smoothScrolling: true,
              cursorBlinking: 'smooth',
            }}
            loading={
              <div className="flex items-center justify-center h-full gap-2 text-xs text-[#6E756D]">
                <Loader2 className="w-4 h-4 animate-spin text-[#24543F]" />
                <span>Loading Code Workspace...</span>
              </div>
            }
          />
        </ErrorBoundary>
      </div>

      {/* Keyboard Shortcuts Hint Footer */}
      <div className="px-4 py-2 bg-[#F3EEE5] border-t border-[#DDD4C6] flex items-center justify-between text-[11px] text-[#6E756D] shrink-0">
        <div className="flex items-center gap-3">
          <span>
            Run:{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-[#FFFDF9] border border-[#DDD4C6] text-[#26352D] font-mono text-[10px]">
              Ctrl+Enter
            </kbd>
          </span>
          <span>
            Submit:{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-[#FFFDF9] border border-[#DDD4C6] text-[#26352D] font-mono text-[10px]">
              Ctrl+Shift+Enter
            </kbd>
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#6E756D]">UTF-8</span>
      </div>
    </div>
  );
};
