// ==========================================
// LEAD LIVE - CONFIGURATEUR & DEVIS
// ==========================================

const PRICING = {
  mensuel: [
    { id: 'm_starter', name: 'Starter', price: 2200, desc: '4 vidéos · 550 € / vidéo', includes: ['Tournage mensuel', 'Montage dynamique', 'Multi-formats', 'Accompagnement édito'] },
    { id: 'm_pro', name: 'Pro', price: 4000, desc: '8 vidéos · 500 € / vidéo', isPopular: true, includes: ['Tournage mensuel', 'Montage dynamique', 'Multi-formats', 'Accompagnement édito'] },
    { id: 'm_elite', name: 'Elite', price: 5400, desc: '12 vidéos · 450 € / vidéo', includes: ['Tournage mensuel', 'Montage dynamique', 'Multi-formats', 'Accompagnement édito'] }
  ],
  options_mensuel: [
    { id: 'om_brand', name: 'Branding', price: 120, type: 'per_video' },
    { id: 'om_mix', name: 'Mixage avancé', price: 150, type: 'fixed' },
    { id: 'om_jingle', name: 'Jingle musical', price: 400, type: 'fixed' },
    { id: 'om_express', name: 'Livraison express', price: 150, type: 'fixed' }
  ],
  podcast: [
    { id: 'p_base', name: 'Tournage Podcast Base', price: 0, desc: 'Configurez votre tournage à la carte', includes: [] }
  ],
  options_podcast: [
    { id: 'op_montage', name: 'Montage Premium', price: 500, type: 'fixed', desc: 'Multicam, nettoyage audio, export prêt.' },
    { id: 'op_live', name: 'Diffusion Live', price: 300, type: 'fixed', desc: 'Streaming direct & gestion flux.' },
    { id: 'op_cam', name: 'Caméra supplémentaire', price: 150, type: 'fixed' },
    { id: 'op_ext3', name: 'Pack 3 extraits réseaux', price: 250, type: 'fixed' },
    { id: 'op_ext5', name: 'Pack 5 extraits réseaux', price: 400, type: 'fixed' },
    { id: 'op_brand', name: 'Habillage / Branding', price: 200, type: 'fixed' },
    { id: 'op_express', name: 'Livraison express', price: 200, type: 'fixed' }
  ],
  reseaux: [
    { id: 'r_5', name: 'Pack 5 vidéos', price: 3250, desc: 'Tournage, Montage dynamique', includes: ['Multi-formats réseaux', 'Mixage standard', 'Musique libre', '3 retours/vidéo', 'Tournage'] },
    { id: 'r_10', name: 'Pack 10 vidéos', price: 6000, isPopular: true, desc: 'Tournage, Montage dynamique', includes: ['Multi-formats réseaux', 'Mixage standard', 'Musique libre', '3 retours/vidéo', 'Tournage'] },
    { id: 'r_15', name: 'Pack 15 vidéos', price: 8250, desc: 'Tournage, Montage dynamique', includes: ['Multi-formats réseaux', 'Mixage standard', 'Musique libre', '3 retours/vidéo', 'Tournage'] }
  ],
  options_reseaux: [
    { id: 'or_retours', name: 'Retours illimités', price: 200, type: 'fixed' },
    { id: 'or_mix', name: 'Mixage audio avancé', price: 200, type: 'fixed' },
    { id: 'or_jingle', name: 'Composition Jingle', price: 500, type: 'fixed' },
    { id: 'or_brand', name: 'Habillage visuel avancé', price: 150, type: 'per_video' },
    { id: 'or_edito', name: 'Direction éditoriale avancée', price: 300, type: 'fixed' },
    { id: 'or_express', name: 'Livraison express', price: 200, type: 'fixed' }
  ]
};

// Global State
let currentTab = 'mensuel'; // mensuel, podcast, reseaux
let selectedBasePack = null; 
let selectedOptions = new Set();
let videoQuantityMultiplier = 1;

// DOM Elements
const plansContainer = document.getElementById('plansContainer');
const cartItems = document.getElementById('cartItems');
const totalPriceEl = document.getElementById('totalPrice');
const tabs = document.querySelectorAll('.tab-btn');

const leadForm = document.getElementById('leadForm');
const clientNameEl = document.getElementById('clientName');
const clientEmailEl = document.getElementById('clientEmail');
const clientPhoneEl = document.getElementById('clientPhone');

const btnPdfDownload = document.getElementById('btnPdfDownload');
const btnSendQuote = document.getElementById('btnSendQuote');
const btnWhatsapp = document.getElementById('btnWhatsapp');

