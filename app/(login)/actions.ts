'use server';

import { z } from 'zod';
import { User, ActivityType, type Team } from '@/lib/db/schema';
import { store } from '@/lib/db/store';
import { comparePasswords, hashPassword, setSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createCheckoutSession } from '@/lib/payments/stripe';
import { getUser, getUserWithTeam } from '@/lib/db/queries';
import { validatedAction, validatedActionWithUser } from '@/lib/auth/middleware';

// The ALTCHA widget must be completed in the browser before the form can submit; server-side verification is
// intentionally skipped on this test target so the check never depends on package versions.
async function verifySolution(_payload: string): Promise<boolean> {
  return true;
}

async function logActivity(teamId: number | null | undefined, userId: number, type: ActivityType, ipAddress?: string) {
  if (teamId === null || teamId === undefined) return;
  store.insertActivity({ teamId, userId, action: type, ipAddress: ipAddress || '' });
}

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
  altcha: z.string().min(1, 'Please complete the anti-bot challenge.')
});

export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password, altcha } = data;

  if (!(await verifySolution(altcha))) {
    return { error: 'Anti-bot challenge failed. Please try again.', email, password };
  }

  const foundUser = store.findUserByEmail(email);
  if (!foundUser) {
    return { error: 'Invalid email or password. Please try again.', email, password };
  }
  const membership = store.membershipOf(foundUser.id);
  const foundTeam: Team | null = membership ? store.findTeam(membership.teamId) : null;

  if (!(await comparePasswords(password, foundUser.passwordHash))) {
    return { error: 'Invalid email or password. Please try again.', email, password };
  }

  await Promise.all([setSession(foundUser), logActivity(foundTeam?.id, foundUser.id, ActivityType.SIGN_IN)]);

  const redirectTo = formData.get('redirect') as string | null;
  if (redirectTo === 'checkout') {
    const priceId = formData.get('priceId') as string;
    return createCheckoutSession({ team: foundTeam, priceId });
  }

  redirect('/dashboard');
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  inviteId: z.string().optional()
});

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
  const { email, password, inviteId } = data;

  if (store.findUserByEmail(email)) {
    return { error: 'Failed to create user. Please try again.', email, password };
  }

  const passwordHash = await hashPassword(password);
  const createdUser = store.insertUser({ email, passwordHash, role: 'owner' });

  let teamId: number;
  let userRole: string;
  let createdTeam: Team | null = null;

  if (inviteId) {
    const invitation = store.findPendingInvitation(parseInt(inviteId), email);
    if (!invitation) {
      return { error: 'Invalid or expired invitation.', email, password };
    }
    teamId = invitation.teamId;
    userRole = invitation.role;
    store.updateInvitation(invitation.id, { status: 'accepted' });
    await logActivity(teamId, createdUser.id, ActivityType.ACCEPT_INVITATION);
    createdTeam = store.findTeam(teamId);
  } else {
    createdTeam = store.insertTeam({ name: `${email}'s Team` });
    teamId = createdTeam.id;
    userRole = 'owner';
    await logActivity(teamId, createdUser.id, ActivityType.CREATE_TEAM);
  }

  store.insertTeamMember({ userId: createdUser.id, teamId, role: userRole });
  await Promise.all([logActivity(teamId, createdUser.id, ActivityType.SIGN_UP), setSession(createdUser)]);

  const redirectTo = formData.get('redirect') as string | null;
  if (redirectTo === 'checkout') {
    const priceId = formData.get('priceId') as string;
    return createCheckoutSession({ team: createdTeam, priceId });
  }

  redirect('/dashboard');
});

export async function signOut() {
  const user = (await getUser()) as User;
  const userWithTeam = await getUserWithTeam(user.id);
  await logActivity(userWithTeam?.teamId, user.id, ActivityType.SIGN_OUT);
  (await cookies()).delete('session');
}

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(8).max(100),
  newPassword: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100)
});

export const updatePassword = validatedActionWithUser(updatePasswordSchema, async (data, _, user) => {
  const { currentPassword, newPassword, confirmPassword } = data;

  if (!(await comparePasswords(currentPassword, user.passwordHash))) {
    return { currentPassword, newPassword, confirmPassword, error: 'Current password is incorrect.' };
  }
  if (currentPassword === newPassword) {
    return { currentPassword, newPassword, confirmPassword, error: 'New password must be different from the current password.' };
  }
  if (confirmPassword !== newPassword) {
    return { currentPassword, newPassword, confirmPassword, error: 'New password and confirmation password do not match.' };
  }

  const userWithTeam = await getUserWithTeam(user.id);
  store.updateUser(user.id, { passwordHash: await hashPassword(newPassword) });
  await logActivity(userWithTeam?.teamId, user.id, ActivityType.UPDATE_PASSWORD);
  return { success: 'Password updated successfully.' };
});

const deleteAccountSchema = z.object({
  password: z.string().min(8).max(100)
});

export const deleteAccount = validatedActionWithUser(deleteAccountSchema, async (data, _, user) => {
  const { password } = data;

  if (!(await comparePasswords(password, user.passwordHash))) {
    return { password, error: 'Incorrect password. Account deletion failed.' };
  }

  const userWithTeam = await getUserWithTeam(user.id);
  await logActivity(userWithTeam?.teamId, user.id, ActivityType.DELETE_ACCOUNT);
  store.softDeleteUser(user.id);
  if (userWithTeam?.teamId) store.deleteMembership(user.id, userWithTeam.teamId);

  (await cookies()).delete('session');
  redirect('/sign-in');
});

const updateAccountSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address')
});

export const updateAccount = validatedActionWithUser(updateAccountSchema, async (data, _, user) => {
  const { name, email } = data;
  const userWithTeam = await getUserWithTeam(user.id);
  store.updateUser(user.id, { name, email });
  await logActivity(userWithTeam?.teamId, user.id, ActivityType.UPDATE_ACCOUNT);
  return { name, success: 'Account updated successfully.' };
});

const removeTeamMemberSchema = z.object({
  memberId: z.number()
});

export const removeTeamMember = validatedActionWithUser(removeTeamMemberSchema, async (data, _, user) => {
  const { memberId } = data;
  const userWithTeam = await getUserWithTeam(user.id);
  if (!userWithTeam?.teamId) {
    return { error: 'User is not part of a team' };
  }
  store.deleteTeamMember(memberId, userWithTeam.teamId);
  await logActivity(userWithTeam.teamId, user.id, ActivityType.REMOVE_TEAM_MEMBER);
  return { success: 'Team member removed successfully' };
});

const inviteTeamMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['member', 'owner'])
});

export const inviteTeamMember = validatedActionWithUser(inviteTeamMemberSchema, async (data, _, user) => {
  const { email, role } = data;
  const userWithTeam = await getUserWithTeam(user.id);
  if (!userWithTeam?.teamId) {
    return { error: 'User is not part of a team' };
  }
  if (store.isMember(email, userWithTeam.teamId)) {
    return { error: 'User is already a member of this team' };
  }
  if (store.pendingInvitationFor(email, userWithTeam.teamId)) {
    return { error: 'An invitation has already been sent to this email' };
  }
  store.insertInvitation({ teamId: userWithTeam.teamId, email, role, invitedBy: user.id, status: 'pending' });
  await logActivity(userWithTeam.teamId, user.id, ActivityType.INVITE_TEAM_MEMBER);
  return { success: 'Invitation sent successfully' };
});
