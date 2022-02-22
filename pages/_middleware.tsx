import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { NextURL } from "next/dist/server/web/next-url";
import { NextResponse } from "next/server";

const Middleware = async (req: NextApiRequest) => {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const pathname = new URL(req.url ?? "").pathname;

  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  if (!token && pathname !== "/login") {
    return NextResponse.rewrite(new NextURL("/login", req.url));
  }
};

export default Middleware;
