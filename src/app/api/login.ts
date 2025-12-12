import type { NextApiRequest, NextApiResponse } from "next";

const USERS = [
  { email: process.env.APP_USER_1_EMAIL, password: process.env.APP_USER_1_PASSWORD },
  { email: process.env.APP_USER_2_EMAIL, password: process.env.APP_USER_2_PASSWORD },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { email, password } = req.body;

  const user = USERS.find(u => u.email === email && u.password === password);
  if (user) {
    return res.status(200).json({ token: email });
  }

  return res.status(401).json({ message: "Invalid credentials" });
}
