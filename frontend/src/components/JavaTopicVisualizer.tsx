import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Cpu,
  Table,
  CheckCircle2,
  Code2,
  Terminal,
  Calculator,
  Layers,
  ArrowRight,
  RefreshCw,
  Eye,
  Info,
  ChevronRight,
  FileCode2,
  HelpCircle,
  Grid,
} from 'lucide-react';
import { TopicConceptCards } from './TopicConceptCards';

interface JavaTopicVisualizerProps {
  activeTabDefault?: 'methodology' | 'variables' | 'datatypes' | 'operators' | 'userinput' | 'arrays';
  showAllTabs?: boolean;
}

export const JavaTopicVisualizer: React.FC<JavaTopicVisualizerProps> = ({
  activeTabDefault = 'methodology',
  showAllTabs = true,
}) => {
  const [activeTab, setActiveTab] = useState<
    'methodology' | 'variables' | 'datatypes' | 'operators' | 'userinput' | 'arrays'
  >(activeTabDefault);

  // Interactive Variables State
  const [varType, setVarType] = useState<string>('int');
  const [varName, setVarName] = useState<string>('age');
  const [varValue, setVarValue] = useState<string>('20');
  const [ramPulse, setRamPulse] = useState<boolean>(false);

  // Interactive Operators State
  const [opA, setOpA] = useState<number>(17);
  const [opB, setOpB] = useState<number>(5);
  const [pBool, setPBool] = useState<boolean>(true);
  const [qBool, setQBool] = useState<boolean>(false);

  // Interactive User Input State
  const [inputName, setInputName] = useState<string>('Rahul');
  const [inputAge, setInputAge] = useState<number>(21);
  const [inputSalary, setInputSalary] = useState<number>(45000.5);

  const triggerRamAnimation = () => {
    setRamPulse(true);
    setTimeout(() => setRamPulse(false), 700);
  };

  const primitiveDataTypes = [
    { type: 'boolean', size: '1 bit', range: 'true or false', defaultVal: 'false', color: 'from-emerald-500 to-teal-600', category: 'Boolean' },
    { type: 'byte', size: '8 bits (1 byte)', range: '[-128, 127]', defaultVal: '0', color: 'from-amber-500 to-orange-600', category: 'Integer' },
    { type: 'short', size: '16 bits (2 bytes)', range: '[-32,768, 32,767]', defaultVal: '0', color: 'from-amber-500 to-yellow-600', category: 'Integer' },
    { type: 'char', size: '16 bits (2 bytes)', range: "['\\u0000', '\\uffff'] (0 to 65,535)", defaultVal: "'\\u0000'", color: 'from-purple-500 to-indigo-600', category: 'Character' },
    { type: 'int', size: '32 bits (4 bytes)', range: '[-2,147,483,648 to 2,147,483,647]', defaultVal: '0', color: 'from-brand-500 to-amber-700', category: 'Integer (Default)' },
    { type: 'long', size: '64 bits (8 bytes)', range: '[-2⁶³, 2⁶³ - 1]', defaultVal: '0L', color: 'from-rose-500 to-red-600', category: 'Large Integer' },
    { type: 'float', size: '32 bits (4 bytes)', range: '32-bit IEEE 754 floating-point', defaultVal: '0.0f', color: 'from-cyan-500 to-blue-600', category: 'Floating Point' },
    { type: 'double', size: '64 bits (8 bytes)', range: '64-bit IEEE 754 floating-point', defaultVal: '0.0d', color: 'from-violet-500 to-purple-600', category: 'Floating Point (Default)' },
  ];

  return (
    <div className="bg-gradient-to-br from-[#FAF6EE] via-white to-[#F6EDE0] dark:from-[#1E1712] dark:via-[#19130F] dark:to-[#251A13] border border-amber-200/80 dark:border-amber-900/40 rounded-3xl p-6 sm:p-8 shadow-xl shadow-amber-900/5 relative overflow-hidden transition-all duration-300">
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-400/10 via-brand-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-orange-400/10 via-brand-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-200/60 dark:border-amber-900/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/50 dark:border-amber-800/50 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Interactive Java Study Masterclass</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 dark:text-amber-50">
            Visual Guide & Practical Methodology
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
            Reference concepts directly aligned with your placement interview preparation workflow.
          </p>
        </div>

        {/* Tab Navigation */}
        {showAllTabs && (
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-amber-100/60 dark:bg-stone-900/80 border border-amber-200 dark:border-stone-800 rounded-2xl shrink-0">
            <button
              onClick={() => setActiveTab('methodology')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'methodology'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>5-Step Workflow</span>
            </button>
            <button
              onClick={() => setActiveTab('variables')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'variables'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>1. Variables</span>
            </button>
            <button
              onClick={() => setActiveTab('datatypes')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'datatypes'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>2. Data Types</span>
            </button>
            <button
              onClick={() => setActiveTab('operators')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'operators'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>3. Operators</span>
            </button>
            <button
              onClick={() => setActiveTab('userinput')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'userinput'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>4. User Input</span>
            </button>
            <button
              onClick={() => setActiveTab('arrays')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'arrays'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>5. Arrays (1D & 2D)</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab Content 0: 5-Step Methodology */}
      {activeTab === 'methodology' && (
        <div className="relative z-10 pt-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
              ★
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-white">
                How to Practice Each Problem
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Follow this exact five-step discipline for every interview coding question to maximize retention and speed.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '1',
                title: 'Understand Problem',
                desc: 'Carefully identify input types, output requirements, edge constraints, and core logic.',
                highlight: 'Input, output, constraints',
                color: 'border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300',
              },
              {
                step: '2',
                title: 'Write in Notebook',
                desc: 'Dry-run the algorithm on paper. Draw variables & arrays before writing a single line of code.',
                highlight: 'Solve without looking at code',
                color: 'border-orange-300 dark:border-orange-800 bg-orange-50/70 dark:bg-orange-950/30 text-orange-800 dark:text-orange-300',
              },
              {
                step: '3',
                title: 'Code in Java',
                desc: 'Write clean code using proper naming conventions and only the concepts covered so far.',
                highlight: 'Clean Java syntax & structure',
                color: 'border-amber-400 dark:border-amber-700 bg-amber-100/50 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200',
              },
              {
                step: '4',
                title: 'Test Edge Cases',
                desc: 'Explicitly test zero, negative numbers, maximum bounds, empty strings, and duplicate entries.',
                highlight: 'Zero, negatives, bounds',
                color: 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300',
              },
              {
                step: '5',
                title: 'Solve Again Without Help',
                desc: 'Close solutions and re-implement from scratch to build muscle memory and interview speed.',
                highlight: 'Improves speed & retention',
                color: 'border-rose-300 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300',
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between ${item.color}`}
              >
                <div>
                  <span className="w-7 h-7 rounded-xl bg-white/80 dark:bg-black/40 font-black text-xs flex items-center justify-center mb-3 shadow-sm">
                    {item.step}
                  </span>
                  <h4 className="text-sm font-black mb-1">{item.title}</h4>
                  <p className="text-xs opacity-90 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-current/20 text-[11px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.highlight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 1: Variables & Memory Allocation */}
      {activeTab === 'variables' && (
        <div className="relative z-10 pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>Java Variable Declaration & RAM Memory Allocation</span>
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                Every variable has a data type, an identifier name, and occupies a reserved physical block in RAM.
              </p>
            </div>

            {/* Live Interactive Tester */}
            <div className="flex items-center gap-2">
              <button
                onClick={triggerRamAnimation}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-100 bg-amber-200/80 dark:bg-amber-900/60 hover:bg-amber-300 dark:hover:bg-amber-800 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Simulate RAM Write</span>
              </button>
            </div>
          </div>

          {/* Interactive Variable Builder */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Syntax Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900/80 border border-amber-200 dark:border-stone-800 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" />
                  <span>Variable Declaration Syntax</span>
                </p>

                <div className="p-4 rounded-xl bg-stone-950 text-stone-100 font-mono text-base sm:text-lg flex items-center justify-center gap-2 border border-stone-800 shadow-inner">
                  <span className="text-amber-400 font-bold">{varType}</span>
                  <span className="text-cyan-400 font-bold">{varName}</span>
                  <span className="text-stone-400">=</span>
                  <span className="text-emerald-400 font-bold">{varValue}</span>
                  <span className="text-stone-400">;</span>
                </div>

                {/* Explanation Callouts */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                    <span><strong>Data Type ({varType}):</strong> Specifies how much RAM memory to allocate (e.g. 32 bits for int).</span>
                  </div>
                  <div className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 mt-1 shrink-0" />
                    <span><strong>Variable Name ({varName}):</strong> The identifier / label assigned to the memory address.</span>
                  </div>
                  <div className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                    <span><strong>Value ({varValue}):</strong> The literal data stored inside the allocated RAM memory cell.</span>
                  </div>
                </div>

                {/* Live Inputs */}
                <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Type</label>
                    <select
                      value={varType}
                      onChange={(e) => {
                        setVarType(e.target.value);
                        triggerRamAnimation();
                      }}
                      className="w-full text-xs font-mono p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    >
                      <option value="int">int</option>
                      <option value="double">double</option>
                      <option value="char">char</option>
                      <option value="boolean">boolean</option>
                      <option value="String">String</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Name</label>
                    <input
                      type="text"
                      value={varName}
                      onChange={(e) => {
                        setVarName(e.target.value);
                        triggerRamAnimation();
                      }}
                      className="w-full text-xs font-mono p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">Value</label>
                    <input
                      type="text"
                      value={varValue}
                      onChange={(e) => {
                        setVarValue(e.target.value);
                        triggerRamAnimation();
                      }}
                      className="w-full text-xs font-mono p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RAM Visualizer Box */}
            <div className="lg:col-span-7">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FDF0EC] via-[#FCE4DC] to-[#F9D6CA] dark:from-[#2B1B15] dark:via-[#241712] dark:to-[#1E130E] border-2 border-orange-200 dark:border-orange-950/60 shadow-lg relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500 animate-ping" />
                    <span className="font-extrabold text-xs uppercase tracking-wider text-orange-900 dark:text-orange-200">
                      RAM (Random Access Memory) Architecture
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-orange-800 dark:text-orange-300 bg-white/70 dark:bg-stone-900/60 px-2.5 py-1 rounded-full border border-orange-300 dark:border-orange-900">
                    Address: 0x7FFF5FBFF4A8
                  </span>
                </div>

                {/* Inner Memory Block */}
                <div className="p-6 rounded-2xl bg-white/90 dark:bg-stone-900/90 border-2 border-dashed border-orange-400 dark:border-orange-700/60 shadow-sm flex flex-col items-center justify-center">
                  <span className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300 mb-2">
                    Memory Block Identifier: <span className="text-amber-600 dark:text-amber-400">{varType} {varName}</span>
                  </span>

                  {/* Value Cell */}
                  <div
                    className={`w-32 h-24 rounded-2xl flex flex-col items-center justify-center font-mono font-black text-3xl shadow-md transition-all duration-500 ${
                      ramPulse
                        ? 'scale-110 bg-amber-400 text-stone-950 shadow-amber-500/50'
                        : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-orange-600/30'
                    }`}
                  >
                    <span>{varValue}</span>
                    <span className="text-[10px] font-sans font-normal opacity-80 mt-1">
                      {varType === 'int' ? '32 bits' : varType === 'double' ? '64 bits' : 'RAM Cell'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-4 text-center max-w-sm">
                    Reserved memory area for variable <strong>{varName}</strong> in execution stack memory.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Data Types */}
      {activeTab === 'datatypes' && (
        <div className="relative z-10 pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                <Table className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>Java Primitive Types Reference Table</span>
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                Java has exactly 8 primitive data types with fixed memory sizes, value ranges, and default values.
              </p>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-amber-200 dark:border-stone-800 shadow-sm bg-white dark:bg-stone-900/80">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-amber-100/70 dark:bg-stone-800/80 text-amber-900 dark:text-amber-200 uppercase tracking-wider font-extrabold text-[11px] border-b border-amber-200 dark:border-stone-700">
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Range</th>
                  <th className="py-3 px-4">Default Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100/60 dark:divide-stone-800/60">
                {primitiveDataTypes.map((item) => (
                  <tr
                    key={item.type}
                    className="hover:bg-amber-50/70 dark:hover:bg-stone-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>{item.type}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-600 dark:text-stone-300">
                      {item.category}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-stone-800 dark:text-stone-200">
                      {item.size}
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-700 dark:text-stone-300">
                      {item.range}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {item.defaultVal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Key Rule Note */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Placement Exam Tip:</strong> In Java, integer literals are treated as <code className="font-mono bg-amber-200/50 dark:bg-amber-900/50 px-1 py-0.5 rounded">int</code> by default, and decimal literals are treated as <code className="font-mono bg-amber-200/50 dark:bg-amber-900/50 px-1 py-0.5 rounded">double</code>. To assign a <code className="font-mono">long</code> literal, append <code className="font-mono font-bold">L</code> (e.g. <code className="font-mono">10000000000L</code>), and for <code className="font-mono">float</code>, append <code className="font-mono font-bold">f</code> (e.g. <code className="font-mono">3.14f</code>).
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Operators & Truth Tables */}
      {activeTab === 'operators' && (
        <div className="relative z-10 pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>Java Operators & Truth Tables</span>
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                Operators perform operations on variables and values. Classified into Arithmetic, Relational, and Logical.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Arithmetic */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900/80 border border-amber-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  1. Arithmetic Operators
                </span>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 mb-4">
                  Mathematical computations on numeric values.
                </p>

                <div className="grid grid-cols-5 gap-1.5 p-2 rounded-xl bg-amber-50/70 dark:bg-stone-800 text-center font-mono text-base font-bold text-stone-900 dark:text-stone-100 border border-amber-200/60 dark:border-stone-700">
                  <span title="Addition">+</span>
                  <span title="Subtraction">-</span>
                  <span title="Multiplication">*</span>
                  <span title="Division">/</span>
                  <span title="Modulus (Remainder)">%</span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs font-mono text-stone-700 dark:text-stone-300">
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span>{opA} + {opB}</span>
                    <span className="font-bold text-amber-600">{opA + opB}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span>{opA} - {opB}</span>
                    <span className="font-bold text-amber-600">{opA - opB}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span>{opA} * {opB}</span>
                    <span className="font-bold text-amber-600">{opA * opB}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span>{opA} / {opB}</span>
                    <span className="font-bold text-amber-600">{Math.floor(opA / opB)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>{opA} % {opB} (Remainder)</span>
                    <span className="font-bold text-amber-600">{opA % opB}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Relational */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900/80 border border-amber-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-orange-700 dark:text-orange-400">
                  2. Relational Operators
                </span>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 mb-4">
                  Compare two operands and return a boolean.
                </p>

                <div className="grid grid-cols-6 gap-1 p-2 rounded-xl bg-orange-50/70 dark:bg-stone-800 text-center font-mono text-sm font-bold text-stone-900 dark:text-stone-100 border border-orange-200/60 dark:border-stone-700">
                  <span>&lt;</span>
                  <span>&lt;=</span>
                  <span>&gt;</span>
                  <span>&gt;=</span>
                  <span>==</span>
                  <span>!=</span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs font-mono text-stone-700 dark:text-stone-300">
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span>{opA} &lt; {opB}</span>
                    <span className={`font-bold ${opA < opB ? 'text-emerald-500' : 'text-rose-500'}`}>{String(opA < opB)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span>{opA} &gt; {opB}</span>
                    <span className={`font-bold ${opA > opB ? 'text-emerald-500' : 'text-rose-500'}`}>{String(opA > opB)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span>{opA} == {opB}</span>
                    <span className={`font-bold ${opA === opB ? 'text-emerald-500' : 'text-rose-500'}`}>{String(opA === opB)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>{opA} != {opB}</span>
                    <span className={`font-bold ${opA !== opB ? 'text-emerald-500' : 'text-rose-500'}`}>{String(opA !== opB)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Logical & Truth Table */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900/80 border border-amber-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  3. Logical Operators (Truth Table)
                </span>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 mb-4">
                  Combine multiple boolean expressions.
                </p>

                <div className="grid grid-cols-3 gap-1 p-2 rounded-xl bg-emerald-50/70 dark:bg-stone-800 text-center font-mono text-xs font-bold text-stone-900 dark:text-stone-100 border border-emerald-200/60 dark:border-stone-700">
                  <div>
                    <span className="text-emerald-600 font-extrabold">&amp;&amp;</span>
                    <div className="text-[10px] text-stone-500 font-sans">AND</div>
                  </div>
                  <div>
                    <span className="text-emerald-600 font-extrabold">||</span>
                    <div className="text-[10px] text-stone-500 font-sans">OR</div>
                  </div>
                  <div>
                    <span className="text-emerald-600 font-extrabold">!</span>
                    <div className="text-[10px] text-stone-500 font-sans">NOT</div>
                  </div>
                </div>

                {/* Truth Table Display */}
                <div className="mt-4 p-3 rounded-xl bg-stone-950 text-stone-100 font-mono text-xs space-y-1.5 border border-stone-800">
                  <div className="flex justify-between text-stone-400 font-bold border-b border-stone-800 pb-1 text-[11px]">
                    <span>Logical Rule</span>
                    <span>Result</span>
                  </div>
                  <div className="flex justify-between">
                    <span>T &amp;&amp; T</span>
                    <span className="text-emerald-400 font-bold">TRUE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>F || F</span>
                    <span className="text-rose-400 font-bold">FALSE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>!TRUE</span>
                    <span className="text-rose-400 font-bold">FALSE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>!FALSE</span>
                    <span className="text-emerald-400 font-bold">TRUE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: User Input with Scanner */}
      {activeTab === 'userinput' && (
        <div className="relative z-10 pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>Java User Input with Scanner (java.util.Scanner)</span>
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                The standard way to read console input in Java. Reads Strings, integers, and floating-point values.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Code Block */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl overflow-hidden border border-stone-800 shadow-lg bg-[#0F141C]">
                <div className="flex items-center justify-between px-4 py-2.5 bg-stone-900/90 border-b border-stone-800 text-xs font-mono text-stone-400">
                  <span className="flex items-center gap-2">
                    <FileCode2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>Main.java</span>
                  </span>
                  <span className="text-[11px] text-amber-400 font-sans font-semibold">Scanner Guide</span>
                </div>

                <pre className="p-4 text-xs font-mono text-stone-200 leading-relaxed overflow-x-auto">
{`import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner myObj = new Scanner(System.in);

        System.out.println("Enter name, age and salary:");

        // String input
        String name = myObj.nextLine();

        // Numerical input
        int age = myObj.nextInt();
        double salary = myObj.nextDouble();

        // Output input by user
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Salary: " + salary);

        myObj.close();
    }
}`}
                </pre>
              </div>
            </div>

            {/* Interactive Simulated Terminal */}
            <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-stone-900/80 border border-amber-200 dark:border-stone-800 shadow-sm">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" />
                  <span>Simulated Terminal Execution</span>
                </p>

                {/* Input Fields */}
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                      myObj.nextLine() [Name]:
                    </label>
                    <input
                      type="text"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      className="w-full text-xs font-mono p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                      myObj.nextInt() [Age]:
                    </label>
                    <input
                      type="number"
                      value={inputAge}
                      onChange={(e) => setInputAge(Number(e.target.value))}
                      className="w-full text-xs font-mono p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                      myObj.nextDouble() [Salary]:
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputSalary}
                      onChange={(e) => setInputSalary(Number(e.target.value))}
                      className="w-full text-xs font-mono p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>

                {/* Console Output Preview */}
                <div className="p-3.5 rounded-xl bg-stone-950 text-stone-100 font-mono text-xs border border-stone-800 shadow-inner">
                  <p className="text-stone-500 text-[10px] uppercase font-bold mb-1 border-b border-stone-800 pb-1">Console Output</p>
                  <p className="text-amber-300">Name: {inputName}</p>
                  <p className="text-amber-300">Age: {inputAge}</p>
                  <p className="text-amber-300">Salary: {inputSalary}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Tip: Always call <code className="font-mono text-amber-600">myObj.nextLine()</code> after <code className="font-mono text-amber-600">nextInt()</code> to consume the trailing newline!</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 5: Arrays (1D & 2D) Masterclass */}
      {activeTab === 'arrays' && (
        <div className="relative z-10 pt-6">
          <TopicConceptCards orderIndex={14} slug="arrays-1d" />
        </div>
      )}
    </div>
  );
};
