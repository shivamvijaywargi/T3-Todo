import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { todoInput, todoUpdate } from "~/types";

export const todoRouter = createTRPCRouter({
  getAllTodos: protectedProcedure.query(async ({ ctx }) => {
    const todos = await ctx.prisma.todo.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    console.log(
      "TODOS FROM PRISMA",
      todos.map(({ id, text, completed }) => ({
        id,
        text,
        completed,
      }))
    );

    return [
      {
        id: "fake-todo-id-1",
        text: "Fake Todo 1",
        completed: false,
      },
      {
        id: "fake-todo-id-2",
        text: "Fake Todo 2",
        completed: true,
      },
    ];
  }),

  create: protectedProcedure
    .input(todoInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.create({
        data: {
          text: input,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.delete({
        where: {
          id: input,
        },
      });
    }),

  update: protectedProcedure
    .input(todoUpdate)
    .mutation(async ({ ctx, input: { id, completed } }) => {
      return ctx.prisma.todo.update({
        where: {
          id,
        },
        data: {
          completed,
        },
      });
    }),
});
