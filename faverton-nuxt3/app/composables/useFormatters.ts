// composables/useFormatters.ts
export function useFormatters() {
  function formatDate(dateString: string | Date, format: string = `long`): string {
    if (!dateString) return ``;

    const date = new Date(dateString);

    if (format === `long`) {
      return date.toLocaleDateString(`fr-FR`, {
        year: `numeric`,
        month: `long`,
        day: `numeric`,
      });
    }

    if (format === `short`) {
      return date.toLocaleDateString(`fr-FR`, {
        year: `numeric`,
        month: `2-digit`,
        day: `2-digit`,
      });
    }

    return date.toLocaleDateString(`fr-FR`);
  }

  return {
    formatDate,
  };
}
