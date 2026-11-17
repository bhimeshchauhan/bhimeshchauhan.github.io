// Dates that matter for her programs, as listed on the schools' own pages on Nov 16, 2026. Always re-check with the school:
// deadlines move, and "or until full" means a program can close early.
export const deadlines = [
  { id: "coach", date: "2026-11-18", title: "UBC coaching: apply by", note: "Or until the cohort is full. The cohort runs Jan 25 to Dec 4, 2027 and asks for about five years of relevant work experience.", url: "https://extendedlearning.ubc.ca/programs-credentials/organizational-coaching-certificate" },
  { id: "adler", date: "2026-12-10", title: "Adler MIOP: Spring 2027 domestic applications close", note: "The next intake after that is Fall 2027.", url: "https://www.adler.edu/en-ca/programs/master-of-arts-industrial-organizational-psychology/" },
  { id: "smu", date: "2026-12-15", title: "Saint Mary’s online MSc: Canadian and PR deadline", note: "Listed for a September start. Ask the school which year this deadline applies to.", url: "https://www.smu.ca/psychology/graduateprograms/msc-in-applied-psychology.html" },
  { id: "ubc", date: "2027-01-15", title: "UBC Change Management Fundamentals starts", note: "Four weeks, with live evenings on Jan 19, Jan 26, Feb 2 and Feb 9, 6–9pm Pacific.", url: "https://growth.sauder.ubc.ca/courses/change-management-fundamentals" },
  { id: "adler-fall", date: "2027-08-15", title: "Adler MIOP: Fall 2027 domestic applications close", note: "The last day listed for a fall start.", url: "https://www.adler.edu/en-ca/programs/master-of-arts-industrial-organizational-psychology/" }
];
export const daysUntil = (iso, now = new Date()) => Math.round((new Date(`${iso}T00:00:00`) - new Date(now.toDateString())) / 86400000);
export const upcoming = (now = new Date()) => deadlines.filter((d) => daysUntil(d.date, now) >= 0);
