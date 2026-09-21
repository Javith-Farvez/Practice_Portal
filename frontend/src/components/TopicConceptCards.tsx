import React, { useState, useEffect } from 'react';
import {
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Table,
  Calculator,
  Terminal,
  AlertTriangle,
  ArrowRight,
  ArrowDown,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Grid,
  Check,
  Zap,
  Lock,
  Unlock,
  Box,
  ShieldCheck,
  Users,
  User,
  GitBranch,
  Key,
  Folder,
  FileText,
  Volume2,
  Search,
  Link2,
  Clock,
  Flag,
  Activity,
} from 'lucide-react';

interface TopicConceptCardsProps {
  orderIndex: number;
  slug: string;
}

export const TopicConceptCards: React.FC<TopicConceptCardsProps> = ({ orderIndex, slug }) => {
  // Interactive states for Topic 1: Variables
  const [selectedVar, setSelectedVar] = useState<{
    type: string;
    name: string;
    value: string;
    bits: string;
    address: string;
  }>({
    type: 'int',
    name: 'age',
    value: '21',
    bits: '32 bits (4 bytes)',
    address: '0x7FFF5FBFF58C',
  });

  // Interactive states for Topic 3: Operators
  const [opA, setOpA] = useState<number>(10);
  const [opB, setOpB] = useState<number>(3);
  const [opChoice, setOpChoice] = useState<string>('+');

  // Interactive states for Topic 4: Scanner
  const [simName, setSimName] = useState<string>('Alex Rivera');
  const [simAge, setSimAge] = useState<number>(22);
  const [simSalary, setSimSalary] = useState<number>(65000);
  const [simOutput, setSimOutput] = useState<string | null>(null);

  // Interactive states for Arrays (Topics 14 & 15, matching reference images 1 to 5)
  const [arrayTab, setArrayTab] = useState<
    '1d-traversal' | '1d-anatomy' | 'program-lifecycle' | '2d-grid' | '2d-coordinates'
  >(orderIndex === 15 || slug.includes('2d') ? '2d-coordinates' : '1d-traversal');
  const [traversalStep, setTraversalStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [selectedCell1D, setSelectedCell1D] = useState<number>(4);
  const [lifecyclePhase, setLifecyclePhase] = useState<number>(1);
  const [selected2DCoord, setSelected2DCoord] = useState<{ row: number; col: number }>({ row: 1, col: 2 });

  // Interactive state for Methods (Topics 12 & 13, matching Image 4)
  const [methodAddX, setMethodAddX] = useState<number>(5);
  const [methodAddY, setMethodAddY] = useState<number>(10);
  const [overloadChoice, setOverloadChoice] = useState<'int' | 'string' | 'double'>('int');

  // Interactive state for Strings & StringBuilder (Topics 16 & 17, matching Images 1, 2, 3)
  const [stringTab, setStringTab] = useState<'string-methods' | 'stringbuilder-buffer' | 'string-vs-builder'>(
    orderIndex === 17 || slug.includes('builder') ? 'stringbuilder-buffer' : 'string-methods'
  );
  const [testString, setTestString] = useState<string>('  Hello Java World!  ');
  const [selectedStringMethod, setSelectedStringMethod] = useState<string>('length');
  const [sbStep, setSbStep] = useState<number>(0);

  // Interactive states for Topics 6, 7, 8, 9, 18, 20 (matching reference images)
  const [ifScore, setIfScore] = useState<number>(75);
  const [switchVal, setSwitchVal] = useState<number>(2);
  const [activeLoopTab, setActiveLoopTab] = useState<'for' | 'while'>('for');
  const [loopStep, setLoopStep] = useState<number>(1);
  const [activeJumpTab, setActiveJumpTab] = useState<'break' | 'continue' | 'return'>('break');
  const [activeThisUsage, setActiveThisUsage] = useState<number>(1);
  const [oopTab, setOopTab] = useState<'blueprint' | 'constructors' | 'this-keyword'>('blueprint');
  const [constructorJillRef, setConstructorJillRef] = useState<'initial' | 'reassigned'>('initial');
  const [selectedStudentObj, setSelectedStudentObj] = useState<string>('Anna');
  const [inheritanceType, setInheritanceType] = useState<'single' | 'multilevel' | 'hierarchical'>('single');

  // Interactive state for Topic 19: Encapsulation & Packages (matching Images 3 & 5)
  const [encapTab, setEncapTab] = useState<'safe' | 'packages'>('safe');
  const [bankBalance, setBankBalance] = useState<number>(1000.0);
  const [depositAmtInput, setDepositAmtInput] = useState<number>(250);
  const [lastBankMsg, setLastBankMsg] = useState<string>('Initial balance loaded: $1,000.00');

  // Interactive state for Topic 21: Polymorphism (matching Image 1)
  const [activeAnimalSound, setActiveAnimalSound] = useState<'Dog' | 'Cat' | 'Cow'>('Dog');
  const [polyOverloadVal, setPolyOverloadVal] = useState<'int' | 'string'>('int');

  // Interactive state for Topic 22: Abstraction & Interfaces (matching Images 2 & 4)
  const [abstractTab, setAbstractTab] = useState<'shapes' | 'interfaces'>('shapes');
  const [selectedShape, setSelectedShape] = useState<'Circle' | 'Rectangle'>('Circle');
  const [activeScrollAnimal, setActiveScrollAnimal] = useState<'Cat' | 'Dog'>('Cat');

  // Interactive state for Topic 23: Exception Handling (matching Image 1)
  const [exceptionScenario, setExceptionScenario] = useState<'success' | 'error'>('error');
  const [exceptionDivisor, setExceptionDivisor] = useState<number>(0);

  // Interactive state for Topic 24: Collections Framework (matching Images 3, 4, 5)
  const [collectionTab, setCollectionTab] = useState<'hierarchy' | 'tree' | 'table'>('hierarchy');
  const [selectedColType, setSelectedColType] = useState<string>('List');

  // Interactive state for Topic 26: File Handling (matching Image 2)
  const [fileInputContent, setFileInputContent] = useState<string>('Placement 2026 Ready');
  const [fileOutputContent, setFileOutputContent] = useState<string>('PLACEMENT 2026 READY');
  const [isFileStreaming, setIsFileStreaming] = useState<boolean>(false);

  // Interactive state for Topic 27: Generics (matching Reference Image 1)
  const [genericType, setGenericType] = useState<'Integer' | 'String' | 'Double'>('Integer');
  const [genericVal, setGenericVal] = useState<string>('42');

  // Interactive state for Topic 28: Lambda Expressions (matching Reference Image 2)
  const [activeLambdaRule, setActiveLambdaRule] = useState<number>(1);
  const [lambdaTestInput, setLambdaTestInput] = useState<string>('Placement');

  // Interactive state for Topic 29: Multithreading & Thread Lifecycle (matching Reference Image 3)
  const [threadStage, setThreadStage] = useState<'NEW' | 'RUNNABLE' | 'RUNNING' | 'TIMED_WAITING' | 'WAITING' | 'TERMINATED'>('NEW');
  const [threadCounter, setThreadCounter] = useState<number>(0);

  useEffect(() => {
    let timer: any;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setTraversalStep((prev) => (prev + 1) % 4);
      }, 1400);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  // =========================================================================
  // TOPIC 1: VARIABLES (Exact Memory Allocation Diagram from Reference Image 1)
  // =========================================================================
  if (orderIndex === 1 || slug.includes('variable')) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#E76F51]">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: Variable Declaration & Memory</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            Interactive Architecture Diagram
          </span>
        </div>

        {/* Big Visual Card: Java Variable Declaration & its Memory Allocation */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-lg sm:text-xl font-black text-[#1F2421] dark:text-[#FAF6EE] italic tracking-tight">
              Java Variable Declaration & its Memory Allocation
            </h3>
            <p className="text-xs text-[#6B706B] dark:text-[#BDB7AB]">
              Understanding how the Java compiler and JVM map source code variables directly into RAM cells.
            </p>
          </div>

          {/* Interactive Variable Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {[
              { type: 'int', name: 'age', value: '20', bits: '32 bits (4 bytes)', address: '0x7FFF5FBFF8C0' },
              { type: 'double', name: 'salary', value: '75000.50', bits: '64 bits (8 bytes)', address: '0x7FFF5FBFF8C8' },
              { type: 'char', name: 'grade', value: "'A'", bits: '16 bits (2 bytes)', address: '0x7FFF5FBFF8D0' },
              { type: 'boolean', name: 'isEligible', value: 'true', bits: '1 bit (virtual byte)', address: '0x7FFF5FBFF8D8' },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setSelectedVar(item)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedVar.name === item.name
                    ? 'bg-[#E76F51] text-white shadow-sm'
                    : 'bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 text-[#1F2421] dark:text-stone-300 hover:border-[#E76F51]'
                }`}
              >
                {item.type} {item.name} = {item.value};
              </button>
            ))}
          </div>

          {/* Diagram Box replicating Reference Image 1 */}
          <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-[#FEEBE8] dark:bg-[#2A1D1A] border-2 border-[#F6C2B8] dark:border-[#5A3830] relative shadow-inner">
            {/* Syntax Line with pointers */}
            <div className="text-center pb-6">
              <div className="inline-block relative">
                <p className="text-2xl sm:text-3xl font-black font-mono tracking-wide text-[#1F2421] dark:text-[#FAF6EE]">
                  <span className="text-[#E76F51] underline decoration-2 underline-offset-8">
                    {selectedVar.type}
                  </span>{' '}
                  <span className="text-[#BD8A48] underline decoration-2 underline-offset-8">
                    {selectedVar.name}
                  </span>{' '}
                  ={' '}
                  <span className="text-[#5C8D68] underline decoration-2 underline-offset-8">
                    {selectedVar.value}
                  </span>{' '}
                  ;
                </p>

                {/* Annotations below */}
                <div className="grid grid-cols-3 gap-2 text-center pt-5 mt-2">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-[#E76F51] font-bold">▲</span>
                    <span className="text-[11px] font-bold text-[#E76F51]">Data type</span>
                    <span className="text-[10px] text-[#6B706B] dark:text-stone-400">of variable</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-[#BD8A48] font-bold">▲</span>
                    <span className="text-[11px] font-bold text-[#BD8A48]">Variable name</span>
                    <span className="text-[10px] text-[#6B706B] dark:text-stone-400">(identifier)</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-[#5C8D68] font-bold">▲</span>
                    <span className="text-[11px] font-bold text-[#5C8D68]">Value</span>
                    <span className="text-[10px] text-[#6B706B] dark:text-stone-400">stored in cell</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RAM (Random Access Memory) Container Box */}
            <div className="p-6 rounded-2xl bg-[#F6FCE8] dark:bg-[#1B271A] border-2 border-[#CCE2A8] dark:border-[#384F2E] text-center relative mt-4 shadow-sm">
              <p className="text-xs font-black font-mono uppercase tracking-widest text-[#5C8D68] mb-3">
                {selectedVar.type} {selectedVar.name}
              </p>

              {/* Reserved Memory Cell */}
              <div className="inline-flex flex-col items-center">
                <div className="w-28 sm:w-36 h-16 sm:h-20 bg-white dark:bg-stone-900 border-2 border-[#1F2421] dark:border-stone-400 flex items-center justify-center shadow-md rounded-lg">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-[#1F2421] dark:text-white animate-fade-in">
                    {selectedVar.value}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#6B706B] dark:text-stone-400 mt-1.5">
                  RAM Address: <strong className="text-[#1F2421] dark:text-stone-200">{selectedVar.address}</strong>
                </span>
              </div>

              {/* Label below RAM box */}
              <div className="mt-4 pt-3 border-t border-[#CCE2A8]/80 dark:border-[#384F2E] flex flex-col sm:flex-row items-center justify-between text-xs text-[#5C8D68] font-bold gap-2">
                <span>RAM (Random Access Memory)</span>
                <span className="text-[11px] font-normal text-[#6B706B] dark:text-stone-400">
                  Reserved memory area for variable <code className="font-bold text-[#1F2421] dark:text-stone-200">{selectedVar.name}</code> ({selectedVar.bits})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TOPIC 2: DATA TYPES (Exact Primitive Types Table from Reference Image 2)
  // =========================================================================
  if (orderIndex === 2 || slug.includes('data-type')) {
    const primitives = [
      { type: 'boolean', size: '1 bit', range: 'true or false', defaultVal: 'false', category: 'Logical' },
      { type: 'byte', size: '8 bits', range: '[-128, 127]', defaultVal: '0', category: 'Integer' },
      { type: 'short', size: '16 bits', range: '[-32,768, 32,767]', defaultVal: '0', category: 'Integer' },
      { type: 'char', size: '16 bits', range: "['\\u0000', '\\uffff'] or [0, 65535]", defaultVal: "'\\u0000'", category: 'Character' },
      { type: 'int', size: '32 bits', range: '[-2,147,483,648 to 2,147,483,647]', defaultVal: '0', category: 'Integer (Default)' },
      { type: 'long', size: '64 bits', range: '[-2⁶³, 2⁶³ - 1]', defaultVal: '0', category: 'Integer' },
      { type: 'float', size: '32 bits', range: '32-bit IEEE 754 floating-point', defaultVal: '0.0', category: 'Floating Point' },
      { type: 'double', size: '64 bits', range: '64-bit IEEE 754 floating-point', defaultVal: '0.0', category: 'Floating (Default)' },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#E76F51]">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: Java Primitive Types Reference</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            Official Java Type Specification
          </span>
        </div>

        {/* Primitive Types Table Card */}
        <div className="rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E76F51]/15 text-[#E76F51] inline-block mb-1">
                Core Reference Table
              </span>
              <h3 className="text-lg font-black text-[#1F2421] dark:text-[#FAF6EE]">
                Java Primitive Types
              </h3>
            </div>
            <p className="text-xs text-[#6B706B] dark:text-[#BDB7AB] hidden sm:block">
              All 8 primitives, exact bit widths, ranges, and JVM default initializations.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="bg-[#4682B4] text-white">
                  <th className="py-3 px-4 font-black border border-[#3A6D97]">Type</th>
                  <th className="py-3 px-4 font-black border border-[#3A6D97]">Size</th>
                  <th className="py-3 px-4 font-black border border-[#3A6D97]">Range</th>
                  <th className="py-3 px-4 font-black border border-[#3A6D97]">Default</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFC8] dark:divide-stone-800 font-mono">
                {primitives.map((p, idx) => (
                  <tr
                    key={p.type}
                    className={`${
                      idx % 2 === 0
                        ? 'bg-white dark:bg-[#251D17]'
                        : 'bg-[#FAF6EE] dark:bg-[#1B140F]'
                    } hover:bg-[#FDF3E6] dark:hover:bg-stone-800 transition-colors`}
                  >
                    <td className="py-3 px-4 font-bold text-[#E76F51] border border-[#E8DFC8] dark:border-stone-800">
                      {p.type}
                    </td>
                    <td className="py-3 px-4 text-[#1F2421] dark:text-stone-200 border border-[#E8DFC8] dark:border-stone-800">
                      {p.size}
                    </td>
                    <td className="py-3 px-4 text-[#6B706B] dark:text-stone-300 border border-[#E8DFC8] dark:border-stone-800">
                      {p.range}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#5C8D68] border border-[#E8DFC8] dark:border-stone-800">
                      {p.defaultVal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E8DFC8] dark:border-stone-800 flex flex-wrap items-center justify-between text-[11px] text-[#6B706B] dark:text-stone-400 gap-2">
            <span>💡 <strong>Interview Rule:</strong> Use <code className="text-[#E76F51] font-mono font-bold">long</code> with an <code className="font-mono">L</code> suffix (e.g. <code className="font-mono">10000000000L</code>) to avoid integer overflow.</span>
            <span>Default decimal value in Java is always 64-bit <code className="text-[#E76F51] font-mono font-bold">double</code>.</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TOPIC 3: OPERATORS (Exact Classification & Truth Table from Reference Image 3)
  // =========================================================================
  if (orderIndex === 3 || slug.includes('operator')) {
    const calculateLive = () => {
      switch (opChoice) {
        case '+':
          return opA + opB;
        case '-':
          return opA - opB;
        case '*':
          return opA * opB;
        case '/':
          return opB !== 0 ? Math.floor(opA / opB) : 'Divide by zero';
        case '%':
          return opB !== 0 ? opA % opB : 'Modulo by zero';
        case '<':
          return String(opA < opB);
        case '<=':
          return String(opA <= opB);
        case '>':
          return String(opA > opB);
        case '>=':
          return String(opA >= opB);
        case '==':
          return String(opA === opB);
        case '!=':
          return String(opA !== opB);
        default:
          return opA + opB;
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#E76F51]">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: Operators Classification & Truth Table</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            Interactive Logic Engine
          </span>
        </div>

        {/* Master Operators Card replicating Reference Image 3 */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#1F2421] dark:text-[#FAF6EE] tracking-tight flex items-center gap-2">
              <Calculator className="w-6 h-6 text-[#E76F51]" />
              <span>OPERATORS</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#6B706B] dark:text-[#BDB7AB] mt-1">
              JAVA operators can be classified into a number of related categories as below:-
            </p>
          </div>

          {/* 1. Arithmetic Category */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#251D17] border border-[#E8DFC8] dark:border-stone-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-[#E76F51] flex items-center gap-1.5">
                  <span>• Arithmetic.</span>
                  <ArrowRight className="w-4 h-4 text-[#E76F51]" />
                </span>
              </div>
              {/* Segmented Boxes for +, -, *, /, % */}
              <div className="flex items-center border-2 border-[#9F3333] rounded-xl overflow-hidden bg-white dark:bg-stone-900 divide-x-2 divide-[#9F3333]">
                {['+', '-', '*', '/', '%'].map((op) => (
                  <button
                    key={op}
                    onClick={() => setOpChoice(op)}
                    className={`px-3.5 py-2 font-mono font-black text-sm transition-colors cursor-pointer ${
                      opChoice === op
                        ? 'bg-[#9F3333] text-white'
                        : 'text-[#1F2421] dark:text-stone-200 hover:bg-[#FEEBE8] dark:hover:bg-stone-800'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Relational Category */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#251D17] border border-[#E8DFC8] dark:border-stone-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-[#BD8A48] flex items-center gap-1.5">
                  <span>• Relational.</span>
                  <ArrowRight className="w-4 h-4 text-[#BD8A48]" />
                </span>
              </div>
              {/* Segmented Boxes for <, <=, >, >=, ==, != */}
              <div className="flex items-center border-2 border-[#9F3333] rounded-xl overflow-hidden bg-white dark:bg-stone-900 divide-x-2 divide-[#9F3333]">
                {['<', '<=', '>', '>=', '==', '!='].map((op) => (
                  <button
                    key={op}
                    onClick={() => setOpChoice(op)}
                    className={`px-3 py-2 font-mono font-black text-xs sm:text-sm transition-colors cursor-pointer ${
                      opChoice === op
                        ? 'bg-[#9F3333] text-white'
                        : 'text-[#1F2421] dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Logical Category & Complete Truth Table */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#251D17] border border-[#E8DFC8] dark:border-stone-800">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-black text-[#5C8D68] flex items-center gap-1.5">
                <span>• Logical.</span>
                <ArrowRight className="w-4 h-4 text-[#5C8D68]" />
              </span>
            </div>

            {/* Truth Table matching Reference Image 3 */}
            <div className="border-2 border-[#8AC0D6] dark:border-[#384F2E] rounded-2xl overflow-hidden bg-white dark:bg-stone-900 shadow-sm">
              <div className="grid grid-cols-3 text-center border-b-2 border-[#8AC0D6] dark:border-[#384F2E] bg-[#E8F4F8] dark:bg-[#1C281B] py-2.5 font-mono">
                <div>
                  <p className="font-black text-sm text-[#1F2421] dark:text-stone-200">&&</p>
                  <p className="text-xs font-black text-red-600">AND</p>
                </div>
                <div className="border-x-2 border-[#8AC0D6] dark:border-[#384F2E]">
                  <p className="font-black text-sm text-[#1F2421] dark:text-stone-200">||</p>
                  <p className="text-xs font-black text-red-600">OR</p>
                </div>
                <div>
                  <p className="font-black text-sm text-[#1F2421] dark:text-stone-200">!</p>
                  <p className="text-xs font-black text-red-600">NOT</p>
                </div>
              </div>

              <div className="grid grid-cols-3 text-center py-4 font-mono font-black text-xs sm:text-sm">
                <div className="space-y-1.5 px-2">
                  <p className="text-[#D6008D]">T && T = T</p>
                  <p className="text-[#6B706B] text-xs">T && F = F</p>
                  <p className="text-[#6B706B] text-xs">F && F = F</p>
                </div>
                <div className="space-y-1.5 px-2 border-x-2 border-[#8AC0D6] dark:border-[#384F2E]">
                  <p className="text-[#D6008D]">F || F = F</p>
                  <p className="text-[#6B706B] text-xs">T || F = T</p>
                  <p className="text-[#6B706B] text-xs">T || T = T</p>
                </div>
                <div className="space-y-1.5 px-2">
                  <p className="text-[#D6008D]">T = F</p>
                  <p className="text-[#D6008D]">F = T</p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Operator Sandbox */}
          <div className="p-4 rounded-2xl bg-[#FAF6EE] dark:bg-[#251C15] border border-[#E8DFC8] dark:border-stone-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#6B706B] dark:text-stone-400">Live Evaluator:</span>
              <input
                type="number"
                value={opA}
                onChange={(e) => setOpA(Number(e.target.value))}
                className="w-16 px-2.5 py-1 rounded-lg border border-[#E8DFC8] dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-xs font-bold text-center"
              />
              <span className="font-mono font-black text-base text-[#E76F51]">{opChoice}</span>
              <input
                type="number"
                value={opB}
                onChange={(e) => setOpB(Number(e.target.value))}
                className="w-16 px-2.5 py-1 rounded-lg border border-[#E8DFC8] dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-xs font-bold text-center"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6B706B] dark:text-stone-400">Evaluates To:</span>
              <span className="px-4 py-1.5 rounded-xl bg-white dark:bg-stone-900 border-2 border-[#5C8D68] text-[#5C8D68] font-mono font-black text-sm shadow-sm">
                {String(calculateLive())}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TOPIC 4: USER INPUT (Exact Scanner Program from Reference Image 4)
  // =========================================================================
  if (orderIndex === 4 || slug.includes('input')) {
    const runSimulatedScanner = () => {
      setSimOutput(
        `Enter name, age and salary:\nName: ${simName}\nAge: ${simAge}\nSalary: ${Number(simSalary).toFixed(1)}`
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#E76F51]">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: Java User Input using Scanner</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            Interactive Standard I/O Console
          </span>
        </div>

        {/* 2-Column Card: Code on Left, Live Simulator on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column (7 cols): Exact Scanner Code from Reference Image 4 */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-base font-black text-[#1F2421] dark:text-[#FAF6EE] flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-[#E76F51]" />
                  <span>Scanner Standard Input Architecture</span>
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FAF6EE] dark:bg-stone-900 text-[#6B706B] border border-[#E8DFC8] dark:border-stone-800">
                  Main.java
                </span>
              </div>

              {/* Formatted Code Block matching Reference Image 4 */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#18130F] text-[#1F2421] dark:text-amber-50 font-mono text-xs space-y-1 overflow-x-auto border border-[#E8DFC8] dark:border-stone-800 shadow-inner">
                <p className="text-[#3A76AF]">import java.util.Scanner;</p>
                <p>&nbsp;</p>
                <p><span className="text-[#3A76AF]">class</span> <span className="text-[#B35212]">Main</span> &#123;</p>
                <p className="pl-4">
                  <span className="text-[#3A76AF]">public static void</span> <span className="text-[#B35212]">main</span>(String[] args) &#123;
                </p>
                <p className="pl-8 text-[#A83232]">
                  Scanner myObj = <span className="text-[#3A76AF]">new</span> Scanner(System.in);
                </p>
                <p>&nbsp;</p>
                <p className="pl-8 text-stone-600 dark:text-stone-300">
                  System.out.println(<span className="text-[#B35212]">"Enter name, age and salary:"</span>);
                </p>
                <p>&nbsp;</p>
                <p className="pl-8 text-stone-400">// String input</p>
                <p className="pl-8">
                  <span className="text-[#A83232]">String</span> name = myObj.<span className="text-[#A83232] font-bold">nextLine()</span>;
                </p>
                <p>&nbsp;</p>
                <p className="pl-8 text-stone-400">// Numerical input</p>
                <p className="pl-8">
                  <span className="text-[#3A76AF]">int</span> age = myObj.<span className="text-[#A83232] font-bold">nextInt()</span>;
                </p>
                <p className="pl-8">
                  <span className="text-[#3A76AF]">double</span> salary = myObj.<span className="text-[#A83232] font-bold">nextDouble()</span>;
                </p>
                <p>&nbsp;</p>
                <p className="pl-8 text-stone-400">// Output input by user</p>
                <p className="pl-8 text-stone-600 dark:text-stone-300">
                  System.out.println(<span className="text-[#B35212]">"Name: "</span> + name);
                </p>
                <p className="pl-8 text-stone-600 dark:text-stone-300">
                  System.out.println(<span className="text-[#B35212]">"Age: "</span> + age);
                </p>
                <p className="pl-8 text-stone-600 dark:text-stone-300">
                  System.out.println(<span className="text-[#B35212]">"Salary: "</span> + salary);
                </p>
                <p className="pl-4">&#125;</p>
                <p>&#125;</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E8DFC8] dark:border-stone-800 text-[11px] text-[#5C8D68] font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Standard input tokens are read in order: String, then int, then double.</span>
            </div>
          </div>

          {/* Right Column (5 cols): Interactive Scanner Console Playground */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#FAF6EE] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#E76F51]">
                <Terminal className="w-5 h-5" />
                <h3 className="text-sm font-black text-[#1F2421] dark:text-[#FAF6EE]">
                  Simulated Standard Input (System.in)
                </h3>
              </div>
              <p className="text-xs text-[#6B706B] dark:text-stone-400 mb-4">
                Type test inputs below and execute to verify how Java parses the tokens:
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#1F2421] dark:text-stone-300 mb-1">
                    Line 1: myObj.nextLine() [Name]
                  </label>
                  <input
                    type="text"
                    value={simName}
                    onChange={(e) => setSimName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 font-mono text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1F2421] dark:text-stone-300 mb-1">
                    Line 2: myObj.nextInt() [Age]
                  </label>
                  <input
                    type="number"
                    value={simAge}
                    onChange={(e) => setSimAge(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 font-mono text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1F2421] dark:text-stone-300 mb-1">
                    Line 3: myObj.nextDouble() [Salary]
                  </label>
                  <input
                    type="number"
                    value={simSalary}
                    onChange={(e) => setSimSalary(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 font-mono text-xs font-semibold"
                  />
                </div>
              </div>

              <button
                onClick={runSimulatedScanner}
                className="w-full mt-4 py-2.5 rounded-xl bg-[#E76F51] hover:bg-[#D35A3D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Run Simulated Scanner</span>
              </button>
            </div>

            {/* Terminal Output Display */}
            {simOutput && (
              <div className="mt-4 p-3.5 rounded-2xl bg-[#18130F] border border-stone-800 font-mono text-xs space-y-1">
                <p className="text-stone-500 text-[10px] uppercase font-bold tracking-wider">Console Output:</p>
                <pre className="text-emerald-400 whitespace-pre-wrap">{simOutput}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TOPIC 5: TYPE CASTING (Exact Widening & Narrowing Diagram from Reference Image 5)
  // =========================================================================
  if (orderIndex === 5 || slug.includes('cast')) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#E76F51]">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: Java Type Casting</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            Widening vs Narrowing
          </span>
        </div>

        {/* Master Type Casting Card matching Reference Image 5 */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-8">
          {/* 1. Widening Casting (Implicit) */}
          <div className="p-6 rounded-2xl bg-[#FAF6EE] dark:bg-[#251D17] border border-[#E8DFC8] dark:border-stone-800 space-y-4">
            <div>
              <p className="text-sm sm:text-base font-black text-[#1F2421] dark:text-[#FAF6EE]">
                • Widening Casting(Implicit)
              </p>
              <p className="text-xs text-[#6B706B] dark:text-[#BDB7AB] mt-0.5">
                Automatically converted by Java from a smaller type to a larger type size. No data loss.
              </p>
            </div>

            {/* Sequence with Red Arrow */}
            <div className="text-center py-4 bg-white dark:bg-stone-900 rounded-2xl border border-[#E8DFC8] dark:border-stone-800 shadow-sm overflow-x-auto">
              <p className="text-base sm:text-lg font-mono font-black tracking-wider text-[#1F2421] dark:text-stone-200">
                byte → short → int → long → float → double
              </p>
              <div className="flex flex-col items-center mt-3">
                <div className="w-48 sm:w-80 h-0.5 bg-red-700 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-red-700" />
                </div>
                <span className="text-sm font-black text-red-700 dark:text-red-400 mt-1">widening</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#18130F] text-amber-100 font-mono text-xs space-y-1 border border-stone-800">
              <p className="text-stone-400">// Automatic type promotion</p>
              <p><span className="text-[#E76F51]">int</span> myInt = <span className="text-[#E9B44C]">9</span>;</p>
              <p><span className="text-[#E76F51]">double</span> myDouble = myInt; <span className="text-emerald-400">// Automatic casting: 9.0</span></p>
            </div>
          </div>

          {/* 2. Narrowing Casting (Explicitly done) */}
          <div className="p-6 rounded-2xl bg-[#FAF6EE] dark:bg-[#251D17] border border-[#E8DFC8] dark:border-stone-800 space-y-4">
            <div>
              <p className="text-sm sm:text-base font-black text-[#1F2421] dark:text-[#FAF6EE]">
                • Narrowing Casting(Explicitly done)
              </p>
              <p className="text-xs text-[#6B706B] dark:text-[#BDB7AB] mt-0.5">
                Manually converting a larger type to a smaller type by placing the type in parentheses. Potential precision loss.
              </p>
            </div>

            {/* Sequence with Red Arrow */}
            <div className="text-center py-4 bg-white dark:bg-stone-900 rounded-2xl border border-[#E8DFC8] dark:border-stone-800 shadow-sm overflow-x-auto">
              <p className="text-base sm:text-lg font-mono font-black tracking-wider text-[#1F2421] dark:text-stone-200">
                double → float → long → int → short → byte
              </p>
              <div className="flex flex-col items-center mt-3">
                <div className="w-48 sm:w-80 h-0.5 bg-red-700 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-red-700" />
                </div>
                <span className="text-sm font-black text-red-700 dark:text-red-400 mt-1">narrowing</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#18130F] text-amber-100 font-mono text-xs space-y-1 border border-stone-800">
              <p className="text-stone-400">// Manual explicit casting</p>
              <p><span className="text-[#E76F51]">double</span> myDouble = <span className="text-[#E9B44C]">9.78d</span>;</p>
              <p><span className="text-[#E76F51]">int</span> myInt = (<span className="text-[#E76F51]">int</span>) myDouble; <span className="text-rose-400">// Manual casting: 9 (truncated decimal)</span></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TOPIC 14 & 15: ARRAYS (1D & 2D) (Exact Visuals from Reference Images 1 to 5)
  // =========================================================================
  if (orderIndex === 14 || orderIndex === 15 || slug.includes('array')) {
    const arr1DValues = [126, 32, 230, 21, 200];
    const traversalValues = [1, 2, 3, 4];
    const matrix2DValues = [
      [0, 1, 2, 3, 4],
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20],
    ];
    const matrix4x4Coords = [
      ['A[0][0]', 'A[0][1]', 'A[0][2]', 'A[0][3]'],
      ['A[1][0]', 'A[1][1]', 'A[1][2]', 'A[1][3]'],
      ['A[2][0]', 'A[2][1]', 'A[2][2]', 'A[2][3]'],
      ['A[3][0]', 'A[3][1]', 'A[3][2]', 'A[3][3]'],
    ];

    return (
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#E76F51]">
            <Sparkles className="w-4 h-4" />
            <span>Mastering Java Arrays: Visual & Interactive Architecture</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            Reference Diagrams & Pointer Mechanics
          </span>
        </div>

        {/* Multi-Concept Navigation Pills */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-[#FAF6EE] dark:bg-[#1E1712] border border-[#E8DFC8] dark:border-[#382B20] rounded-2xl">
          <button
            onClick={() => setArrayTab('1d-traversal')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              arrayTab === '1d-traversal'
                ? 'bg-[#244D38] text-white shadow-sm'
                : 'text-[#1F2421] dark:text-stone-300 hover:bg-[#F3ECE0] dark:hover:bg-stone-800'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>1. 1D Loop & Pointer Model</span>
          </button>
          <button
            onClick={() => setArrayTab('1d-anatomy')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              arrayTab === '1d-anatomy'
                ? 'bg-[#244D38] text-white shadow-sm'
                : 'text-[#1F2421] dark:text-stone-300 hover:bg-[#F3ECE0] dark:hover:bg-stone-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. 1D Memory & Indexing Rules</span>
          </button>
          <button
            onClick={() => setArrayTab('program-lifecycle')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              arrayTab === 'program-lifecycle'
                ? 'bg-[#244D38] text-white shadow-sm'
                : 'text-[#1F2421] dark:text-stone-300 hover:bg-[#F3ECE0] dark:hover:bg-stone-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>3. Single Dimensional Program</span>
          </button>
          <button
            onClick={() => setArrayTab('2d-grid')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              arrayTab === '2d-grid'
                ? 'bg-[#244D38] text-white shadow-sm'
                : 'text-[#1F2421] dark:text-stone-300 hover:bg-[#F3ECE0] dark:hover:bg-stone-800'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>4. 2D Arrays in Java</span>
          </button>
          <button
            onClick={() => setArrayTab('2d-coordinates')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              arrayTab === '2d-coordinates'
                ? 'bg-[#244D38] text-white shadow-sm'
                : 'text-[#1F2421] dark:text-stone-300 hover:bg-[#F3ECE0] dark:hover:bg-stone-800'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>5. 2D Coordinate Model (N x M)</span>
          </button>
        </div>

        {/* ===================================================================== */}
        {/* VIEW 1: 1D TRAVERSAL LOOP & POINTER MODEL (Reference Image 1)         */}
        {/* ===================================================================== */}
        {arrayTab === '1d-traversal' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E76F51]/15 text-[#E76F51] inline-block mb-1">
                  Reference Diagram 1
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#1F2421] dark:text-[#FAF6EE]">
                  1D Array Traversal Loop & Pointer Model
                </h3>
              </div>
              <p className="text-xs text-[#6B706B] dark:text-[#BDB7AB]">
                Visualizing how <code className="font-bold text-[#1F2421] dark:text-stone-200">for(int i = 0; i &lt; arr.length; i++)</code> steps through memory.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Side: Code Block styled exactly like Reference Image 1 */}
              <div className="lg:col-span-6 flex flex-col justify-between p-6 rounded-3xl bg-[#FEF9EE] dark:bg-[#251D17] border-2 border-[#2C2C2C] shadow-md">
                <div className="font-mono text-sm sm:text-base font-bold text-[#1F2421] dark:text-amber-100 space-y-2 leading-relaxed">
                  <p className="tracking-wide">
                    <span className="text-[#3A76AF] dark:text-[#64B5F6]">int</span>[] arr = &#123;
                    <span className="text-[#E76F51]">1</span>, <span className="text-[#E76F51]">2</span>,{' '}
                    <span className="text-[#E76F51]">3</span>, <span className="text-[#E76F51]">4</span>&#125;;
                  </p>
                  <p className="tracking-wide">
                    <span className="text-[#3A76AF] dark:text-[#64B5F6]">for</span> (
                    <span className="text-[#3A76AF] dark:text-[#64B5F6]">int</span>{' '}
                    <span className={traversalStep === 0 ? 'bg-amber-300 dark:bg-amber-800 px-1 rounded' : ''}>
                      i = 0
                    </span>
                    ;{' '}
                    <span className="text-[#244D38] dark:text-emerald-400">
                      i &lt; arr.length
                    </span>
                    ;
                  </p>
                  <p className="pl-6 tracking-wide">
                    <span className="text-[#E76F51] underline decoration-2 underline-offset-4">
                      i++
                    </span>
                    )
                  </p>
                  <p
                    className={`pl-6 transition-all rounded py-0.5 ${
                      'bg-emerald-100 dark:bg-emerald-950/60 text-[#244D38] dark:text-emerald-300 font-black'
                    }`}
                  >
                    System.out.println(arr[
                    <span className="text-[#E76F51] underline decoration-2 font-black">{traversalStep}</span>
                    ]);
                  </p>
                  <p>&#125;</p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-300 dark:border-stone-800 flex items-center justify-between text-xs text-[#6B706B] dark:text-stone-400">
                  <span>Current Variable: <strong className="font-mono text-[#E76F51]">i = {traversalStep}</strong></span>
                  <span>Evaluates to: <strong className="font-mono text-[#244D38] dark:text-emerald-400">arr[{traversalStep}] = {traversalValues[traversalStep]}</strong></span>
                </div>
              </div>

              {/* Right Side: Memory Diagram with Pointer & Curved Iteration Arrow */}
              <div className="lg:col-span-6 flex flex-col justify-between p-6 rounded-3xl bg-[#FAF6EE] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm">
                <div className="text-center space-y-4">
                  {/* Dashed curved trajectory indicator pointing to current index */}
                  <div className="relative h-20 flex items-center justify-center">
                    {/* SVG Curved Dashed Arrow */}
                    <svg className="w-full h-full overflow-visible pointer-events-none" viewBox="0 0 320 80">
                      <path
                        d={`M 60 70 Q 160 10 ${70 + traversalStep * 60} 65`}
                        fill="none"
                        stroke="#2C2C2C"
                        strokeWidth="2.5"
                        strokeDasharray="6 5"
                      />
                      {/* Arrowhead pointing to active index */}
                      <polygon
                        points={`${66 + traversalStep * 60},62 ${74 + traversalStep * 60},62 ${70 + traversalStep * 60},70`}
                        fill="#2C2C2C"
                      />
                    </svg>

                    {/* Circular Pointer (i) Badge */}
                    <div
                      className="absolute top-1 transition-all duration-300 flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#2C2C2C] bg-[#FFFDF8] dark:bg-stone-800 shadow-sm"
                      style={{ left: `calc(${18 + traversalStep * 20}% + 4px)` }}
                    >
                      <span className="font-mono font-black text-sm text-[#1F2421] dark:text-white">i</span>
                    </div>
                  </div>

                  {/* Contiguous Array Block: [1][2][3][4] */}
                  <div className="flex justify-center items-center">
                    <div className="inline-flex border-2 border-[#2C2C2C] rounded-xl overflow-hidden shadow-md divide-x-2 divide-[#2C2C2C]">
                      {traversalValues.map((val, idx) => (
                        <div
                          key={idx}
                          onClick={() => setTraversalStep(idx)}
                          className={`w-14 sm:w-16 h-14 sm:h-16 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                            traversalStep === idx
                              ? 'bg-[#89CFF0] dark:bg-[#1A5276] text-[#1F2421] dark:text-white scale-105 shadow-inner'
                              : 'bg-[#B0D4EE]/70 dark:bg-[#1E3A5F]/70 text-[#1F2421] dark:text-stone-200 hover:bg-[#C2E0F4]'
                          }`}
                        >
                          <span className="font-mono font-black text-xl sm:text-2xl">{val}</span>
                          <span className="text-[10px] font-mono font-bold text-stone-600 dark:text-stone-300">
                            [{idx}]
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pointer 'arr' with upward arrow pointing to index 0 */}
                  <div className="flex items-center justify-start pl-8 sm:pl-16 gap-2">
                    <div className="flex flex-col items-center">
                      <span className="font-mono font-black text-lg text-[#1F2421] dark:text-stone-200">arr</span>
                      <svg className="w-6 h-6 text-[#2C2C2C] dark:text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M 4 18 Q 12 18 12 4" />
                        <polyline points="7 9 12 4 17 9" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
                      Base reference pointer in Stack memory
                    </span>
                  </div>
                </div>

                {/* Controls & Console Output */}
                <div className="mt-6 pt-4 border-t border-[#E8DFC8] dark:border-stone-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTraversalStep((prev) => (prev > 0 ? prev - 1 : 3))}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 text-xs font-bold hover:bg-stone-50 cursor-pointer"
                      >
                        Prev (i--)
                      </button>
                      <button
                        onClick={() => setTraversalStep((prev) => (prev + 1) % 4)}
                        className="px-3 py-1.5 rounded-xl bg-[#244D38] hover:bg-[#1B3A2B] text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <SkipForward className="w-3.5 h-3.5" />
                        <span>Next Step (i++)</span>
                      </button>
                      <button
                        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer ${
                          isAutoPlaying
                            ? 'bg-amber-500 text-white'
                            : 'bg-white dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 text-[#1F2421] dark:text-stone-200'
                        }`}
                      >
                        {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isAutoPlaying ? 'Pause' : 'Auto Play'}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setTraversalStep(0);
                        setIsAutoPlaying(false);
                      }}
                      className="text-xs font-semibold text-[#6B706B] hover:text-[#1F2421] flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>

                  {/* Console Output Bar */}
                  <div className="p-3 rounded-2xl bg-[#18130F] text-amber-100 font-mono text-xs flex items-center justify-between border border-stone-800">
                    <span className="text-stone-400">Standard Output (System.out):</span>
                    <span className="text-emerald-400 font-black">
                      {traversalValues.slice(0, traversalStep + 1).join('  ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 2: 1D MEMORY & INDEXING RULES (Reference Image 3)                */}
        {/* ===================================================================== */}
        {arrayTab === '1d-anatomy' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-8">
            <div className="text-center space-y-1">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#7E9A45]/20 text-[#5F7533] dark:text-[#A7C868] inline-block mb-1">
                Reference Diagram 3
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#1F2421] dark:text-[#FAF6EE] tracking-tight">
                One-Dimensional Array in Java
              </h3>
              <p className="text-xs text-[#6B706B] dark:text-[#BDB7AB]">
                Contiguous memory, zero-based indexing, and O(1) direct address arithmetic.
              </p>
            </div>

            {/* Visual Replicating Image 3 */}
            <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#FAF6EE] dark:bg-[#251D17] border border-[#E8DFC8] dark:border-stone-800 relative space-y-8 shadow-sm">
              {/* Top Callout Banner (Green) pointing to index 0 */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col items-center sm:items-start">
                  <div className="px-4 py-2 rounded-xl bg-[#7E9A45] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Array always starts from the index 0</span>
                  </div>
                  <div className="w-0.5 h-6 bg-[#7E9A45] ml-8" />
                  <div className="w-3 h-3 border-b-2 border-r-2 border-[#7E9A45] rotate-45 -mt-1 ml-7" />
                </div>

                {/* Right Callout Banner (Green) pointing to index 4 */}
                <div className="flex flex-col items-center sm:items-end">
                  <div className="px-4 py-2 rounded-xl bg-[#7E9A45] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    <span>Ex. - array index {selectedCell1D} is holding a value of {arr1DValues[selectedCell1D]}</span>
                  </div>
                  <div className="w-0.5 h-6 bg-[#7E9A45] mr-8" />
                  <div className="w-3 h-3 border-b-2 border-r-2 border-[#7E9A45] rotate-45 -mt-1 mr-7" />
                </div>
              </div>

              {/* Main Array Diagram */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Left "Integers" Tag with Arrow pointing to array */}
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-lg bg-[#084C61] text-white font-bold text-xs shadow-md">
                    Integers
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#084C61] hidden sm:block" />
                </div>

                {/* The 5 Cells */}
                <div className="flex flex-col items-center">
                  {/* Indices Above Cells in Sky Blue */}
                  <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full max-w-md pb-1 text-center font-mono font-black text-sm text-[#0284C7] dark:text-[#38BDF8]">
                    {arr1DValues.map((_, idx) => (
                      <span key={idx}>{idx}</span>
                    ))}
                  </div>

                  {/* Array Box */}
                  <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full max-w-md">
                    {arr1DValues.map((val, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedCell1D(idx)}
                        className={`h-16 sm:h-20 rounded-xl flex items-center justify-center font-mono font-black text-base sm:text-xl cursor-pointer transition-all duration-200 shadow-sm ${
                          selectedCell1D === idx
                            ? 'bg-white dark:bg-stone-900 border-2 border-dashed border-[#E76F51] ring-4 ring-[#E76F51]/20 text-[#E76F51] scale-105'
                            : 'bg-white dark:bg-stone-900 border-2 border-[#0284C7]/80 text-[#1F2421] dark:text-stone-100 hover:border-[#0284C7]'
                        }`}
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Callout Banner (Coral) spanning bracket under all elements */}
              <div className="flex flex-col items-center pt-2">
                <div className="w-full max-w-md h-3 border-b-2 border-x-2 border-[#E76F51] rounded-b-xl" />
                <div className="mt-3 px-5 py-2 rounded-xl bg-[#E76F51] text-white font-bold text-xs sm:text-sm shadow-md text-center">
                  Each index in the array holds a value
                </div>
              </div>

              {/* Interactive Inspector Box */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-stone-500 font-semibold block">Active Index:</span>
                  <strong className="font-mono text-sm text-[#0284C7]">index = {selectedCell1D}</strong>
                </div>
                <div>
                  <span className="text-stone-500 font-semibold block">Stored Value:</span>
                  <strong className="font-mono text-sm text-[#E76F51]">arr[{selectedCell1D}] = {arr1DValues[selectedCell1D]}</strong>
                </div>
                <div>
                  <span className="text-stone-500 font-semibold block">RAM Offset:</span>
                  <strong className="font-mono text-sm text-[#244D38] dark:text-emerald-400">
                    Base + ({selectedCell1D} × 4B) = 0x{(0x2000 + selectedCell1D * 4).toString(16).toUpperCase()}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 3: PROGRAM - SINGLE DIMENSIONAL ARRAY (Reference Image 4)        */}
        {/* ===================================================================== */}
        {arrayTab === 'program-lifecycle' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E76F51]/15 text-[#E76F51] inline-block mb-1">
                  Reference Diagram 4
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#1F2421] dark:text-[#FAF6EE]">
                  Program - Single Dimensional Array (Lifecycle)
                </h3>
              </div>
              <p className="text-xs text-[#6B706B] dark:text-[#BDB7AB]">
                Declaration, Instantiation, Initialization, and Traversing with <code className="font-bold">.length</code>.
              </p>
            </div>

            {/* Program Lifecycle 3-Phase Stepper */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { phase: 1, title: '1. Declaration & Instantiation', desc: 'int a[] = new int[5];' },
                { phase: 2, title: '2. Value Initialization', desc: 'a[0]=10; a[1]=20; ...' },
                { phase: 3, title: '3. Printing with .length', desc: 'for(int i=0; i<a.length; i++)' },
              ].map((step) => (
                <button
                  key={step.phase}
                  onClick={() => setLifecyclePhase(step.phase)}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                    lifecyclePhase === step.phase
                      ? 'bg-[#244D38] text-white border-[#244D38] shadow-sm'
                      : 'bg-[#FAF6EE] dark:bg-stone-900 border-[#E8DFC8] dark:border-stone-800 text-[#1F2421] dark:text-stone-300 hover:border-[#244D38]'
                  }`}
                >
                  <p className="text-xs font-black">{step.title}</p>
                  <p className="text-[11px] font-mono opacity-80 mt-0.5">{step.desc}</p>
                </button>
              ))}
            </div>

            {/* Code Box & Dynamic Memory Reflection */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Java Program Code Display */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-[#18130F] text-amber-50 font-mono text-xs sm:text-sm space-y-1 border border-stone-800 shadow-inner">
                <p className="text-[#E76F51] font-black text-base pb-2">class Testarray &#123;</p>
                <p className="pl-4 text-stone-300">public static void main(String args[]) &#123;</p>
                <p className={`pl-8 py-1 rounded transition-colors ${lifecyclePhase === 1 ? 'bg-amber-900/60 text-amber-300 font-black' : ''}`}>
                  <span className="text-[#64B5F6]">int</span> a[] = <span className="text-[#64B5F6]">new int</span>[<span className="text-[#E76F51]">5</span>]; <span className="text-stone-500">// declaration and instantiation</span>
                </p>
                <div className={`pl-8 py-1 rounded transition-colors ${lifecyclePhase === 2 ? 'bg-amber-900/60 text-amber-300' : ''}`}>
                  <p>a[<span className="text-[#E76F51]">0</span>] = <span className="text-[#81C784]">10</span>; <span className="text-stone-500">// initialization</span></p>
                  <p>a[<span className="text-[#E76F51]">1</span>] = <span className="text-[#81C784]">20</span>;</p>
                  <p>a[<span className="text-[#E76F51]">2</span>] = <span className="text-[#81C784]">70</span>;</p>
                  <p>a[<span className="text-[#E76F51]">3</span>] = <span className="text-[#81C784]">40</span>;</p>
                  <p>a[<span className="text-[#E76F51]">4</span>] = <span className="text-[#81C784]">50</span>;</p>
                </div>
                <p>&nbsp;</p>
                <p className="pl-8 text-stone-500">// printing array</p>
                <p className={`pl-8 py-1 rounded transition-colors ${lifecyclePhase === 3 ? 'bg-amber-900/60 text-amber-300 font-black' : ''}`}>
                  <span className="text-[#64B5F6]">for</span>(<span className="text-[#64B5F6]">int</span> i = <span className="text-[#E76F51]">0</span>; i &lt; a.<span className="text-amber-400 font-black">length</span>; i++) <span className="text-stone-500">// length is the property of array</span>
                </p>
                <p className="pl-12">
                  System.out.println(a[i]);
                </p>
                <p className="pl-4">&#125;</p>
                <p>&#125;</p>
              </div>

              {/* Dynamic Memory State in Heap */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-[#FAF6EE] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#244D38] dark:text-emerald-400 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" />
                  <span>JVM Heap Memory State (Phase {lifecyclePhase})</span>
                </p>

                <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Array Reference: <code className="text-[#E76F51]">a</code></span>
                    <span className="text-[#5C8D68]">Capacity: a.length = 5</span>
                  </div>

                  {/* 5 Heap Slots */}
                  <div className="grid grid-cols-5 gap-1 text-center font-mono">
                    {[0, 1, 2, 3, 4].map((i) => {
                      const val = lifecyclePhase === 1 ? 0 : [10, 20, 70, 40, 50][i];
                      return (
                        <div key={i} className="p-2 rounded-lg bg-[#FAF6EE] dark:bg-stone-800 border border-[#E8DFC8] dark:border-stone-700">
                          <span className="text-[10px] text-stone-500 block">[{i}]</span>
                          <span className="text-sm font-black text-[#1F2421] dark:text-white">{val}</span>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-[#6B706B] dark:text-stone-400 leading-relaxed pt-2 border-t border-stone-200 dark:border-stone-800">
                    {lifecyclePhase === 1 && (
                      'When instantiated with new int[5], the JVM zero-initializes all 5 continuous memory slots in the Heap.'
                    )}
                    {lifecyclePhase === 2 && (
                      'Direct index assignment (a[0]=10, etc.) overwrites the zeroed slots with developer-provided integer values.'
                    )}
                    {lifecyclePhase === 3 && (
                      'Notice: .length is a public final field on the array object, NOT a method call (unlike String.length()).'
                    )}
                  </p>
                </div>

                {/* Console Output for Phase 3 */}
                {lifecyclePhase === 3 && (
                  <div className="p-3 rounded-2xl bg-[#18130F] text-amber-100 font-mono text-xs border border-stone-800 space-y-1">
                    <span className="text-stone-500 text-[10px] uppercase font-bold">Printed Output:</span>
                    <div className="flex flex-wrap gap-2 text-emerald-400 font-black">
                      <span>10</span>
                      <span>20</span>
                      <span>70</span>
                      <span>40</span>
                      <span>50</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 4: 2D ARRAYS IN JAVA (Reference Image 2)                         */}
        {/* ===================================================================== */}
        {arrayTab === '2d-grid' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#0E7490]/20 text-[#0E7490] dark:text-[#38BDF8] inline-block mb-1">
                Reference Diagram 2 (EDUCBA Model)
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#1F2421] dark:text-[#FAF6EE] tracking-tight">
                2D Arrays in Java
              </h3>
              <p className="text-xs text-[#6B706B] dark:text-[#BDB7AB]">
                In Java, a 2D array is an array of 1D arrays (Rows × Columns).
              </p>
            </div>

            {/* EDUCBA Grid Layout reproduction */}
            <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#FAF6EE] dark:bg-[#251D17] border border-[#E8DFC8] dark:border-stone-800 shadow-sm space-y-4">
              {/* Columns Bracket on Top */}
              <div className="flex flex-col items-center">
                <div className="px-4 py-1 rounded-md bg-[#084C61] text-white font-bold text-xs shadow-sm">
                  Columns
                </div>
                <div className="w-64 h-3 border-t-2 border-x-2 border-[#084C61] rounded-t-lg mt-1" />
              </div>

              {/* Main Grid with Left (Rows) and Right (Arrays) Brackets */}
              <div className="flex items-center justify-center gap-3">
                {/* Left "Rows" Bracket */}
                <div className="flex items-center gap-2">
                  <div className="px-2 py-4 rounded-md bg-[#2C2C2C] text-white font-bold text-xs [writing-mode:vertical-rl] rotate-180 shadow-sm">
                    Rows
                  </div>
                  <div className="w-2.5 h-48 border-l-2 border-y-2 border-[#2C2C2C] rounded-l-lg" />
                </div>

                {/* 5x5 Table Cells */}
                <div className="overflow-x-auto">
                  <table className="border-collapse font-mono text-xs sm:text-sm font-bold text-white text-center">
                    <tbody>
                      {matrix2DValues.map((rowVals, rIdx) => (
                        <tr key={rIdx}>
                          {rowVals.map((val, cIdx) => (
                            <td
                              key={cIdx}
                              className={`w-12 sm:w-16 h-10 sm:h-12 border border-white/60 dark:border-stone-800 transition-colors ${
                                rIdx === 0
                                  ? 'bg-[#6BAA95] text-white font-black'
                                  : 'bg-[#0E7490] hover:bg-[#084C61]'
                              }`}
                            >
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Right "Arrays" Bracket */}
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-48 border-r-2 border-y-2 border-[#2C2C2C] rounded-r-lg" />
                  <div className="px-2 py-4 rounded-md bg-[#2C2C2C] text-white font-bold text-xs [writing-mode:vertical-rl] shadow-sm">
                    Arrays
                  </div>
                </div>
              </div>

              <p className="text-center text-xs text-[#6B706B] dark:text-stone-400 max-w-lg mx-auto pt-2">
                Notice: The right bracket denotes that each row is an independent 1D array instance referenced by the primary array variable.
              </p>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 5: 2D COORDINATE MODEL (N x M) (Reference Image 5)               */}
        {/* ===================================================================== */}
        {arrayTab === '2d-coordinates' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E76F51]/15 text-[#E76F51] inline-block mb-1">
                  Reference Diagram 5
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#1F2421] dark:text-[#FAF6EE]">
                  2D Array Coordinate Model (N × M Matrix)
                </h3>
              </div>
              <p className="text-xs text-[#6B706B] dark:text-[#BDB7AB]">
                Interactive 4x4 matrix coordinate inspector with row/column indexes.
              </p>
            </div>

            {/* Declaration Syntax Line */}
            <div className="p-4 rounded-2xl bg-[#FAF6EE] dark:bg-[#251D17] border border-[#E8DFC8] dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs sm:text-sm">
              <span className="font-bold text-[#1F2421] dark:text-stone-100">
                <span className="text-[#3A76AF]">int</span>[][] A = <span className="text-[#3A76AF]">new int</span>[<span className="text-[#E76F51]">4</span>][<span className="text-[#E76F51]">4</span>];
              </span>
              <span className="text-xs text-[#6B706B] dark:text-stone-400 font-sans">
                // declares a 2D array containing 4 rows and 4 columns
              </span>
            </div>

            {/* 4x4 Grid with Column and Row Index Arrows */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6EE] dark:bg-[#251D17] border border-[#E8DFC8] dark:border-stone-800 overflow-x-auto space-y-4 shadow-sm">
              {/* Column Indexes Header with Arrows */}
              <div className="flex items-center pl-32 sm:pl-36 gap-3 sm:gap-4 font-mono text-xs">
                {['col_1 (0)', 'col_2 (1)', 'col_3 (2)', 'col_4 (3)'].map((colLabel, idx) => (
                  <div key={idx} className="w-16 sm:w-20 text-center space-y-1">
                    <span className="text-stone-500 font-bold block">{colLabel}</span>
                    <ArrowDown className="w-4 h-4 mx-auto text-[#1F2421] dark:text-stone-300" />
                  </div>
                ))}
                <span className="text-xs font-bold text-[#6B706B] dark:text-stone-400 pl-2">
                  → column indexes
                </span>
              </div>

              {/* Grid with Left Row Labels */}
              <div className="space-y-3">
                {matrix4x4Coords.map((rowCoords, rIdx) => (
                  <div key={rIdx} className="flex items-center gap-3 sm:gap-4">
                    {/* Left Row Label */}
                    <div className="w-32 sm:w-36 flex items-center justify-end gap-2 font-mono text-xs font-bold text-[#1F2421] dark:text-stone-300">
                      <span>row_{rIdx + 1} ({rIdx})</span>
                      <ArrowRight className="w-4 h-4 text-[#1F2421] dark:text-stone-300" />
                    </div>

                    {/* Row Cells */}
                    <div className="flex gap-2 sm:gap-3">
                      {rowCoords.map((coord, cIdx) => {
                        const isSelected = selected2DCoord.row === rIdx && selected2DCoord.col === cIdx;
                        return (
                          <div
                            key={cIdx}
                            onClick={() => setSelected2DCoord({ row: rIdx, col: cIdx })}
                            className={`w-16 sm:w-20 h-12 sm:h-14 rounded-xl flex items-center justify-center font-mono font-bold text-xs sm:text-sm cursor-pointer transition-all duration-200 border-2 ${
                              isSelected
                                ? 'bg-[#244D38] text-white border-[#244D38] shadow-md scale-105'
                                : 'bg-[#BFDBFE]/60 dark:bg-[#1E3A5F]/60 text-[#1E3A5F] dark:text-blue-100 border-[#93C5FD] hover:bg-[#93C5FD]'
                            }`}
                          >
                            {coord}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Row Indexes Arrow & N x M Label */}
              <div className="flex items-center justify-between pt-2">
                <div className="pl-24 sm:pl-28 flex items-center gap-2 text-xs font-bold text-[#6B706B] dark:text-stone-400">
                  <ArrowDown className="w-4 h-4 text-[#6B706B]" />
                  <span>row indexes</span>
                </div>
                <div className="font-mono font-black text-sm text-[#E76F51] bg-white dark:bg-stone-900 px-3 py-1 rounded-xl border border-[#E8DFC8] dark:border-stone-800 shadow-sm">
                  N × M (4 × 4)
                </div>
              </div>
            </div>

            {/* Live Cell Coordinate Inspector */}
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-stone-500 font-semibold block">Selected Cell:</span>
                <strong className="font-mono text-base text-[#244D38] dark:text-emerald-400">
                  A[{selected2DCoord.row}][{selected2DCoord.col}]
                </strong>
              </div>
              <div>
                <span className="text-stone-500 font-semibold block">Loop Indices:</span>
                <strong className="font-mono text-sm text-[#1F2421] dark:text-stone-200">
                  row (i) = {selected2DCoord.row}, col (j) = {selected2DCoord.col}
                </strong>
              </div>
              <div>
                <span className="text-stone-500 font-semibold block">Nested Loop Syntax:</span>
                <code className="font-mono text-[11px] text-[#E76F51] block mt-0.5">
                  for(int i=0; i&lt;4; i++) for(int j=0; j&lt;4; j++) ...
                </code>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // TOPIC 12 & 13: METHODS & METHOD OVERLOADING (Exact Diagram from Image 4)
  // =========================================================================
  if (orderIndex === 12 || orderIndex === 13 || slug.includes('method')) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#244D38] dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: Methods in Java</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            Syntax, Parameters, Return Types & Overloading
          </span>
        </div>

        {/* Master Card replicating Reference Image 4 */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E3A5F] dark:text-[#90CDF4] tracking-tight">
              Methods in Java
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#6B706B] dark:text-[#BDB7AB]">
              Syntax, Parameters, Return Types, and Overloading
            </p>
          </div>

          {/* 3 Side-by-Side Cards replicating Image 4 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {/* Card 1: What is a Method? (Light Blue) */}
            <div className="p-6 rounded-3xl bg-[#E8F4F8] dark:bg-[#15232A] border-2 border-[#BEE3F8] dark:border-[#2C5282] shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#1E3A5F] dark:text-[#90CDF4] mb-3">
                  What is a Method?
                </h3>
                <p className="text-xs sm:text-sm text-[#2D3748] dark:text-stone-200 leading-relaxed">
                  A method is a block of code that performs a specific task and can be called from other parts of a program.
                </p>
                <p className="text-xs sm:text-sm text-[#2D3748] dark:text-stone-200 leading-relaxed mt-4">
                  Methods help organize code and improve reusability
                </p>
              </div>

              <div className="pt-4 border-t border-[#BEE3F8] dark:border-stone-800 flex items-center gap-2 text-xs font-bold text-[#1E3A5F] dark:text-[#90CDF4]">
                <CheckCircle2 className="w-4 h-4 text-[#3182CE]" />
                <span>DRY Principle (Don't Repeat Yourself)</span>
              </div>
            </div>

            {/* Card 2: Syntax (Soft Warm Yellow/Cream) */}
            <div className="p-6 rounded-3xl bg-[#FEFCBF]/60 dark:bg-[#2A2415] border-2 border-[#FAF089] dark:border-[#744210] shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#744210] dark:text-[#F6E05E] mb-3">
                  Syntax
                </h3>

                <div className="p-2.5 rounded-xl bg-white/90 dark:bg-stone-900 border border-[#FAF089] dark:border-stone-800 font-mono text-xs font-bold text-[#744210] dark:text-amber-200 mb-3">
                  accessModifier returnType methodName &#123; param1 &#125;
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-bold text-[#744210] dark:text-amber-300">Example</p>
                  <div className="p-3 rounded-xl bg-white/90 dark:bg-stone-900 font-mono text-xs space-y-1 text-[#1F2421] dark:text-stone-200 border border-[#FAF089] dark:border-stone-800">
                    <p><span className="text-[#3182CE]">public int</span> add(<span className="text-[#3182CE]">int</span> x, <span className="text-[#3182CE]">int</span> y) &#123;</p>
                    <p className="pl-4"><span className="text-[#E53E3E]">return</span> x + y;</p>
                    <p>&#125;</p>
                  </div>
                </div>

                <ul className="text-xs text-[#744210] dark:text-amber-200/90 space-y-1.5 mt-3 list-disc pl-4 font-medium">
                  <li>Parameters are optional</li>
                  <li>Return type is void if method does not return a value</li>
                </ul>
              </div>

              {/* Interactive Live Adder Test */}
              <div className="pt-3 border-t border-[#FAF089] dark:border-stone-800 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#744210] dark:text-amber-300">add(</span>
                  <input
                    type="number"
                    value={methodAddX}
                    onChange={(e) => setMethodAddX(Number(e.target.value))}
                    className="w-10 px-1.5 py-0.5 rounded bg-white dark:bg-stone-900 border border-[#FAF089] dark:border-stone-700 text-center font-mono font-bold"
                  />
                  <span>,</span>
                  <input
                    type="number"
                    value={methodAddY}
                    onChange={(e) => setMethodAddY(Number(e.target.value))}
                    className="w-10 px-1.5 py-0.5 rounded bg-white dark:bg-stone-900 border border-[#FAF089] dark:border-stone-700 text-center font-mono font-bold"
                  />
                  <span className="font-bold text-[#744210] dark:text-amber-300">) =</span>
                </div>
                <span className="font-mono font-black text-sm text-[#244D38] dark:text-emerald-400">
                  {methodAddX + methodAddY}
                </span>
              </div>
            </div>

            {/* Card 3: Overloading (Soft Peach/Orange) */}
            <div className="p-6 rounded-3xl bg-[#FEEBC8]/60 dark:bg-[#2C1D17] border-2 border-[#FBD38D] dark:border-[#7B341E] shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#7B341E] dark:text-[#FBD38D] mb-2">
                  Overloading
                </h3>
                <p className="text-xs sm:text-sm text-[#7B341E] dark:text-stone-300 leading-relaxed mb-3">
                  Define multiple methods with the same name but different parameters
                </p>

                <div className="space-y-1.5 text-xs">
                  <p className="font-bold text-[#7B341E] dark:text-amber-300">Example</p>
                  <div className="p-3 rounded-xl bg-white/90 dark:bg-stone-900 font-mono text-xs space-y-1.5 border border-[#FBD38D] dark:border-stone-800 text-[#1F2421] dark:text-stone-200">
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E76F51]" />
                      <span>print(<span className="text-[#3182CE]">int</span> number)</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E76F51]" />
                      <span>print(<span className="text-[#3182CE]">String</span> str)</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E76F51]" />
                      <span>print(<span className="text-[#3182CE]">double</span> value)</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Dispatcher Tester */}
              <div className="pt-3 border-t border-[#FBD38D] dark:border-stone-800 space-y-2">
                <div className="flex gap-1.5">
                  {(['int', 'string', 'double'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setOverloadChoice(t)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer ${
                        overloadChoice === t
                          ? 'bg-[#7B341E] text-white shadow-sm'
                          : 'bg-white dark:bg-stone-900 text-[#7B341E] dark:text-stone-300 border border-[#FBD38D]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="p-2 rounded-xl bg-[#18130F] text-emerald-400 font-mono text-[11px]">
                  Output: print({overloadChoice === 'int' ? '42' : overloadChoice === 'string' ? '"Java"' : '98.6'})
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TOPIC 16 & 17: STRINGS & STRINGBUILDER (Exact Diagrams from Images 1, 2, 3)
  // =========================================================================
  if (orderIndex === 16 || orderIndex === 17 || slug.includes('string')) {
    // 10 Hexagonal String Methods from Image 1
    const stringMethodsList = [
      { name: 'length()', ret: 'int', desc: 'Returns the number of characters in the string.', color: 'from-amber-500 to-orange-500', hexBg: '#F59E0B' },
      { name: 'charAt(int index)', ret: 'char', desc: 'Returns character at specified zero-based index.', color: 'from-orange-500 to-red-500', hexBg: '#EA580C' },
      { name: 'concat(String string1)', ret: 'String', desc: 'Concatenates specified string to end of this string.', color: 'from-pink-500 to-rose-500', hexBg: '#E11D48' },
      { name: 'substring(int beginIndex)', ret: 'String', desc: 'Returns substring starting at beginIndex to the end.', color: 'from-fuchsia-500 to-pink-600', hexBg: '#C026D3' },
      { name: 'substring(int begin, int end)', ret: 'String', desc: 'Returns substring from beginIndex to endIndex - 1.', color: 'from-purple-500 to-indigo-600', hexBg: '#7C3AED' },
      { name: 'compareTo(String string2)', ret: 'int', desc: 'Compares two strings lexicographically.', color: 'from-blue-600 to-cyan-600', hexBg: '#2563EB' },
      { name: 'toUpperCase()', ret: 'String', desc: 'Converts all characters to uppercase.', color: 'from-sky-500 to-blue-600', hexBg: '#0284C7' },
      { name: 'toLowerCase()', ret: 'String', desc: 'Converts all characters to lowercase.', color: 'from-teal-500 to-emerald-600', hexBg: '#0D9488' },
      { name: 'trim()', ret: 'String', desc: 'Removes leading and trailing whitespace.', color: 'from-emerald-600 to-green-600', hexBg: '#16A34A' },
      { name: 'replace(char old, char new)', ret: 'String', desc: 'Replaces all occurrences of oldChar with newChar.', color: 'from-lime-600 to-green-700', hexBg: '#65A30D' },
    ];

    // Evaluate live method for interactive sandbox
    const getEvaluatedResult = () => {
      const s = testString;
      switch (selectedStringMethod) {
        case 'length()':
          return { val: s.length, type: 'int', note: `s.length() returns total character count (${s.length})` };
        case 'charAt(int index)':
          return { val: s.length > 3 ? `'${s.charAt(3)}'` : 'Out of range', type: 'char', note: `s.charAt(3) returns char at index 3` };
        case 'concat(String string1)':
          return { val: `"${s.concat(' [ROCKET]')}"`, type: 'String', note: `Creates a brand new String object with concatenated text` };
        case 'substring(int beginIndex)':
          return { val: `"${s.substring(Math.min(2, s.length))}"`, type: 'String', note: `s.substring(2) extracts from index 2 to end` };
        case 'substring(int begin, int end)':
          return { val: `"${s.substring(2, Math.min(8, s.length))}"`, type: 'String', note: `s.substring(2, 8) extracts indices [2..7]` };
        case 'compareTo(String string2)':
          return { val: s.compareTo('Hello'), type: 'int', note: `Lexicographical ASCII difference vs "Hello"` };
        case 'toUpperCase()':
          return { val: `"${s.toUpperCase()}"`, type: 'String', note: `Converts all characters to uppercase` };
        case 'toLowerCase()':
          return { val: `"${s.toLowerCase()}"`, type: 'String', note: `Converts all characters to lowercase` };
        case 'trim()':
          return { val: `"${s.trim()}"`, type: 'String', note: `Strips whitespace from both ends: "${s.trim()}"` };
        case 'replace(char old, char new)':
          return { val: `"${s.replace(/l/g, 'X')}"`, type: 'String', note: `Replaces every 'l' with 'X'` };
        default:
          return { val: s.length, type: 'int', note: '' };
      }
    };

    const evalResult = getEvaluatedResult();

    // StringBuilder Buffer Steps matching Image 2
    const sbStepData = [
      {
        step: 0,
        code: 'StringBuilder sb = new StringBuilder(10);',
        desc: 'Allocates an empty internal char buffer with capacity 10.',
        chars: Array(10).fill(' '),
        indices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        arrow: null,
      },
      {
        step: 1,
        code: 'sb.append("Hello...");',
        desc: 'Appends "Hello..." into indices 0 through 7.',
        chars: ['H', 'e', 'l', 'l', 'o', '.', '.', '.', ' ', ' '],
        indices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        arrow: null,
      },
      {
        step: 2,
        code: "sb.append('!');",
        desc: "Appends single character '!' at index 8.",
        chars: ['H', 'e', 'l', 'l', 'o', '.', '.', '.', '!', ' '],
        indices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        arrow: null,
      },
      {
        step: 3,
        code: 'sb.insert(8, " java");',
        desc: 'Inserts " java" at index 8. Buffer expands capacity to fit 15 characters!',
        chars: ['H', 'e', 'l', 'l', 'o', '.', '.', '.', ' ', 'j', 'a', 'v', 'a', '!'],
        indices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        arrow: 'insert at 8',
      },
      {
        step: 4,
        code: 'sb.delete(5, 8);',
        desc: 'Deletes indices [5, 8) (the 3 dots "..."), shifting remaining characters left in-place!',
        chars: ['H', 'e', 'l', 'l', 'o', ' ', 'j', 'a', 'v', 'a', '!'],
        indices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        arrow: 'delete 5 to 8',
      },
    ];

    const curSb = sbStepData[sbStep];

    return (
      <div className="space-y-6">
        {/* Navigation bar between Image 1, Image 2, and Image 3 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#E76F51]">
            <Sparkles className="w-4 h-4" />
            <span>Mastering Java Strings & StringBuilder</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            3 Visual Reference Models
          </span>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-[#FAF6EE] dark:bg-[#1E1712] border border-[#E8DFC8] dark:border-[#382B20] rounded-2xl">
          <button
            onClick={() => setStringTab('string-methods')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              stringTab === 'string-methods'
                ? 'bg-[#244D38] text-white shadow-sm'
                : 'text-[#1F2421] dark:text-stone-300 hover:bg-[#F3ECE0] dark:hover:bg-stone-800'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>1. Methods of Java String (Img 1)</span>
          </button>
          <button
            onClick={() => setStringTab('stringbuilder-buffer')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              stringTab === 'stringbuilder-buffer'
                ? 'bg-[#244D38] text-white shadow-sm'
                : 'text-[#1F2421] dark:text-stone-300 hover:bg-[#F3ECE0] dark:hover:bg-stone-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. StringBuilder Buffer & Mutation (Img 2)</span>
          </button>
          <button
            onClick={() => setStringTab('string-vs-builder')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              stringTab === 'string-vs-builder'
                ? 'bg-[#244D38] text-white shadow-sm'
                : 'text-[#1F2421] dark:text-stone-300 hover:bg-[#F3ECE0] dark:hover:bg-stone-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>3. String vs StringBuilder Made Easy (Img 3)</span>
          </button>
        </div>

        {/* ===================================================================== */}
        {/* VIEW 1: METHODS OF JAVA STRING (Reference Image 1 - TechVidvan)      */}
        {/* ===================================================================== */}
        {stringTab === 'string-methods' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E76F51]/15 text-[#E76F51] inline-block mb-1">
                Reference Diagram 1 (TechVidvan)
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1E3A5F] dark:text-[#90CDF4] tracking-tight">
                METHODS OF JAVA STRING
              </h2>
              <p className="text-xs text-[#6B706B] dark:text-[#BDB7AB]">
                10 essential String methods for campus placement screening and coding rounds.
              </p>
            </div>

            {/* 10 Hexagonal Method Badges matching Image 1 */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {stringMethodsList.map((m) => {
                const isSelected = selectedStringMethod === m.name;
                return (
                  <button
                    key={m.name}
                    onClick={() => setSelectedStringMethod(m.name)}
                    className={`p-4 rounded-2xl text-center border-2 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[96px] ${
                      isSelected
                        ? 'border-black dark:border-white shadow-lg scale-105 ring-2 ring-amber-400'
                        : 'border-dashed hover:scale-102 hover:shadow-md'
                    }`}
                    style={{
                      borderColor: m.hexBg,
                      backgroundColor: isSelected ? `${m.hexBg}18` : '#FFFDF9',
                    }}
                  >
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                      {m.ret}
                    </span>
                    <span
                      className="text-xs sm:text-sm font-black font-mono leading-snug"
                      style={{ color: m.hexBg }}
                    >
                      {m.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Live String Method Sandbox */}
            <div className="p-5 rounded-2xl bg-[#FAF6EE] dark:bg-[#251D17] border border-[#E8DFC8] dark:border-stone-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Test String (Modify in Real-Time):
                  </label>
                  <input
                    type="text"
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-700 font-mono text-xs font-bold"
                  />
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 min-w-[200px]">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Selected Method:</span>
                  <code className="text-xs font-mono font-black text-[#E76F51]">{selectedStringMethod}</code>
                </div>
              </div>

              {/* Evaluated Output Bar */}
              <div className="p-3.5 rounded-xl bg-[#18130F] text-amber-100 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-stone-800 shadow-inner">
                <div className="flex items-center gap-2">
                  <span className="text-stone-400">Result ({evalResult.type}):</span>
                  <span className="text-emerald-400 font-black text-sm">{String(evalResult.val)}</span>
                </div>
                <span className="text-stone-400 text-[11px] font-sans">{evalResult.note}</span>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 2: STRINGBUILDER BUFFER & MUTATION (Reference Image 2)           */}
        {/* ===================================================================== */}
        {stringTab === 'stringbuilder-buffer' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E76F51]/15 text-[#E76F51] inline-block mb-1">
                  Reference Diagram 2
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#1F2421] dark:text-[#FAF6EE]">
                  StringBuilder Internal Buffer Array & Methods
                </h3>
              </div>
              <p className="text-xs text-[#6B706B] dark:text-[#BDB7AB]">
                Tracing internal character buffer expansion, append, insert, and delete.
              </p>
            </div>

            {/* Stepper Navigation */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {sbStepData.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setSbStep(idx)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    sbStep === idx
                      ? 'bg-[#244D38] text-white border-[#244D38] shadow-sm'
                      : 'bg-[#FAF6EE] dark:bg-stone-900 border-[#E8DFC8] dark:border-stone-800 text-[#1F2421] dark:text-stone-300'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase block opacity-75">Step {idx + 1}</span>
                  <span className="text-xs font-mono font-black truncate block">{s.code.split(';')[0]}</span>
                </button>
              ))}
            </div>

            {/* Active Step Display */}
            <div className="p-6 rounded-3xl bg-[#FAF6EE] dark:bg-[#251D17] border border-[#E8DFC8] dark:border-stone-800 space-y-6 shadow-sm">
              {/* Code Line Display with Handwritten-style Red Indices */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm sm:text-base font-black text-[#1F2421] dark:text-amber-100">
                    {curSb.code}
                  </span>
                  <span className="text-xs text-[#5C8D68] font-bold">Step {sbStep + 1} of 5</span>
                </div>
                <p className="text-xs text-[#6B706B] dark:text-stone-400">
                  {curSb.desc}
                </p>
              </div>

              {/* The Buffer Grid with Indices 0, 1, 2, ... in red */}
              <div className="overflow-x-auto pb-2">
                <div className="inline-block min-w-full">
                  {/* Red Indices above cells */}
                  <div className="flex font-mono text-xs font-bold text-red-600 dark:text-red-400 pb-1">
                    {curSb.indices.map((idx) => (
                      <div key={idx} className="w-10 sm:w-12 text-center">
                        {idx}
                      </div>
                    ))}
                  </div>

                  {/* Character Cells Array */}
                  <div className="flex border-2 border-[#2C2C2C] rounded-lg overflow-hidden bg-white dark:bg-stone-900 divide-x-2 divide-[#2C2C2C] shadow-md">
                    {curSb.chars.map((ch, idx) => (
                      <div
                        key={idx}
                        className={`w-10 sm:w-12 h-12 sm:h-14 flex items-center justify-center font-mono font-black text-base sm:text-lg ${
                          ch === ' '
                            ? 'bg-stone-50 dark:bg-stone-900 text-transparent'
                            : ch === 'j' || ch === 'a' || ch === 'v'
                            ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300'
                            : 'text-[#1F2421] dark:text-white'
                        }`}
                      >
                        {ch === ' ' ? '·' : ch}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stepper Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-800">
                <button
                  disabled={sbStep === 0}
                  onClick={() => setSbStep((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl border border-[#E8DFC8] dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-bold disabled:opacity-40 cursor-pointer"
                >
                  ← Previous
                </button>
                <button
                  disabled={sbStep === sbStepData.length - 1}
                  onClick={() => setSbStep((prev) => Math.min(sbStepData.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-[#244D38] text-white text-xs font-bold disabled:opacity-40 cursor-pointer shadow-sm"
                >
                  Next Step →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 3: STRING vs STRINGBUILDER MADE EASY (Reference Image 3)        */}
        {/* ===================================================================== */}
        {stringTab === 'string-vs-builder' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E76F51]/15 text-[#E76F51] inline-block mb-1">
                Reference Diagram 3
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1F2421] dark:text-[#FAF6EE] tracking-tight">
                UNDERSTANDING JAVA <span className="text-[#3A76AF]">STRING</span> vs{' '}
                <span className="text-[#244D38] dark:text-emerald-400">STRINGBUILDER</span>
              </h2>
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                ➜ MADE EASY ⚡
              </p>
            </div>

            {/* Side-by-Side Comparison Cards matching Image 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative items-stretch">
              {/* Left Column: STRING */}
              <div className="p-6 rounded-3xl bg-[#F0F7FA] dark:bg-[#17252D] border-2 border-[#BEE3F8] dark:border-[#2C5282] shadow-sm flex flex-col justify-between space-y-6">
                <div>
                  <div className="px-4 py-1.5 rounded-xl bg-[#1E3A5F] text-white font-black text-sm text-center mb-4 tracking-wider">
                    STRING
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#18130F] text-amber-100 font-mono text-xs space-y-1 border border-stone-800 shadow-inner mb-5">
                    <p><span className="text-[#64B5F6]">String</span> str = <span className="text-[#81C784]">"Hello"</span>;</p>
                    <p>str = str + <span className="text-[#81C784]">" World"</span>;</p>
                  </div>

                  <div className="space-y-3.5 text-xs font-bold">
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-[#BEE3F8] dark:border-stone-800">
                      <Lock className="w-5 h-5 text-[#3182CE]" />
                      <span>Immutable</span>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-[#BEE3F8] dark:border-stone-800">
                      <Box className="w-5 h-5 text-[#3182CE]" />
                      <span>Creates New Object</span>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-[#BEE3F8] dark:border-stone-800">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <span>Slower Performance</span>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-[#BEE3F8] dark:border-stone-800">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span>Thread-Safe</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: STRINGBUILDER */}
              <div className="p-6 rounded-3xl bg-[#F2F8F4] dark:bg-[#16271D] border-2 border-[#C6F6D5] dark:border-[#276749] shadow-sm flex flex-col justify-between space-y-6">
                <div>
                  <div className="px-4 py-1.5 rounded-xl bg-[#244D38] text-white font-black text-sm text-center mb-4 tracking-wider">
                    STRINGBUILDER
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#18130F] text-amber-100 font-mono text-xs space-y-1 border border-stone-800 shadow-inner mb-5">
                    <p><span className="text-[#64B5F6]">StringBuilder</span> sb = <span className="text-[#64B5F6]">new</span> StringBuilder(<span className="text-[#81C784]">"Hello"</span>);</p>
                    <p>sb.append(<span className="text-[#81C784]">" World"</span>);</p>
                  </div>

                  <div className="space-y-3.5 text-xs font-bold">
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-[#C6F6D5] dark:border-stone-800">
                      <Unlock className="w-5 h-5 text-[#244D38] dark:text-emerald-400" />
                      <span>Mutable</span>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-[#C6F6D5] dark:border-stone-800">
                      <RotateCcw className="w-5 h-5 text-[#244D38] dark:text-emerald-400" />
                      <span>Modifies Same Object</span>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-[#C6F6D5] dark:border-stone-800">
                      <Zap className="w-5 h-5 text-emerald-500" />
                      <span>Faster Performance</span>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-[#C6F6D5] dark:border-stone-800">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <span>Not Thread-Safe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Golden Callout Tip matching Image 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FEFCBF]/70 dark:bg-[#2C2718] border-2 border-[#FAF089] dark:border-[#744210] flex items-center gap-3 text-xs sm:text-sm font-bold text-[#744210] dark:text-amber-200 shadow-sm">
              <Sparkles className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <p>Use <strong className="text-[#1E3A5F] dark:text-sky-300">String</strong> for fixed text.</p>
                <p>Use <strong className="text-[#244D38] dark:text-emerald-400">StringBuilder</strong> for dynamic text.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // TOPIC 6: IF-ELSE (Exact Flowchart from Image 1)
  // =========================================================================
  if (orderIndex === 6 || slug.includes('conditional')) {
    const isPassing = ifScore >= 50;
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#244D38] dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: Java If-else Statement</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            Control Flowchart Architecture
          </span>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E3A5F] dark:text-[#90CDF4] tracking-tight">
              Java If-else Statement
            </h2>
            <p className="text-xs text-[#6B706B] dark:text-[#BDB7AB]">
              Binary condition branching and execution path convergence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Flowchart replicating Image 1 */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#FAF6EE] dark:bg-[#251D17] border border-[#E8DFC8] dark:border-stone-800 flex flex-col items-center shadow-inner space-y-3">
              {/* Start */}
              <div className="w-24 py-2 rounded-full bg-[#183556] text-white text-xs font-bold text-center shadow-md">
                Start
              </div>
              <ArrowDown className="w-4 h-4 text-stone-400" />

              {/* Condition Diamond */}
              <div className="relative flex items-center justify-center">
                <div className="w-28 h-14 rotate-45 border-2 bg-[#0284C7] border-[#0369A1] text-white shadow-md flex items-center justify-center" />
                <span className="absolute font-bold text-xs text-white pointer-events-none">
                  Condition
                </span>
              </div>

              {/* True / False Branching Arrows */}
              <div className="w-full max-w-sm flex items-center justify-between text-[11px] font-mono font-black pt-1 px-4">
                <div className="flex flex-col items-center">
                  <span className={isPassing ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-stone-400'}>
                    True ↓
                  </span>
                  <div
                    className={`w-28 sm:w-32 py-3 mt-1 rounded-xl text-xs font-bold text-center text-white transition-all shadow-md ${
                      isPassing ? 'bg-[#0284C7] ring-4 ring-emerald-400/40 scale-105' : 'bg-[#0284C7]/60'
                    }`}
                  >
                    If Code
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className={!isPassing ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-stone-400'}>
                    False →
                  </span>
                  <div
                    className={`w-28 sm:w-32 py-3 mt-1 rounded-xl text-xs font-bold text-center text-white transition-all shadow-md ${
                      !isPassing ? 'bg-[#0284C7] ring-4 ring-rose-400/40 scale-105' : 'bg-[#0284C7]/60'
                    }`}
                  >
                    Else Code
                  </div>
                </div>
              </div>

              <ArrowDown className="w-4 h-4 text-stone-400 pt-2" />

              {/* After If */}
              <div className="w-32 py-3 rounded-xl bg-[#0284C7] text-white text-xs font-bold text-center shadow-md">
                After If
              </div>

              <ArrowDown className="w-4 h-4 text-stone-400" />

              {/* End */}
              <div className="w-24 py-2 rounded-full bg-[#183556] text-white text-xs font-bold text-center shadow-md">
                End
              </div>
            </div>

            {/* Interactive Live Testing Sandbox */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#244D38] dark:text-emerald-400 block">
                Interactive Branch Simulator
              </span>

              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 mb-1">
                  Input Score Value: <strong className="text-emerald-600 font-mono text-sm">{ifScore}</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ifScore}
                  onChange={(e) => setIfScore(Number(e.target.value))}
                  className="w-full accent-[#244D38] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>0 (Fail)</span>
                  <span>50 (Threshold)</span>
                  <span>100 (Pass)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#18130F] text-amber-100 font-mono text-xs space-y-1.5 border border-stone-800">
                <p className="text-stone-400">// Java Statement:</p>
                <p><span className="text-[#64B5F6]">if</span> (score &gt;= <span className="text-[#E76F51]">50</span>) &#123;</p>
                <p className={`pl-4 py-0.5 rounded transition-all ${isPassing ? 'bg-emerald-950 text-emerald-300 font-black' : 'text-stone-500'}`}>
                  System.out.println(<span className="text-[#81C784]">"Pass"</span>); <span className="text-stone-500">// If Code</span>
                </p>
                <p>&#125; <span className="text-[#64B5F6]">else</span> &#123;</p>
                <p className={`pl-4 py-0.5 rounded transition-all ${!isPassing ? 'bg-rose-950 text-rose-300 font-black' : 'text-stone-500'}`}>
                  System.out.println(<span className="text-[#81C784]">"Fail"</span>); <span className="text-stone-500">// Else Code</span>
                </p>
                <p>&#125;</p>
                <p className="text-stone-300 pt-1">System.out.println(<span className="text-[#81C784]">"Done"</span>); // After If</p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF6EE] dark:bg-stone-800 border border-[#E8DFC8] dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-200">
                Branch Taken: <span className={isPassing ? 'text-emerald-600 font-mono font-black' : 'text-rose-600 font-mono font-black'}>{isPassing ? 'True -> If Code executed' : 'False -> Else Code executed'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TOPIC 7: SWITCH (Exact Flowchart from Image 2)
  // =========================================================================
  if (orderIndex === 7 || slug.includes('switch')) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#244D38] dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: Switch Case Statement</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            Flowchart & Break Termination Architecture
          </span>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E3A5F] dark:text-[#90CDF4] tracking-tight">
              Switch Case Flowchart Architecture
            </h2>
            <p className="text-xs text-[#6B706B] dark:text-[#BDB7AB]">
              Evaluating discrete cases, executing statements, and breaking flow to End.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Flowchart Diagram replicating Image 2 */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-[#FAF6EE] dark:bg-[#251D17] border border-[#E8DFC8] dark:border-stone-800 space-y-3 shadow-inner">
              {/* Start */}
              <div className="flex justify-center">
                <div className="px-5 py-1.5 rounded-lg bg-[#F59E0B] text-black font-black text-xs shadow-sm border border-amber-600">
                  Start
                </div>
              </div>
              <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-stone-400" /></div>

              {/* Switch Expression */}
              <div className="flex justify-center">
                <div className="w-32 py-2 rounded-xl bg-[#7CA5C2] text-black dark:text-white font-mono font-bold text-xs text-center border border-[#5A87A6] shadow-sm">
                  Switch expression
                </div>
              </div>
              <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-stone-400" /></div>

              {/* Case 1, 2, 3, Default Rows */}
              {[
                { caseNum: 1, label: 'CASE 1', stmt: 'Statement 1', isMatch: switchVal === 1 },
                { caseNum: 2, label: 'CASE 2', stmt: 'Statement 2', isMatch: switchVal === 2 },
                { caseNum: 3, label: 'CASE 3', stmt: 'Statement 3', isMatch: switchVal === 3 },
                { caseNum: 4, label: 'Default', stmt: 'Default Statement', isMatch: switchVal === 4 },
              ].map((c) => (
                <div key={c.label} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    {/* Case Diamond / Node */}
                    <div
                      onClick={() => setSwitchVal(c.caseNum)}
                      className={`w-24 sm:w-28 py-2 rounded-xl font-bold font-mono text-xs text-center border-2 cursor-pointer transition-all ${
                        c.isMatch
                          ? 'bg-[#2563EB] text-white border-blue-700 shadow-md ring-2 ring-blue-400'
                          : 'bg-[#7CA5C2]/40 text-[#1F2421] dark:text-stone-200 border-[#5A87A6]'
                      }`}
                    >
                      {c.label}
                    </div>

                    <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />

                    {/* Statement Box */}
                    <div
                      className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs text-center border-2 transition-all ${
                        c.isMatch
                          ? 'bg-[#1E40AF] text-white border-blue-900 shadow-md'
                          : 'bg-[#1E40AF]/40 text-[#1F2421] dark:text-stone-300 border-[#1E40AF]'
                      }`}
                    >
                      {c.stmt}
                    </div>

                    {c.caseNum !== 4 && (
                      <>
                        <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
                        {/* Break Box */}
                        <div
                          className={`w-20 py-2 rounded-xl font-bold font-mono text-xs text-center border-2 transition-all ${
                            c.isMatch
                              ? 'bg-[#1E40AF] text-white border-blue-900 shadow-md'
                              : 'bg-[#1E40AF]/40 text-[#1F2421] dark:text-stone-300 border-[#1E40AF]'
                          }`}
                        >
                          break
                        </div>
                      </>
                    )}
                  </div>
                  {c.caseNum !== 4 && <div className="flex justify-start pl-12"><ArrowDown className="w-4 h-4 text-stone-400" /></div>}
                </div>
              ))}

              {/* End */}
              <div className="flex justify-end pt-2">
                <div className="px-5 py-1.5 rounded-lg bg-[#F59E0B] text-black font-black text-xs shadow-sm border border-amber-600">
                  End
                </div>
              </div>
            </div>

            {/* Interactive Switch Case Runner */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#244D38] dark:text-emerald-400 block">
                Test Switch Case Branch
              </span>

              <div className="flex gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => setSwitchVal(n)}
                    className={`flex-1 py-2 rounded-xl font-mono font-bold text-xs border transition-all cursor-pointer ${
                      switchVal === n
                        ? 'bg-[#244D38] text-white border-[#244D38] shadow-sm'
                        : 'bg-[#FAF6EE] dark:bg-stone-800 border-[#E8DFC8] dark:border-stone-700 text-[#1F2421] dark:text-stone-300'
                    }`}
                  >
                    {n === 4 ? 'Default' : `Case ${n}`}
                  </button>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#18130F] text-amber-100 font-mono text-xs space-y-1 border border-stone-800 shadow-inner">
                <p><span className="text-[#64B5F6]">switch</span> (choice) &#123;</p>
                <p className={`pl-4 ${switchVal === 1 ? 'text-amber-300 font-black' : 'text-stone-500'}`}>case 1: Statement 1; break;</p>
                <p className={`pl-4 ${switchVal === 2 ? 'text-amber-300 font-black' : 'text-stone-500'}`}>case 2: Statement 2; break;</p>
                <p className={`pl-4 ${switchVal === 3 ? 'text-amber-300 font-black' : 'text-stone-500'}`}>case 3: Statement 3; break;</p>
                <p className={`pl-4 ${switchVal === 4 ? 'text-amber-300 font-black' : 'text-stone-500'}`}>default: Default Statement;</p>
                <p>&#125; <span className="text-stone-500">// Exits to End</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TOPIC 8: LOOPS (Exact Flowchart Comparison from Image 3)
  // =========================================================================
  if (orderIndex === 8 || slug.includes('loop')) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#244D38] dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: For Loop vs While Loop</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            Flowchart Comparison Architecture
          </span>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E3A5F] dark:text-[#90CDF4] tracking-tight">
              For Loop vs While Loop
            </h2>
            <p className="text-xs text-[#6B706B] dark:text-[#BDB7AB]">
              Comparing definite index-driven iteration versus dynamic boolean condition cycles.
            </p>
          </div>

          {/* Side-by-Side Flowchart comparison matching Image 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-2">
            {/* For Loop Column */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6EE] dark:bg-[#251D17] border border-[#E8DFC8] dark:border-stone-800 flex flex-col items-center space-y-4 shadow-sm">
              <h3 className="text-xl font-black text-[#1F2421] dark:text-stone-100">
                For Loop
              </h3>

              {/* Start (Green Circle) */}
              <div className="w-14 h-14 rounded-full bg-[#4ADE80] text-black font-black text-xs flex items-center justify-center shadow-md">
                Start
              </div>
              <ArrowDown className="w-4 h-4 text-stone-400" />

              {/* Last Item? (Yellow Diamond) */}
              <div className="relative flex items-center justify-center">
                <div className="w-24 h-24 rotate-45 bg-[#FBBF24] border-2 border-amber-500 rounded-lg shadow-md" />
                <span className="absolute font-bold text-xs text-black text-center leading-tight pointer-events-none">
                  Last<br />Item?
                </span>
              </div>

              {/* Branches: No -> Statements (Cyan Parallelogram) -> Loop back */}
              <div className="flex items-center justify-between w-full max-w-xs pt-2">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-stone-500 mb-1">Yes ↓</span>
                  {/* End (Red Circle) */}
                  <div className="w-14 h-14 rounded-full bg-[#EF4444] text-white font-black text-xs flex items-center justify-center shadow-md">
                    End
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-stone-500 mb-1">No →</span>
                  <div className="px-5 py-3.5 rounded-xl bg-[#2DD4BF] text-black font-black text-xs shadow-md [transform:skewX(-10deg)]">
                    Statements
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 font-mono">⤴ loops back</span>
                </div>
              </div>
            </div>

            {/* While Loop Column */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6EE] dark:bg-[#251D17] border border-[#E8DFC8] dark:border-stone-800 flex flex-col items-center space-y-4 shadow-sm">
              <h3 className="text-xl font-black text-[#1F2421] dark:text-stone-100">
                While Loop
              </h3>

              {/* Start (Green Circle) */}
              <div className="w-14 h-14 rounded-full bg-[#4ADE80] text-black font-black text-xs flex items-center justify-center shadow-md">
                Start
              </div>
              <ArrowDown className="w-4 h-4 text-stone-400" />

              {/* Condition (Yellow Diamond) */}
              <div className="relative flex items-center justify-center">
                <div className="w-24 h-24 rotate-45 bg-[#FBBF24] border-2 border-amber-500 rounded-lg shadow-md" />
                <span className="absolute font-bold text-xs text-black text-center pointer-events-none">
                  Condition
                </span>
              </div>

              {/* Branches: True -> Statements (Purple Parallelogram) -> Loop back */}
              <div className="flex items-center justify-between w-full max-w-xs pt-2">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-stone-500 mb-1">False ↓</span>
                  {/* End (Red Circle) */}
                  <div className="w-14 h-14 rounded-full bg-[#EF4444] text-white font-black text-xs flex items-center justify-center shadow-md">
                    End
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-stone-500 mb-1">True →</span>
                  <div className="px-5 py-3.5 rounded-xl bg-[#A78BFA] text-white font-black text-xs shadow-md [transform:skewX(-10deg)]">
                    Statements
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 font-mono">⤴ loops back</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TOPIC 9: BREAK, CONTINUE, AND RETURN (Exact 3-Card Layout from Image 4)
  // =========================================================================
  if (orderIndex === 9 || slug.includes('break')) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#244D38] dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: Jump & Control Flow Transfer</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            Break, Continue, and Return
          </span>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1F2421] dark:text-[#FAF6EE] tracking-tight">
              Break, Continue, and Return
            </h2>
            <p className="text-xs text-[#6B706B] dark:text-[#BDB7AB]">
              Comparing syntax, execution semantics, and use-cases.
            </p>
          </div>

          {/* 3 Comparative Columns matching Image 4 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2">
            {/* Column 1: BREAK */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1712] border-2 border-stone-300 dark:border-stone-700 shadow-sm flex flex-col justify-between space-y-5">
              <div>
                <div className="px-5 py-2 rounded-xl bg-[#2B6CB0] text-white font-black text-sm text-center mb-4 tracking-wider shadow-sm">
                  BREAK
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-stone-500 block mb-1">Syntax:</span>
                    <div className="p-3 rounded-xl bg-[#FAF6EE] dark:bg-stone-900 font-mono font-bold text-xs text-[#1F2421] dark:text-stone-200 border border-[#E8DFC8] dark:border-stone-800">
                      break;
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-stone-500 block mb-2">Use-Cases:</span>
                    <ul className="space-y-2 text-xs font-medium text-[#1F2421] dark:text-stone-200">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#2B6CB0] shrink-0 mt-0.5" />
                        <span>Exits the loop or switch statement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#2B6CB0] shrink-0 mt-0.5" />
                        <span>Immediate flow control transfer</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#2B6CB0] shrink-0 mt-0.5" />
                        <span>'Breaks' the current flow</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#18130F] text-amber-100 font-mono text-[11px] border border-stone-800">
                <span className="text-stone-500">// Terminates immediately</span>
                <p>if (i == 5) <span className="text-amber-400 font-bold">break;</span></p>
              </div>
            </div>

            {/* Column 2: CONTINUE */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1712] border-2 border-stone-300 dark:border-stone-700 shadow-sm flex flex-col justify-between space-y-5">
              <div>
                <div className="px-5 py-2 rounded-xl bg-[#DD6B20] text-white font-black text-sm text-center mb-4 tracking-wider shadow-sm">
                  CONTINUE
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-stone-500 block mb-1">Syntax:</span>
                    <div className="p-3 rounded-xl bg-[#FAF6EE] dark:bg-stone-900 font-mono font-bold text-xs text-[#1F2421] dark:text-stone-200 border border-[#E8DFC8] dark:border-stone-800">
                      continue;
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-stone-500 block mb-2">Use-Cases:</span>
                    <ul className="space-y-2 text-xs font-medium text-[#1F2421] dark:text-stone-200">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#DD6B20] shrink-0 mt-0.5" />
                        <span>Skips the current iteration of a loop</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#DD6B20] shrink-0 mt-0.5" />
                        <span>Jumps to the next iteration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#DD6B20] shrink-0 mt-0.5" />
                        <span>'Continues' the loop flow</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#18130F] text-amber-100 font-mono text-[11px] border border-stone-800">
                <span className="text-stone-500">// Skips rest of current cycle</span>
                <p>if (i % 2 == 0) <span className="text-orange-400 font-bold">continue;</span></p>
              </div>
            </div>

            {/* Column 3: RETURN */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1712] border-2 border-stone-300 dark:border-stone-700 shadow-sm flex flex-col justify-between space-y-5">
              <div>
                <div className="px-5 py-2 rounded-xl bg-[#319795] text-white font-black text-sm text-center mb-4 tracking-wider shadow-sm">
                  RETURN
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-stone-500 block mb-1">Syntax:</span>
                    <div className="p-3 rounded-xl bg-[#FAF6EE] dark:bg-stone-900 font-mono font-bold text-xs text-[#1F2421] dark:text-stone-200 border border-[#E8DFC8] dark:border-stone-800">
                      return[expression];
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-stone-500 block mb-2">Use-Cases:</span>
                    <ul className="space-y-2 text-xs font-medium text-[#1F2421] dark:text-stone-200">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#319795] shrink-0 mt-0.5" />
                        <span>Exits a method and returns a value</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#319795] shrink-0 mt-0.5" />
                        <span>Optional return expression</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#319795] shrink-0 mt-0.5" />
                        <span>'Returns' control to the caller</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#18130F] text-amber-100 font-mono text-[11px] border border-stone-800">
                <span className="text-stone-500">// Returns value to calling frame</span>
                <p><span className="text-teal-400 font-bold">return</span> count * 2;</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TOPIC 18: OOP - CLASS & OBJECTS, CONSTRUCTORS & THIS KEYWORD (Reference Images 1, 2, 3, 4, 5)
  // =========================================================================
  if (orderIndex === 18 || slug.includes('oop')) {
    const thisUsagesList = [
      {
        id: 1,
        badge: '01',
        title: 'refer current class instance variable',
        text: 'this can be used to refer current class instance variable.',
        color: 'bg-[#7E9A45] text-white',
        code: [
          'class Student {',
          '    int age; // instance variable',
          '    Student(int age) {',
          '        this.age = age; // resolves variable shadowing',
          '    }',
          '}',
        ],
      },
      {
        id: 2,
        badge: '02',
        title: 'invoke current class method (implicitly)',
        text: 'this can be used to invoke current class method (implicitly)',
        color: 'bg-[#C53030] text-white',
        code: [
          'class Display {',
          '    void show() { System.out.println("Hello"); }',
          '    void render() {',
          '        this.show(); // invokes current class method',
          '    }',
          '}',
        ],
      },
      {
        id: 3,
        badge: '03',
        title: 'invoke current class Constructor',
        text: 'this() can be used to invoke current class Constructor.',
        color: 'bg-[#DD6B20] text-white',
        code: [
          'class Box {',
          '    Box() { System.out.println("Default box"); }',
          '    Box(int size) {',
          '        this(); // Constructor chaining (must be 1st line)',
          '    }',
          '}',
        ],
      },
      {
        id: 4,
        badge: '04',
        title: 'passed as an argument in method call',
        text: 'this can be passed as an argument in the method call.',
        color: 'bg-[#007791] text-white',
        code: [
          'class Processor {',
          '    void log(Processor p) { ... }',
          '    void execute() {',
          '        log(this); // passes current object reference',
          '    }',
          '}',
        ],
      },
      {
        id: 5,
        badge: '05',
        title: 'passed as argument in constructor call',
        text: 'this can be passed as argument in the constructor call.',
        color: 'bg-[#A0522D] text-white',
        code: [
          'class Engine {',
          '    Car car;',
          '    Engine(Car car) { this.car = car; }',
          '}',
          'class Car {',
          '    Car() { Engine e = new Engine(this); }',
          '}',
        ],
      },
      {
        id: 6,
        badge: '06',
        title: 'return current class instance from method',
        text: 'this can be used to return the current class instance from the method',
        color: 'bg-[#0284C7] text-white',
        code: [
          'class Builder {',
          '    Builder setConfig(String c) {',
          '        // ... configure ...',
          '        return this; // Enables Method Chaining!',
          '    }',
          '}',
        ],
      },
    ];

    const activeThis = thisUsagesList.find((u) => u.id === activeThisUsage) || thisUsagesList[0];

    const studentInstances = [
      { name: 'Anna', id: 'ID101', role: 'Student 1', color: 'border-pink-300 bg-pink-50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300', traits: 'Girl with backpack & book, orange hair' },
      { name: 'Leo', id: 'ID103', role: 'Student 2', color: 'border-blue-300 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300', traits: 'Boy in blue suit & green bow tie' },
      { name: 'Sara', id: 'ID105', role: 'Student 3', color: 'border-amber-300 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300', traits: 'Girl in orange top & green skirt' },
      { name: 'Max', id: 'ID108', role: 'Student 4', color: 'border-orange-300 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300', traits: 'Boy in grey tee with briefcase B' },
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#244D38] dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: Java OOP & Reference Model</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            Class, Objects, Constructors & this Keyword
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800">
          <button
            onClick={() => setOopTab('blueprint')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              oopTab === 'blueprint'
                ? 'bg-[#244D38] text-white shadow-md'
                : 'text-[#6B706B] dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Class Blueprint & Objects (Images 1, 3, 4)</span>
          </button>

          <button
            onClick={() => setOopTab('constructors')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              oopTab === 'constructors'
                ? 'bg-[#244D38] text-white shadow-md'
                : 'text-[#6B706B] dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Constructors & Reference Reassignment (Image 2)</span>
          </button>

          <button
            onClick={() => setOopTab('this-keyword')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              oopTab === 'this-keyword'
                ? 'bg-[#244D38] text-white shadow-md'
                : 'text-[#6B706B] dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>6 Usages of this Keyword</span>
          </button>
        </div>

        {/* TAB 1: BLUEPRINT VS OBJECTS (IMAGES 1, 3, 4) */}
        {oopTab === 'blueprint' && (
          <div className="space-y-6">
            {/* PART A: Image 1 - Class Student Cloud Blueprint pointing to 4 Student Objects */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs font-bold">
                  <span>Reference Image 1: Class Blueprint vs Real-world Objects</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1F2421] dark:text-[#FAF6EE] tracking-tight">
                  One Class Blueprint $\rightarrow$ Multiple Object Instances
                </h2>
                <p className="text-xs sm:text-sm text-[#6B706B] dark:text-[#BDB7AB] max-w-2xl mx-auto">
                  A <strong className="text-[#1F2421] dark:text-white">Class</strong> is a conceptual blueprint (occupies 0 Heap memory until instantiated). An <strong className="text-[#1F2421] dark:text-white">Object</strong> is an actual real-world instance allocated in Heap memory with its own distinct state.
                </p>
              </div>

              {/* Visual Diagram replicating Image 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 rounded-3xl bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800">
                {/* 4 Object Instances on Left */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-stone-200 dark:border-stone-800">
                    <span className="text-xs font-black text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>Objects (Instances in Heap Memory)</span>
                    </span>
                    <span className="text-[11px] text-stone-500 font-mono">new Student(...)</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {studentInstances.map((std) => {
                      const isSelected = selectedStudentObj === std.name;
                      return (
                        <div
                          key={std.name}
                          onClick={() => setSelectedStudentObj(std.name)}
                          className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-1 shadow-sm ${
                            isSelected
                              ? 'border-[#244D38] dark:border-emerald-400 bg-white dark:bg-stone-800 ring-2 ring-emerald-400/20 scale-105'
                              : `${std.color} hover:scale-102`
                          }`}
                        >
                          <div className="w-12 h-12 rounded-full bg-white dark:bg-stone-900 flex items-center justify-center font-black text-base shadow-sm border border-stone-200 dark:border-stone-700">
                            {std.name[0]}
                          </div>
                          <span className="text-sm font-black text-stone-900 dark:text-white pt-1">{std.name}</span>
                          <span className="px-2 py-0.5 rounded-md bg-stone-900 text-white font-mono text-[10px] font-bold">
                            {std.id}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Active Student Inspector */}
                  {(() => {
                    const cur = studentInstances.find((s) => s.name === selectedStudentObj) || studentInstances[0];
                    return (
                      <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Active Object Instance: {cur.name} ({cur.id})</span>
                          </span>
                          <span className="text-[10px] font-mono bg-stone-100 dark:bg-stone-900 px-2 py-0.5 rounded text-stone-600 dark:text-stone-400">
                            Heap: 0x{cur.id.slice(2)}F8A0
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#18130F] text-amber-100 font-mono text-xs space-y-0.5">
                          <p><span className="text-teal-400 font-bold">Student</span> obj = <span className="text-yellow-400 font-bold">new</span> Student();</p>
                          <p>obj.setName(<span className="text-emerald-300">"{cur.name}"</span>);</p>
                          <p>obj.setId(<span className="text-emerald-300">"{cur.id}"</span>);</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Arrow connector in middle */}
                <div className="hidden lg:flex flex-col items-center justify-center lg:col-span-1 text-stone-400">
                  <ArrowRight className="w-6 h-6 text-stone-500" />
                  <span className="text-[10px] font-bold text-stone-500 uppercase mt-1">instantiates</span>
                </div>

                {/* Cloud Blueprint for Class Student on Right (Replicating Image 1 Cloud) */}
                <div className="lg:col-span-4 flex flex-col items-center">
                  <div className="relative p-6 rounded-[40px] bg-white dark:bg-stone-800 border-4 border-blue-400 dark:border-blue-600 shadow-xl w-full max-w-[280px] space-y-3 text-center">
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                      class blueprint
                    </div>
                    <h3 className="text-xl font-black text-blue-900 dark:text-blue-200">
                      Class Student
                    </h3>

                    {/* Attributes */}
                    <div className="text-xs font-mono font-semibold text-stone-700 dark:text-stone-300 space-y-0.5 py-1">
                      <p>name</p>
                      <p>id</p>
                    </div>

                    <div className="w-full h-0.5 bg-stone-300 dark:bg-stone-700 my-2" />

                    {/* Methods */}
                    <div className="text-xs font-mono font-semibold text-blue-700 dark:text-blue-400 space-y-0.5 py-1">
                      <p>setName()</p>
                      <p>setId()</p>
                    </div>

                    <span className="text-[10px] text-stone-400 block pt-1 italic">
                      Templates define state & behavior, objects hold individual data
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PART B: Images 3 & 4 - Class Person Anatomy with Data Members & Methods */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  <span>Reference Images 3 & 4: Java Class & Objects Anatomy</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1F2421] dark:text-[#FAF6EE] tracking-tight">
                  Class Person Structure: Data Members & Methods
                </h2>
                <p className="text-xs sm:text-sm text-[#6B706B] dark:text-[#BDB7AB] max-w-2xl mx-auto">
                  Every class encapsulates <strong className="text-red-600 dark:text-red-400">Data Members</strong> (state/attributes) and <strong className="text-blue-600 dark:text-blue-400">Methods</strong> (behavior/actions).
                </p>
              </div>

              {/* Exact 2-Column Replication of Images 3 & 4 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 rounded-3xl bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800">
                {/* Left: Class Person Box */}
                <div className="md:col-span-5 space-y-3">
                  <div className="rounded-2xl border-2 border-stone-800 dark:border-stone-400 overflow-hidden bg-white dark:bg-stone-800 shadow-md">
                    {/* Header: Class | Person */}
                    <div className="flex border-b-2 border-stone-800 dark:border-stone-400 bg-stone-100 dark:bg-stone-900 font-black text-sm">
                      <div className="w-1/3 p-3 border-r-2 border-stone-800 dark:border-stone-400 text-stone-700 dark:text-stone-300">
                        Class
                      </div>
                      <div className="w-2/3 p-3 text-stone-900 dark:text-white font-mono text-base">
                        Person
                      </div>
                    </div>

                    {/* Data Members (Red border box) */}
                    <div className="m-3 p-3.5 rounded-xl border-2 border-red-500 bg-red-50/50 dark:bg-red-950/20 space-y-1.5">
                      <span className="text-xs font-black uppercase text-red-600 dark:text-red-400 tracking-wider block">
                        Data Members
                      </span>
                      <div className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200 space-y-1 pl-1">
                        <p className="text-red-700 dark:text-red-300">unique_id</p>
                        <p>name</p>
                        <p>age</p>
                        <p>city</p>
                        <p>gender</p>
                      </div>
                    </div>

                    {/* Methods (Blue border box) */}
                    <div className="m-3 mt-0 p-3.5 rounded-xl border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 space-y-1.5">
                      <span className="text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider block">
                        Methods
                      </span>
                      <div className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200 space-y-1 pl-1">
                        <p>eat()</p>
                        <p>study()</p>
                        <p>sleep()</p>
                        <p>play()</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Arrow */}
                <div className="hidden md:flex flex-col items-center justify-center md:col-span-2 text-stone-400">
                  <div className="w-12 h-0.5 bg-stone-400" />
                  <span className="text-[10px] font-black text-stone-500 uppercase my-1">instantiates</span>
                  <div className="w-12 h-0.5 bg-stone-400" />
                </div>

                {/* Right: 2 Concrete Object Instances (John & Dessy) */}
                <div className="md:col-span-5 space-y-4">
                  {/* Object 1: John */}
                  <div className="p-4 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-black text-xl text-blue-700 dark:text-blue-300 shrink-0 border border-blue-300">
                      👨‍💼
                    </div>
                    <div className="space-y-0.5 text-xs font-mono text-stone-800 dark:text-stone-200">
                      <p><span className="font-bold text-stone-500">name-</span> <strong className="text-blue-600 dark:text-blue-400">John</strong></p>
                      <p><span className="font-bold text-stone-500">age-</span> 35</p>
                      <p><span className="font-bold text-stone-500">city-</span> Delhi</p>
                      <p><span className="font-bold text-stone-500">gender-</span> male</p>
                    </div>
                  </div>

                  {/* Object 2: Dessy */}
                  <div className="p-4 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center font-black text-xl text-pink-700 dark:text-pink-300 shrink-0 border border-pink-300">
                      👩‍💼
                    </div>
                    <div className="space-y-0.5 text-xs font-mono text-stone-800 dark:text-stone-200">
                      <p><span className="font-bold text-stone-500">name-</span> <strong className="text-pink-600 dark:text-pink-400">Dessy</strong></p>
                      <p><span className="font-bold text-stone-500">age-</span> 20</p>
                      <p><span className="font-bold text-stone-500">city-</span> Pune</p>
                      <p><span className="font-bold text-stone-500">gender-</span> female</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONSTRUCTORS & REFERENCE REASSIGNMENT (IMAGE 2) */}
        {oopTab === 'constructors' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 text-xs font-bold">
                <span>Reference Image 2: Constructors & Reference Lost / Garbage Collection</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1F2421] dark:text-[#FAF6EE] tracking-tight">
                Constructors & Memory Reference Lifecycle
              </h2>
              <p className="text-xs sm:text-sm text-[#6B706B] dark:text-[#BDB7AB] max-w-2xl mx-auto">
                Constructors initialize freshly allocated Heap memory. What happens when a reference variable is reassigned to a new object?
              </p>
            </div>

            {/* Code Snippet from Reference Image 2 */}
            <div className="p-5 rounded-2xl bg-[#18130F] text-amber-100 font-mono text-xs space-y-2 border border-stone-800 shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800 text-stone-400 text-[11px]">
                <span className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5 text-teal-400" /> Java Constructor Definitions</span>
                <span className="text-amber-400">Image 2 Code Replication</span>
              </div>
              <p><span className="text-teal-400 font-bold">public</span> Name() &#123; &#125; <span className="text-stone-500">// Default constructor</span></p>
              <p><span className="text-teal-400 font-bold">public</span> Name(<span className="text-teal-400">String</span> firstName, <span className="text-teal-400">String</span> lastName) &#123;</p>
              <p className="pl-4">setFirst(firstName);</p>
              <p className="pl-4">setLast(lastName);</p>
              <p>&#125;</p>
              <div className="pt-2 border-t border-stone-800 text-teal-300">
                <p><span className="text-teal-400 font-bold">Name</span> jill = <span className="text-yellow-400 font-bold">new</span> Name(<span className="text-emerald-300">"Jill"</span>, <span className="text-emerald-300">"Jones"</span>);</p>
                <p>jill = <span className="text-yellow-400 font-bold">new</span> Name(<span className="text-emerald-300">"Jill"</span>, <span className="text-emerald-300">"Smith"</span>);</p>
              </div>
            </div>

            {/* Interactive Memory Diagram Switcher */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setConstructorJillRef('initial')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  constructorJillRef === 'initial'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                (a) After Initial Creation
              </button>
              <button
                onClick={() => setConstructorJillRef('reassigned')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  constructorJillRef === 'reassigned'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                (b) After Reference is Lost (GC / Leak)
              </button>
            </div>

            {/* Diagram replicating (a) and (b) from Image 2 */}
            <div className="p-6 rounded-3xl bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 space-y-4">
              <div className="text-center font-bold text-xs uppercase tracking-wider text-stone-500">
                {constructorJillRef === 'initial'
                  ? 'An object (a) after its initial creation;'
                  : '(b) after its reference is lost memory leak / Garbage Collection'}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-6">
                {/* Pointer Box "jill" on Stack */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 rounded-xl bg-stone-300 dark:bg-stone-700 border-2 border-stone-500 flex items-center justify-center shadow-md">
                    <div className="w-3.5 h-3.5 rounded-full bg-black dark:bg-white" />
                  </div>
                  <span className="font-mono text-sm font-black text-stone-800 dark:text-stone-200">
                    jill
                  </span>
                  <span className="text-[10px] text-stone-500 font-semibold">Stack Variable</span>
                </div>

                {/* Arrow Pointer */}
                <div className="flex items-center text-stone-600 dark:text-stone-300">
                  <ArrowRight className="w-8 h-8" />
                </div>

                {/* Heap Objects */}
                <div className="flex flex-col gap-4">
                  {/* Object 1: Jill Jones */}
                  <div
                    className={`px-6 py-3 rounded-full border-2 font-mono text-sm font-bold flex items-center gap-3 transition-all ${
                      constructorJillRef === 'initial'
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-200 shadow-md ring-2 ring-cyan-400/20'
                        : 'border-dashed border-red-400 bg-red-50/50 dark:bg-red-950/20 text-stone-400 dark:text-stone-500 line-through opacity-70'
                    }`}
                  >
                    <span>"Jill"</span>
                    <span>"Jones"</span>
                    {constructorJillRef === 'reassigned' && (
                      <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-red-600 text-white not-italic no-underline">
                        Unreachable (GC)
                      </span>
                    )}
                  </div>

                  {/* Object 2: Jill Smith (Only in reassigned state) */}
                  {constructorJillRef === 'reassigned' && (
                    <div className="px-6 py-3 rounded-full border-2 border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-200 font-mono text-sm font-bold flex items-center gap-3 shadow-md ring-2 ring-cyan-400/20 animate-fadeIn">
                      <span>"Jill"</span>
                      <span>"Smith"</span>
                      <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-emerald-600 text-white">
                        Active Reference
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Caption & Takeaways */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 space-y-1.5 leading-relaxed">
                <p className="font-bold flex items-center gap-1.5 text-stone-900 dark:text-white">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Interview Concept: C++ Memory Leak vs Java Garbage Collection</span>
                </p>
                <p>
                  In C++, reassigning <code className="font-mono font-bold">jill</code> without calling <code className="font-mono font-bold">delete</code> causes a <strong>permanent memory leak</strong> because the memory allocated for <code className="font-mono">"Jill", "Jones"</code> can never be recovered.
                </p>
                <p>
                  In Java, the JVM’s <strong>Garbage Collector (GC)</strong> detects that <code className="font-mono">"Jill", "Jones"</code> is no longer reachable by any active reference in the root set, and automatically frees its heap memory during the next GC cycle.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 6 USAGES OF THIS KEYWORD */}
        {oopTab === 'this-keyword' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-[#C53030] dark:text-[#FEB2B2] tracking-tight">
                Usage of Java this Keyword
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5568] dark:text-[#CBD5E0] max-w-xl mx-auto leading-relaxed">
                There can be a lot of usage of java this keyword. In java, <strong className="text-[#1F2421] dark:text-white">this</strong> is a reference variable that refers to the current object.
              </p>
            </div>

            {/* 6 Badges Grid replicating Image 5 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {thisUsagesList.map((item) => {
                const isSelected = activeThisUsage === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveThisUsage(item.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 shadow-sm ${
                      isSelected
                        ? 'border-[#244D38] dark:border-emerald-400 bg-white dark:bg-stone-800 ring-2 ring-emerald-400/20 scale-102'
                        : 'border-[#E8DFC8] dark:border-stone-800 bg-[#FAF6EE] dark:bg-stone-900 hover:border-stone-400'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-md ${item.color}`}>
                      {item.badge}
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#1F2421] dark:text-stone-200 leading-snug">
                      <span className="text-[#C53030] dark:text-[#FEB2B2] font-mono font-black">this</span> {item.text.replace('this ', '').replace('this() ', '')}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Interactive Code Snippet for Active Usage */}
            <div className="p-6 rounded-3xl bg-[#FAF6EE] dark:bg-[#251D17] border border-[#E8DFC8] dark:border-stone-800 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#244D38] dark:text-emerald-400 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" />
                  <span>Standard Java Pattern: Usage {activeThis.badge}</span>
                </span>
                <span className="text-xs font-mono font-bold text-[#C53030]">{activeThis.title}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#18130F] text-amber-100 font-mono text-xs space-y-1 border border-stone-800">
                {activeThis.code.map((line, idx) => (
                  <p key={idx} className="whitespace-pre">{line}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // TOPIC 19: ENCAPSULATION & PACKAGES (Reference Images 3 & 5)
  // =========================================================================
  if (orderIndex === 19 || slug.includes('encapsulation')) {
    const handleDeposit = () => {
      if (depositAmtInput <= 0) {
        setLastBankMsg('⚠️ Validation Error: Deposit amount must be positive!');
        return;
      }
      setBankBalance((prev) => prev + depositAmtInput);
      setLastBankMsg(`✅ Success: Deposited $${depositAmtInput.toFixed(2)} via public deposit() method.`);
    };

    const handleIllegalAccess = () => {
      setLastBankMsg('❌ Compiler Error: balance has private access in BankAccount. Direct modification is forbidden!');
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#244D38] dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: Java Encapsulation & Data Hiding</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            Private Safe Vault & Package Architecture
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800">
          <button
            onClick={() => setEncapTab('safe')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              encapTab === 'safe'
                ? 'bg-[#244D38] text-white shadow-md'
                : 'text-[#6B706B] dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>BankAccount Safe Vault (Reference Image 3)</span>
          </button>

          <button
            onClick={() => setEncapTab('packages')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              encapTab === 'packages'
                ? 'bg-[#244D38] text-white shadow-md'
                : 'text-[#6B706B] dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>Package Hierarchy (Reference Image 5)</span>
          </button>
        </div>

        {/* TAB 1: BANK SAFE (IMAGE 3) */}
        {encapTab === 'safe' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <span>Reference Image 3: Encapsulation Safe Model</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1F2421] dark:text-[#FAF6EE] tracking-tight">
                Data Hiding: BankAccount Safe Vault
              </h2>
              <p className="text-xs sm:text-sm text-[#6B706B] dark:text-[#BDB7AB] max-w-2xl mx-auto">
                Encapsulation keeps internal variables <strong className="text-red-600 dark:text-red-400">private</strong> to prevent direct tampering, exposing only authorized <strong className="text-emerald-600 dark:text-emerald-400">public methods</strong> (keys) with validation.
              </p>
            </div>

            {/* Visual Safe Vault Diagram Replicating Image 3 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 space-y-6">
              <div className="text-center text-xs font-mono font-bold text-stone-500 uppercase tracking-wider flex items-center justify-center gap-2">
                <span>Java Class</span>
                <ArrowDown className="w-4 h-4 text-stone-400" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-4xl mx-auto">
                {/* Left: The Steel Bank Vault (Image 3) */}
                <div className="lg:col-span-7 flex flex-col items-center">
                  <div className="relative w-full max-w-sm rounded-3xl bg-[#E2E8F0] dark:bg-stone-800 border-4 border-stone-600 dark:border-stone-500 shadow-2xl p-6 space-y-4">
                    {/* Safe Door Hinges */}
                    <div className="absolute left-2 top-8 w-2 h-6 bg-stone-500 rounded-sm" />
                    <div className="absolute left-2 bottom-8 w-2 h-6 bg-stone-500 rounded-sm" />

                    {/* Safe Header */}
                    <div className="text-center pb-2 border-b-2 border-stone-400 dark:border-stone-600">
                      <h3 className="text-2xl font-black text-stone-800 dark:text-stone-100 font-mono tracking-tight">
                        BankAccount
                      </h3>
                      <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                        Encapsulated Vault
                      </span>
                    </div>

                    {/* Inside Safe: Private Fields Box */}
                    <div className="p-4 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/30 border-2 border-cyan-400/80 dark:border-cyan-700/60 space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-bold text-red-600 dark:text-red-400">
                        <span>Private Fields</span>
                        <span className="text-[10px] font-normal text-stone-500">(inside class)</span>
                      </div>

                      {/* private balance */}
                      <div className="space-y-1">
                        <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400 block">
                          private balance
                        </span>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-red-300 dark:border-red-900 text-center font-mono font-black text-lg text-stone-900 dark:text-white shadow-inner">
                          ${bankBalance.toFixed(2)}
                        </div>
                      </div>

                      <div className="w-full border-t border-dashed border-cyan-300 dark:border-cyan-800" />

                      {/* private owner */}
                      <div className="space-y-1">
                        <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400 block">
                          private owner
                        </span>
                        <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-red-300 dark:border-red-900 text-center font-mono font-bold text-sm text-stone-800 dark:text-stone-200">
                          Alice
                        </div>
                      </div>
                    </div>

                    {/* Heavy Padlock on the safe door (Image 3) */}
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-stone-700 text-amber-300 shadow-2xl border-2 border-stone-500 ring-4 ring-black/10">
                      <Lock className="w-7 h-7" />
                    </div>
                  </div>
                </div>

                {/* Right: Public Methods (Accessible from outside with Keys) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-emerald-600" />
                      <span>Public Methods (Keys to Vault)</span>
                    </span>
                    <p className="text-[11px] text-stone-500">
                      External code can only interact through validated methods:
                    </p>
                  </div>

                  {/* Key 1: getBalance() */}
                  <div className="p-3.5 rounded-2xl border-2 border-emerald-500 bg-white dark:bg-stone-800 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black shrink-0 border border-emerald-300">
                      <Key className="w-5 h-5" />
                    </div>
                    <div className="font-mono text-xs">
                      <p className="font-black text-emerald-700 dark:text-emerald-400">getBalance()</p>
                      <span className="text-[10px] text-stone-500">Returns balance safely without modification</span>
                    </div>
                  </div>

                  {/* Key 2: deposit() */}
                  <div className="p-3.5 rounded-2xl border-2 border-emerald-500 bg-white dark:bg-stone-800 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black shrink-0 border border-emerald-300">
                      <Key className="w-5 h-5" />
                    </div>
                    <div className="font-mono text-xs">
                      <p className="font-black text-emerald-700 dark:text-emerald-400">deposit(double amount)</p>
                      <span className="text-[10px] text-stone-500">Validates amount &gt; 0 before updating</span>
                    </div>
                  </div>

                  {/* Interactive Safe Actions */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 space-y-3">
                    <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
                      Live Interaction Test
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={depositAmtInput}
                        onChange={(e) => setDepositAmtInput(Number(e.target.value))}
                        className="w-24 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-[#FAF6EE] dark:bg-stone-900 font-mono text-xs text-stone-900 dark:text-white"
                      />
                      <button
                        onClick={handleDeposit}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                      >
                        Call deposit()
                      </button>
                      <button
                        onClick={handleIllegalAccess}
                        className="px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-950/50 hover:bg-red-200 text-red-700 dark:text-red-300 font-bold text-xs border border-red-300 dark:border-red-800 transition-all"
                      >
                        Direct balance = -100
                      </button>
                    </div>

                    <p className="text-[11px] font-mono p-2 rounded-lg bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800">
                      {lastBankMsg}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom quote from Reference Image 3 */}
              <div className="text-center pt-2 border-t border-stone-300 dark:border-stone-800">
                <p className="text-xs sm:text-sm font-black text-stone-700 dark:text-stone-300 italic">
                  "The class controls access to its data. Use public methods to interact."
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PACKAGES (IMAGE 5) */}
        {encapTab === 'packages' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs font-bold">
                <span>Reference Image 5: Java Package Hierarchy Diagram</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1F2421] dark:text-[#FAF6EE] tracking-tight">
                Package Namespace: com.example.app.Main
              </h2>
              <p className="text-xs sm:text-sm text-[#6B706B] dark:text-[#BDB7AB] max-w-2xl mx-auto">
                Packages group related classes into directory namespaces to prevent naming collisions and enforce access boundaries (package-private vs public).
              </p>
            </div>

            {/* Replicating Image 5 Folder Hierarchy Staircase */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 space-y-8">
              {/* Header Label: com.example.app.Main with dotted arrows */}
              <div className="text-center">
                <span className="font-mono text-base sm:text-lg font-black text-stone-900 dark:text-white bg-white dark:bg-stone-800 px-6 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 shadow-sm inline-block">
                  com.example.app.Main
                </span>
                <p className="text-[11px] text-stone-500 mt-2 font-mono">
                  Full Qualified Class Name (FQCN) maps directly to filesystem directory structure:
                </p>
              </div>

              {/* Staircase Directory Tree */}
              <div className="max-w-md mx-auto space-y-3 font-mono text-xs">
                {/* 1. src (Grey root) */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-600 text-white shadow-md w-48">
                  <Folder className="w-5 h-5 text-stone-300" />
                  <span className="font-bold">src</span>
                  <span className="text-[10px] text-stone-300 ml-auto">(root)</span>
                </div>

                {/* 2. com (Cyan) */}
                <div className="ml-8 flex items-center gap-3 p-3 rounded-2xl bg-cyan-500 text-white shadow-md w-48">
                  <Folder className="w-5 h-5 text-cyan-100" />
                  <span className="font-bold">com</span>
                </div>

                {/* 3. example (Lime Yellow) */}
                <div className="ml-16 flex items-center gap-3 p-3 rounded-2xl bg-lime-500 text-stone-950 shadow-md w-48">
                  <Folder className="w-5 h-5 text-lime-950" />
                  <span className="font-black">example</span>
                </div>

                {/* 4. app (Orange) */}
                <div className="ml-24 flex items-center gap-3 p-3 rounded-2xl bg-orange-500 text-white shadow-md w-48">
                  <Folder className="w-5 h-5 text-orange-100" />
                  <span className="font-bold">app</span>
                </div>

                {/* 5. Main.java (Document icon) */}
                <div className="ml-32 flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-800 dark:border-stone-400 text-stone-900 dark:text-white shadow-lg w-52">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-black">Main.java</p>
                    <span className="text-[10px] text-stone-500">Main class definition</span>
                  </div>
                </div>
              </div>

              {/* Java Code File Declaration */}
              <div className="p-4 rounded-2xl bg-[#18130F] text-amber-100 font-mono text-xs space-y-1 border border-stone-800 max-w-md mx-auto shadow-inner">
                <p><span className="text-teal-400 font-bold">package</span> com.example.app; <span className="text-stone-500">// Line 1 must be package</span></p>
                <p><span className="text-teal-400 font-bold">public class</span> <span className="text-yellow-400 font-bold">Main</span> &#123;</p>
                <p className="pl-4"><span className="text-teal-400 font-bold">public static void</span> main(<span className="text-teal-400">String</span>[] args) &#123;</p>
                <p className="pl-8">System.out.println(<span className="text-emerald-300">"Running com.example.app.Main"</span>);</p>
                <p className="pl-4">&#125;</p>
                <p>&#125;</p>
              </div>

              {/* Access Modifiers Across Packages Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-stone-300 dark:border-stone-700 rounded-xl overflow-hidden">
                  <thead className="bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-black">
                    <tr>
                      <th className="p-2.5">Modifier</th>
                      <th className="p-2.5">Same Class</th>
                      <th className="p-2.5">Same Package</th>
                      <th className="p-2.5">Subclass (Diff Pkg)</th>
                      <th className="p-2.5">World (Any Pkg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300">
                    <tr>
                      <td className="p-2.5 font-bold font-mono text-emerald-600">public</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Yes</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Yes</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Yes</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Yes</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono text-blue-600">protected</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Yes</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Yes</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Yes</td>
                      <td className="p-2.5 text-red-500 font-bold">✗ No</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono text-amber-600">default (no keyword)</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Yes</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Yes</td>
                      <td className="p-2.5 text-red-500 font-bold">✗ No</td>
                      <td className="p-2.5 text-red-500 font-bold">✗ No</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono text-red-600">private</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Yes</td>
                      <td className="p-2.5 text-red-500 font-bold">✗ No</td>
                      <td className="p-2.5 text-red-500 font-bold">✗ No</td>
                      <td className="p-2.5 text-red-500 font-bold">✗ No</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // TOPIC 20: INHERITANCE (Exact Parent Class -> Child Class from Reference Image 5)
  // =========================================================================
  if (orderIndex === 20 || slug.includes('inheritance')) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#244D38] dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: Java Inheritance Architecture</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            Parent Class $\rightarrow$ Child Class Model
          </span>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs font-bold">
              <span>Reference Image 5: Parent Class $\rightarrow$ Child Class Hierarchy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1F2421] dark:text-[#FAF6EE] tracking-tight">
              Java Inheritance (IS-A Relationship)
            </h2>
            <p className="text-xs sm:text-sm text-[#6B706B] dark:text-[#BDB7AB] max-w-2xl mx-auto">
              Inheritance is the mechanism in Java by which one class inherits the fields and methods of another class using the <strong className="text-[#244D38] dark:text-emerald-400 font-mono">extends</strong> keyword.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setInheritanceType('single')}
              className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                inheritanceType === 'single'
                  ? 'bg-[#244D38] text-white shadow-md'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              Single Inheritance (Image 5)
            </button>
            <button
              onClick={() => setInheritanceType('multilevel')}
              className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                inheritanceType === 'multilevel'
                  ? 'bg-[#244D38] text-white shadow-md'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              Multilevel Inheritance
            </button>
            <button
              onClick={() => setInheritanceType('hierarchical')}
              className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                inheritanceType === 'hierarchical'
                  ? 'bg-[#244D38] text-white shadow-md'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              Hierarchical Inheritance
            </button>
          </div>

          {/* DIAGRAM SECTION: Exact Image 5 Recreation */}
          <div className="p-8 rounded-3xl bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 flex flex-col items-center justify-center gap-4">
            {/* SINGLE INHERITANCE: Direct Image 5 Match */}
            {inheritanceType === 'single' && (
              <div className="flex flex-col items-center gap-3 w-full max-w-sm">
                {/* Parent Class Box (Blue rounded card) */}
                <div className="w-full py-5 px-6 rounded-2xl bg-[#3B82F6] dark:bg-[#2563EB] text-white text-center shadow-lg border-2 border-blue-400 space-y-1">
                  <h3 className="text-xl font-black tracking-wide">Parent Class</h3>
                  <span className="text-[11px] text-blue-100 block font-mono">
                    (Super Class / Base Class)
                  </span>
                  <div className="pt-2 text-xs font-mono text-blue-100 border-t border-blue-400/40">
                    <p>String familyName;</p>
                    <p>void displayInfo() &#123; ... &#125;</p>
                  </div>
                </div>

                {/* Downward Red Arrow labeled 'extends' */}
                <div className="flex flex-col items-center my-1 text-red-600 dark:text-red-400">
                  <span className="px-3 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-mono text-[11px] font-black tracking-wider border border-red-200 dark:border-red-800 shadow-sm">
                    extends (IS-A)
                  </span>
                  <ArrowDown className="w-8 h-8 text-red-500 dark:text-red-400 stroke-[3]" />
                </div>

                {/* Child Class Box (Blue rounded card) */}
                <div className="w-full py-5 px-6 rounded-2xl bg-[#3B82F6] dark:bg-[#2563EB] text-white text-center shadow-lg border-2 border-blue-400 space-y-1">
                  <h3 className="text-xl font-black tracking-wide">Child Class</h3>
                  <span className="text-[11px] text-blue-100 block font-mono">
                    (Sub Class / Derived Class)
                  </span>
                  <div className="pt-2 text-xs font-mono text-blue-100 border-t border-blue-400/40">
                    <p className="text-emerald-200 font-bold">// Inherits familyName & displayInfo()</p>
                    <p>void childMethod() &#123; ... &#125;</p>
                  </div>
                </div>
              </div>
            )}

            {/* MULTILEVEL INHERITANCE */}
            {inheritanceType === 'multilevel' && (
              <div className="flex flex-col items-center gap-2 w-full max-w-sm">
                <div className="w-full py-3 px-4 rounded-xl bg-[#3B82F6] text-white text-center font-black text-sm shadow">
                  Grandparent Class (Animal)
                </div>
                <ArrowDown className="w-5 h-5 text-red-500 stroke-[3]" />
                <div className="w-full py-3 px-4 rounded-xl bg-[#3B82F6] text-white text-center font-black text-sm shadow">
                  Parent Class (Mammal extends Animal)
                </div>
                <ArrowDown className="w-5 h-5 text-red-500 stroke-[3]" />
                <div className="w-full py-3 px-4 rounded-xl bg-[#3B82F6] text-white text-center font-black text-sm shadow">
                  Child Class (Dog extends Mammal)
                </div>
              </div>
            )}

            {/* HIERARCHICAL INHERITANCE */}
            {inheritanceType === 'hierarchical' && (
              <div className="flex flex-col items-center gap-3 w-full max-w-md">
                <div className="w-64 py-3 px-4 rounded-xl bg-[#3B82F6] text-white text-center font-black text-sm shadow">
                  Parent Class (Vehicle)
                </div>
                <div className="flex items-center gap-12 text-red-500">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold">extends</span>
                    <ArrowDown className="w-5 h-5 stroke-[3]" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold">extends</span>
                    <ArrowDown className="w-5 h-5 stroke-[3]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="py-3 px-4 rounded-xl bg-[#3B82F6] text-white text-center font-black text-xs shadow">
                    Child Class A (Car)
                  </div>
                  <div className="py-3 px-4 rounded-xl bg-[#3B82F6] text-white text-center font-black text-xs shadow">
                    Child Class B (Bike)
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live Code Implementation Card */}
          <div className="p-6 rounded-3xl bg-[#FAF6EE] dark:bg-[#251D17] border border-[#E8DFC8] dark:border-stone-800 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#244D38] dark:text-emerald-400 flex items-center gap-1.5">
                <Code2 className="w-4 h-4" />
                <span>Java Implementation Syntax</span>
              </span>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">extends keyword</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#18130F] text-amber-100 font-mono text-xs space-y-1 border border-stone-800">
              <p><span className="text-stone-500">// 1. Parent Class Definition</span></p>
              <p><span className="text-teal-400 font-bold">class</span> <span className="text-yellow-400 font-bold">Parent</span> &#123;</p>
              <p className="pl-4"><span className="text-teal-400">String</span> familyName = <span className="text-emerald-300">"Sharma"</span>;</p>
              <p className="pl-4"><span className="text-teal-400 font-bold">void</span> display() &#123;</p>
              <p className="pl-8">System.out.println(<span className="text-emerald-300">"Family: "</span> + familyName);</p>
              <p className="pl-4">&#125;</p>
              <p>&#125;</p>
              <p className="pt-2"><span className="text-stone-500">// 2. Child Class inherits from Parent</span></p>
              <p><span className="text-teal-400 font-bold">class</span> <span className="text-yellow-400 font-bold">Child</span> <span className="text-pink-400 font-bold">extends</span> <span className="text-yellow-400 font-bold">Parent</span> &#123;</p>
              <p className="pl-4"><span className="text-teal-400 font-bold">void</span> greet() &#123;</p>
              <p className="pl-8"><span className="text-pink-400 font-bold">super</span>.display(); <span className="text-stone-500">// invokes parent method</span></p>
              <p className="pl-8">System.out.println(<span className="text-emerald-300">"Child class specific behavior"</span>);</p>
              <p className="pl-4">&#125;</p>
              <p>&#125;</p>
            </div>

            {/* Placement Takeaways */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs">
                <strong className="text-stone-900 dark:text-white block pb-1">Code Reusability</strong>
                <span className="text-stone-600 dark:text-stone-400 text-[11px]">Child classes reuse verified parent code without duplicate implementation.</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs">
                <strong className="text-stone-900 dark:text-white block pb-1">Method Overriding</strong>
                <span className="text-stone-600 dark:text-stone-400 text-[11px]">Child can provide its own specialized implementation with @Override.</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs">
                <strong className="text-stone-900 dark:text-white block pb-1">Diamond Problem</strong>
                <span className="text-stone-600 dark:text-stone-400 text-[11px]">Multiple inheritance with classes is forbidden in Java to prevent ambiguity.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TOPIC 21: POLYMORPHISM (Reference Image 1)
  // =========================================================================
  if (orderIndex === 21 || slug.includes('polymorphism')) {
    const animals = [
      { name: 'Dog', icon: '🐶', sound: 'Bark! Woof!', code: 'System.out.println("Woof! Bark!");', color: 'border-amber-400 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300' },
      { name: 'Cat', icon: '🐱', sound: 'Meow~', code: 'System.out.println("Meow~");', color: 'border-orange-300 bg-orange-50 dark:bg-orange-950/30 text-orange-800 dark:text-orange-300' },
      { name: 'Cow', icon: '🐮', sound: 'Moo~', code: 'System.out.println("Moo~");', color: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300' },
    ];

    const currentAnimal = animals.find((a) => a.name === activeAnimalSound) || animals[0];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#244D38] dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: Java Polymorphism</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            Compile-Time vs Runtime Polymorphism
          </span>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs font-bold">
              <span>Reference Image 1: Java Polymorphism Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-800 dark:text-white tracking-tight">
              JAVA POLYMORPHISM
            </h2>
            <p className="text-xs sm:text-sm text-[#6B706B] dark:text-[#BDB7AB] max-w-2xl mx-auto">
              "Poly" (many) + "Morph" (forms). Ability of a message or method to be displayed or executed in more than one form.
            </p>
          </div>

          {/* 2-Column Architecture Replicating Image 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: COMPILE-TIME (METHOD OVERLOADING) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 space-y-4 shadow-sm h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-center space-y-0.5">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-300">
                    Compile-Time
                  </span>
                  <h3 className="text-sm font-black text-stone-900 dark:text-white">
                    (METHOD OVERLOADING)
                  </h3>
                </div>

                {/* Box from Image 1 */}
                <div className="p-5 rounded-2xl bg-white dark:bg-stone-800 border-2 border-blue-300 dark:border-blue-700 font-mono text-sm font-bold text-stone-900 dark:text-white space-y-2 text-center shadow-sm">
                  <p className="text-blue-600 dark:text-blue-400">void print(int a)</p>
                  <p className="text-blue-600 dark:text-blue-400">void print(String s)</p>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Resolved during compilation (*early/static binding*). Methods share identical names but vary by argument count, types, or order.
                </p>
              </div>

              {/* Interactive Caller */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 space-y-2.5">
                <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
                  Interactive Compiler Binding:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPolyOverloadVal('int')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      polyOverloadVal === 'int'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    print(42)
                  </button>
                  <button
                    onClick={() => setPolyOverloadVal('string')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      polyOverloadVal === 'string'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    print("Java")
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-[#18130F] text-amber-100 font-mono text-[11px]">
                  {polyOverloadVal === 'int' ? (
                    <p><span className="text-stone-500">// Bound to:</span> void print(int a) → Output: 42</p>
                  ) : (
                    <p><span className="text-stone-500">// Bound to:</span> void print(String s) → Output: "Java"</p>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: RUNTIME (METHOD OVERRIDING) */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 space-y-4 shadow-sm">
              <div className="text-center space-y-0.5">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Runtime
                </span>
                <h3 className="text-sm font-black text-stone-900 dark:text-white">
                  (METHOD OVERRIDING)
                </h3>
              </div>

              {/* Tree Diagram Replicating Image 1 */}
              <div className="flex flex-col items-center space-y-3 pt-2">
                {/* Parent Box: Animal -> makeSound() */}
                <div className="w-52 py-3 px-4 rounded-2xl bg-blue-100 dark:bg-blue-950/60 border-2 border-blue-400 dark:border-blue-700 text-center font-mono shadow-sm">
                  <h4 className="text-sm font-black text-stone-900 dark:text-white">Animal</h4>
                  <p className="text-xs font-bold text-blue-700 dark:text-blue-300">makeSound()</p>
                </div>

                {/* Branching Line */}
                <div className="w-full max-w-xs flex items-center justify-between text-stone-400">
                  <div className="w-full h-0.5 bg-stone-400 mx-auto" />
                </div>

                {/* 3 Children Boxes: Dog, Cat, Cow */}
                <div className="grid grid-cols-3 gap-3 w-full">
                  {animals.map((item) => {
                    const isSelected = activeAnimalSound === item.name;
                    return (
                      <div
                        key={item.name}
                        onClick={() => setActiveAnimalSound(item.name as any)}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-1 shadow-sm ${
                          isSelected
                            ? 'border-[#244D38] dark:border-emerald-400 bg-white dark:bg-stone-800 ring-2 ring-emerald-400/20 scale-105'
                            : `${item.color} hover:scale-102`
                        }`}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <h5 className="font-mono text-xs font-black">{item.name}</h5>
                        <span className="text-[10px] font-mono text-stone-500">@Override</span>
                        <span className="text-[10px] font-bold text-stone-700 dark:text-stone-300">makeSound()</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Dynamic Method Dispatch Simulator */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dynamic Method Dispatch (Late Binding)</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                    Object: {currentAnimal.name}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#18130F] text-amber-100 font-mono text-xs space-y-1">
                  <p><span className="text-teal-400 font-bold">Animal</span> a = <span className="text-yellow-400 font-bold">new</span> {currentAnimal.name}(); <span className="text-stone-500">// Upcasting</span></p>
                  <p>a.makeSound(); <span className="text-stone-500">// Dynamic dispatch looks up Heap object at runtime</span></p>
                  <p className="text-emerald-300 font-bold pt-1">▶ Output: "{currentAnimal.sound}"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TOPIC 22: ABSTRACTION & INTERFACES (Reference Images 2 & 4)
  // =========================================================================
  if (orderIndex === 22 || slug.includes('abstraction') || slug.includes('interface')) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#244D38] dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: Java Abstraction & Interfaces</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            UML Abstract Classes & Pure Interface Scrolls
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800">
          <button
            onClick={() => setAbstractTab('shapes')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              abstractTab === 'shapes'
                ? 'bg-[#244D38] text-white shadow-md'
                : 'text-[#6B706B] dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Abstract Class: Shape UML (Reference Image 2)</span>
          </button>

          <button
            onClick={() => setAbstractTab('interfaces')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              abstractTab === 'interfaces'
                ? 'bg-[#244D38] text-white shadow-md'
                : 'text-[#6B706B] dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Interface Contracts: Animal Scrolls (Reference Image 4)</span>
          </button>
        </div>

        {/* TAB 1: ABSTRACT CLASSES (IMAGE 2) */}
        {abstractTab === 'shapes' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold">
                <span>Reference Image 2: An abstract class example</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1F2421] dark:text-[#FAF6EE] tracking-tight">
                Abstract Class Shape & Derived Subclasses
              </h2>
              <p className="text-xs sm:text-sm text-[#6B706B] dark:text-[#BDB7AB] max-w-2xl mx-auto">
                An <strong className="text-amber-700 dark:text-amber-400">abstract class</strong> cannot be instantiated directly with <code className="font-mono">new</code>. It defines an abstract template (<code className="font-mono">void draw();</code>) that subclasses must implement.
              </p>
            </div>

            {/* UML Diagram Replicating Image 2 */}
            <div className="p-8 rounded-3xl bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 flex flex-col items-center justify-center gap-6">
              {/* Top: (A) Shape */}
              <div className="w-48 rounded-xl border-2 border-red-800 dark:border-red-600 bg-[#FFFFE0] dark:bg-stone-800 shadow-lg overflow-hidden text-center">
                <div className="p-2.5 flex items-center justify-center gap-2 border-b-2 border-red-800 dark:border-red-600">
                  <div className="w-6 h-6 rounded-full bg-cyan-200 text-stone-900 font-black text-xs flex items-center justify-center border border-cyan-400">
                    A
                  </div>
                  <span className="font-black text-sm italic font-serif text-stone-900 dark:text-white">Shape</span>
                </div>
                <div className="p-2 text-xs font-mono italic text-stone-800 dark:text-stone-200">
                  void draw()
                </div>
              </div>

              {/* Upward Hollow Arrows (UML Generalization) */}
              <div className="flex items-center justify-center gap-28 text-red-800 dark:text-red-400">
                <div className="flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-red-800 dark:border-b-red-400" />
                  <div className="w-0.5 h-12 bg-red-800 dark:bg-red-400" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-red-800 dark:border-b-red-400" />
                  <div className="w-0.5 h-12 bg-red-800 dark:bg-red-400" />
                </div>
              </div>

              {/* Bottom: (C) Circle and (C) Rectangle */}
              <div className="flex flex-wrap items-center justify-center gap-8">
                {/* Circle */}
                <div
                  onClick={() => setSelectedShape('Circle')}
                  className={`w-44 rounded-xl border-2 cursor-pointer transition-all overflow-hidden text-center shadow-md ${
                    selectedShape === 'Circle'
                      ? 'border-emerald-600 ring-2 ring-emerald-400/30 scale-105'
                      : 'border-red-800 dark:border-red-600'
                  } bg-[#FFFFE0] dark:bg-stone-800`}
                >
                  <div className="p-2 flex items-center justify-center gap-2 border-b-2 border-red-800 dark:border-red-600">
                    <div className="w-5 h-5 rounded-full bg-emerald-200 text-stone-900 font-black text-xs flex items-center justify-center border border-emerald-400">
                      C
                    </div>
                    <span className="font-black text-xs font-serif text-stone-900 dark:text-white">Circle</span>
                  </div>
                  <div className="p-2 text-xs font-mono text-stone-800 dark:text-stone-200">
                    draw()
                  </div>
                </div>

                {/* Rectangle */}
                <div
                  onClick={() => setSelectedShape('Rectangle')}
                  className={`w-44 rounded-xl border-2 cursor-pointer transition-all overflow-hidden text-center shadow-md ${
                    selectedShape === 'Rectangle'
                      ? 'border-emerald-600 ring-2 ring-emerald-400/30 scale-105'
                      : 'border-red-800 dark:border-red-600'
                  } bg-[#FFFFE0] dark:bg-stone-800`}
                >
                  <div className="p-2 flex items-center justify-center gap-2 border-b-2 border-red-800 dark:border-red-600">
                    <div className="w-5 h-5 rounded-full bg-emerald-200 text-stone-900 font-black text-xs flex items-center justify-center border border-emerald-400">
                      C
                    </div>
                    <span className="font-black text-xs font-serif text-stone-900 dark:text-white">Rectangle</span>
                  </div>
                  <div className="p-2 text-xs font-mono text-stone-800 dark:text-stone-200">
                    draw()
                  </div>
                </div>
              </div>

              {/* Subtitle from Reference Image 2 */}
              <p className="text-xs font-serif italic text-stone-600 dark:text-stone-400 pt-2">
                An abstract class example
              </p>

              {/* Interactive Canvas Preview */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 w-full max-w-md space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
                  <span>Interactive Polymorphic Execution</span>
                  <span className="font-mono text-emerald-600">Shape s = new {selectedShape}()</span>
                </div>

                <div className="h-24 rounded-xl bg-[#FAF6EE] dark:bg-stone-900 flex items-center justify-center border border-dashed border-stone-300 dark:border-stone-700">
                  {selectedShape === 'Circle' ? (
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 border-4 border-blue-600 flex items-center justify-center font-bold text-xs text-blue-700">
                      Circle
                    </div>
                  ) : (
                    <div className="w-28 h-14 rounded-lg bg-amber-500/20 border-4 border-amber-600 flex items-center justify-center font-bold text-xs text-amber-700">
                      Rectangle
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTERFACES (IMAGE 4) */}
        {abstractTab === 'interfaces' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 text-xs font-bold">
                <span>Reference Image 4: Java Language Interface Contract Scrolls</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1F2421] dark:text-[#FAF6EE] tracking-tight">
                Interface Animal & Implementing Classes
              </h2>
              <p className="text-xs sm:text-sm text-[#6B706B] dark:text-[#BDB7AB] max-w-2xl mx-auto">
                An <strong className="text-purple-700 dark:text-purple-300">interface</strong> is a 100% abstract contract. Any class that implements it must provide bodies for all contract methods.
              </p>
            </div>

            {/* Replicating Image 4 Ancient Scrolls Architecture */}
            <div className="p-8 rounded-3xl bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 flex flex-col items-center justify-center gap-6">
              <span className="px-3 py-1 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-serif font-bold text-xs">
                Java Language
              </span>

              {/* Top Scroll: Animal (interface) */}
              <div className="relative w-64 p-5 rounded-2xl bg-[#FFFDF8] dark:bg-stone-800 border-2 border-stone-800 dark:border-stone-400 shadow-xl space-y-2 font-mono text-xs">
                <div className="text-blue-600 dark:text-blue-400 space-y-0.5">
                  <p>void move();</p>
                  <p>void cry();</p>
                </div>
                <div className="pt-2 border-t border-stone-300 dark:border-stone-700 text-center font-bold">
                  <span className="text-red-600 dark:text-red-400">Animal</span>
                  <span className="text-stone-500 text-[11px]"> (interface)</span>
                </div>
              </div>

              {/* Dashed Upward Implementation Arrows */}
              <div className="flex items-center justify-center gap-36 text-stone-500">
                <div className="flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-stone-500" />
                  <div className="w-0.5 h-10 border-l-2 border-dashed border-stone-400" />
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-stone-500" />
                  <div className="w-0.5 h-10 border-l-2 border-dashed border-stone-400" />
                </div>
              </div>

              {/* Bottom 2 Scrolls: Cat and Dog */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-xl">
                {/* Cat Scroll */}
                <div className="p-5 rounded-2xl bg-[#FFFDF8] dark:bg-stone-800 border-2 border-stone-800 dark:border-stone-400 shadow-xl space-y-2 font-mono text-xs">
                  <div className="text-blue-600 dark:text-blue-400 space-y-0.5">
                    <p>public void move() &#123;</p>
                    <p className="pl-4 text-stone-400">...</p>
                    <p>&#125;</p>
                    <p>public void cry() &#123;</p>
                    <p className="pl-4 text-emerald-600 dark:text-emerald-400">// meow ..</p>
                    <p>&#125;</p>
                  </div>
                  <div className="pt-2 border-t border-stone-300 dark:border-stone-700 text-center font-bold">
                    <span className="text-red-600 dark:text-red-400">Cat</span>
                    <span className="text-stone-500 text-[11px]"> (class)</span>
                  </div>
                </div>

                {/* Dog Scroll */}
                <div className="p-5 rounded-2xl bg-[#FFFDF8] dark:bg-stone-800 border-2 border-stone-800 dark:border-stone-400 shadow-xl space-y-2 font-mono text-xs">
                  <div className="text-blue-600 dark:text-blue-400 space-y-0.5">
                    <p>public void move() &#123;</p>
                    <p className="pl-4 text-stone-400">...</p>
                    <p>&#125;</p>
                    <p>public void cry() &#123;</p>
                    <p className="pl-4 text-emerald-600 dark:text-emerald-400">// au au ..</p>
                    <p>&#125;</p>
                  </div>
                  <div className="pt-2 border-t border-stone-300 dark:border-stone-700 text-center font-bold">
                    <span className="text-red-600 dark:text-red-400">Dog</span>
                    <span className="text-stone-500 text-[11px]"> (class)</span>
                  </div>
                </div>
              </div>

              {/* Comparison Matrix: Abstract Class vs Interface */}
              <div className="w-full max-w-xl overflow-x-auto pt-2">
                <table className="w-full text-left text-xs border border-stone-300 dark:border-stone-700 rounded-xl overflow-hidden">
                  <thead className="bg-stone-200 dark:bg-stone-800 font-bold">
                    <tr>
                      <th className="p-2.5">Feature</th>
                      <th className="p-2.5">Abstract Class</th>
                      <th className="p-2.5">Interface</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-700 bg-white dark:bg-stone-900">
                    <tr>
                      <td className="p-2.5 font-bold">Multiple Inheritance</td>
                      <td className="p-2.5 text-red-500">✗ No (Single extends)</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Yes (implements A, B)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Instance Variables</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Any state fields</td>
                      <td className="p-2.5 text-amber-600">Only public static final constants</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Constructor</td>
                      <td className="p-2.5 text-emerald-600 font-bold">✓ Can have constructors</td>
                      <td className="p-2.5 text-red-500">✗ No constructors allowed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // TOPIC 23: EXCEPTION HANDLING (Reference Image 1: Try-Catch-Finally Flowchart)
  // =========================================================================
  if (orderIndex === 23 || slug.includes('exception')) {
    const isException = exceptionScenario === 'error';

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#244D38] dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: Java Exception Handling</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            try-catch-finally Execution Flowchart
          </span>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs font-bold">
              <span>Reference Image 1: Exception Flowchart Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1F2421] dark:text-[#FAF6EE] tracking-tight">
              try, catch, and finally Control Flow
            </h2>
            <p className="text-xs sm:text-sm text-[#6B706B] dark:text-[#BDB7AB] max-w-2xl mx-auto">
              The <strong className="text-blue-600 dark:text-blue-400">try</strong> block contains risky code, <strong className="text-blue-600 dark:text-blue-400">catch</strong> handles errors when thrown, and <strong className="text-blue-600 dark:text-blue-400">finally</strong> executes unconditionally.
            </p>
          </div>

          {/* Interactive Scenario Selector */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setExceptionScenario('error');
                setExceptionDivisor(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                exceptionScenario === 'error'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              Scenario A: Exception Generated (10 / 0)
            </button>
            <button
              onClick={() => {
                setExceptionScenario('success');
                setExceptionDivisor(2);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                exceptionScenario === 'success'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              Scenario B: Normal Execution (10 / 2)
            </button>
          </div>

          {/* FLOWCHART: Replicating Image 1 */}
          <div className="p-8 rounded-3xl bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center max-w-lg w-full relative">
              {/* 1. try block (Blue Rectangle) */}
              <div
                className={`w-48 py-4 px-6 rounded-xl text-white text-center font-bold text-base shadow-md transition-all ${
                  'bg-[#0284C7] ring-4 ring-cyan-400/30'
                }`}
              >
                try block
              </div>

              {/* Downward Arrow */}
              <div className="my-2 flex flex-col items-center">
                <ArrowDown className="w-6 h-6 text-stone-500 stroke-[2.5]" />
              </div>

              {/* 2. code generates exceptions (Red Diamond) */}
              <div className="relative flex items-center justify-center my-4">
                <div
                  className={`w-36 h-36 rotate-45 rounded-xl shadow-lg transition-all flex items-center justify-center ${
                    'bg-[#DC2626] ring-4 ring-red-400/30'
                  }`}
                />
                <span className="absolute font-bold text-xs text-white text-center pointer-events-none px-4 leading-snug">
                  code generates exceptions
                </span>
              </div>

              {/* Decision Branches */}
              <div className="w-full flex items-start justify-between relative mt-2">
                {/* Branch No (Downwards to finally) */}
                <div className="flex flex-col items-center ml-12">
                  <span className={`text-xs font-mono font-bold mb-1 ${!isException ? 'text-emerald-600 font-black' : 'text-stone-500'}`}>
                    No ↓
                  </span>
                  <div className={`w-0.5 h-16 ${!isException ? 'bg-emerald-500 w-1' : 'bg-stone-400'}`} />
                </div>

                {/* Branch Yes (Right to catch block) */}
                <div className="flex items-center gap-3 mr-4">
                  <span className={`text-xs font-mono font-bold ${isException ? 'text-red-600 font-black' : 'text-stone-500'}`}>
                    Yes →
                  </span>
                  {/* catch block */}
                  <div
                    className={`w-44 py-4 px-4 rounded-xl text-white text-center font-bold text-sm shadow-md transition-all ${
                      isException ? 'bg-[#0284C7] ring-4 ring-blue-400/40' : 'bg-[#0284C7]/60 opacity-60'
                    }`}
                  >
                    catch block
                  </div>
                </div>
              </div>

              {/* Exceptions Processed line from catch block down and left */}
              {isException && (
                <div className="self-end mr-24 flex flex-col items-end my-1">
                  <div className="h-8 w-0.5 bg-blue-500" />
                  <span className="text-[10px] font-mono text-blue-600 font-bold pr-1">
                    Exceptions Processed ↙
                  </span>
                </div>
              )}

              {/* 3. finally block (Blue Rectangle) */}
              <div
                className={`w-48 py-4 px-6 rounded-xl text-white text-center font-bold text-base shadow-md mt-4 transition-all ${
                  'bg-[#0284C7] ring-4 ring-emerald-400/40'
                }`}
              >
                finally block
              </div>
            </div>
          </div>

          {/* Interactive Code Trace */}
          <div className="p-5 rounded-2xl bg-[#18130F] text-amber-100 font-mono text-xs space-y-1.5 border border-stone-800 shadow-inner">
            <div className="flex items-center justify-between pb-1 border-b border-stone-800 text-stone-400 text-[11px]">
              <span className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5 text-teal-400" /> Java Execution Trace</span>
              <span className={isException ? 'text-red-400' : 'text-emerald-400'}>
                {isException ? 'Exception Caught & Handled' : 'Clean Execution'}
              </span>
            </div>
            <p><span className="text-teal-400 font-bold">try</span> &#123;</p>
            <p className="pl-4">int res = 10 / {exceptionDivisor}; <span className="text-stone-500">{isException ? '// 💥 ArithmeticException: / by zero' : '// ✓ Result: 5'}</span></p>
            <p>&#125; <span className="text-teal-400 font-bold">catch</span> (ArithmeticException e) &#123;</p>
            <p className="pl-4 text-emerald-300">System.out.println("Handled: Cannot divide by zero");</p>
            <p>&#125; <span className="text-teal-400 font-bold">finally</span> &#123;</p>
            <p className="pl-4 text-cyan-300">System.out.println("Finally block ALWAYS runs (closes streams/connections)");</p>
            <p>&#125;</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TOPIC 24: COLLECTIONS FRAMEWORK (Reference Images 3, 4, 5)
  // =========================================================================
  if (orderIndex === 24 || slug.includes('collection')) {
    const tableData = [
      {
        type: 'List',
        characteristics: 'Ordered, allows duplicates',
        useCase: 'When the order of elements matters and you need index-based access.',
        implementations: 'ArrayList: Fast random access; better for frequent retrieval.\nLinkedList: Efficient for frequent insertions/deletions.',
        code: 'List<String> list = new ArrayList<>();\nlist.add("Apple");\nlist.add("Apple"); // Duplicates OK\nString item = list.get(0); // Fast O(1) by index',
      },
      {
        type: 'Set',
        characteristics: 'Unordered, no duplicates',
        useCase: 'When you need to ensure uniqueness and fast membership testing.',
        implementations: 'HashSet: Fast access; no duplicates.\nTreeSet: Sorted order of elements.\nLinkedHashSet: Maintains insertion order.',
        code: 'Set<Integer> set = new HashSet<>();\nset.add(10);\nset.add(10); // Ignored! Size = 1\nboolean has = set.contains(10); // O(1) lookup',
      },
      {
        type: 'Map',
        characteristics: 'Key-value pairs',
        useCase: 'When you need to associate unique keys with values and perform fast lookups.',
        implementations: 'HashMap: Fast, unordered map; allows null keys/values.\nTreeMap: Sorted map by keys.\nLinkedHashMap: Maintains insertion order.',
        code: 'Map<String, Integer> map = new HashMap<>();\nmap.put("Alice", 95);\nint score = map.get("Alice"); // O(1) key lookup',
      },
      {
        type: 'Queue',
        characteristics: 'FIFO order',
        useCase: 'When you need to process elements in the order they arrive.',
        implementations: 'LinkedList: Implements a queue (also a stack).\nPriorityQueue: Processes elements based on priority.',
        code: 'Queue<String> q = new LinkedList<>();\nq.offer("Job1");\nq.offer("Job2");\nString next = q.poll(); // FIFO -> Job1',
      },
      {
        type: 'Dequeue',
        characteristics: 'Double-ended queue',
        useCase: 'When you need to add or remove elements from both ends efficiently.',
        implementations: 'ArrayDeque: Resizable array implementation of a double-ended queue.\nLinkedList: Linked list implementation for flexibility.',
        code: 'Deque<Integer> dq = new ArrayDeque<>();\ndq.addFirst(10);\ndq.addLast(20);\nint val = dq.removeLast(); // 20',
      },
    ];

    const activeItem = tableData.find((d) => d.type === selectedColType) || tableData[0];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#244D38] dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: Java Collections Framework</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            Hierarchy, Metaphor Tree & Comparison Table
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800">
          <button
            onClick={() => setCollectionTab('hierarchy')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              collectionTab === 'hierarchy'
                ? 'bg-[#244D38] text-white shadow-md'
                : 'text-[#6B706B] dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Hierarchy Architecture (Reference Image 3)</span>
          </button>

          <button
            onClick={() => setCollectionTab('table')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              collectionTab === 'table'
                ? 'bg-[#244D38] text-white shadow-md'
                : 'text-[#6B706B] dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Characteristics & Use-Cases Table (Reference Image 5)</span>
          </button>

          <button
            onClick={() => setCollectionTab('tree')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              collectionTab === 'tree'
                ? 'bg-[#244D38] text-white shadow-md'
                : 'text-[#6B706B] dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Collections Garden Tree (Reference Image 4)</span>
          </button>
        </div>

        {/* TAB 1: HIERARCHY ARCHITECTURE (IMAGE 3) */}
        {collectionTab === 'hierarchy' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs font-bold">
                <span>Reference Image 3: Hierarchy of Collection Framework</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                Hierarchy of Collection Framework in Java
              </h2>
              <p className="text-xs sm:text-sm text-[#6B706B] dark:text-[#BDB7AB] max-w-2xl mx-auto">
                Separated into two root hierarchies: <strong className="text-pink-600 dark:text-pink-400">Collection</strong> (elements) and <strong className="text-pink-600 dark:text-pink-400">Map</strong> (key-value pairs).
              </p>
            </div>

            {/* Complete Replicated Diagram of Image 3 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 space-y-8 overflow-x-auto">
              <div className="min-w-[700px] grid grid-cols-12 gap-6">
                {/* LEFT HIERARCHY: Collection (Cols 1-8) */}
                <div className="col-span-8 space-y-4">
                  {/* Top: Iterable */}
                  <div className="flex flex-col items-center">
                    <div className="px-5 py-2 rounded-lg bg-[#F87171]/90 text-white font-bold text-xs shadow border border-red-300">
                      Iterable
                    </div>
                    <div className="w-0.5 h-4 bg-stone-500" />
                    {/* Collection */}
                    <div className="px-6 py-2.5 rounded-lg bg-[#F87171] text-white font-black text-sm shadow-md border border-red-400">
                      Collection
                    </div>
                    <div className="w-0.5 h-4 bg-stone-500" />
                  </div>

                  {/* 3 Core Interfaces: List | Queue | Set */}
                  <div className="grid grid-cols-3 gap-4 pt-1">
                    {/* 1. List Interface */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-full py-2 rounded-lg bg-[#F87171] text-white text-center font-bold text-xs shadow">
                        List
                      </div>
                      <div className="w-full space-y-1.5 font-mono text-[11px]">
                        <div className="py-1.5 px-2 rounded-md bg-[#67E8F9] text-stone-900 text-center font-bold shadow-sm">ArrayList</div>
                        <div className="py-1.5 px-2 rounded-md bg-[#67E8F9] text-stone-900 text-center font-bold shadow-sm">LinkedList</div>
                        <div className="py-1.5 px-2 rounded-md bg-[#67E8F9] text-stone-900 text-center font-bold shadow-sm">Vector</div>
                        <div className="py-1.5 px-2 rounded-md bg-[#67E8F9] text-stone-900 text-center font-bold shadow-sm">Stack</div>
                      </div>
                    </div>

                    {/* 2. Queue Interface */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-full py-2 rounded-lg bg-[#F87171] text-white text-center font-bold text-xs shadow">
                        Queue
                      </div>
                      <div className="w-full space-y-1.5 font-mono text-[11px]">
                        <div className="py-1.5 px-2 rounded-md bg-[#67E8F9] text-stone-900 text-center font-bold shadow-sm">Priority Queue</div>
                        <div className="py-2 rounded-lg bg-[#F87171]/80 text-white text-center font-bold text-[11px]">Deque</div>
                        <div className="py-1.5 px-2 rounded-md bg-[#67E8F9] text-stone-900 text-center font-bold shadow-sm">ArrayDeque</div>
                      </div>
                    </div>

                    {/* 3. Set Interface */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-full py-2 rounded-lg bg-[#F87171] text-white text-center font-bold text-xs shadow">
                        Set
                      </div>
                      <div className="w-full space-y-1.5 font-mono text-[11px]">
                        <div className="py-1.5 px-2 rounded-md bg-[#67E8F9] text-stone-900 text-center font-bold shadow-sm">HashSet</div>
                        <div className="py-1.5 px-2 rounded-md bg-[#67E8F9] text-stone-900 text-center font-bold shadow-sm">LinkedHashSet</div>
                        <div className="py-2 rounded-lg bg-[#F87171]/80 text-white text-center font-bold text-[11px]">SortedSet</div>
                        <div className="py-1.5 px-2 rounded-md bg-[#67E8F9] text-stone-900 text-center font-bold shadow-sm">TreeSet</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT HIERARCHY: Map (Cols 9-12) */}
                <div className="col-span-4 space-y-4 border-l border-stone-300 dark:border-stone-800 pl-6">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-36 py-2.5 rounded-lg bg-[#F87171] text-white text-center font-black text-sm shadow-md">
                      Map
                    </div>
                    <div className="w-0.5 h-3 bg-stone-500" />
                    <div className="w-36 py-2 rounded-lg bg-[#F87171]/80 text-white text-center font-bold text-xs">
                      SortedMap
                    </div>
                    <div className="w-0.5 h-3 bg-stone-500" />
                    <div className="w-36 py-1.5 rounded-md bg-[#67E8F9] text-stone-900 text-center font-mono font-bold text-[11px] shadow-sm">
                      TreeMap
                    </div>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px] max-w-[150px] mx-auto pt-2">
                    <div className="py-1.5 px-2 rounded-md bg-[#67E8F9] text-stone-900 text-center font-bold shadow-sm">HashTable</div>
                    <div className="py-1.5 px-2 rounded-md bg-[#67E8F9] text-stone-900 text-center font-bold shadow-sm">LinkedHashMap</div>
                    <div className="py-1.5 px-2 rounded-md bg-[#67E8F9] text-stone-900 text-center font-bold shadow-sm">HashMap</div>
                  </div>

                  {/* Legend Box from Image 3 */}
                  <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-400 dark:border-stone-600 text-xs space-y-1.5 shadow-sm mt-6">
                    <span className="font-bold text-[11px] uppercase tracking-wider block text-stone-600 dark:text-stone-400">
                      Legend
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-3 bg-[#F87171] rounded-sm" />
                      <span className="font-bold">Interface</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-3 bg-[#67E8F9] rounded-sm" />
                      <span className="font-bold">Class</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono">
                      <span>─── Implements</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono">
                      <span>- - - Extends</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPARISON TABLE (IMAGE 5) */}
        {collectionTab === 'table' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <span>Reference Image 5: Collection Characteristics & Use-Cases</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                Collection Type Comparison Guide
              </h2>
              <p className="text-xs sm:text-sm text-[#6B706B] dark:text-[#BDB7AB] max-w-2xl mx-auto">
                Match the optimal data structure to your interview problem requirements.
              </p>
            </div>

            {/* Green Header Table matching Image 5 */}
            <div className="overflow-x-auto rounded-2xl border-2 border-[#2E7D32] shadow-md">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#4CAF50] text-white font-black text-sm">
                  <tr>
                    <th className="p-3.5 border-r border-green-600">Collection Type</th>
                    <th className="p-3.5 border-r border-green-600">Characteristics</th>
                    <th className="p-3.5 border-r border-green-600">Use Case</th>
                    <th className="p-3.5">Implementations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-200 dark:divide-stone-800 bg-[#E8F5E9] dark:bg-stone-900 text-stone-900 dark:text-stone-200 font-medium">
                  {tableData.map((row) => {
                    const isSelected = selectedColType === row.type;
                    return (
                      <tr
                        key={row.type}
                        onClick={() => setSelectedColType(row.type)}
                        className={`cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-green-200/80 dark:bg-stone-800 font-bold'
                            : 'hover:bg-green-100/50 dark:hover:bg-stone-800/60'
                        }`}
                      >
                        <td className="p-3.5 font-black text-green-900 dark:text-green-300 border-r border-green-200 dark:border-stone-800">
                          {row.type}
                        </td>
                        <td className="p-3.5 border-r border-green-200 dark:border-stone-800">
                          {row.characteristics}
                        </td>
                        <td className="p-3.5 border-r border-green-200 dark:border-stone-800">
                          {row.useCase}
                        </td>
                        <td className="p-3.5 whitespace-pre-line text-[11px] font-mono">
                          {row.implementations}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Interactive Code Inspector for Selected Collection */}
            <div className="p-5 rounded-2xl bg-[#18130F] text-amber-100 font-mono text-xs space-y-2 border border-stone-800 shadow-inner">
              <div className="flex items-center justify-between pb-1 border-b border-stone-800 text-stone-400 text-[11px]">
                <span className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5 text-teal-400" /> Standard {activeItem.type} Pattern</span>
                <span className="text-emerald-400 font-bold">{activeItem.characteristics}</span>
              </div>
              <pre className="text-xs whitespace-pre-wrap">{activeItem.code}</pre>
            </div>
          </div>
        )}

        {/* TAB 3: GARDEN TREE METAPHOR (IMAGE 4) */}
        {collectionTab === 'tree' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold">
                <span>Reference Image 4: Visual Collections Tree</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                The Java Collections Tree
              </h2>
              <p className="text-xs sm:text-sm text-[#6B706B] dark:text-[#BDB7AB] max-w-2xl mx-auto">
                Sprouting from the core Java runtime into 4 powerful branches.
              </p>
            </div>

            {/* Tree Metaphor Visualizer replicating Image 4 */}
            <div className="p-8 rounded-3xl bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 flex flex-col items-center justify-center space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl">
                {/* Branch 1: List */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 text-center space-y-2 shadow-sm">
                  <span className="text-2xl">📋</span>
                  <h4 className="font-black text-emerald-800 dark:text-emerald-300 text-sm">List</h4>
                  <p className="text-[10px] text-stone-500">Ordered sequence</p>
                  <div className="pt-2 border-t border-emerald-200 dark:border-emerald-900 font-mono text-[10px] space-y-1 text-emerald-700 dark:text-emerald-400">
                    <p>ArrayList</p>
                    <p>LinkedList</p>
                  </div>
                </div>

                {/* Branch 2: Set */}
                <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border-2 border-cyan-500 text-center space-y-2 shadow-sm">
                  <span className="text-2xl">🧺</span>
                  <h4 className="font-black text-cyan-800 dark:text-cyan-300 text-sm">Set</h4>
                  <p className="text-[10px] text-stone-500">Unique elements</p>
                  <div className="pt-2 border-t border-cyan-200 dark:border-cyan-900 font-mono text-[10px] space-y-1 text-cyan-700 dark:text-cyan-400">
                    <p>HashSet</p>
                    <p>TreeSet</p>
                  </div>
                </div>

                {/* Branch 3: Queue */}
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-500 text-center space-y-2 shadow-sm">
                  <span className="text-2xl">⏳</span>
                  <h4 className="font-black text-purple-800 dark:text-purple-300 text-sm">Queue</h4>
                  <p className="text-[10px] text-stone-500">FIFO order</p>
                  <div className="pt-2 border-t border-purple-200 dark:border-purple-900 font-mono text-[10px] space-y-1 text-purple-700 dark:text-purple-400">
                    <p>PriorityQueue</p>
                    <p>ArrayDeque</p>
                  </div>
                </div>

                {/* Branch 4: Map */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500 text-center space-y-2 shadow-sm">
                  <span className="text-2xl">🗝️</span>
                  <h4 className="font-black text-amber-800 dark:text-amber-300 text-sm">Map</h4>
                  <p className="text-[10px] text-stone-500">Key → Value pairs</p>
                  <div className="pt-2 border-t border-amber-200 dark:border-amber-900 font-mono text-[10px] space-y-1 text-amber-700 dark:text-amber-400">
                    <p>HashMap</p>
                    <p>TreeMap</p>
                  </div>
                </div>
              </div>

              {/* Tree Trunk & Java Cup */}
              <div className="flex flex-col items-center">
                <div className="w-6 h-12 bg-amber-800/80 rounded-sm" />
                <div className="px-6 py-2 rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-800 dark:border-stone-400 font-black text-sm flex items-center gap-2 shadow-md">
                  <span>☕</span>
                  <span className="font-serif">JAVA ROOT</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // TOPIC 26: FILE HANDLING (Reference Image 2: File Stream Architecture)
  // =========================================================================
  if (orderIndex === 26 || slug.includes('file')) {
    const handleRunFileStream = () => {
      setIsFileStreaming(true);
      setTimeout(() => {
        setFileOutputContent(fileInputContent.toUpperCase());
        setIsFileStreaming(false);
      }, 1000);
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#244D38] dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: Java File Handling & Streams</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            FileReader & FileWriter Stream Pipeline
          </span>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs font-bold">
              <span>Reference Image 2: Reading from and writing to files</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1F2421] dark:text-[#FAF6EE] tracking-tight">
              File I/O Stream Architecture
            </h2>
            <p className="text-xs sm:text-sm text-[#6B706B] dark:text-[#BDB7AB] max-w-2xl mx-auto">
              Streams are pipelines of continuous bytes/characters connecting source files, JVM programs, and destination files.
            </p>
          </div>

          {/* STREAM PIPELINE: Exact Replication of Image 2 */}
          <div className="p-8 rounded-3xl bg-[#FAF6EE] dark:bg-stone-900 border border-[#E8DFC8] dark:border-stone-800 space-y-6 overflow-x-auto">
            <div className="min-w-[650px] flex items-center justify-between gap-4 max-w-3xl mx-auto">
              {/* Left Column: inFile & input.txt (Red) and outFile & output.txt (Green) */}
              <div className="space-y-6 flex flex-col justify-between">
                {/* Top: input.txt inFile (Red) */}
                <div className="w-44 p-3 rounded-xl border-2 border-stone-900 dark:border-stone-400 bg-white dark:bg-stone-800 shadow-md space-y-2 text-center">
                  <div className="py-4 px-2 rounded-lg bg-[#EF4444] text-white font-mono font-black text-sm shadow-inner">
                    input.txt
                  </div>
                  <span className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200 block">
                    inFile
                  </span>
                </div>

                {/* Bottom: output.txt outFile (Green) */}
                <div className="w-44 p-3 rounded-xl border-2 border-stone-900 dark:border-stone-400 bg-white dark:bg-stone-800 shadow-md space-y-2 text-center">
                  <div className="py-4 px-2 rounded-lg bg-[#16A34A] text-white font-mono font-black text-sm shadow-inner">
                    output.txt
                  </div>
                  <span className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200 block">
                    outFile
                  </span>
                </div>
              </div>

              {/* Middle: Streams Pipes (Orange) and Program (Cyan) */}
              <div className="flex-1 flex flex-col justify-between space-y-8 px-4">
                {/* Top Pipe: fr stream -> read() */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex flex-col items-center">
                    <span className="font-mono text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      fr stream
                    </span>
                    <div className="w-full h-5 rounded-md bg-[#FB923C] border border-orange-600 flex items-center px-1 shadow-inner">
                      <div className="w-full h-1 bg-lime-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center text-xs font-mono font-bold text-stone-600 dark:text-stone-300">
                    <span>read() ↘</span>
                  </div>
                </div>

                {/* Bottom Pipe: write() -> fw stream */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-xs font-mono font-bold text-stone-600 dark:text-stone-300">
                    <span>↙ write()</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <span className="font-mono text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      fw stream
                    </span>
                    <div className="w-full h-5 rounded-md bg-[#FB923C] border border-orange-600 flex items-center px-1 shadow-inner">
                      <div className="w-full h-1 bg-lime-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Program (Cyan Oval from Image 2) */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-36 h-20 rounded-full bg-[#06B6D4] text-white font-bold text-base flex items-center justify-center shadow-lg border-2 border-cyan-400">
                  Program
                </div>
                <span className="text-[10px] font-mono text-stone-500 mt-1">JVM Process</span>
              </div>
            </div>

            {/* Subtitle Caption from Image 2 */}
            <div className="text-center pt-2 border-t border-stone-300 dark:border-stone-800">
              <p className="text-xs sm:text-sm font-black text-stone-700 dark:text-stone-300">
                Fig: Reading from and writing to files
              </p>
            </div>
          </div>

          {/* Interactive Stream Simulator */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 space-y-4">
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider block">
              Live Stream Execution Simulator:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-red-600">Source: input.txt</span>
                <input
                  type="text"
                  value={fileInputContent}
                  onChange={(e) => setFileInputContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-[#FAF6EE] dark:bg-stone-900 font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-600">Destination: output.txt</span>
                <div className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-900 font-mono text-xs font-bold text-stone-800 dark:text-stone-200">
                  {isFileStreaming ? 'Streaming & writing...' : fileOutputContent}
                </div>
              </div>
            </div>

            <button
              onClick={handleRunFileStream}
              disabled={isFileStreaming}
              className="px-4 py-2 rounded-xl bg-[#244D38] hover:bg-[#1A3829] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isFileStreaming ? 'Transferring stream...' : 'Run Stream Pipeline (read → process → write)'}</span>
            </button>
          </div>

          {/* Standard Java Try-With-Resources Snippet */}
          <div className="p-5 rounded-2xl bg-[#18130F] text-amber-100 font-mono text-xs space-y-1 border border-stone-800 shadow-inner">
            <div className="flex items-center justify-between pb-1 border-b border-stone-800 text-stone-400 text-[11px]">
              <span className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5 text-teal-400" /> Modern Java Try-With-Resources (Auto-Close Streams)</span>
              <span className="text-amber-400 font-bold">No resource leaks</span>
            </div>
            <p><span className="text-teal-400 font-bold">try</span> (BufferedReader fr = <span className="text-yellow-400 font-bold">new</span> BufferedReader(<span className="text-yellow-400 font-bold">new</span> FileReader(<span className="text-emerald-300">"input.txt"</span>));</p>
            <p className="pl-5">BufferedWriter fw = <span className="text-yellow-400 font-bold">new</span> BufferedWriter(<span className="text-yellow-400 font-bold">new</span> FileWriter(<span className="text-emerald-300">"output.txt"</span>))) &#123;</p>
            <p className="pl-4"><span className="text-teal-400">String</span> line;</p>
            <p className="pl-4"><span className="text-teal-400 font-bold">while</span> ((line = fr.readLine()) != <span className="text-red-400">null</span>) &#123;</p>
            <p className="pl-8">fw.write(line.toUpperCase()); <span className="text-stone-500">// Program processing</span></p>
            <p className="pl-8">fw.newLine();</p>
            <p className="pl-4">&#125;</p>
            <p>&#125; <span className="text-stone-500">// Streams automatically closed!</span></p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TOPIC 27: JAVA GENERICS CLASS (Box<T>) - Matching Reference Image 1
  // =========================================================================
  if (orderIndex === 27 || slug.includes('generic')) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: Java Generics Class (Box&lt;T&gt;)</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            Reference Image 1: Type Safety & Architecture
          </span>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-indigo-200 dark:border-indigo-950 shadow-sm space-y-6">
          {/* Header Banner */}
          <div>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 inline-block mb-2">
              JAVA GENERICS CLASS
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#1F2421] dark:text-[#FAF6EE]">
              Box&lt;T&gt; Class & Compile-Time Type Checking
            </h3>
            <p className="text-xs sm:text-sm text-[#6B706B] dark:text-[#BDB7AB] mt-1 leading-relaxed">
              Generics enable classes, interfaces, and methods to operate on parameterized types. They provide compile-time type safety, eliminate manual typecasting, and prevent disastrous runtime <code className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-mono text-xs">ClassCastException</code> errors.
            </p>
          </div>

          {/* Interactive Generics Workbench: Box<T> UML + Side Explanation (Directly Replicating Image 1) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Box<T> Class Card (Replicating the exact UML card in Image 1) */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 border-indigo-300 dark:border-indigo-800 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-100 dark:border-indigo-900/50">
                <div className="flex items-center gap-2">
                  <Box className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-black text-indigo-700 dark:text-indigo-300 font-mono">
                    Class Box&lt;T&gt;
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Parameterized Type
                </span>
              </div>

              {/* UML Representation from Image 1 */}
              <div className="space-y-3 font-mono text-xs">
                {/* Field Section */}
                <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-900/50">
                  <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider mb-1 font-sans">
                    Private Data Member
                  </p>
                  <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200">
                    <span className="text-red-500 font-bold">-</span>
                    <span className="text-indigo-600 font-bold">T</span>
                    <span className="font-semibold">data;</span>
                  </div>
                </div>

                {/* Methods Section */}
                <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-900/50 space-y-2">
                  <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider font-sans">
                    Public Member Methods
                  </p>
                  <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200">
                    <span className="text-emerald-500 font-bold">+</span>
                    <span className="text-indigo-600 font-bold">void</span>
                    <span className="font-semibold">setData(<span className="text-indigo-600 font-bold">T</span> data)</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200">
                    <span className="text-emerald-500 font-bold">+</span>
                    <span className="text-indigo-600 font-bold">T</span>
                    <span className="font-semibold">getData()</span>
                  </div>
                </div>
              </div>

              {/* Interactive Type Switcher */}
              <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900/40 space-y-3">
                <p className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Choose Generic Type Parameter &lt;T&gt;:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(['Integer', 'String', 'Double'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setGenericType(t);
                        setGenericVal(t === 'Integer' ? '42' : t === 'String' ? '"Placement 2026"' : '98.6');
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
                        genericType === t
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow'
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      &lt;{t}&gt;
                    </button>
                  ))}
                </div>

                {/* Value Setter Test */}
                <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-stone-600 dark:text-stone-400">Set value for <code className="text-indigo-600 font-mono">box.setData()</code>:</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono">&lt;{genericType}&gt;</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={genericVal}
                      onChange={(e) => setGenericVal(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-xs font-mono text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Current Memory Box Representation */}
                <div className="p-4 rounded-2xl bg-indigo-900 text-white shadow-inner flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-indigo-300 font-mono uppercase tracking-wider">Heap Object Instance:</span>
                    <p className="text-xs font-mono font-bold text-yellow-300">
                      new Box&lt;{genericType}&gt;()
                    </p>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-400/40 text-center font-mono">
                    <span className="text-[9px] block text-indigo-300 uppercase">stored data</span>
                    <span className="text-xs font-bold text-emerald-300">{genericVal}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Code Explanation & Compile-Time Guard (Matching Image 1 Right Side) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Java Implementation Code Box */}
              <div className="p-5 rounded-3xl bg-[#18130F] text-amber-50 font-mono text-xs space-y-1.5 border border-stone-800 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800 text-stone-400 text-[11px]">
                  <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                    <Code2 className="w-3.5 h-3.5" />
                    Generic Class Definition
                  </span>
                  <span className="text-emerald-400 font-semibold">Compile-Time Checked</span>
                </div>
                <p><span className="text-teal-400 font-bold">public class</span> <span className="text-yellow-300 font-bold">Box</span>&lt;<span className="text-indigo-400 font-bold">T</span>&gt; &#123;</p>
                <p className="pl-4"><span className="text-teal-400 font-bold">private</span> <span className="text-indigo-400 font-bold">T</span> data;</p>
                <p className="pl-4"><span className="text-teal-400 font-bold">public void</span> <span className="text-blue-300">setData</span>(<span className="text-indigo-400 font-bold">T</span> data) &#123;</p>
                <p className="pl-8"><span className="text-teal-400 font-bold">this</span>.data = data;</p>
                <p className="pl-4">&#125;</p>
                <p className="pl-4"><span className="text-teal-400 font-bold">public</span> <span className="text-indigo-400 font-bold">T</span> <span className="text-blue-300">getData</span>() &#123;</p>
                <p className="pl-8"><span className="text-teal-400 font-bold">return</span> data;</p>
                <p className="pl-4">&#125;</p>
                <p>&#125;</p>
                <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-400 space-y-1">
                  <p className="text-emerald-300 font-bold">// Usage with selected type &lt;{genericType}&gt;:</p>
                  <p>Box&lt;<span className="text-indigo-400">{genericType}</span>&gt; box = <span className="text-yellow-400 font-bold">new</span> Box&lt;&gt;();</p>
                  <p>box.setData({genericVal});</p>
                  <p><span className="text-indigo-400">{genericType}</span> res = box.getData(); <span className="text-stone-500">// 0 casting required!</span></p>
                </div>
              </div>

              {/* The Compile-Time Error Guard Demo (Key Placement Concept) */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-stone-900 border-2 border-amber-300 dark:border-amber-800/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>The Safety Net: Compile-Time vs Runtime</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-stone-950 border border-emerald-300 dark:border-emerald-800 space-y-1">
                    <p className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      With Generics (Modern Java)
                    </p>
                    <p className="font-mono text-[11px] text-stone-700 dark:text-stone-300">
                      Box&lt;String&gt; b = new Box&lt;&gt;();
                    </p>
                    <p className="font-mono text-[11px] text-stone-700 dark:text-stone-300">
                      b.setData(100); <span className="text-red-500 font-bold">// ❌ COMPILE ERROR</span>
                    </p>
                    <p className="text-[10px] text-stone-500">
                      Caught instantly in the IDE before runtime. Safe in production!
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-stone-950 border border-red-300 dark:border-red-900 space-y-1">
                    <p className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Without Generics (Raw Object)
                    </p>
                    <p className="font-mono text-[11px] text-stone-700 dark:text-stone-300">
                      Box b = new Box();
                    </p>
                    <p className="font-mono text-[11px] text-stone-700 dark:text-stone-300">
                      b.setData(100); <span className="text-stone-400">// compiles ok</span>
                    </p>
                    <p className="font-mono text-[11px] text-red-600 dark:text-red-400 font-bold">
                      String s = (String) b.getData(); <span className="text-red-500 font-bold">// 💥 ClassCastException</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Three Core Benefits Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5 mb-1">
                <Check className="w-3.5 h-3.5 text-indigo-600" />
                1. Compile-Time Checking
              </span>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Errors surface during compilation, avoiding unexpected application crashes in production.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5 mb-1">
                <Check className="w-3.5 h-3.5 text-indigo-600" />
                2. Eliminates Manual Casts
              </span>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Code no longer requires verbose casts like <code className="font-mono text-[11px]">(String) list.get(0)</code>.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5 mb-1">
                <Check className="w-3.5 h-3.5 text-indigo-600" />
                3. Bounded Wildcards
              </span>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Allows constraints like <code className="font-mono text-[11px]">&lt;T extends Number&gt;</code> for algorithms.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TOPIC 28: SYNTAX AND RULES OF WRITING LAMBDAS IN JAVA - Matching Reference Image 2
  // =========================================================================
  if (orderIndex === 28 || slug.includes('lambda')) {
    // Exact 6 rules from Image 2
    const LAMBDA_RULES = [
      {
        id: 1,
        title: 'Anonymous Method',
        tag: 'Definition',
        desc: 'A lambda expression is an anonymous method: it has no name, no return type, and no access modifier. It represents a block of code passed directly.',
        syntax: '(a, b) -> a + b;',
        note: 'Bypasses the verbosity of creating a full named method or anonymous class.',
      },
      {
        id: 2,
        title: 'Functional Interface Requirement',
        tag: 'Prerequisite',
        desc: 'Lambdas can only be assigned to a Functional Interface — an interface having exactly ONE abstract method (Single Abstract Method - SAM).',
        syntax: '@FunctionalInterface\ninterface Calculator {\n    int operate(int a, int b);\n}',
        note: 'Built-in interfaces include Predicate<T>, Consumer<T>, Function<T,R>, Supplier<T>, and Runnable.',
      },
      {
        id: 3,
        title: 'Basic Arrow (->) Syntax',
        tag: 'Structure',
        desc: 'The arrow operator -> divides the lambda into two parts: parameters on the left and the body expression or statement block on the right.',
        syntax: '(parameters) -> expression\n// OR for multi-line blocks:\n(parameters) -> { statements; }',
        note: 'Arrow token separates what goes in from what happens.',
      },
      {
        id: 4,
        title: 'Type Inference',
        tag: 'Compiler Intelligence',
        desc: 'The Java compiler infers parameter types automatically from target interface method signature, making explicit type annotations optional.',
        syntax: '// Fully typed:\n(String s) -> s.length()\n// Type inferred (Idiomatic):\n(s) -> s.length()',
        note: 'Omitting parameter types makes code concise while maintaining 100% type safety.',
      },
      {
        id: 5,
        title: 'Parentheses Rules',
        tag: 'Parameters',
        desc: 'Parentheses around parameter list are optional ONLY when there is exactly ONE parameter. For zero or 2+ parameters, parentheses are mandatory.',
        syntax: 's -> s.toUpperCase()      // 1 param: no ()\n() -> System.out.println() // 0 params: () mandatory\n(x, y) -> x * y           // 2+ params: () mandatory',
        note: 'Single parameter without type annotation is the cleanest syntax.',
      },
      {
        id: 6,
        title: 'Curly Braces & Return Rules',
        tag: 'Body & Output',
        desc: 'For single expressions, curly braces and return keyword MUST be omitted (return is implicit). For multi-line statements, {} and return are mandatory.',
        syntax: '// Single expression (implicit return):\n(a, b) -> a + b\n// Block syntax (explicit return):\n(a, b) -> {\n    int sum = a + b;\n    return sum;\n}',
        note: 'Cannot mix: if you write { return a + b; } braces are required.',
      },
    ];

    const currentRule = LAMBDA_RULES.find((r) => r.id === activeLambdaRule) || LAMBDA_RULES[0];

    // Live execution helper
    const computeLambda = (input: string, mode: number) => {
      switch (mode) {
        case 1:
          return input.toUpperCase();
        case 2:
          return `Length: ${input.length}`;
        case 3:
          return input.split('').reverse().join('');
        case 4:
          return `[Clean: ${input.trim()}]`;
        default:
          return input.toUpperCase();
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: Syntax and Rules of Writing Lambdas</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            Reference Image 2: Exact 6 Rules
          </span>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-emerald-200 dark:border-emerald-950 shadow-sm space-y-6">
          {/* Header Banner Directly Replicating Image 2 Title */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3.5 py-1 rounded-full text-[11px] font-black tracking-widest uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 inline-block">
              SYNTAX AND RULES OF WRITING LAMBDAS IN JAVA
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#1F2421] dark:text-[#FAF6EE]">
              The 6 Golden Rules of Lambda Expressions
            </h3>
            <p className="text-xs sm:text-sm text-[#6B706B] dark:text-[#BDB7AB] leading-relaxed">
              Introduced in Java 8, lambda expressions facilitate functional programming by treating functions as method arguments, or passing a block of code around concisely.
            </p>
          </div>

          {/* 6 Rules Cards Grid (Replicating Image 2 Layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LAMBDA_RULES.map((rule) => {
              const isActive = activeLambdaRule === rule.id;
              return (
                <button
                  key={rule.id}
                  onClick={() => setActiveLambdaRule(rule.id)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all space-y-2.5 flex flex-col justify-between ${
                    isActive
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500 shadow-md ring-2 ring-emerald-400/20'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-emerald-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                        Rule {rule.id}: {rule.tag}
                      </span>
                      {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <h4 className="text-sm font-black text-[#1F2421] dark:text-stone-100">
                      {rule.title}
                    </h4>
                    <p className="text-xs text-[#6B706B] dark:text-stone-400 mt-1 leading-relaxed">
                      {rule.desc}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#18130F] text-emerald-300 font-mono text-[11px] border border-stone-800 w-full overflow-x-auto">
                    <pre className="whitespace-pre">{rule.syntax}</pre>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Inspector for Selected Rule */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 border-emerald-300 dark:border-emerald-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-black text-stone-900 dark:text-stone-100 font-mono">
                  Deep Dive: Rule {currentRule.id} — {currentRule.title}
                </h4>
              </div>
              <span className="text-xs text-emerald-600 font-bold">
                Target Concept: {currentRule.tag}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Code Showcase */}
              <div className="lg:col-span-7 p-4 rounded-2xl bg-[#18130F] text-amber-50 font-mono text-xs space-y-1.5 border border-stone-800 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800 text-stone-400 text-[11px]">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    Syntax Pattern
                  </span>
                  <span className="text-stone-400">Java 8+ Functional Spec</span>
                </div>
                <pre className="text-emerald-300 whitespace-pre leading-relaxed">{currentRule.syntax}</pre>
                <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-400">
                  <span className="text-amber-400 font-bold">Key Insight: </span>
                  <span>{currentRule.note}</span>
                </div>
              </div>

              {/* Right Live Interactive Playground */}
              <div className="lg:col-span-5 p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-emerald-600" />
                  Live Lambda Execution Playground
                </p>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400">
                    Sample String Input:
                  </label>
                  <input
                    type="text"
                    value={lambdaTestInput}
                    onChange={(e) => setLambdaTestInput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-800/80 space-y-1 font-mono text-xs">
                  <span className="text-[10px] text-stone-400 block">Lambda: <code className="text-emerald-600 font-bold">s -&gt; s.toUpperCase()</code></span>
                  <p className="font-bold text-stone-800 dark:text-stone-100">
                    Result: <span className="text-emerald-600 dark:text-emerald-400">{computeLambda(lambdaTestInput, 1)}</span>
                  </p>
                  <p className="text-[10px] text-stone-500">
                    Functional Interface: <code className="text-indigo-500">Function&lt;String, String&gt;</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TOPIC 29: JAVA MULTITHREADING & THREAD LIFECYCLE - Matching Reference Image 3
  // =========================================================================
  if (orderIndex === 29 || slug.includes('thread') || slug.includes('multithreading')) {
    const THREAD_STATES = [
      {
        name: 'NEW',
        color: 'bg-blue-500',
        textColor: 'text-blue-600',
        borderColor: 'border-blue-400',
        tag: 'State 1',
        desc: 'Thread instance created in Heap using new Thread(), but start() has not yet been invoked. JVM has not allocated an OS native thread.',
        code: 'Thread t = new Thread(runnable);',
        isAlive: false,
      },
      {
        name: 'RUNNABLE',
        color: 'bg-emerald-500',
        textColor: 'text-emerald-600',
        borderColor: 'border-emerald-400',
        tag: 'State 2',
        desc: 'start() method called. Thread sits in the Runnable pool ready for execution. Awaiting CPU scheduler time-slice.',
        code: 't.start(); // Moves to Runnable pool',
        isAlive: true,
      },
      {
        name: 'RUNNING',
        color: 'bg-amber-500',
        textColor: 'text-amber-600',
        borderColor: 'border-amber-400',
        tag: 'State 3',
        desc: 'Thread Scheduler selects thread from Runnable pool. The run() method is actively being executed on a CPU core.',
        code: 'public void run() { /* CPU executing */ }',
        isAlive: true,
      },
      {
        name: 'TIMED_WAITING',
        color: 'bg-purple-500',
        textColor: 'text-purple-600',
        borderColor: 'border-purple-400',
        tag: 'State 4A',
        desc: 'Thread is sleeping or waiting with a specified timeout. Automatically returns to RUNNABLE once duration lapses.',
        code: 'Thread.sleep(2000); // 2 sec timeout',
        isAlive: true,
      },
      {
        name: 'WAITING',
        color: 'bg-orange-500',
        textColor: 'text-orange-600',
        borderColor: 'border-orange-400',
        tag: 'State 4B',
        desc: 'Waiting indefinitely for another thread to perform a specific action (e.g., notify() or notifyAll() on monitor lock, or t.join()).',
        code: 'lock.wait(); // Awaiting notify()',
        isAlive: true,
      },
      {
        name: 'TERMINATED',
        color: 'bg-rose-500',
        textColor: 'text-rose-600',
        borderColor: 'border-rose-400',
        tag: 'State 5',
        desc: 'Dead state. The run() method completed normally or aborted due to an uncaught exception. Thread cannot be restarted.',
        code: 't.getState() == Thread.State.TERMINATED',
        isAlive: false,
      },
    ];

    const activeStateObj = THREAD_STATES.find((s) => s.name === threadStage) || THREAD_STATES[0];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E8DFC8] dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>Understanding Concept: Java Thread Lifecycle</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
            Reference Image 3: 5 Essential States
          </span>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-amber-200 dark:border-amber-950 shadow-sm space-y-6">
          {/* Header Banner Replicating Image 3 Title */}
          <div>
            <span className="px-3.5 py-1 rounded-full text-[11px] font-black tracking-widest uppercase bg-amber-500/15 text-amber-700 dark:text-amber-400 inline-block mb-2">
              JAVA THREAD LIFECYCLE (5 ESSENTIAL STATES)
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#1F2421] dark:text-[#FAF6EE]">
              JVM & OS Thread State Machine & Transitions
            </h3>
            <p className="text-xs sm:text-sm text-[#6B706B] dark:text-[#BDB7AB] mt-1 leading-relaxed">
              Every concurrent thread in Java progresses through defined states in <code className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-mono text-xs">java.lang.Thread.State</code>. Transitions occur through lifecycle methods like <code className="font-mono text-xs">start()</code>, <code className="font-mono text-xs">sleep()</code>, <code className="font-mono text-xs">wait()</code>, and <code className="font-mono text-xs">join()</code>.
            </p>
          </div>

          {/* Interactive State Pipeline (Replicating Image 3 Flowchart) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border-2 border-amber-300 dark:border-amber-800/80 shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-amber-600" />
                State Machine Diagram (Click state to inspect or use transition controls)
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                Current: {threadStage}
              </span>
            </div>

            {/* Visual State Nodes Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {THREAD_STATES.map((s) => {
                const isActive = threadStage === s.name;
                return (
                  <button
                    key={s.name}
                    onClick={() => setThreadStage(s.name as any)}
                    className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-between gap-2 ${
                      isActive
                        ? `${s.borderColor} bg-amber-50/80 dark:bg-stone-800 shadow-lg scale-105 ring-2 ring-amber-400/30`
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 hover:border-amber-300'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-stone-400">
                      {s.tag}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${s.color} ${isActive ? 'animate-ping' : ''}`} />
                      <span className={`text-xs font-black font-mono ${isActive ? s.textColor : 'text-stone-700 dark:text-stone-300'}`}>
                        {s.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {s.isAlive ? 'isAlive: true' : 'isAlive: false'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Transition Controls Panel */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
              <p className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-amber-600" />
                Simulate State Transitions (Directly matching Image 3 method arrows):
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setThreadStage('RUNNABLE')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-mono transition-all flex items-center gap-1"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  1. t.start() [NEW → RUNNABLE]
                </button>
                <button
                  onClick={() => setThreadStage('RUNNING')}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-mono transition-all flex items-center gap-1"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  2. OS Scheduler Dispatch [RUNNABLE → RUNNING]
                </button>
                <button
                  onClick={() => setThreadStage('TIMED_WAITING')}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold font-mono transition-all flex items-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5" />
                  3. Thread.sleep(2000) [RUNNING → TIMED_WAITING]
                </button>
                <button
                  onClick={() => setThreadStage('WAITING')}
                  className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold font-mono transition-all flex items-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5" />
                  4. lock.wait() / join() [RUNNING → WAITING]
                </button>
                <button
                  onClick={() => setThreadStage('RUNNABLE')}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold font-mono transition-all flex items-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5" />
                  5. notify() / Timeout [WAITING → RUNNABLE]
                </button>
                <button
                  onClick={() => setThreadStage('TERMINATED')}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-mono transition-all flex items-center gap-1"
                >
                  <Flag className="w-3.5 h-3.5" />
                  6. run() finishes [RUNNING → TERMINATED]
                </button>
                <button
                  onClick={() => setThreadStage('NEW')}
                  className="px-3 py-1.5 rounded-xl bg-stone-700 hover:bg-stone-800 text-white text-xs font-bold font-mono transition-all flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Thread [NEW]
                </button>
              </div>
            </div>

            {/* Active State Detail & Live Thread Monitor */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 p-5 rounded-2xl bg-[#18130F] text-amber-50 font-mono text-xs space-y-2 border border-stone-800 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800 text-stone-400 text-[11px]">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    Active State: {activeStateObj.name}
                  </span>
                  <span className="text-stone-400">Thread.State enum</span>
                </div>
                <p className="text-stone-300 font-sans leading-relaxed text-xs">
                  {activeStateObj.desc}
                </p>
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-emerald-300 font-mono text-xs">
                  <pre>{activeStateObj.code}</pre>
                </div>
              </div>

              {/* Thread Monitor Widget */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-3">
                <p className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-amber-600" />
                  Live JVM Thread Monitor
                </p>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-amber-200 dark:border-stone-800">
                    <span className="text-stone-500">Thread Name:</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">"PlacementWorker-1"</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-amber-200 dark:border-stone-800">
                    <span className="text-stone-500">Thread ID:</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">tid = 14</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-amber-200 dark:border-stone-800">
                    <span className="text-stone-500">Thread.State:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{threadStage}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-amber-200 dark:border-stone-800">
                    <span className="text-stone-500">isAlive():</span>
                    <span className={`font-bold ${activeStateObj.isAlive ? 'text-emerald-600' : 'text-stone-400'}`}>
                      {String(activeStateObj.isAlive)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">Priority:</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">5 (NORM_PRIORITY)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Placement Interview Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                start() vs run() Interview Question
              </span>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Calling <code className="font-mono text-xs text-emerald-600">t.start()</code> allocates a new call stack and starts a new OS thread. Calling <code className="font-mono text-xs text-red-500">t.run()</code> directly just runs the method synchronously on the main thread!
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                wait() vs sleep() Difference
              </span>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                <code className="font-mono text-xs text-amber-600">sleep()</code> keeps lock ownership while pausing. <code className="font-mono text-xs text-amber-600">wait()</code> releases the monitor lock so other threads can proceed inside synchronized blocks!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // TOPICS 6 TO 29: DEDICATED CONCEPT CARDS FOR ALL CURRICULUM TOPICS
  // =========================================================================
  const TOPIC_DETAILS: Record<
    number,
    {
      title: string;
      stage: string;
      concept: string;
      subtopics: string[];
      code: string[];
      placementTip: string;
      mistake: string;
    }
  > = {
    6: {
      title: 'Conditional Decision Making (if, if-else, nested if)',
      stage: 'Stage 2: Logic & Control Flow',
      concept:
        'Conditional statements control the execution flow of a program based on boolean expressions. If a condition evaluates to true, the corresponding block executes; otherwise, alternative or default branches run.',
      subtopics: ['Simple if statement', 'Binary if-else branching', 'Ladder if-else-if for multi-interval checks', 'Nested if structures'],
      code: [
        'int score = 85;',
        'if (score >= 90) {',
        '    System.out.println("Grade A");',
        '} else if (score >= 75) {',
        '    System.out.println("Grade B");',
        '} else {',
        '    System.out.println("Pass");',
        '}',
      ],
      placementTip: 'Always check boundary conditions (e.g., >= vs >) and handle leap years with (y % 400 == 0 || (y % 4 == 0 && y % 100 != 0)).',
      mistake: 'Never put a semicolon directly after the if condition: if (score > 50); { ... } executes the body unconditionally.',
    },
    7: {
      title: 'Switch Case Branching',
      stage: 'Stage 2: Logic & Control Flow',
      concept:
        'The switch statement executes one block among many options based on matching an integer, character, string, or enum value against constant cases.',
      subtopics: ['Switch syntax & case labels', 'Break statement role', 'Default fallback case', 'Modern arrow switch expressions'],
      code: [
        'int day = 3;',
        'switch (day) {',
        '    case 1 -> System.out.println("Monday");',
        '    case 2 -> System.out.println("Tuesday");',
        '    case 3 -> System.out.println("Wednesday");',
        '    default -> System.out.println("Other Day");',
        '}',
      ],
      placementTip: 'Use switch for discrete menu systems or state transitions. Avoid using switch with floating-point types as Java does not support them.',
      mistake: 'Forgetting break in standard colon switch causes accidental fall-through into all subsequent cases.',
    },
    8: {
      title: 'Loops (for, while, do-while)',
      stage: 'Stage 2: Logic & Control Flow',
      concept:
        'Loops execute a block of code repeatedly while a specified condition is true. The for loop is ideal when count is known; while loop is ideal for dynamic termination conditions.',
      subtopics: ['For loop (init; condition; update)', 'While loop (entry-controlled)', 'Do-while loop (exit-controlled, runs >= 1)', 'Digit extraction algorithm (n % 10, n / 10)'],
      code: [
        '// Extract and reverse digits',
        'int n = 1234, rev = 0;',
        'while (n > 0) {',
        '    int digit = n % 10;',
        '    rev = rev * 10 + digit;',
        '    n /= 10;',
        '}',
        'System.out.println("Reversed: " + rev);',
      ],
      placementTip: 'Digit extraction using n % 10 and n / 10 is the core technique for palindromes, Armstrong numbers, and digital sums in screening rounds.',
      mistake: 'Modifying the loop index inside the body inappropriately or forgetting n /= 10 creates infinite loops.',
    },
    9: {
      title: 'Jump Statements (Break & Continue)',
      stage: 'Stage 2: Logic & Control Flow',
      concept:
        'Break terminates the loop immediately, transferring control outside. Continue skips the rest of the current iteration and jumps directly to the next cycle.',
      subtopics: ['Break for early loop pruning', 'Continue for filtering', 'Labeled break in nested loops', 'Difference between break and return'],
      code: [
        'for (int i = 1; i <= 10; i++) {',
        '    if (i % 3 == 0) continue; // skip multiples of 3',
        '    if (i == 8) break;        // terminate at 8',
        '    System.out.print(i + " ");',
        '} // Output: 1 2 4 5 7',
      ],
      placementTip: 'Terminate primality tests early at Math.sqrt(n) using break upon finding the first divisor to optimize time complexity from O(N) to O(sqrt(N)).',
      mistake: 'Writing statements directly after break or continue within the same block causes "unreachable code" compiler errors.',
    },
    10: {
      title: 'Nested Loops & Time Complexity',
      stage: 'Stage 2: Logic & Control Flow',
      concept:
        'A nested loop consists of an outer loop controlling major cycles (e.g. rows) and an inner loop controlling sub-steps (e.g. columns).',
      subtopics: ['Outer vs inner loop execution sequence', 'Total iteration count (N x M)', 'Time complexity (O(N^2))', 'Independent vs dependent index boundaries'],
      code: [
        'int n = 3;',
        'for (int i = 1; i <= n; i++) {',
        '    for (int j = 1; j <= n; j++) {',
        '        System.out.print("(" + i + "," + j + ") ");',
        '    }',
        '    System.out.println();',
        '}',
      ],
      placementTip: 'Nested loops are the foundation for matrix traversals and pair-comparison algorithms. Pay attention to whether the inner loop runs N times or (N - i) times.',
      mistake: 'Accidentally incrementing the outer loop variable i inside the inner loop.',
    },
    11: {
      title: 'Pattern Programming',
      stage: 'Stage 2: Logic & Control Flow',
      concept:
        'Pattern problems develop spatial reasoning, loop boundary coordination, and clean stdout manipulation using spaces and stars.',
      subtopics: ['Square and rectangle grids', 'Right triangles (increasing & decreasing)', 'Spaces management formulas', 'Pyramids and Floyd triangle'],
      code: [
        'int n = 4;',
        'for (int i = 1; i <= n; i++) {',
        '    for (int j = 1; j <= i; j++) {',
        '        System.out.print("*");',
        '    }',
        '    System.out.println();',
        '}',
      ],
      placementTip: 'Always calculate spaces before stars per row: spaces = n - i, stars = 2*i - 1 for centered pyramids.',
      mistake: 'Confusing System.out.print() (no newline) with System.out.println() (adds newline).',
    },
    12: {
      title: 'Methods & Modular Architecture',
      stage: 'Stage 3: Methods & Arrays',
      concept:
        'Methods are reusable blocks of code executed when called. They encapsulate logic, eliminate redundancy (DRY), and take inputs as parameters and return results.',
      subtopics: ['Method signature (modifiers, return type, name, params)', 'Pass-by-value in Java', 'Call stack frames', 'Pure helper functions'],
      code: [
        'public static int gcd(int a, int b) {',
        '    while (b != 0) {',
        '        int temp = b;',
        '        b = a % b;',
        '        a = temp;',
        '    }',
        '    return a;',
        '}',
      ],
      placementTip: 'LeetCode and HackerRank require implementing pure class methods with given signatures rather than entire main routines.',
      mistake: 'Believing primitive arguments can be changed inside a method (Java strictly passes primitives by value).',
    },
    13: {
      title: 'Method Overloading (Compile-Time Polymorphism)',
      stage: 'Stage 3: Methods & Arrays',
      concept:
        'Method Overloading allows multiple methods in the same class to share the exact same name, as long as their parameter lists differ in count, type, or sequence.',
      subtopics: ['Overloading by parameter count', 'Overloading by parameter type', 'Return type limitation', 'Type promotion in overloading'],
      code: [
        'public static int add(int a, int b) { return a + b; }',
        'public static int add(int a, int b, int c) { return a + b + c; }',
        'public static double add(double a, double b) { return a + b; }',
      ],
      placementTip: 'Changing only the return type does NOT constitute valid overloading and causes a compiler error.',
      mistake: 'Ambiguity errors when passing numeric literals that can match multiple widened types.',
    },
    14: {
      title: 'Arrays (1D) & Linear Memory',
      stage: 'Stage 3: Methods & Arrays',
      concept:
        'A 1D array is a fixed-size, contiguous sequence of elements of the same type stored in Heap memory and accessed via zero-based indices.',
      subtopics: ['Array allocation (new int[n])', 'Zero-based indexing (0 to length-1)', 'Two-pointer technique', 'In-place reversal and rotation'],
      code: [
        'int[] arr = {10, 20, 30, 40, 50};',
        'int left = 0, right = arr.length - 1;',
        'while (left < right) {',
        '    int temp = arr[left];',
        '    arr[left] = arr[right];',
        '    arr[right] = temp;',
        '    left++; right--;',
        '}',
      ],
      placementTip: 'Two-pointer array manipulation is asked in nearly 50% of Tier-1 placement rounds (Two Sum, Dutch Flag, Trapping Rainwater).',
      mistake: 'Accessing arr[arr.length] throws ArrayIndexOutOfBoundsException.',
    },
    15: {
      title: 'Arrays (2D) / Matrices',
      stage: 'Stage 3: Methods & Arrays',
      concept:
        'A 2D array is an array of arrays representing a grid with rows and columns (matrix[row][col]).',
      subtopics: ['Matrix declaration & traversal', 'Row-wise vs column-wise iteration', 'Primary (i==j) and secondary (i+j==n-1) diagonals', 'Matrix transpose & rotation'],
      code: [
        'int[][] matrix = {{1, 2}, {3, 4}};',
        'for (int r = 0; r < matrix.length; r++) {',
        '    for (int c = 0; c < matrix[r].length; c++) {',
        '        System.out.print(matrix[r][c] + " ");',
        '    }',
        '    System.out.println();',
        '}',
      ],
      placementTip: 'Matrix rotation by 90 degrees in-place: first transpose the matrix, then reverse each row.',
      mistake: 'Inverting row and column dimensions for non-square matrices: matrix.length gives row count, matrix[0].length gives col count.',
    },
    16: {
      title: 'Strings & String Constant Pool',
      stage: 'Stage 4: String Processing',
      concept:
        'Strings are immutable sequences of characters. Literal strings are cached in the String Constant Pool (SCP) to conserve memory.',
      subtopics: ['Immutability of String', 'String Constant Pool (SCP)', '== vs .equals()', 'Key methods: substring, charAt, toCharArray'],
      code: [
        'String s1 = "hello";',
        'String s2 = new String("hello");',
        'System.out.println(s1 == s2);      // false (different memory)',
        'System.out.println(s1.equals(s2)); // true (same content)',
      ],
      placementTip: 'Always use .equals() for content comparison. Strings are immutable, so every concatenation (+) creates a new object in memory.',
      mistake: 'Using == to compare string contents in coding tests.',
    },
    17: {
      title: 'StringBuilder & StringBuffer (Mutable Strings)',
      stage: 'Stage 4: String Processing',
      concept:
        'StringBuilder provides a mutable buffer for modifying strings in-place without generating intermediate garbage objects, running in O(N) instead of O(N^2).',
      subtopics: ['StringBuilder (fast, non-synchronized)', 'StringBuffer (thread-safe, synchronized)', 'Methods: append, insert, delete, reverse', 'Capacity and resizing'],
      code: [
        'StringBuilder sb = new StringBuilder("Placement");',
        'sb.append(" 2026");',
        'sb.reverse();',
        'System.out.println(sb.toString());',
      ],
      placementTip: 'Whenever concatenating strings in a loop, always use StringBuilder to prevent Time Limit Exceeded (TLE) errors.',
      mistake: 'Calling .equals() directly on StringBuilder without converting to string (StringBuilder does not override equals).',
    },
    18: {
      title: 'Object-Oriented Programming (Classes & Objects)',
      stage: 'Stage 4: String Processing',
      concept:
        'OOP models real-world systems into Classes (blueprints) and Objects (instances with state and behavior in Heap memory).',
      subtopics: ['Class blueprint & fields', 'Object instantiation with new', 'Default & parameterized constructors', 'this keyword for variable shadowing'],
      code: [
        'class Student {',
        '    int rollNo;',
        '    String name;',
        '    Student(int rollNo, String name) {',
        '        this.rollNo = rollNo;',
        '        this.name = name;',
        '    }',
        '}',
      ],
      placementTip: 'Machine coding rounds require clean class designs with proper constructors and meaningful instance methods.',
      mistake: 'Adding a return type (such as void) to a constructor converts it into a regular method.',
    },
    19: {
      title: 'Encapsulation & Data Hiding',
      stage: 'Stage 5: OOP Architecture',
      concept:
        'Encapsulation bundles data and methods into a single class while keeping fields private and exposing controlled public getters and setters.',
      subtopics: ['Private access modifier', 'Getter and setter validation', 'Read-only & write-only classes', 'JavaBean naming conventions'],
      code: [
        'class BankAccount {',
        '    private double balance;',
        '    public double getBalance() { return balance; }',
        '    public void deposit(double amt) {',
        '        if (amt > 0) this.balance += amt;',
        '    }',
        '}',
      ],
      placementTip: 'Encapsulation guarantees that internal class states cannot be corrupted with negative or invalid values.',
      mistake: 'Leaving fields public or providing setters without validation rules.',
    },
    20: {
      title: 'Inheritance & Code Reusability',
      stage: 'Stage 5: OOP Architecture',
      concept:
        'Inheritance allows a subclass to inherit fields and methods from a superclass using extends, establishing an IS-A relationship.',
      subtopics: ['extends keyword', 'super() constructor invocation', 'Multilevel and hierarchical inheritance', 'Diamond problem resolution in Java'],
      code: [
        'class Employee {',
        '    double basePay = 50000;',
        '}',
        'class Manager extends Employee {',
        '    double bonus = 15000;',
        '    double getTotal() { return basePay + bonus; }',
        '}',
      ],
      placementTip: 'Parent class constructors always execute before child constructors. Use super(...) to pass parameters up the chain.',
      mistake: 'Assuming private members of the parent class are directly accessible in the child without getters.',
    },
    21: {
      title: 'Polymorphism (Dynamic Method Dispatch)',
      stage: 'Stage 5: OOP Architecture',
      concept:
        'Polymorphism allows a parent reference to hold a child object and execute overridden methods determined dynamically at runtime.',
      subtopics: ['Method overriding with @Override', 'Dynamic Method Dispatch', 'Parent reference pointing to child', 'Upcasting and safe downcasting'],
      code: [
        'class Shape { void draw() { System.out.println("Shape"); } }',
        'class Circle extends Shape { void draw() { System.out.println("Circle"); } }',
        'Shape s = new Circle(); // Upcasting',
        's.draw(); // Prints "Circle" at runtime!',
      ],
      placementTip: 'Dynamic method dispatch is a favorite topic in technical interviews to test whether you know methods are resolved by object type, not reference type.',
      mistake: 'Variables cannot be overridden in Java; only methods participate in runtime polymorphism.',
    },
    22: {
      title: 'Abstraction & Interfaces',
      stage: 'Stage 5: OOP Architecture',
      concept:
        'Abstraction hides complex implementation details. Abstract classes allow partial implementation; interfaces provide 100% contract specifications.',
      subtopics: ['abstract class & abstract methods', 'interface and implements', 'Multiple inheritance via interfaces', 'Default and static interface methods'],
      code: [
        'interface PaymentGateway {',
        '    void processPayment(double amount);',
        '}',
        'class UPI implements PaymentGateway {',
        '    public void processPayment(double amt) {',
        '        System.out.println("Paid via UPI: " + amt);',
        '    }',
        '}',
      ],
      placementTip: 'Modern design patterns (Factory, Strategy, Observer) depend entirely on interface contracts.',
      mistake: 'Attempting to instantiate an interface or abstract class directly using new.',
    },
    23: {
      title: 'Exception Handling & Robust Code',
      stage: 'Stage 6: Advanced & Collections',
      concept:
        'Exceptions are runtime disruptions. Java uses try, catch, finally, throw, and throws to handle errors gracefully without crashing the application.',
      subtopics: ['Checked vs unchecked exceptions', 'try-catch-finally flow', 'Multiple catch blocks ordering', 'Custom user-defined exceptions'],
      code: [
        'try {',
        '    int result = 10 / 0;',
        '} catch (ArithmeticException e) {',
        '    System.out.println("Caught: Division by zero");',
        '} finally {',
        '    System.out.println("Cleanup executed always");',
        '}',
      ],
      placementTip: 'The finally block executes whether an exception occurs or not, making it mandatory for closing database connections and streams.',
      mistake: 'Catching generic Exception before specific child exceptions causes unreachable catch errors.',
    },
    24: {
      title: 'Collections Framework (ArrayList, HashSet, HashMap)',
      stage: 'Stage 6: Advanced & Collections',
      concept:
        'The Java Collections Framework provides pre-built, highly optimized data structures: dynamic lists, unique sets, and O(1) hash maps.',
      subtopics: ['ArrayList for fast index access', 'HashSet for uniqueness', 'HashMap for key-value pair lookups', 'Iterators and generics'],
      code: [
        'Map<String, Integer> map = new HashMap<>();',
        'map.put("Apple", 3);',
        'map.put("Banana", 5);',
        'for (Map.Entry<String, Integer> entry : map.entrySet()) {',
        '    System.out.println(entry.getKey() + ": " + entry.getValue());',
        '}',
      ],
      placementTip: 'HashMap is the single most tested collection in coding interviews (Two Sum, Anagram grouping, Frequency maps, LRU caches).',
      mistake: 'Modifying a collection directly while looping through it with a for-each loop throws ConcurrentModificationException.',
    },
    25: {
      title: 'Recursion & Call Stack Foundations',
      stage: 'Stage 6: Advanced & Collections',
      concept:
        'Recursion is a programming technique where a method calls itself to solve smaller subproblems until a base condition is reached.',
      subtopics: ['Base case identification', 'Recursive leap of faith', 'Call stack frames and memory', 'Tree recursion vs tail recursion'],
      code: [
        'public static int fib(int n) {',
        '    if (n <= 1) return n; // Base case',
        '    return fib(n - 1) + fib(n - 2); // Recursive step',
        '}',
      ],
      placementTip: 'Recursion is the prerequisite for Trees, Graphs, Backtracking, and Dynamic Programming.',
      mistake: 'Missing or incorrect base cases cause StackOverflowError.',
    },
    26: {
      title: 'File Handling & Placement Problem Solving',
      stage: 'Stage 6: Advanced & Collections',
      concept:
        'File Handling allows persistent storage of data on disk using java.io and java.nio.file with automated resource management.',
      subtopics: ['File, FileReader, FileWriter', 'BufferedReader & BufferedWriter', 'try-with-resources auto-close', 'Parsing CSV and streams'],
      code: [
        'try (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {',
        '    String line;',
        '    while ((line = br.readLine()) != null) {',
        '        System.out.println(line);',
        '    }',
        '} catch (IOException e) {',
        '    e.printStackTrace();',
        '}',
      ],
      placementTip: 'Always use try-with-resources to prevent unreleased file handles and data truncation.',
      mistake: 'Forgetting to close or flush file output streams, leaving files blank on disk.',
    },
    27: {
      title: 'Generics (Type Safety & Generic Classes)',
      stage: 'Stage 6: Advanced Java & Frameworks',
      concept:
        'Generics enable types (classes and interfaces) to be parameters when defining classes, interfaces, and methods. They provide compile-time type safety, eliminate manual casts, and prevent ClassCastException.',
      subtopics: [
        'Generic Class Box<T> definition',
        'Type Parameters (T, E, K, V)',
        'Compile-time type checking vs Raw types',
        'Bounded Wildcards (? extends Number, ? super Integer)',
      ],
      code: [
        'public class Box<T> {',
        '    private T data;',
        '    public void setData(T data) { this.data = data; }',
        '    public T getData() { return data; }',
        '}',
        'Box<Integer> b = new Box<>();',
        'b.setData(42);',
        'Integer val = b.getData(); // 0 cast needed',
      ],
      placementTip: 'Remember Type Erasure: Java replaces generic types with Object (or bounds) in bytecode for backward compatibility.',
      mistake: 'Using primitive types directly like Box<int> instead of wrapper classes Box<Integer>.',
    },
    28: {
      title: 'Lambda Expressions & Functional Interfaces',
      stage: 'Stage 6: Advanced Java & Frameworks',
      concept:
        'A lambda expression is an anonymous method that provides a clear and concise syntax to write Single Abstract Method (SAM) interfaces directly without boilerplate anonymous classes.',
      subtopics: [
        'Anonymous method characteristics (no name/modifier)',
        'SAM: Single Abstract Method rule',
        'Basic arrow syntax: (params) -> expression',
        'Java built-in functional interfaces (Predicate, Function, Consumer, Supplier)',
      ],
      code: [
        '@FunctionalInterface',
        'interface StringOp {',
        '    String apply(String s);',
        '}',
        'StringOp upper = s -> s.toUpperCase();',
        'System.out.println(upper.apply("hello")); // HELLO',
      ],
      placementTip: 'Method references (String::toUpperCase) are shorthand for lambdas and heavily tested in product company interviews.',
      mistake: 'Using curly braces without the return keyword for multi-line lambdas, causing compile errors.',
    },
    29: {
      title: 'Multithreading & Thread Lifecycle',
      stage: 'Stage 6: Advanced Java & Frameworks',
      concept:
        'Multithreading allows concurrent execution of two or more parts of a program for maximum CPU utilization. Threads cycle through 5 JVM states: NEW, RUNNABLE, RUNNING, WAITING/BLOCKED, and TERMINATED.',
      subtopics: [
        'The 5 thread lifecycle states',
        'Extending Thread vs Implementing Runnable',
        'Synchronization & Race Condition prevention',
        'Inter-thread communication (wait, notify, notifyAll)',
      ],
      code: [
        'class Worker implements Runnable {',
        '    public void run() {',
        '        System.out.println("Thread running: " + Thread.currentThread().getName());',
        '    }',
        '}',
        'Thread t = new Thread(new Worker());',
        't.start(); // Spawns OS thread in RUNNABLE pool',
      ],
      placementTip: 'Always implement Runnable or Callable rather than extending Thread so class remains open to extend other classes.',
      mistake: 'Calling run() directly instead of start(), which fails to start a concurrent thread and runs synchronously on main thread.',
    },
  };

  const details = TOPIC_DETAILS[orderIndex];
  if (!details) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E8DFC8] dark:border-stone-800">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#E76F51]">
          <Sparkles className="w-4 h-4" />
          <span>Understanding Concept: {details.title}</span>
        </div>
        <span className="text-[11px] font-semibold text-[#6B706B] dark:text-stone-400">
          {details.stage}
        </span>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF8] dark:bg-[#1E1712] border-2 border-[#E8DFC8] dark:border-[#382B20] shadow-sm space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E76F51]/15 text-[#E76F51] inline-block mb-2">
            Core Theory & Architecture
          </span>
          <h3 className="text-lg sm:text-xl font-black text-[#1F2421] dark:text-[#FAF6EE]">
            {details.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#6B706B] dark:text-[#BDB7AB] mt-1 leading-relaxed">
            {details.concept}
          </p>
        </div>

        {/* Subtopics Pills */}
        <div className="p-4 rounded-2xl bg-[#FAF6EE] dark:bg-[#251D17] border border-[#E8DFC8] dark:border-stone-800">
          <p className="text-xs font-bold uppercase tracking-wider text-[#1F2421] dark:text-stone-300 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#E76F51]" />
            <span>Key Subtopics You Must Master:</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {details.subtopics.map((sub, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs text-[#1F2421] dark:text-stone-300 bg-white dark:bg-stone-900 px-3 py-1.5 rounded-xl border border-[#E8DFC8] dark:border-stone-800"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5C8D68] shrink-0" />
                <span>{sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Code Syntax Box */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#1F2421] dark:text-stone-300 mb-2 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-[#E76F51]" />
            <span>Standard Java Reference Pattern:</span>
          </p>
          <div className="p-4 rounded-2xl bg-[#18130F] text-amber-50 font-mono text-xs space-y-1 overflow-x-auto border border-stone-800 shadow-inner">
            {details.code.map((line, idx) => (
              <p key={idx} className="whitespace-pre">
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Placement Tip & Common Mistake Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#F6FCE8] dark:bg-[#1B271A] border border-[#CCE2A8] dark:border-[#384F2E]">
            <p className="text-xs font-bold text-[#5C8D68] mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Campus Placement Focus</span>
            </p>
            <p className="text-xs text-[#1F2421] dark:text-stone-300 leading-relaxed">
              {details.placementTip}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FEEBE8] dark:bg-[#2A1D1A] border border-[#F6C2B8] dark:border-[#5A3830]">
            <p className="text-xs font-bold text-red-600 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Common Beginner Mistake</span>
            </p>
            <p className="text-xs text-[#1F2421] dark:text-stone-300 leading-relaxed">
              {details.mistake}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
