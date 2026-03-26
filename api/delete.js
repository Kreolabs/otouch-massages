import { del } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilise POST.' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL manquante dans le body.' });
    }

    await del(url);

    return res.status(200).json({
      message: 'Fichier supprimé avec succès',
    });

  } catch (err) {
    console.error('Erreur suppression Vercel Blob:', err);
    return res.status(500).json({
      error: 'Erreur lors de la suppression.',
      detail: err.message,
    });
  }
}
