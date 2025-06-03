export const setupAuthMock = (page) => {
  return page.addInitScript(() => {
    // Mock global de Supabase
    window.__SUPABASE_MOCKED__ = true;

    // Mock du client Supabase
    window.mockSupabase = {
      auth: {
        signInWithPassword: async ({ email, password }) => {
          const validUsers = [`test@faverton.fr`, `user@faverton.fr`];

          // Simuler un délai réseau
          await new Promise(resolve => setTimeout(resolve, 500));

          if (validUsers.includes(email) && password.length >= 6) {
            return {
              error: null,
              data: {
                user: {
                  email,
                  id: `mock-user-id`,
                },
              },
            };
          }
          return {
            error: { message: `Invalid credentials` },
            data: null,
          };
        },

        getUser: async () => {
          return {
            data: { user: null },
            error: null,
          };
        },
      },
    };

    // Remplacer useSupabaseClient si utilisé
    if (window.useSupabaseClient) {
      window.useSupabaseClient = () => window.mockSupabase;
    }
  });
};
