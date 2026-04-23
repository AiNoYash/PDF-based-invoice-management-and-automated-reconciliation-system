export function getUserInitial(user) {
  const username = user?.username?.trim();
  return username ? username.charAt(0).toUpperCase() : '?';
}

export function getActiveBusinessName(user) {
  const businessName = user?.lastActiveBusinessName?.trim();

  if (businessName) {
    return businessName;
  }

  if (user?.lastActiveBusinessId != null) {
    return `Business #${user.lastActiveBusinessId}`;
  }

  return 'No active business selected';
}

export function getActiveBusinessLabel(user, prefix = 'Active Business') {
  return `${prefix}: ${getActiveBusinessName(user)}`;
}
