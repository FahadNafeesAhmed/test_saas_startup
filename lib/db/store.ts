// In-memory data for the Helix Ledger test target. No database, no environment variables, deterministic content.
// The seed user exists at process start; anything created at runtime lives until the serverless instance recycles,
// which is fine for a demo target (the seed user always comes back).
import type { ActivityLog, Invitation, Team, TeamMember, User, NewUser, NewTeam, NewTeamMember, NewActivityLog, NewInvitation, TeamDataWithMembers } from './schema';

export const SEED_EMAIL = 'test@test.com';
export const SEED_PASSWORD = 'admin123';
// bcrypt hash of SEED_PASSWORD, precomputed so cold starts do not spend 100 ms hashing.
const SEED_HASH = '$2b$10$tuYYN48nLtYtOFGcJVYWs.7qQkvllOMMf0kMKN./DLeIrJyKW4TwG';
const T0 = new Date('2026-09-01T09:00:00Z');

interface Tables {
  users: User[];
  teams: Team[];
  teamMembers: TeamMember[];
  activityLogs: ActivityLog[];
  invitations: Invitation[];
  seq: Record<string, number>;
}

function seed(): Tables {
  const users: User[] = [
    { id: 1, name: 'Demo Owner', email: SEED_EMAIL, passwordHash: SEED_HASH, role: 'owner', createdAt: T0, updatedAt: T0, deletedAt: null },
    { id: 2, name: 'Priya Raman', email: 'priya@helixledger.test', passwordHash: SEED_HASH, role: 'member', createdAt: T0, updatedAt: T0, deletedAt: null },
    { id: 3, name: 'Jonas Weber', email: 'jonas@helixledger.test', passwordHash: SEED_HASH, role: 'member', createdAt: T0, updatedAt: T0, deletedAt: null },
  ];
  const teams: Team[] = [
    { id: 1, name: 'Helix Ledger Demo Team', createdAt: T0, updatedAt: T0, stripeCustomerId: null, stripeSubscriptionId: null, stripeProductId: null, planName: 'Team', subscriptionStatus: 'active' },
  ];
  const teamMembers: TeamMember[] = [
    { id: 1, userId: 1, teamId: 1, role: 'owner', joinedAt: T0 },
    { id: 2, userId: 2, teamId: 1, role: 'member', joinedAt: T0 },
    { id: 3, userId: 3, teamId: 1, role: 'member', joinedAt: T0 },
  ];
  const activityLogs: ActivityLog[] = [
    { id: 1, teamId: 1, userId: 1, action: 'SIGN_UP', timestamp: new Date('2026-09-01T09:05:00Z'), ipAddress: '203.0.113.10' },
    { id: 2, teamId: 1, userId: 1, action: 'CREATE_TEAM', timestamp: new Date('2026-09-01T09:06:00Z'), ipAddress: '203.0.113.10' },
    { id: 3, teamId: 1, userId: 1, action: 'INVITE_TEAM_MEMBER', timestamp: new Date('2026-09-02T14:20:00Z'), ipAddress: '203.0.113.10' },
    { id: 4, teamId: 1, userId: 1, action: 'UPDATE_ACCOUNT', timestamp: new Date('2026-09-05T11:42:00Z'), ipAddress: '203.0.113.10' },
  ];
  return { users, teams, teamMembers, activityLogs, invitations: [], seq: { users: 3, teams: 1, teamMembers: 3, activityLogs: 4, invitations: 0 } };
}

// One store per process; survives hot reloads in dev via globalThis.
const g = globalThis as unknown as { __helixStore?: Tables };
const t: Tables = g.__helixStore ?? (g.__helixStore = seed());
const nextId = (table: keyof Tables['seq']) => (t.seq[table] = (t.seq[table] ?? 0) + 1);

