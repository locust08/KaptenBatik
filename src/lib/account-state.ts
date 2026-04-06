export const ACCOUNT_STATE_KEY = "kapten-batik-account-state";
export const ACCOUNT_STATE_CHANGE_EVENT = "kapten-batik-account-state-change";
export const ACCOUNT_REWARD_POINTS_KEY = "kapten-batik-reward-points";
export const ACCOUNT_REWARD_OFFER_KEY = "kapten-batik-reward-offer";
export const DEFAULT_REWARD_POINTS = 0;
export const SIGN_UP_BONUS_POINTS = 50;
export const REWARD_POINTS_PER_RM = 1;

export type AccountState = "logged-out" | "logged-in";

export type RewardOffer = {
  discountAmount: number;
  minimumPurchase: number;
  pointsRedeemed: number;
  redeemedAt: number;
  title: string;
};

export function readAccountState(): AccountState {
  if (typeof window === "undefined") {
    return "logged-out";
  }

  return window.localStorage.getItem(ACCOUNT_STATE_KEY) === "logged-in" ? "logged-in" : "logged-out";
}

export function readAccountRewardPoints(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const storedPoints = window.localStorage.getItem(ACCOUNT_REWARD_POINTS_KEY);
  const parsedPoints = storedPoints ? Number.parseInt(storedPoints, 10) : NaN;

  return Number.isFinite(parsedPoints) && parsedPoints > 0 ? parsedPoints : 0;
}

export function readPendingRewardOffer(): RewardOffer | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedOffer = window.localStorage.getItem(ACCOUNT_REWARD_OFFER_KEY);

  if (!storedOffer) {
    return null;
  }

  try {
    const parsed = JSON.parse(storedOffer) as RewardOffer;

    if (
      !parsed ||
      typeof parsed.discountAmount !== "number" ||
      typeof parsed.minimumPurchase !== "number" ||
      typeof parsed.pointsRedeemed !== "number" ||
      typeof parsed.redeemedAt !== "number" ||
      typeof parsed.title !== "string"
    ) {
      return null;
    }

    return {
      discountAmount: Math.max(0, Math.floor(parsed.discountAmount)),
      minimumPurchase: Math.max(0, Math.floor(parsed.minimumPurchase)),
      pointsRedeemed: Math.max(0, Math.floor(parsed.pointsRedeemed)),
      redeemedAt: Math.max(0, Math.floor(parsed.redeemedAt)),
      title: parsed.title,
    };
  } catch {
    return null;
  }
}

export function calculateRewardPointsFromAmount(amount: number) {
  return Math.max(0, Math.floor(amount * REWARD_POINTS_PER_RM));
}

export function setAccountRewardPoints(rewardPoints: number) {
  window.localStorage.setItem(ACCOUNT_REWARD_POINTS_KEY, String(Math.max(0, Math.floor(rewardPoints))));
  window.dispatchEvent(new Event(ACCOUNT_STATE_CHANGE_EVENT));
}

export function setPendingRewardOffer(offer: RewardOffer) {
  window.localStorage.setItem(
    ACCOUNT_REWARD_OFFER_KEY,
    JSON.stringify({
      discountAmount: Math.max(0, Math.floor(offer.discountAmount)),
      minimumPurchase: Math.max(0, Math.floor(offer.minimumPurchase)),
      pointsRedeemed: Math.max(0, Math.floor(offer.pointsRedeemed)),
      redeemedAt: Math.max(0, Math.floor(offer.redeemedAt)),
      title: offer.title,
    }),
  );
  window.dispatchEvent(new Event(ACCOUNT_STATE_CHANGE_EVENT));
}

export function clearPendingRewardOffer() {
  window.localStorage.removeItem(ACCOUNT_REWARD_OFFER_KEY);
  window.dispatchEvent(new Event(ACCOUNT_STATE_CHANGE_EVENT));
}

export function addAccountRewardPoints(rewardPoints: number) {
  const currentPoints = readAccountRewardPoints();
  const nextPoints = currentPoints + Math.max(0, Math.floor(rewardPoints));
  setAccountRewardPoints(nextPoints);
  return nextPoints;
}

export function redeemAccountRewardPoints(rewardPoints: number) {
  const currentPoints = readAccountRewardPoints();
  const pointsToRedeem = Math.max(0, Math.floor(rewardPoints));

  if (pointsToRedeem <= 0 || currentPoints < pointsToRedeem) {
    return null;
  }

  const remainingPoints = currentPoints - pointsToRedeem;
  setAccountRewardPoints(remainingPoints);
  return remainingPoints;
}

export function setAccountState(accountState: AccountState, rewardPoints = DEFAULT_REWARD_POINTS) {
  window.localStorage.setItem(ACCOUNT_STATE_KEY, accountState);

  if (accountState === "logged-in") {
    setAccountRewardPoints(rewardPoints);
  } else {
    window.localStorage.removeItem(ACCOUNT_REWARD_POINTS_KEY);
    window.localStorage.removeItem(ACCOUNT_REWARD_OFFER_KEY);
    window.dispatchEvent(new Event(ACCOUNT_STATE_CHANGE_EVENT));
  }
}

export function clearAccountState() {
  window.localStorage.removeItem(ACCOUNT_STATE_KEY);
  window.localStorage.removeItem(ACCOUNT_REWARD_POINTS_KEY);
  window.localStorage.removeItem(ACCOUNT_REWARD_OFFER_KEY);
  window.dispatchEvent(new Event(ACCOUNT_STATE_CHANGE_EVENT));
}
