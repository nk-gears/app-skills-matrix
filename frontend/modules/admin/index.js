import { combineReducers } from 'redux';

import { reducers as usersReducers } from './users';
import { reducers as matricesReducers } from './matrices';

export const reducers = combineReducers({ users: usersReducers, matrices: matricesReducers });

