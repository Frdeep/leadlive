/* ============================================
   LEAD LIVE — MAIN JAVASCRIPT v2.0
   Full bug-fix: YouTube API + Pricing logic +
   Modal des formats + Contact form + chatbot
   ============================================ */

// ---------- YOUTUBE IFRAME API ----------
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

let ytPlayer = null;
let isMuted = true;

function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('yt-player', {
    width:  '100%',
    height: '100%',
    videoId: '4sh7rP7Tfmg',
    playerVars: {
      autoplay:        1,
      mute:            1,
      loop:            1,
      playlist:        '4sh7rP7Tfmg',
      controls:        0,
      showinfo:        0,
      modestbranding:  1,
      rel:             0,
      iv_load_policy:  3,
      disablekb:       1,
      fs:              0,
      playsinline:     1,
      origin:          window.location.origin
    },
    events: {
      onReady:       onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    ytPlayer.playVideo();
  }
}

// ---------- DOM READY ----------
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-loaded');

  // ---------- SOUND TOGGLE ----------
  const soundToggle = document.getElementById('heroSoundToggle');
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      if (!ytPlayer) return;
      if (isMuted) {
        ytPlayer.unMute();
        ytPlayer.setVolume(80);
        isMuted = false;
        soundToggle.classList.add('unmuted');
        soundToggle.setAttribute('aria-label', 'Couper le son');
        soundToggle.querySelector('.sound-label').textContent = 'Son activé';
      } else {
        ytPlayer.mute();
        isMuted = true;
        soundToggle.classList.remove('unmuted');
        soundToggle.setAttribute('aria-label', 'Activer le son');
        soundToggle.querySelector('.sound-label').textContent = 'Son';
      }
    });
  }

  // ---------- HEADER SCROLL EFFECT & PARALLAX ----------
  const header            = document.getElementById('header');
  const ytPlayerContainer = document.getElementById('yt-player');
  const heroContent       = document.querySelector('.hero-content');
  const heroSection       = document.getElementById('hero');

  const updateScrollEffects = () => {
    const scrollY = window.scrollY;

    // Determine if header is scrolled past the hero
    const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 400;

    if (scrollY > 60) {
      header.classList.add('scrolled');
      header.classList.remove('over-hero');
    } else {
      header.classList.remove('scrolled');
      // Only apply dark-text over-video style if we're at the top
      if (scrollY < heroBottom) {
        header.classList.add('over-hero');
      }
    }

    if (scrollY < window.innerHeight) {
      if (ytPlayerContainer) {
        ytPlayerContainer.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.4}px))`;
      }
      if (heroContent) {
        heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
      }
    }
  };

  window.addEventListener('scroll', updateScrollEffects, { passive: true });
  updateScrollEffects();

  // ---------- FORCE HERO ELEMENTS VISIBLE (above fold, bypass reveal) ----------
  // Elements inside the hero should never start hidden
  document.querySelectorAll('.hero .reveal, .hero-content').forEach(el => {
    el.classList.add('visible');
  });

  // ---------- MOBILE MENU ----------
  const menuToggle    = document.getElementById('menuToggle');
  const navLinks      = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');

  const closeMenu = () => {
    if (!navLinks) return;
    navLinks.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    if (menuToggle) {
      const spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity   = '1';
      spans[2].style.transform = 'none';
    }
  };

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        navLinks.classList.add('open');
        if (mobileOverlay) mobileOverlay.classList.add('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      }
    });

    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', closeMenu);
    }

    // Close mobile menu when nav link clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // ---------- ROTATING WORDS IN HERO ----------
  const rotatingWord = document.getElementById('rotatingWord');
  if (rotatingWord) {
    const words = rotatingWord.querySelectorAll('span');
    let currentIndex = 0;

    setInterval(() => {
      const current = words[currentIndex];
      current.classList.remove('active');
      current.classList.add('exit');

      setTimeout(() => {
        current.classList.remove('exit');
      }, 500);

      currentIndex = (currentIndex + 1) % words.length;
      words[currentIndex].classList.add('active');
    }, 2500);
  }

  // ---------- FAQ ACCORDION ----------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => {
        i.classList.remove('active');
        const btn = i.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---------- SCROLL REVEAL ANIMATION ----------
  const revealElements = document.querySelectorAll('.reveal');

  // Robust reveal: fires at 1% visibility, generous rootMargin to pre-trigger
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px 60px 0px' });

  revealElements.forEach(el => {
    // Skip hero elements (already forced visible above)
    if (el.closest('.hero')) return;
    revealObserver.observe(el);
  });

  // Hard fallback: after 2.5s, make ALL remaining .reveal elements visible
  // Prevents content from being stuck hidden if IntersectionObserver misfires
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      el.classList.add('visible');
    });
  }, 2500);

  // ---------- STUDIOS SLIDER DRAG ----------
  const slider = document.getElementById('studiosSlider');
  if (slider) {
    let isDown   = false;
    let startX;
    let scrollLeft;
    let hasDragged = false;

    slider.addEventListener('mousedown', (e) => {
      isDown     = true;
      hasDragged = false;
      slider.style.cursor = 'grabbing';
      startX     = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      hasDragged = true;
      const x    = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    });

    slider.style.cursor       = 'grab';
    slider.style.paddingLeft  = 'max(24px, calc((100vw - 1200px) / 2))';
    slider.style.paddingRight = '24px';
  }

  // ---------- SMOOTH SCROLL ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===========================================
  // FORMAT CARDS MODAL — "En savoir +"
  // ===========================================
  const FORMAT_DATA = {
    'Podcast': {
      tag:   'Audio & Vidéo',
      title: 'Podcast Vidéo 🎙️',
      desc:  'On installe un studio broadcast professionnel chez vous en 30 minutes. Multi-caméras 4K, son Shure SM7B, éclairage cinéma — vous n'avez qu'à parler. Idéal pour les podcasts solo ou avec invités.',
      features: [
        'Installation studio en 30 min (bureaux, salon, extérieur)',
        'Multi-caméras Sony 4K + son broadcast Shure SM7B',
        'Jusqu'à 4 intervenants simultanés',
        'Montage, sous-titres SRT, habillage inclus',
        'Déclinaison Reels / TikTok / YouTube Shorts',
        'Livraison sous 48–72h'
      ]
    },
    'Émission': {
      tag:   'Plateau TV',
      title: 'Émission Plateau 📺',
      desc:  'Format talk-show, table ronde ou magazine TV. On scénarise, on installe et on dirige le plateau complet chez vous ou dans nos locaux parisiens.',
      features: [
        'Mise en scène et direction artistique',
        'Multi-caméras HD + prompteur disponible',
        'Régie vidéo en temps réel',
        'Habillage graphique TV professionnel',
        'Possibilité de diffusion en direct (Live)',
        'Montage "broadcast" livré en 5 jours'
      ]
    },
    'Réseaux Sociaux': {
      tag:   'Courtes vidéos',
      title: 'Réseaux Sociaux 📱',
      desc:  'Tournage optimisé pour les formats courts : Reels Instagram, TikTok, YouTube Shorts, LinkedIn. Prise de vue verticale et horizontale simultanée.',
      features: [
        'Tournage vertical 9:16 + horizontal 16:9',
        'Jusqu'à 8 vidéos par session',
        'Éclairage studio LED professionnel',
        'Montage dynamique avec musique libre',
        'Sous-titres animés inclus',
        'Prêt à publier sous 48h'
      ]
    },
    'Clips': {
      tag:   'Production musicale',
      title: 'Clips Musicaux 🎬',
      desc:  'Production vidéo cinématographique pour artistes et labels. Du concept au rendu final, on gère la direction artistique, le tournage et le montage.',
      features: [
        'Pré-production : moodboard, storyboard, repérage',
        'Caméras cinéma Sony FX3 / FX6',
        'Éclairage Aputure + équipements professionnels',
        'Étalonnage couleur colorimétrique',
        'Montage vidéo rythmique sur mesure',
        'Livraison 4K — prêt pour toutes plateformes'
      ]
    }
  };

  const modalOverlay = document.getElementById('formatModal');
  const modalClose   = document.getElementById('modalClose');
  const modalTag     = document.getElementById('modalTag');
  const modalTitle   = document.getElementById('modalTitle');
  const modalDesc    = document.getElementById('modalDesc');
  const modalFeats   = document.getElementById('modalFeatures');

  function openModal(formatKey) {
    const data = FORMAT_DATA[formatKey];
    if (!data || !modalOverlay) return;
    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    modalDesc.textContent  = data.desc;
    modalFeats.innerHTML = data.features.map(f => `
      <li>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        ${f}
      </li>`).join('');
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Studio cards click → open modal
  document.querySelectorAll('.studio-card[data-format]').forEach(card => {
    card.addEventListener('click', () => {
      openModal(card.getAttribute('data-format'));
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.getAttribute('data-format'));
      }
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ===========================================
  // PRICING CARDS — Options Calculator + CTA
  // ===========================================
  const optToggles = document.querySelectorAll('.opt-toggle input');

  optToggles.forEach(input => {
    input.addEventListener('change', (e) => {
      const card = e.target.closest('.price-layer-card');
      if (!card) return;

      const basePrice = parseInt(card.dataset.base) || 0;
      let optionsTotal = 0;

      card.querySelectorAll('.opt-toggle input:checked').forEach(opt => {
        const val  = parseFloat(opt.value)  || 0;
        const mult = parseFloat(opt.dataset.mult) || 1;
        optionsTotal += val * mult;
      });

      const totalDisplay = card.querySelector('.display-total');
      if (totalDisplay) {
        const finalPrice = basePrice + optionsTotal;
        totalDisplay.textContent = new Intl.NumberFormat('fr-FR').format(finalPrice) + ' €';
      }
    });
  });

  // Submit-pack button → redirect to configurateur with pre-selection
  document.querySelectorAll('.submit-pack').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card     = btn.closest('.price-layer-card');
      const packName = btn.dataset.pack || (card && card.dataset.name) || 'Pack';
      const packBase = card ? parseInt(card.dataset.base) : 0;

      // Always redirect to configurateur
      window.location.href = 'configurateur.html';
    });
  });

  // ===========================================
  // CHATBOT LOGIC (Enhanced)
  // ===========================================
  const chatBody    = document.getElementById('chatBody');
  const chatChoices = document.querySelector('.chat-choices');

  function scrollChatToBottom() {
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
  }

  function addBotMsg(html, delay = 800) {
    return new Promise(resolve => {
      setTimeout(() => {
        const msg = document.createElement('div');
        msg.className = 'chat-msg bot-msg';
        msg.innerHTML = html;
        if (chatBody) chatBody.appendChild(msg);
        scrollChatToBottom();
        resolve();
      }, delay);
    });
  }

  function addUserMsg(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg user-msg';
    msg.textContent = text;
    if (chatBody) chatBody.appendChild(msg);
    scrollChatToBottom();
  }

  if (chatChoices) {
    chatChoices.addEventListener('click', async (e) => {
      if (!e.target.classList.contains('chat-btn')) return;

      const choice = e.target.dataset.type || e.target.textContent;
      chatChoices.remove();
      addUserMsg(choice);

      await addBotMsg(`Excellent choix ! 🎬 Pour un <strong>${choice}</strong>, on peut intervenir directement chez vous ou dans nos locaux parisiens.<br><br>Combien d'épisodes ou vidéos souhaitez-vous produire par mois ?`);

      const inputArea = document.createElement('div');
      inputArea.className = 'chat-input-area';
      inputArea.innerHTML = `
        <input type="number" id="chatVideoCount" placeholder="Ex: 4" min="1" max="50" style="font-family:inherit;">
        <button class="btn-primary" id="chatNextBtn" style="padding: 10px 20px; white-space: nowrap;">Continuer</button>
      `;
      if (chatBody) chatBody.appendChild(inputArea);
      scrollChatToBottom();
      document.getElementById('chatVideoCount').focus();

      const handleNext = async () => {
        const val = parseInt(document.getElementById('chatVideoCount').value) || 1;
        inputArea.remove();
        addUserMsg(val + (val > 1 ? ' vidéos / mois' : ' vidéo / mois'));

        // Price estimation per type
        const perVideo = choice.includes('Podcast') ? 800 : choice.includes('Émission') ? 1200 : 550;
        const estimated = val * perVideo;

        await addBotMsg(`Parfait ! Pour <strong>${val} ${val > 1 ? 'vidéos' : 'vidéo'} / mois</strong>, notre estimation de départ est autour de <strong>${new Intl.NumberFormat('fr-FR').format(estimated)} €</strong>.<br><br>Pour un devis précis, laissez-nous votre nom et email — notre équipe vous répond sous 24h.`);

        const emailArea = document.createElement('div');
        emailArea.className = 'chat-input-area';
        emailArea.style.cssText = 'flex-direction: column; gap: 8px;';
        emailArea.innerHTML = `
          <input type="text"  id="chatName"  placeholder="Votre prénom / entreprise" style="width:100%;box-sizing:border-box;font-family:inherit;">
          <input type="email" id="chatEmail" placeholder="votre@email.com" style="width:100%;box-sizing:border-box;font-family:inherit;">
          <input type="tel"   id="chatPhone" placeholder="Votre numéro de téléphone" style="width:100%;box-sizing:border-box;font-family:inherit;">
          <button class="btn-primary" id="chatFinalBtn" style="padding: 12px 20px; width:100%;">Recevoir mon devis 📩</button>
        `;
        if (chatBody) chatBody.appendChild(emailArea);
        scrollChatToBottom();

        document.getElementById('chatFinalBtn').addEventListener('click', async () => {
          const emailVal = document.getElementById('chatEmail').value.trim();
          const phoneVal = document.getElementById('chatPhone').value.trim();
          const nameVal  = document.getElementById('chatName').value.trim();

          if (!emailVal) {
            document.getElementById('chatEmail').style.borderColor = 'red';
            return;
          }

          emailArea.remove();
          addUserMsg((nameVal || 'Anonyme') + ' — ' + emailVal);

          await addBotMsg(`✅ <strong>C'est noté ${nameVal ? ', ' + nameVal : ''} !</strong><br><br>Notre équipe va vous préparer un devis sur-mesure pour votre projet <em>${choice}</em> (${val} vid/mois) et vous contacte dans les 24h.<br><br>Pour aller plus vite : <a href="https://wa.me/33616435797" target="_blank" style="color:var(--accent-blue);font-weight:600;">Chattez-nous sur WhatsApp</a> 💬`);

          // Build WhatsApp fallback link
          const waMsg = encodeURIComponent(
            `Bonjour Lead Live ! 👋\nJe suis ${nameVal || 'intéressé(e)'} par un projet de ${choice}.\n${val} vidéo(s) / mois.\nEmail: ${emailVal}${phoneVal ? '\nTél: ' + phoneVal : ''}\n\nPouvons-nous échanger ?`
          );
          const waBtn = document.createElement('a');
          waBtn.href    = `https://wa.me/33616435797?text=${waMsg}`;
          waBtn.target  = '_blank';
          waBtn.className = 'chat-btn';
          waBtn.style.cssText = 'background:#25D366;color:#fff;border-color:#25D366;margin-top:5px;display:inline-block;';
          waBtn.textContent = '💬 Ouvrir WhatsApp';
          if (chatBody) chatBody.appendChild(waBtn);
          scrollChatToBottom();
        });
      };

      document.getElementById('chatNextBtn').addEventListener('click', handleNext);
      document.getElementById('chatVideoCount').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleNext();
      });
    });
  }

  // ===========================================
  // CONTACT FORM (if on contact.html)
  // ===========================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const origText = btn.innerHTML;

      const firstName = document.getElementById('firstName')?.value.trim() || '';
      const lastName  = document.getElementById('lastName')?.value.trim()  || '';
      const email     = document.getElementById('email')?.value.trim()     || '';
      const subject   = document.getElementById('subject')?.value          || '';
      const message   = document.getElementById('message')?.value.trim()   || '';

      if (!email || !message) {
        alert('Merci de remplir les champs obligatoires.');
        return;
      }

      btn.innerHTML = '<span>Envoi en cours…</span>';
      btn.disabled  = true;

      // Build WhatsApp message as fallback (no Resend key locally)
      const waMsg = encodeURIComponent(
        `📩 Message depuis leadlive.fr\n\nDe : ${firstName} ${lastName}\nEmail : ${email}\nSujet : ${subject || 'Non précisé'}\n\nMessage :\n${message}`
      );

      // Try API, fall back to WhatsApp redirect gracefully
      try {
        const res = await fetch('/api/send-quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientName:   `${firstName} ${lastName}`,
            clientEmail:  email,
            clientPhone:  '',
            buildSummary: [{ name: subject || 'Contact', price: 0 }],
            totalStr:     'Contact direct'
          })
        });
        if (res.ok) {
          btn.innerHTML = '✅ Message envoyé !';
          contactForm.reset();
          return;
        }
      } catch (_) {}

      // Fallback: open WhatsApp
      window.open(`https://wa.me/33616435797?text=${waMsg}`, '_blank');
      btn.innerHTML = '✅ Redirigé vers WhatsApp';
      setTimeout(() => {
        btn.innerHTML = origText;
        btn.disabled  = false;
      }, 3000);
    });
  }

});
