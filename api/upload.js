import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-filename, content-type-file');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilise POST.' });
  }

  try {
    const filename = req.headers['x-filename'] || `image-${Date.now()}.jpg`;
    const contentType = req.headers['content-type-file'] || req.headers['content-type'] || 'image/jpeg';

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);

    if (fileBuffer.length === 0) {
      return res.status(400).json({ error: 'Aucun fichier reçu.' });
    }

    const blob = await put(filename, fileBuffer, {
      access: 'public',
      contentType: contentType,
    });

    return res.status(200).json({
      url: blob.url,
      message: 'Image uploadée avec succès',
    });

  } catch (err) {
    console.error('Erreur upload Vercel Blob:', err);
    return res.status(500).json({
      error: 'Erreur lors de l\'upload.',
      detail: err.message,
    });
  }
}
