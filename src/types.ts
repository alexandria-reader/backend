export type ConnectionOptions = {
  connectionString: string | undefined,
  ssl: boolean | Object
};

export interface User {
  username: string,
  passwordHash: string,
  email: string
}