export const store = {
  findUserById: (id: number): User | null => t.users.find((u) => u.id === id && !u.deletedAt) ?? null,
  findUserByEmail: (email: string): User | null => t.users.find((u) => u.email === email && !u.deletedAt) ?? null,
  insertUser: (u: NewUser): User => {
    const now = new Date();
    const row: User = { id: nextId('users'), name: u.name ?? null, email: u.email, passwordHash: u.passwordHash, role: u.role ?? 'member', createdAt: now, updatedAt: now, deletedAt: null };
    t.users.push(row); return row;
  },
  updateUser: (id: number, patch: Partial<User>): void => {
    const u = t.users.find((x) => x.id === id); if (u) Object.assign(u, patch, { updatedAt: new Date() });
  },
  softDeleteUser: (id: number): void => {
    const u = t.users.find((x) => x.id === id); if (u) { u.deletedAt = new Date(); u.email = `${u.email}-${u.id}-deleted`; }
  },

  findTeam: (id: number): Team | null => t.teams.find((x) => x.id === id) ?? null,
  findTeamByStripeCustomerId: (cid: string): Team | null => t.teams.find((x) => x.stripeCustomerId === cid) ?? null,
  insertTeam: (n: NewTeam): Team => {
    const now = new Date();
    const row: Team = { id: nextId('teams'), name: n.name, createdAt: now, updatedAt: now, stripeCustomerId: null, stripeSubscriptionId: null, stripeProductId: null, planName: null, subscriptionStatus: null };
    t.teams.push(row); return row;
  },
  updateTeam: (id: number, patch: Partial<Team>): void => {
    const x = t.teams.find((y) => y.id === id); if (x) Object.assign(x, patch, { updatedAt: new Date() });
  },

  membershipOf: (userId: number): TeamMember | null => t.teamMembers.find((m) => m.userId === userId) ?? null,
  insertTeamMember: (m: NewTeamMember): TeamMember => {
    const row: TeamMember = { id: nextId('teamMembers'), ...m, joinedAt: new Date() }; t.teamMembers.push(row); return row;
  },
  deleteTeamMember: (memberId: number, teamId: number): void => {
    const i = t.teamMembers.findIndex((m) => m.id === memberId && m.teamId === teamId); if (i >= 0) t.teamMembers.splice(i, 1);
  },
  deleteMembership: (userId: number, teamId: number): void => {
    const i = t.teamMembers.findIndex((m) => m.userId === userId && m.teamId === teamId); if (i >= 0) t.teamMembers.splice(i, 1);
  },
  teamWithMembers: (teamId: number): TeamDataWithMembers | null => {
    const team = t.teams.find((x) => x.id === teamId); if (!team) return null;
    const members = t.teamMembers.filter((m) => m.teamId === teamId).map((m) => {
      const u = t.users.find((x) => x.id === m.userId);
      return { ...m, user: { id: u?.id ?? m.userId, name: u?.name ?? null, email: u?.email ?? '' } };
    });
    return { ...team, teamMembers: members };
  },

  insertActivity: (a: NewActivityLog): ActivityLog => {
    const row: ActivityLog = { id: nextId('activityLogs'), teamId: a.teamId, userId: a.userId, action: a.action, timestamp: new Date(), ipAddress: a.ipAddress ?? '' };
    t.activityLogs.push(row); return row;
  },
  activityFor: (userId: number, limit = 10) => t.activityLogs
    .filter((a) => a.userId === userId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit)
    .map((a) => ({ id: a.id, action: a.action, timestamp: a.timestamp, ipAddress: a.ipAddress, userName: t.users.find((u) => u.id === a.userId)?.name ?? null })),

  findPendingInvitation: (id: number, email: string): Invitation | null => t.invitations.find((i) => i.id === id && i.email === email && i.status === 'pending') ?? null,
  pendingInvitationFor: (email: string, teamId: number): Invitation | null => t.invitations.find((i) => i.email === email && i.teamId === teamId && i.status === 'pending') ?? null,
  insertInvitation: (n: NewInvitation): Invitation => {
    const row: Invitation = { id: nextId('invitations'), teamId: n.teamId, email: n.email, role: n.role, invitedBy: n.invitedBy, invitedAt: new Date(), status: n.status ?? 'pending' };
    t.invitations.push(row); return row;
  },
  updateInvitation: (id: number, patch: Partial<Invitation>): void => {
    const i = t.invitations.find((x) => x.id === id); if (i) Object.assign(i, patch);
  },
  isMember: (email: string, teamId: number): boolean => {
    const u = t.users.find((x) => x.email === email); return Boolean(u && t.teamMembers.some((m) => m.userId === u.id && m.teamId === teamId));
  },
};
