
import { createYoga } from 'graphql-yoga';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

const schema = makeExecutableSchema({ typeDefs, resolvers });

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  const yoga = createYoga({
    schema, 
    context: async () => ({ token }),
  });

  return yoga.handleRequest(req);
}

export async function GET(req: NextRequest) {
  const yoga = createYoga({
    schema, 
    context: async () => ({ token: null }),
  });

  return yoga.handleRequest(req);
}
