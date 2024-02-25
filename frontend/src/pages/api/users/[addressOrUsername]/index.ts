import { db } from '@/db';
import { users as users } from '@/db/schema';
import {
  HTTP_METHOD_CB,
  errorHandlerCallback,
  mainHandler,
  successHandlerCallback,
} from '@/utils/api-utils';
import { NextApiRequest, NextApiResponse } from 'next';

import { eq, or } from 'drizzle-orm';

import isEmpty from 'just-is-empty';
import { IS_DEV } from '@/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return mainHandler(req, res, {
    GET,
    PUT,
  });
}

export const GET: HTTP_METHOD_CB = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    let { addressOrUsername } = req.query;

    const user = await db.query.users.findFirst({
      columns: {
        password: false,
        email: false,
      },
      where: or(
        eq(users.address, addressOrUsername as string),
        eq(users.username, addressOrUsername as string)
      ),
    });

    if (isEmpty(user)) {
      return await successHandlerCallback(
        req,
        res,
        {
          message: `User with '${addressOrUsername}' does not exist`,
          data: user,
        },
        404
      );
    }
    return await successHandlerCallback(req, res, {
      message: `User retrieved successfully`,
      data: user,
    });
  } catch (error: any) {
    return await errorHandlerCallback(req, res, {
      message: 'Something went wrong...',
      error: IS_DEV ? { ...error } : null,
    });
  }
};
export const PUT: HTTP_METHOD_CB = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { ...rest } = req.body;
    let { addressOrUsername } = req.query;

    const user = await db.query.users.findFirst({
      where: or(
        eq(users.address, addressOrUsername as string),
        eq(users.username, addressOrUsername as string)
      ),
    });
    if (isEmpty(user)) {
      return await successHandlerCallback(
        req,
        res,
        {
          message: `User with '${addressOrUsername}' does not exist`,
          data: user,
        },
        404
      );
    }

    const update = await db.update(users).set({ ...rest });

    return await successHandlerCallback(req, res, {
      message: 'user updated successfully',
    });
  } catch (error: any) {
    return await errorHandlerCallback(req, res, {
      message: 'Something went wrong...',
    });
  }
};

// export function DELETE(req:NextApiRequest,res:NextApiResponse){

// }
