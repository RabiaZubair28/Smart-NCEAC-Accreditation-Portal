// NCEAC domain-specific knowledge base
export const nceacQA = [
  {
    question: 'what is nceac',
    answer: "NCEAC (National Computing Education Accreditation Council) is Pakistan's premier accreditation body for computing education programs."
  },
  {
    question: "hi",
    answer: "Hello. How can I assist you with your NCEAC-related questions?"
  },
   {
    question: "hey",
    answer: "Hello. How can I assist you with your NCEAC-related questions?"
  },
  {
    question: 'how does the accreditation process work',
    answer: "It includes SAR submission, evaluation visit, review, and then a decision by the NCEAC council."
  },
  {
    question: 'what is a clo',
    answer: "CLOs are Course Learning Outcomes. They describe what a student should know or be able to do after completing a course."
  },
  {
    question: 'what is a plo',
    answer: "PLOs are Program Learning Outcomes. They describe what a student should achieve by the end of the degree program."
  },
  {
    question: 'how are clos and plos connected',
    answer: "CLOs are mapped to PLOs to track how each course contributes to overall program outcomes."
  },
  {
    question: 'how is faculty evaluated',
    answer: "Faculty are evaluated on qualifications, teaching effectiveness, research output, and student feedback."
  },
  {
    question: 'what are the infrastructure requirements',
    answer: "Institutions need modern labs, classrooms, libraries, internet, and learning management systems."
  },
  {
    question: 'how are students assessed',
    answer: "Through assignments, quizzes, presentations, exams, and projects — all mapped to CLOs and PLOs."
  },
  {
    question: 'how does the system handle clo to plo mapping',
    answer: "The system maps assessment marks to their corresponding Course Learning Outcomes (CLOs). Each CLO is then linked to one or more Program Learning Outcomes (PLOs) using a predefined weighted mapping. When a student's assessment marks exceed the threshold set by the instructor, the associated PLOs are marked as achieved. This approach ensures that PLO achievement is directly influenced by the student's performance in CLO-linked assessments."
  },
  {
    question: 'who is responsible for setting the threshold for plo mapping',
    answer: "The threshold for PLO mapping is set by the instructor teaching the respective course. They determine the performance benchmark students must meet for CLOs and associated PLOs to be considered achieved."
  },
  {
    question: 'what are the maximum and minimum limits for the threshold in plo mapping',
    answer: "There is no fixed maximum or minimum threshold. The threshold is entirely defined by the instructor and can vary based on the course content and the difficulty level of assessments. This flexibility allows instructors to tailor the criteria according to their academic objectives."
  },
  {
    question: 'how can i view my plo achievement status',
    answer: "Navigate to your student dashboard and open the 'PLO Performance' section. You will find a summary of your PLO achievements across different courses."
  },
  {
    question: 'can i know which questions contributed to a specific clo',
    answer: "Yes, in the assessment report, each question is tagged with the CLO it contributes to. This helps in understanding how each CLO was evaluated."
  },
  {
    question: 'who creates batches',
    answer: "Only the Head of Department (HOD) has the authority to create new batches in the system."
  },
  {
    question: 'what features does an instructor have',
    answer: "Instructors can update their profile information, add or remove their research publications, create assessments for their assigned courses, allocate marks to students, and define performance thresholds for CLO-PLO mapping."
  },
  {
    question: 'what features does the hod have',
    answer: "The Head of Department (HOD) can manage their profile and research publications, create and manage student batches, edit accreditation-related details, enroll or unenroll students, and assign or change student sections as needed."
  }
];

// Generate a comprehensive context from all QA pairs for Gemini
export const generateFullContext = () => {
  return nceacQA.map(item => `Q: ${item.question}\nA: ${item.answer}`).join('\n\n');
};

// Prepare system prompt that constrains responses to NCEAC domain
export const getSystemPrompt = () => {
  return `You are an NCEAC assistant that helps with questions about the National Computing Education Accreditation Council in Pakistan. 
  Only answer questions related to NCEAC, accreditation processes, CLOs, PLOs, faculty evaluation, infrastructure requirements, student assessment, and similar topics.
  For questions outside this domain, politely explain that you can only answer questions about NCEAC and related topics.
  Keep answers concise, professional, and accurate.
  If you're not sure about an answer, acknowledge it and stick to what you know from the provided information.`;
};