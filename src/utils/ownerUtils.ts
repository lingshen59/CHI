// src/utils/ownerUtils.ts
export function isOwner(userId: string): boolean {
  const ownerId = process.env.OWNER_ID;
  if (!ownerId) {
    throw new Error('OWNER_ID not configured in environment variables');
  }
  return userId === ownerId;
}

export function validateOwnerCommand(command: string): boolean {
  const ownerCommands = ['#admin', '#ipinfo', '#gmailinfo', '#imagelogger'];
  return ownerCommands.some(cmd => command.startsWith(cmd));
}