interface DeleteAccountResponse {
  success: boolean
  error?: string
}

export async function useDeleteAccount(shouldSoftDelete: boolean = true): Promise<DeleteAccountResponse> {
  try {
    const response = await $fetch<DeleteAccountResponse>(`/api/user/delete`, {
      method: `POST`,
      body: { shouldSoftDelete },
    });

    if (!response.success) {
      throw new Error(response.error || `Échec de la suppression du compte`);
    }

    return { success: true };
  }
  catch (error) {
    console.error(`Erreur lors de la suppression du compte:`, error instanceof Error ? error.message : `Erreur inconnue`);
    return {
      success: false,
      error: error instanceof Error ? error.message : `Erreur inconnue`,
    };
  }
};
