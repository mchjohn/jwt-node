declare namespace Express {
  interface Request {
    metadata?: {
      account?: {
        id: string;
        role: "USER" | "ADMIN";
      };
    };
  }
}