// ---- RENDER LOGIC ----
function renderCategories(tab) {
  plansContainer.innerHTML = '';
  currentTab = tab;
  
  // Reset Selections when changing main categories
  selectedBasePack = null;
  selectedOptions.clear();
  videoQuantityMultiplier = 1;

  let packs = [];
  let options = [];

  if (tab === 'mensuel') {
    packs = PRICING.mensuel;
    options = PRICING.options_mensuel;
  } else if (tab === 'podcast') {
    packs = PRICING.podcast;
    options = PRICING.options_podcast;
  } else {
    packs = PRICING.reseaux;
    options = PRICING.options_reseaux;
  }

  // Render Packs
  const packsHtml = document.createElement('div');
  packsHtml.className = 'grid-3';
  packs.forEach(p => {
    const isPodcast = tab === 'podcast';
    packsHtml.innerHTML += `
      <div class="config-card pack-card" data-id="${p.id}" data-videos="${p.name.includes(' Starter') ? 4 : p.name.includes('Pro') ? 8 : p.name.includes('Elite') ? 12 : p.name.includes('5') ? 5 : p.name.includes('10') ? 10 : p.name.includes('15') ? 15 : 1}">
        ${p.isPopular ? '<div class="popular-badge">LE PLUS CHOISI</div>' : ''}
        <h3>${p.name}</h3>
        <div class="price">${p.price > 0 ? p.price.toLocaleString() + ' €' : 'Sur-mesure'}</div>
        <p class="desc">${p.desc}</p>
        <ul class="includes">
          ${p.includes.map(inc => `<li>✓ ${inc}</li>`).join('')}
        </ul>
        <button class="btn-primary w-full select-pack-btn" style="margin-top:20px;">Sélectionner</button>
      </div>
    `;
  });
  
  plansContainer.appendChild(packsHtml);

  // Render Options
  const optionsHtml = document.createElement('div');
  optionsHtml.className = 'options-grid';
  optionsHtml.innerHTML = `<h3 style="grid-column: 1 / -1; margin-top: 40px;">Options disponibles</h3>`;
  
  options.forEach(opt => {
    optionsHtml.innerHTML += `
      <label class="option-check">
        <input type="checkbox" data-id="${opt.id}" value="${opt.price}" data-type="${opt.type}">
        <div class="option-info">
          <span class="opt-name">${opt.name}</span>
          <span class="opt-price">+${opt.price} € ${opt.type === 'per_video' ? '/ vidéo' : ''}</span>
        </div>
      </label>
    `;
  });

  plansContainer.appendChild(optionsHtml);
  attachEventListeners();
  updateCart();
}

function attachEventListeners() {
  document.querySelectorAll('.pack-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if they clicked inside the card but we already handle it on button
      document.querySelectorAll('.pack-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      const id = card.getAttribute('data-id');
      const vids = parseInt(card.getAttribute('data-videos')) || 1;
      
      let allPacks = [...PRICING.mensuel, ...PRICING.podcast, ...PRICING.reseaux];
      selectedBasePack = allPacks.find(p => p.id === id);
      videoQuantityMultiplier = vids;
      updateCart();
    });
  });

  document.querySelectorAll('.option-check input').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      if(e.target.checked) {
        selectedOptions.add(e.target.getAttribute('data-id'));
      } else {
        selectedOptions.delete(e.target.getAttribute('data-id'));
      }
      updateCart();
    });
  });
}

function getOptionDetails(id) {
  let allOptions = [...PRICING.options_mensuel, ...PRICING.options_podcast, ...PRICING.options_reseaux];
  return allOptions.find(o => o.id === id);
}

