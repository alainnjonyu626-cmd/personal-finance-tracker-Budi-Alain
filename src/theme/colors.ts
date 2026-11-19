/**
 * The app's colour palette. Every colour used anywhere in the app
 * comes from this one file, so the whole look can be changed here.
 */

export const colors = {
  // page background, the colour of the paper
  paper: "#F5EFE0",
  // cards, inputs and raised surfaces sit on paper
  paperDeep: "#EBE2CC",
  // main text colour (not pure black, it is a very dark green)
  ink: "#16261D",
  // secondary text: hints, helper lines, quieter words
  inkSoft: "#4A5A4F",
  // primary buttons and headers
  forest: "#14452B",
  // income: money coming in (green)
  income: "#1E7B4F",
  // expense: money going out (red)
  expense: "#B23A2A",
  // accent: focus rings and small highlights
  gold: "#D9A33B",
  // ruled lines and borders
  line: "#D8CDB1",

  // soft background for income badges
  incomeTint: "#E3EEDF",
  // soft background for expense badges
  expenseTint: "#F3DFD7",
  // forest button while it is being pressed
  forestPressed: "#0F3420",
  // anything that cannot be used right now
  disabled: "#C9C0A8",
} as const;

// The type of every colour key above, so other files can reuse it safely.
export type Colors = typeof colors;
