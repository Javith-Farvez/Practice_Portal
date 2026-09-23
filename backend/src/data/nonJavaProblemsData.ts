export interface NonJavaProblemSample {
  id: number;
  sample_input: string;
  sample_output: string;
}

export const NON_JAVA_PROBLEM_SAMPLES: Record<number, NonJavaProblemSample> = {
  // ==========================================
  // DSA (IDs 1001 - 1029)
  // ==========================================
  1001: {
    id: 1001,
    sample_input: '3 9 20 null null 15 7',
    sample_output: '3',
  },
  1002: {
    id: 1002,
    sample_input: '4 2 7 1 3 6 9',
    sample_output: '4 7 2 9 6 3 1',
  },
  1003: {
    id: 1003,
    sample_input: '3 9 20 null null 15 7',
    sample_output: '[[3], [9, 20], [15, 7]]',
  },
  1004: {
    id: 1004,
    sample_input: '2 1 3',
    sample_output: 'true',
  },
  1005: {
    id: 1005,
    sample_input: '3 5 1 6 2 0 8 null null 7 4\n5 1',
    sample_output: '3',
  },
  1006: {
    id: 1006,
    sample_input: '3 1 4 null 2\n1',
    sample_output: '1',
  },
  1007: {
    id: 1007,
    sample_input: '3 9 20 15 7\n9 3 15 20 7',
    sample_output: '3 9 20 null null 15 7',
  },
  1008: {
    id: 1008,
    sample_input: '-10 9 20 null null 15 7',
    sample_output: '42',
  },
  1009: {
    id: 1009,
    sample_input: '3',
    sample_output: '3',
  },
  1010: {
    id: 1010,
    sample_input: '2 7 9 3 1',
    sample_output: '12',
  },
  1011: {
    id: 1011,
    sample_input: '1 2 5\n11',
    sample_output: '3',
  },
  1012: {
    id: 1012,
    sample_input: '10 9 2 5 3 7 101 18',
    sample_output: '4',
  },
  1013: {
    id: 1013,
    sample_input: '3 4\n1 2 3\n10 15 40',
    sample_output: '50',
  },
  1014: {
    id: 1014,
    sample_input: 'abcde\nace',
    sample_output: '3',
  },
  1015: {
    id: 1015,
    sample_input: 'horse\nros',
    sample_output: '3',
  },
  1016: {
    id: 1016,
    sample_input: '1 5 11 5',
    sample_output: 'true',
  },
  1017: {
    id: 1017,
    sample_input: 'No input required',
    sample_output: 'O(N log N)',
  },
  1018: {
    id: 1018,
    sample_input: '2 7 11 15\n9',
    sample_output: '0 1',
  },
  1019: {
    id: 1019,
    sample_input: 'babad',
    sample_output: 'bab',
  },
  1020: {
    id: 1020,
    sample_input: '-1 0 3 5 9 12\n9',
    sample_output: '4',
  },
  1021: {
    id: 1021,
    sample_input: '5 2 3 1',
    sample_output: '1 2 3 5',
  },
  1022: {
    id: 1022,
    sample_input: '3 2 0 -4\n1',
    sample_output: 'true',
  },
  1023: {
    id: 1023,
    sample_input: '()[]{}',
    sample_output: 'true',
  },
  1024: {
    id: 1024,
    sample_input: 'push 1\npush 2\npeek\npop\nempty',
    sample_output: '1\n1\nfalse',
  },
  1025: {
    id: 1025,
    sample_input: '1 2 3',
    sample_output: '[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]',
  },
  1026: {
    id: 1026,
    sample_input: '4',
    sample_output: '.Q..\n...Q\nQ...\n..Q.\n\n..Q.\nQ...\n...Q\n.Q..',
  },
  1027: {
    id: 1027,
    sample_input: '1 1 1 2 2 3\n2',
    sample_output: '1 2',
  },
  1028: {
    id: 1028,
    sample_input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0',
    sample_output: '1',
  },
  1029: {
    id: 1029,
    sample_input: '6\n1 3 0 5 8 5\n2 4 6 7 9 9',
    sample_output: '4',
  },

  // ==========================================
  // APTITUDE (IDs 2001 - 2018)
  // ==========================================
  2001: {
    id: 2001,
    sample_input: '7 105 3 58',
    sample_output: '6',
  },
  2002: {
    id: 2002,
    sample_input: '2 4 6 8 10 12\n30',
    sample_output: '16',
  },
  2003: {
    id: 2003,
    sample_input: '20 -20',
    sample_output: '-4%',
  },
  2004: {
    id: 2004,
    sample_input: '1000 900',
    sample_output: '11.11%',
  },
  2005: {
    id: 2005,
    sample_input: '12 15',
    sample_output: '13 1/4 days',
  },
  2006: {
    id: 2006,
    sample_input: '20 30 40',
    sample_output: '17 1/7 minutes',
  },
  2007: {
    id: 2007,
    sample_input: '150 15 150 12',
    sample_output: '54 km/h',
  },
  2008: {
    id: 2008,
    sample_input: '52 4 2',
    sample_output: '6768 / 270725',
  },
  2009: {
    id: 2009,
    sample_input: '40 2 10',
    sample_output: '4000',
  },
  2010: {
    id: 2010,
    sample_input: '40 4 3',
    sample_output: '29.16 liters',
  },
  2011: {
    id: 2011,
    sample_input: '30 75 20 85',
    sample_output: '79',
  },
  2012: {
    id: 2012,
    sample_input: 'LEADING',
    sample_output: '720',
  },
  2013: {
    id: 2013,
    sample_input: '3 40',
    sample_output: '130 degrees',
  },
  2014: {
    id: 2014,
    sample_input: '7 2 5 2 1',
    sample_output: '35 years',
  },
  2015: {
    id: 2015,
    sample_input: '14',
    sample_output: '112 cm^2',
  },
  2016: {
    id: 2016,
    sample_input: '120 150 180 225',
    sample_output: 'Q2 and Q4 (25%)',
  },
  2017: {
    id: 2017,
    sample_input: 'He is the only son of my mother.',
    sample_output: 'Himself',
  },
  2018: {
    id: 2018,
    sample_input: '(A) Neither of the two candidates / (B) have submitted / (C) their original certificates / (D) at the time of interview.',
    sample_output: '(B) have submitted -> has submitted',
  },

  // ==========================================
  // PYTHON (IDs 3001 - 3008)
  // ==========================================
  3001: {
    id: 3001,
    sample_input: 'apple banana apple orange banana apple',
    sample_output: "{'apple': 3, 'banana': 2, 'orange': 1}",
  },
  3002: {
    id: 3002,
    sample_input: '[1, [2, [3, 4], 5], 6]',
    sample_output: '[1, 2, 3, 4, 5, 6]',
  },
  3003: {
    id: 3003,
    sample_input: '1 1 1 2 2 3\n2',
    sample_output: '[1, 2]',
  },
  3004: {
    id: 3004,
    sample_input: '{"a": 1, "b": 1, "c": 2}',
    sample_output: "{1: ['a', 'b'], 2: ['c']}",
  },
  3005: {
    id: 3005,
    sample_input: '4 3 2 7 8 2 3 1',
    sample_output: '[2, 3]',
  },
  3006: {
    id: 3006,
    sample_input: '1 3 5\n2 4 6',
    sample_output: '[1, 2, 3, 4, 5, 6]',
  },
  3007: {
    id: 3007,
    sample_input: '2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2',
    sample_output: '1\n-1',
  },
  3008: {
    id: 3008,
    sample_input: '1 2 3 4',
    sample_output: '24 12 8 6',
  },
};
