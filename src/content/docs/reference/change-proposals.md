## Proposal: quiz support for polls

### Problem
The polls system collects votes but can't run a quiz. The projector screen
doesn't show the questions while voting is open, and the results page can't
show which answer was correct. The results grid also doesn't fit on one screen
once a questionnaire has more than a few polls.

### Proposed change
1. **Correct answers:** a poll can have an optional `answer` in the `.md`
   front matter. It must match one of the options (or `yes`/`no`). The build
   fails if it doesn't, like the other front matter checks. Single-answer
   polls only for now; `answer` on a `multiple: true` poll is a build error.
2. **No leaks:** one helper in `polls.ts` removes `answer` from any
   questionnaire that isn't closed. Every loader that returns a questionnaire
   uses it, so answers only reach the browser after closing.
3. **Projector:** show the questions and options while the poll is open
   (the data is already available, so this is a template change).
4. **Results:** mark the correct option with a ✓ and "Correct" (not colour
   alone). Show the correct answer even when fewer than 5 people voted.
5. **Layout:** make the closing results fit the screen (see open question).

### Not included
- Per-person scores (the plugin deliberately never records how anyone voted).
- Stepping through questions under mentor control (needs shared state the
  plugin doesn't have).
- Multiple correct answers.

