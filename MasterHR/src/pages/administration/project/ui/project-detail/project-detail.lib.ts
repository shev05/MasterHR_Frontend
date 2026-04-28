const EXPERIENCE_COLORS = {
  junior: { className: 'bg-green-100 text-green-800 border-green-300', maxYears: 1 },
  middle: { className: 'bg-orange-100 text-orange-800 border-orange-300', maxYears: 4 },
  senior: { className: 'bg-red-100 text-red-800 border-red-300', maxYears: Infinity },
} as const;

export const getLevelColor = (years: number) => {
  if (years <= EXPERIENCE_COLORS.junior.maxYears) return EXPERIENCE_COLORS.junior.className;
  if (years <= EXPERIENCE_COLORS.middle.maxYears) return EXPERIENCE_COLORS.middle.className;
  return EXPERIENCE_COLORS.senior.className;
};
