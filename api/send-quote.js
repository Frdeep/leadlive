export default async function handler(req, res) {
  // CORS configurations
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { clientName, clientEmail, clientPhone, buildSummary, totalStr } = req.body;
    
    // On Vercel, this must be set in the Environment Variables dashboard
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      return res.status(500).json({ error: 'Configuration serveur incomplète (Clé API manquante).' });
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #4ADE80;">Nouvelle demande de devis — Lead Live</h1>
        <p>Un utilisateur vient de finaliser un devis via le configurateur interactif.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="font-size: 1.2rem; margin-top: 0;">Informations de contact</h2>
          <p><strong>Nom :</strong> ${clientName || 'Non renseigné'}</p>
          <p><strong>Téléphone :</strong> ${clientPhone || 'Non renseigné'}</p>
          <p><strong>E-mail :</strong> ${clientEmail || 'Non renseigné'}</p>
        </div>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #2563EB;">
          <h2 style="font-size: 1.2rem; margin-top: 0;">Détail de la simulation</h2>
          ${buildSummary.map(item => `<p>• ${item.name} <span style="color: #777; float: right;">(+${item.price}€)</span></p>`).join('')}
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <h3 style="font-size: 1.5rem; text-align: right; color: #1A1A1A;">TOTAL ESTIMÉ : ${totalStr}</h3>
        </div>
        
        <p style="font-size: 0.8rem; color: #999; margin-top: 30px; text-align: center;">
          Généré automatiquement par le site Lead Live.
        </p>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Lead Live Website <onboarding@resend.dev>', // Doit être remplacé par un domaine vérifié si vous passez en production sur Resend
        to: 'contact@leadlive.fr',
        subject: `[Devis en ligne] Simulation à ${totalStr} de ${clientName || 'Anonyme'}`,
        html: htmlContent
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'envoi via Resend.');
    }

    return res.status(200).json({ success: true, message: 'Devis envoyé avec succès !' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
