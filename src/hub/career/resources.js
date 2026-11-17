// "Saved these for you": the full resource library from the original guide, organized by what she needs.
// Links are the schools' and organizations' own pages. Check each one for current prices, dates and rules before relying on it.
export const resourceGroups = [
  {
    title: "If Adler catches your eye",
    items: [
      ["https://www.adler.edu/en-ca/programs/master-of-arts-industrial-organizational-psychology/", "The Vancouver psychology master’s", "See the applied capstone and research thesis options."],
      ["https://www.adler.edu/en-ca/admissions/tuition/", "Tuition and fees", "Check the current Vancouver rates and ask for a full program quote."],
      ["https://www.adler.edu/en-ca/admissions/how-to-apply/", "How to apply", "Transcripts, references, and the application steps."],
      ["https://www.adler.edu/en-ca/admissions/financial-aid-and-scholarships/", "Financial aid and scholarships", "Worth checking before paying the full amount."],
      ["https://www.adler.edu/en-ca/admissions/", "Admissions team", "Ask how your HR experience and degree fit the requirements."]
    ]
  },
  {
    title: "If you’d like to try change management",
    items: [
      ["https://growth.sauder.ubc.ca/courses/change-management-fundamentals", "UBC’s four-week introductory course", "A smaller commitment to find out whether you enjoy the subject."],
      ["https://growth.sauder.ubc.ca/change-management", "UBC’s full change management certificate", "Compare the four-course route with the bootcamp."],
      ["https://growth.sauder.ubc.ca/courses/change-management-bootcamp", "UBC change management bootcamp", "The accelerated option; check upcoming dates and the current fee."],
      ["https://growth.sauder.ubc.ca/courses/change-management-assessing-and-planning", "UBC: assessing and planning change", "Look at the planning side of the certificate."],
      ["https://growth.sauder.ubc.ca/courses/change-management-implementing-and-evaluating", "UBC: implementing and evaluating change", "See how change plans become day-to-day work."],
      ["https://growth.sauder.ubc.ca/courses/change-management-fostering-culture-and-capability", "UBC: culture and capability", "Especially relevant if company culture is what interests you."],
      ["https://www.royalroads.ca/programs/graduate-certificate-change-management", "Royal Roads graduate certificate", "Check the virtual residency and graduate-level coursework."],
      ["https://www.royalroads.ca/student-life/tuition-fees/search-tuition-fees", "Royal Roads tuition search", "Find the fee for your intake, rather than relying on the older benchmark."],
      ["https://www.royalroads.ca/student-life/tuition-fees/ancillary-fees/ancillary-fees-2026-27", "Royal Roads additional fees", "The extras to include in your budget."]
    ]
  },
  {
    title: "If the psychology part is what you love",
    items: [
      ["https://www.smu.ca/psychology/graduateprograms/msc-in-applied-psychology.html", "Saint Mary’s online MSc and personnel psychology diploma", "Both are on this page. Look closely at prerequisites and live class times."],
      ["https://www.smu.ca/academics/graduate-tuition-fees.html", "Saint Mary’s tuition and fees", "Use the per-course table for online psychology programs."],
      ["https://www.smu.ca/webfiles/2026-2027GradCourseFee.pdf", "Saint Mary’s 2026–27 per-course fee table", "The source behind the course-based estimates in the comparison."],
      ["https://www.csiop-scpio.ca/", "Canadian workplace psychology community", "Get a feel for the field and the people working in it."],
      ["https://portal.siop.org/graduate-training-program", "SIOP graduate program directory", "Browse further options; verify delivery and Canadian eligibility with each school."]
    ]
  },
  {
    title: "A couple of nearby directions, too",
    items: [
      ["https://extendedlearning.ubc.ca/programs-credentials/organizational-coaching-certificate", "UBC organizational coaching", "For working directly with people and leaders. A different path from assessment or M&A; it asks for about five years of relevant work experience, and the next cohort starts Jan 25, 2027 (applications close Nov 18, 2026, or when full). Check the page for current dates."],
      ["https://www.royalroads.ca/programs/graduate-certificate-organization-design-and-development", "Royal Roads organization design and development", "For changing how teams and organizations are structured. Confirm the current offering and delivery."],
      ["https://www.sfu.ca/continuing-studies/programs/leadership-essentials-certificate.html", "SFU leadership essentials", "Another angle if leading teams interests you more than a psychology degree."],
      ["https://www.sfu.ca/continuing-studies/courses/lead/change-management-for-leaders.html", "SFU change management for leaders", "A shorter course to investigate; check current availability."]
    ]
  },
  {
    title: "Credentials: only if they help you get where you want",
    items: [
      ["https://cphrbc.ca/cphr-designation/become-a-cphr/", "CPHR BC & Yukon: becoming a CPHR", "Check how your existing education and HR experience count."],
      ["https://cphrbc.ca/learning/professional-engagement/", "CPHR professional events and connections", "A way to meet people doing the work before deciding on school."],
      ["https://www.shrm.org/credentials/certification/eligibility-criteria", "SHRM certification eligibility", "Worth comparing if U.S. client work becomes a bigger part of your career."],
      ["https://www.prosci.com/solutions/training-programs/change-management-certification-program", "Prosci change management training", "A practical training option to compare with university certificates."],
      ["https://www.acmpglobal.org/page/ccmp", "ACMP’s CCMP credential", "Separate from a course certificate; check the education and experience requirements."],
      ["https://www.acmpglobal.org/page/faqs_ccmp", "CCMP questions and answers", "Useful for understanding what actually qualifies you."]
    ]
  },
  {
    title: "Money, jobs, and what the work is really like",
    items: [
      ["https://growth.sauder.ubc.ca/fsg", "UBC’s Future Skills Grant programs", "Check whether your chosen course and intake are currently funded. On Nov 16, 2026 the page said funded seats were full."],
      ["https://www.workbc.ca/develop-skills/funding-grants-learners/strongerbc-future-skills-grant/eligibility-criteria", "WorkBC grant eligibility", "Funding depends on your eligibility and the approved program."],
      ["https://www.workbc.ca/career-profiles/human-resources-professionals", "WorkBC: HR professionals", "Explore duties, training, and the local labour market."],
      ["https://www.jobbank.gc.ca/outlookreport/location/bc", "BC job outlooks", "Useful context when looking at possible career moves."],
      ["https://www.mercer.com/en-us/solutions/transformation/mergers-and-acquisitions-advisory/due-diligence/", "Mercer: people risks before a merger", "See the workforce, compensation and culture questions companies investigate."],
      ["https://www.mercer.com/en-us/solutions/transformation/mergers-and-acquisitions-advisory/integration-planning-and-execution/", "Mercer: bringing companies together", "A concrete look at HR integration, communication, culture and talent work."]
    ]
  }
];

export const resourceCount = resourceGroups.reduce((n, g) => n + g.items.length, 0);
