// The five programs, ported from the original guide. Re-checked against the schools' official pages on Nov 16, 2026:
//  - confirmed: UBC Sauder price, dates and format; Saint Mary's per-course tuition and fees (2026-27 fee schedule);
//  - changed: Saint Mary's totals now include the per-course fees; UBC's funded seats are currently full;
//  - could not be confirmed: Adler's current total price and part-time length, and everything on Royal Roads (its site blocked the check).
// Anything we could not confirm is labelled as an older example in the `price` / `basis` text instead of being stated as current.
const adler = "https://www.adler.edu/en-ca/programs/master-of-arts-industrial-organizational-psychology/";
const smu = "https://www.smu.ca/psychology/graduateprograms/msc-in-applied-psychology.html";
const smuFees = "https://www.smu.ca/webfiles/2026-2027GradCourseFee.pdf";
const royal = "https://www.royalroads.ca/programs/graduate-certificate-change-management";
const ubc = "https://growth.sauder.ubc.ca/courses/change-management-fundamentals";

export const CHECKED = "Nov 16, 2026";

export const programs = [
  {
    id: "miop", school: "Adler University", name: "Industrial & Organizational Psychology", award: "MIOP · Applied master’s",
    format: "campus", venue: "Vancouver campus (520 Seymour Street) · mostly in person, with some online options and evening or weekend schedules",
    months: 24, length: "2 years full-time (a faster path is listed at as little as 16 months); part-time schedules available",
    cost: 50838, price: "≈ $50,838 (older example)",
    basis: "From an earlier published Vancouver sample: $46,018 tuition + $4,820 fees. I couldn’t find a current total on Adler’s pages on " + CHECKED + ", so treat this as an older example and ask Adler for a quote for your intake and for part-time.",
    tags: ["psych", "change"],
    learn: "Employee assessment, leadership, organizational culture and change. Includes an applied capstone and a 240-hour organizational development practicum (typically about four months, two to three days a week).",
    fit: "The closest local match if you want a full psychology degree and practical corporate work. Evening, weekend and part-time options can help you keep working.",
    roles: "Organizational development, talent management, employee experience, people consulting.",
    check: "Ask how the practicum hours fit around work, and compare the capstone route with Adler’s research-thesis MAIOP (ask whether it has its own fee). Adler lists a minimum GPA of 2.75, a statement of intent, transcripts, a résumé and references. As listed on " + CHECKED + ", Spring 2027 domestic applications close Dec 10, 2026 and Fall 2027 close Aug 15, 2027.",
    url: adler, fees: adler
  },
  {
    id: "ubc", school: "UBC Sauder Professional Growth", name: "Change Management Fundamentals", award: "Short course · Counts toward certificate",
    format: "online", venue: "Live online · four Tuesday evenings, 6–9pm Pacific (Jan 19, Jan 26, Feb 2, Feb 9, 2027)",
    months: 1, length: "4 weeks (Jan 15–Feb 12, 2027) · 8–10 hours/week",
    cost: 1095, price: "$1,095",
    basis: "Published fee for the listed Jan–Feb 2027 course, confirmed on " + CHECKED + ".",
    tags: ["change", "deal"],
    learn: "Assess who a change affects, plan for adoption and apply change frameworks to a real workplace problem.",
    fit: "A low-commitment way to see if change work fits before paying for a longer program. This intake needs four live evening sessions.",
    roles: "Change project contributor, HR transformation or integration project support.",
    check: "This price is for one course. The full certificate is $4,380 as four courses (16 weeks) or a 10-week bootcamp, and the bootcamp page lists no upcoming start date right now. UBC’s Future Skills Grant funding was listed as full on " + CHECKED + ".",
    url: ubc, fees: ubc, extra: "https://growth.sauder.ubc.ca/change-management"
  },
  {
    id: "rru", school: "Royal Roads University", name: "Change Management", award: "Graduate certificate",
    format: "online", venue: "Online with a one-week virtual residency; Calgary option also available (as listed earlier)",
    months: 6, length: "About 6 months · 10–15 hours/week during online courses (as listed earlier)",
    cost: 8446, price: "≈ $8,446+ (older benchmark)",
    basis: "From Royal Roads’ 2025–26 budget document, so it may not match today’s fee. Royal Roads’ website blocked my automated check on " + CHECKED + ", so I couldn’t confirm the current price, dates or requirements. Request a current quote.",
    tags: ["change", "deal"],
    learn: "Plan organizational change, engage stakeholders and measure adoption. Credits may transfer into select Royal Roads master’s programs.",
    fit: "A structured next step for an HR professional who wants to run change projects or help integrate teams after a deal.",
    roles: "Change management specialist, HR transformation, post-merger people integration.",
    check: "Confirm everything on this card with Royal Roads directly: the virtual cohort and residency dates, the current fee, and the standard versus flexible admission requirements for your background.",
    url: royal, fees: "https://www.royalroads.ca/sites/default/files/2025-11/25-6571_CFO_Ops_Capital-Budget-Plan_25-26_Web.pdf"
  },
  {
    id: "diploma", school: "Saint Mary’s University", name: "Personnel Psychology", award: "Graduate diploma",
    format: "online", venue: "Online from Vancouver · confirm whether classes are live and what time they run in Pacific Time",
    months: 12, length: "1 year full-time; part-time available",
    cost: 10906, price: "≈ $10,906",
    basis: "5 courses × $2,181.25 from Saint Mary’s 2026–27 fee schedule: $2,000 tuition + $138.75 mandatory fees + $42.50 student association fee per course (part-time rate). Taking three or more courses a term changes the student fees, and medical, dental and U-Pass charges can apply. Domestic rates are for Canadian citizens and permanent residents.",
    tags: ["psych"],
    learn: "Personnel psychology, advanced assessment, research methods and statistics. Five graduate courses (three core and two elective), with no research thesis or internship.",
    fit: "A focused way to build on hiring experience and specialize in evidence-based assessment without a full master’s.",
    roles: "Talent assessment, selection design, workforce analytics support, talent management.",
    check: "Admissions look similar to the MSc, which lists at least 60 credit hours of psychology courses and a minimum GPA of 3.3. Ask whether your coursework meets the threshold before planning around this option.",
    url: smu, fees: smuFees
  },
  {
    id: "msc", school: "Saint Mary’s University", name: "Applied Psychology · I/O stream", award: "MSc · Research master’s",
    format: "online", venue: "Live online from Vancouver (classes are live, not self-paced) · confirm class times in Pacific Time",
    months: 24, length: "Minimum 2 years",
    cost: 17450, price: "≈ $17,450+",
    basis: "8 courses × $2,181.25 from Saint Mary’s 2026–27 fee schedule (tuition $2,000 + mandatory and student fees per course). The MSc also includes an internship and an original research thesis, so ask what other fees apply.",
    tags: ["psych"],
    learn: "24 credits of coursework, an internship and an original research thesis. Builds research, measurement and workplace consulting skills.",
    fit: "A remote option if you want research depth and can make live classes work around your job.",
    roles: "People analytics, applied workplace research, assessment and organizational consulting.",
    check: "The school lists at least 60 credit hours of psychology courses and a minimum GPA of 3.3. Its Canadian and permanent-resident deadline is listed as Dec 15 for a September start (as of " + CHECKED + "). Online MSc students don’t receive internal university funding and aren’t guaranteed TA roles, but can apply for external funding.",
    url: smu, fees: smuFees
  }
];
