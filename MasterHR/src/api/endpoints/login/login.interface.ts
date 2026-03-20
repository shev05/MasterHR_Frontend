export type AuthPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
};

export type RegisterPayload = {
  name: string;
  surname: string;
  patronymc: string;
  password: string;
  email: string;
  phoneNumber: string;
};
