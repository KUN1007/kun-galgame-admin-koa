export const errorMessages: Record<number, string> = {
  // User Part
  10101: `User not found`,
  10102: `User password error`,
  10103: `Email verification code error`,
  10104: `Invalid Email, Name, Password, or Verification Code Format`,
  10105: `In cooldown for login, two identical login attempts should have a one-minute interval.`,
  10106: `You are not yet an administrator and cannot access the management system.`,
  10107: `You are not superuser, can't execute delete operation.`,

  // Topic Part
  10201: `Topic title length exceed 40 characters. Or empty.`,
  10202: `Topic content length exceed 100007 characters. Or empty.`,
  10203: `Topic with a maximum of 7 tags. Minimum one tag.`,
  10204: `Topic with a maximum of 2 categories. Minimum one category.`,
  10205: `Invalid topics timestamp.`,

  // Comment Part
  10401: `Comment length exceed 1007 characters. Or empty.`,

  // Reply Part
  10501: `Reply with a maximum of 7 tags.`,
  10502: `Single tag maximum length is 17 characters`,
  10503: `Reply content is empty`,
  10504: `Reply maximum length is 10007 characters`,
}
