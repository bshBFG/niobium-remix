import { useMemo } from "react";
import { useMatches } from "remix";

import type { Profile, User } from "~/models/user.server";

export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User & { profile: Profile | null } {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser():
  | (User & { profile: Profile | null })
  | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User & { profile: Profile | null } {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function validationEmail(email: unknown) {
  if (validateEmail(email)) {
    return `Invalid email`;
  }
}

export const toCapitalize = (string: string): string => {
  const word = string.toLowerCase();

  const newWord = word[0].toUpperCase() + word.substring(1);

  return newWord;
};

export const toCapitalizeAll = (string: string): string => {
  const words = string.toLowerCase().split(" ");

  const newWords = words.map(
    (word) => word[0].toUpperCase() + word.substring(1)
  );

  const newString = newWords.join(" ");

  return newString;
};

export const getFullNameOrNull = (profile: Profile | null) => {
  if (profile === null) {
    return null;
  }

  const { firstName, secondName } = profile;

  const fullName = `${firstName || ""} ${secondName || ""}`.trim();
  if (fullName.length === 0) {
    return null;
  }

  return fullName;
};
