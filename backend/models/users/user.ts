import auth from '../auth';

type ErrorResponse = {
  error: boolean,
  message: string,
};

type UnhyrdatedUser = {
  _id: string,
  name: string,
  email: string,
  username: string,
  templateId: string,
  mentorId: string,
  avatarUrl: string,
};

export type UserFeedback = {
  id: string, name: string, mentorId: string,
};

export type User = {
  id: string,
  name: string,
  templateId: string,
  username: string,
  mentorId: string,
  email: string,
  isAdmin: () => boolean,
  manageUserViewModel: () => UserDetailsViewModel, // TODO: combine these
  userDetailsViewModel: () => UserDetailsViewModel,
  feedbackData: () => UserFeedback,
  signingData: () => { id: string, username: string },
  evaluationData: () => { id: string, name: string, email: string },
  hasTemplate: boolean,
  hasMentor: boolean,
  setMentor: (newMentorId: string) => ErrorResponse | { mentorId: string, modifiedDate: Date, error: boolean },
  setTemplate: (newTemplateId: string) => { templateId: string, modifiedDate: Date },
  toString: () => string,
};

const user = ({ _id, name, email, username, templateId, mentorId, avatarUrl }: UnhyrdatedUser): User => ({
  id: _id.toString(),
  name,
  username,
  templateId,
  mentorId,
  email,
  isAdmin(): boolean {
    return auth.isAdmin(email);
  },
  manageUserViewModel() {
    return ({ id: _id.toString(), username, name, avatarUrl, email, mentorId, templateId });
  },
  feedbackData() {
    return ({ id: _id.toString(), name: name || username, mentorId });
  },
  signingData() {
    return ({ id: _id.toString(), username });
  },
  evaluationData() {
    return ({ id: _id.toString(), name: name || username, email });
  },
  userDetailsViewModel() {
    return ({ id: _id.toString(), name, username, avatarUrl, email, mentorId, templateId });
  },
  hasTemplate: Boolean(templateId),
  hasMentor: Boolean(mentorId),
  setMentor(newMentorId: string) {
    if (newMentorId === _id.toString()) {
      return { error: true, message: `User '${newMentorId}' can not mentor themselves` };
    }

    return { mentorId: newMentorId, modifiedDate: new Date(), error: false };
  },
  setTemplate(newTemplateId: string) {
    return { templateId: newTemplateId, modifiedDate: new Date() };
  },
  toString() {
    return JSON.stringify(this);
  },
});

export default user;
export const newUser = (name: string, email: string, avatarUrl: string, username: string) => ({
  username,
  name,
  email,
  createdDate: new Date(),
  avatarUrl,
});