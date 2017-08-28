import * as keymirror from 'keymirror';
import * as R from 'ramda';

export const SKILL_STATUS = keymirror({
  ATTAINED: null,
  NOT_ATTAINED: null,
  FEEDBACK: null,
  OBJECTIVE: null,
});

const STATUS_WITH_ACTION = keymirror({
  FEEDBACK: null,
  OBJECTIVE: null,
});

export type Skill = {
  id: number,
  currentStatus: () => string | null,
  statusForNextEvaluation: () => string | null,
  feedbackData: () => UnhydratedEvaluationSkill,
  addAction: (string) => boolean | string,
  removeAction: (string) => boolean | string,
  updateStatus: (string) => UnhydratedEvaluationSkill,
  addNote: (string) => UnhydratedEvaluationSkill,
  deleteNote: (string) => any, // TODO: Fix this.
};

export default ({ id, name, criteria, type, questions, status, notes }: UnhydratedEvaluationSkill): Skill => Object.freeze({
  id,
  currentStatus() {
    return status.current;
  },
  statusForNextEvaluation() {
    return status.current === SKILL_STATUS.ATTAINED ? SKILL_STATUS.ATTAINED : null;
  },
  feedbackData() {
    return ({ id, name, criteria, type, questions, status });
  },
  addAction(newStatus: string) {
    return (STATUS_WITH_ACTION[newStatus] && status.current !== newStatus) && STATUS_WITH_ACTION[newStatus];
  },
  removeAction(newStatus: string) {
    return (STATUS_WITH_ACTION[status.current] && status.current !== newStatus) && STATUS_WITH_ACTION[status.current];
  },
  updateStatus(newStatus: string) {
    return {
      id,
      name,
      criteria,
      type,
      questions,
      status: {
        previous: status.previous,
        current: newStatus,
      },
      notes,
    };
  },
  addNote(newNoteId: string) {
    console.log('notes:', notes);
    return {
      id,
      name,
      criteria,
      type,
      questions,
      status,
      notes: Array.isArray(notes) ? [].concat(notes, newNoteId) : [newNoteId],
    };
  },
  deleteNote(noteId :string) {
    return {
      id,
      name,
      criteria,
      type,
      questions,
      status,
      notes: Array.isArray(notes) ? R.reject(R.equals(noteId), notes) : [],
    };
  },
});
