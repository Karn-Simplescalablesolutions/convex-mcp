import { query } from "./_generated/server";

export const myQuery = query({
    args: {},
    handler: async (ctx) => {
        return "Hello from Railway!";
    },
});
