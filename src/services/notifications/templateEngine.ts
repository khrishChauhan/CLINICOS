export const templateEngine = {
  /**
   * Parses a template string and replaces variables in the format {{variable_name}}.
   * 
   * @param template e.g. "Hello {{patient_name}}, your appt is at {{time}}"
   * @param context e.g. { patient_name: "John", time: "10:00 AM" }
   * @returns Parsed string
   */
  parse(template: string, context: Record<string, string>): string {
    if (!template) return ''
    
    return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      const trimmedKey = key.trim()
      // If the key exists in context, replace it. Otherwise, leave it as is.
      return context[trimmedKey] !== undefined ? context[trimmedKey] : match
    })
  }
}
