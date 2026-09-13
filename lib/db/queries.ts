import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';
import { store } from './store';

export async function getUser() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (!sessionData || !sessionData.user || typeof sessionData.user.id !== 'number') {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  return store.findUserById(sessionData.user.id);
}

export async function getTeamByStripeCustomerId(customerId: string) {
  return store.findTeamByStripeCustomerId(customerId);
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  store.updateTeam(teamId, subscriptionData);
}

export async function getUserWithTeam(userId: number) {
  const user = store.findUserById(userId);
  if (!user) return undefined;
  return { user, teamId: store.membershipOf(userId)?.teamId ?? null };
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  return store.activityFor(user.id, 10);
}

export async function getTeamForUser() {
  const user = await getUser();
  if (!user) {
    return null;
  }
  const membership = store.membershipOf(user.id);
  return membership ? store.teamWithMembers(membership.teamId) : null;
}
