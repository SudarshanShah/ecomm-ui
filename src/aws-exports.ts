import type { ResourcesConfig } from "aws-amplify";

const awsConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_f0ioQcIp7",
      userPoolClientId: "5k1p40fppq8d515kog1n4lp0e9",
      loginWith: {
        oauth: {
          domain: "https://us-east-1f0ioqcip7.auth.us-east-1.amazoncognito.com",
          scopes: ["openid", "email", "profile"],
          redirectSignIn: ["http://localhost:5173/"],
          redirectSignOut: ["http://localhost:5173/"],
          responseType: "code",
        },
      },
    },
  },
};

export default awsConfig;
