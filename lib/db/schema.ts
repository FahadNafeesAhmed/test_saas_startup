// Plain types for the in-memory store. This test target has no database: see lib/db/store.ts.

export interface User {
  id: number;
  name: string | null;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
export type NewUser = Pick<User, 'email' | 'passwordHash'> & Partial<Pick<User, 'name' | 'role'>>;

export interface Team {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripeProductId: string | null;
  planName: string | null;
  subscriptionStatus: string | null;
}
export type NewTeam = Pick<Team, 'name'>;

export interface TeamMember {
  id: number;
  userId: number;
  teamId: number;
  role: string;
  joinedAt: Date;
}
export type NewTeamMember = Pick<TeamMember, 'userId' | 'teamId' | 'role'>;

export interface ActivityLog {
  id: number;
  teamId: number;
  userId: number | null;
  action: string;
  timestamp: Date;
  ipAddress: string | null;
}
export type NewActivityLog = Pick<ActivityLog, 'teamId' | 'userId' | 'action'> & { ipAddress?: string };

export interface Invitation {
  id: number;
  teamId: number;
  email: string;
  role: string;
  invitedBy: number;
  invitedAt: Date;
  status: string;
}
export type NewInvitation = Pick<Invitation, 'teamId' | 'email' | 'role' | 'invitedBy'> & { status?: string };

export type TeamDataWithMembers = Team & {
  teamMembers: (TeamMember & {
    user: Pick<User, 'id' | 'name' | 'email'>;
  })[];
};

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  CREATE_TEAM = 'CREATE_TEAM',
  REMOVE_TEAM_MEMBER = 'REMOVE_TEAM_MEMBER',
  INVITE_TEAM_MEMBER = 'INVITE_TEAM_MEMBER',
  ACCEPT_INVITATION = 'ACCEPT_INVITATION',
}
