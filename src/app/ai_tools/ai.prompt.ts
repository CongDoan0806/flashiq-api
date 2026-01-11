export const buildStoryPrompt = (
  terms: string[],
  storyLength: number,
  style: string
) => `
    You are an English learning assistant.

    Create a ${style} story (approximately ${storyLength} words) using ALL of the following vocabulary words naturally.
    The story should be easy to understand for learners at A2–B1 level.

    Vocabulary list:
    ${terms.map((t) => `- ${t}`).join('\n')}

    Rules:
    - Use each vocabulary word at least once
    - Highlight each vocabulary word by wrapping it with **bold**
    - Keep sentences clear and not too long
    - The story should have a clear beginning, middle, and ending
    - Write in ${style} style
    - Do NOT explain the words, only write the story
`;