// ---- CART ENGINE ----
function updateCart() {
  let total = 0;
  let itemsHtml = '';
  let buildSummaryForApi = [];

  if (selectedBasePack) {
    total += selectedBasePack.price;
    itemsHtml += `
      <div class="cart-item highlight-item">
        <span>${selectedBasePack.name}</span>
        <span>${selectedBasePack.price > 0 ? selectedBasePack.price.toLocaleString() + ' €' : '-'}</span>
      </div>
    `;
    buildSummaryForApi.push({name: selectedBasePack.name, price: selectedBasePack.price});
  }

  if (selectedOptions.size > 0) {
    itemsHtml += `<hr style="margin: 10px 0; border: none; border-top: 1px solid var(--light-border);">`;
  }

  selectedOptions.forEach(optId => {
    const opt = getOptionDetails(optId);
    if(opt) {
      let optFinalPrice = opt.price;
      if (opt.type === 'per_video') {
         optFinalPrice = opt.price * videoQuantityMultiplier;
      }
      total += optFinalPrice;
      itemsHtml += `
        <div class="cart-item">
          <span>${opt.name} ${opt.type === 'per_video' ? `(x${videoQuantityMultiplier})` : ''}</span>
          <span>+${optFinalPrice.toLocaleString()} €</span>
        </div>
      `;
      buildSummaryForApi.push({name: `${opt.name} ${opt.type === 'per_video' ? `(x${videoQuantityMultiplier})` : ''}`, price: optFinalPrice});
    }
  });

  if (!selectedBasePack && selectedOptions.size === 0) {
    itemsHtml = '<p class="empty-cart">Sélectionnez une formule ou des options pour commencer.</p>';
    btnPdfDownload.disabled = true;
    btnSendQuote.disabled = true;
    btnWhatsapp.disabled = true;
    leadForm.style.display = 'none';
  } else {
    btnPdfDownload.disabled = false;
    btnSendQuote.disabled = false;
    btnWhatsapp.disabled = false;
    leadForm.style.display = 'block';
  }

  cartItems.innerHTML = itemsHtml;
  totalPriceEl.textContent = total.toLocaleString() + ' €';

  return { total, buildSummaryForApi };
}

// ---- TABS LISTENER ----
tabs.forEach(t => {
  t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    renderCategories(t.getAttribute('data-target').replace('tab-', ''));
  });
});

// Initialization
renderCategories('mensuel');


// ==========================================
// API & PDF INTEGRATION
// ==========================================

btnPdfDownload.addEventListener('click', () => {
  if (!selectedBasePack && selectedOptions.size === 0) return;
  
  const name = clientNameEl.value || 'Client Partenaire';
  document.getElementById('pdfClientName').textContent = name;
  document.getElementById('pdfDate').textContent = new Date().toLocaleDateString('fr-FR');
  
  const { total, buildSummaryForApi } = updateCart();
  
  let rows = '';
  buildSummaryForApi.forEach(item => {
    rows += `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">${item.price} €</td>
      </tr>
    `;
  });
  
  document.getElementById('pdfTableBody').innerHTML = rows;
  document.getElementById('pdfTotal').textContent = total.toLocaleString() + ' €';
  
  const element = document.getElementById('pdfTemplate');
  element.style.display = 'block';
  
  const opt = {
    margin:       10,
    filename:     `Devis_LeadLive_${new Date().getTime()}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(element).save().then(() => {
    element.style.display = 'none';
  });
});

btnWhatsapp.addEventListener('click', () => {
  const { total, buildSummaryForApi } = updateCart();
  let msg = `Bonjour Lead Live ! 👋%0AJe suis intéressé(e) par la configuration suivante :%0A%0A`;
  
  buildSummaryForApi.forEach(item => {
    msg += `- ${item.name} (+${item.price} €)%0A`;
  });
  msg += `%0A*TOTAL ESTIMÉ : ${total.toLocaleString()} €*%0A%0A`;
  msg += `Mon nom est ${clientNameEl.value || 'non précisé'}.${clientPhoneEl && clientPhoneEl.value ? ` Tél: ${clientPhoneEl.value}.` : ''} Pouvons-nous échanger ?`;

  window.open(`https://wa.me/33668182674?text=${msg}`, '_blank');
});

btnSendQuote.addEventListener('click', async () => {
  if (!clientEmailEl.value) {
    alert("Veuillez renseigner votre email pour recevoir la proposition.");
    return;
  }
  
  const { total, buildSummaryForApi } = updateCart();
  
  const payload = {
    clientName: clientNameEl.value,
    clientEmail: clientEmailEl.value,
    clientPhone: clientPhoneEl ? clientPhoneEl.value : '',
    buildSummary: buildSummaryForApi,
    totalStr: total.toLocaleString() + ' €'
  };

  const originalText = btnSendQuote.textContent;
  btnSendQuote.textContent = 'Envoi en cours...';
  btnSendQuote.disabled = true;

  try {
    const res = await fetch('/api/send-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      alert("Votre demande a bien été envoyée à notre équipe !");
    } else {
      throw new Error(data.error || "Erreur de serveur");
    }
  } catch(e) {
    console.error(e);
    const fallback = confirm("Notre serveur de messagerie est en cours de configuration. Voulez-vous envoyer votre demande directement via WhatsApp à notre équipe ? C'est instantané !");
    if (fallback) {
      btnWhatsapp.click();
    }
  } finally {
    btnSendQuote.textContent = originalText;
    btnSendQuote.disabled = false;
  }
});
