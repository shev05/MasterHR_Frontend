export type AuthPayload = {
  login: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
};
