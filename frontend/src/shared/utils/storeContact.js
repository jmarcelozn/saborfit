export function formatWhatsappDisplay(whatsapp) {
  if (!whatsapp) {
    return null;
  }

  const digits = String(whatsapp).replace(/\D/g, '');

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 13 && digits.startsWith('55')) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
  }

  return digits;
}

export function buildWhatsappUrl(whatsapp) {
  if (!whatsapp) {
    return null;
  }

  const digits = String(whatsapp).replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : null;
}

export function buildInstagramUrl(instagram) {
  if (!instagram) {
    return null;
  }

  const handle = String(instagram).trim().replace(/^@/, '');

  if (!handle) {
    return null;
  }

  if (/^https?:\/\//i.test(handle)) {
    return handle;
  }

  return `https://instagram.com/${handle}`;
}

export function buildMailtoUrl(email) {
  if (!email) {
    return null;
  }

  return `mailto:${email}`;
}
