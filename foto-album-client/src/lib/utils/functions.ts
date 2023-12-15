export function classNames (...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fieldError(field: string, fields: any) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return fields.find((item: any) => item.field === field).message;
    } catch (error) {
      return false;
    }
  }