import {
  signUp,
  confirmSignUp,
  signIn,
  fetchAuthSession,
} from "aws-amplify/auth";

export async function register(email: string, password: string, name?: string) {
  await signUp({
    username: email,
    password,
    options: { userAttributes: { email, name } },
  });
}

export async function confirmRegistration(email: string, code: string) {
  await confirmSignUp({ username: email, confirmationCode: code });
}

export async function login(email: string, password: string) {
  const result = await signIn({ username: email, password });
  return result;
}

export async function getTokens() {
  try {
    const session = await fetchAuthSession({ forceRefresh: false });
    return {
      accessToken: session.tokens?.accessToken?.payload,
      idToken: session.tokens?.idToken?.payload,
    };
  } catch (err) {
    console.log("error ", err);
    return null;
  }
}