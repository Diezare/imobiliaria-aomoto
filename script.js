// ===== Tabs de busca (Comprar / Alugar) =====
document.querySelectorAll('.search-tabs .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.search-tabs .tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ===== Chips de filtro (Todos / Comprar / Alugar) =====
document.querySelectorAll('.filter-tabs .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-tabs .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

// ===== Filtro de imóveis por cidade =====
const cityFilter = document.getElementById('city-filter');
const listingCards = [...document.querySelectorAll('#imoveis .property-card[data-city]')];

if (cityFilter && listingCards.length) {
  const cityTitle = document.getElementById('listing-city-title');
  const propertyCount = document.getElementById('property-count');
  const cityValue = cityFilter.querySelector('.field-value');
  const cityMenu = cityFilter.querySelector('.field-menu');
  const cities = [...new Set([
    ...listingCards.map(card => card.dataset.city.trim()),
    'Londrina'
  ])].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const preferredCity = cities.includes('Apucarana') ? 'Apucarana' : cities[0];
  const neighborhoodCards = [...document.querySelectorAll('#bairros .bairro-card[data-city]')];
  const neighborhoodTitle = document.getElementById('neighborhood-city-title');
  const routinePlaces = {
    Apucarana: [
      'Centro / Calçadão',
      'Escola dos filhos',
      'UTFPR',
      'Hospital da Providência',
      'Parque Industrial',
      'Parque Jaboti'
    ],
    Londrina: [
      'Centro / Calçadão',
      'Escola dos filhos',
      'UEL',
      'Hospital Universitário',
      'Parque Tecnológico',
      'Lago Igapó'
    ]
  };
  const matchSubtitle = document.getElementById('match-city-subtitle');
  const matchForm = document.getElementById('match-form-card');
  const matchCityEmpty = document.getElementById('match-city-empty');
  const matchResults = [...document.querySelectorAll('#match .match-card-new[data-city]')];
  const matchResultsEmpty = document.getElementById('match-results-empty');
  const matchLocationButtons = [...document.querySelectorAll('#match [data-match-location]')];

  const updateMatchCity = selectedCity => {
    const places = routinePlaces[selectedCity];
    const hasSpecificCity = selectedCity !== 'all';
    const hasRoutineReferences = Boolean(places);
    if (matchSubtitle) {
      matchSubtitle.textContent = hasSpecificCity && hasRoutineReferences
        ? `Escolha os lugares importantes para você e veja imóveis que combinam com sua rotina em ${selectedCity}.`
        : 'Selecione uma cidade específica para carregar referências locais e comparar os imóveis com sua rotina.';
    }

    if (matchForm) matchForm.hidden = !hasRoutineReferences;
    if (matchCityEmpty) {
      matchCityEmpty.hidden = hasRoutineReferences;
      matchCityEmpty.textContent = selectedCity === 'all'
        ? 'Selecione Apucarana ou Londrina no filtro de cidade para carregar referências locais e comparar os imóveis com sua rotina.'
        : `As referências de rotina de ${selectedCity} ainda não foram cadastradas.`;
    }

    if (hasRoutineReferences) {
      matchLocationButtons.forEach((button, index) => {
        const label = button.querySelector('.pill-label');
        if (label && places[index]) label.textContent = places[index];
        button.classList.toggle('active', index === 0);
      });
    }

    let visibleResults = 0;
    matchResults.forEach(card => {
      const isVisible = hasSpecificCity && card.dataset.city === selectedCity;
      card.hidden = !isVisible;
      if (isVisible) visibleResults++;
    });
    if (matchResultsEmpty) {
      matchResultsEmpty.hidden = visibleResults > 0;
      matchResultsEmpty.textContent = selectedCity === 'all'
        ? 'Selecione uma cidade específica acima para ver imóveis compatíveis com as referências locais.'
        : `Ainda não há imóveis de ${selectedCity} cadastrados para comparar com sua rotina.`;
    }
  };

  const cityOptions = [
    { label: 'Todas as cidades', value: 'all' },
    ...cities.map(city => ({ label: city, value: city }))
  ];
  cityMenu.replaceChildren(...cityOptions.map(({ label, value }) => {
    const option = document.createElement('li');
    option.textContent = label;
    option.dataset.value = value;
    option.dataset.label = label;
    option.setAttribute('role', 'option');
    return option;
  }));

  const updateCityFilter = selectedCity => {
    cityValue.textContent = cityOptions.find(option => option.value === selectedCity)?.label || selectedCity;
    let visibleCount = 0;

    listingCards.forEach(card => {
      const isVisible = selectedCity === 'all' || card.dataset.city === selectedCity;
      card.hidden = !isVisible;
      if (isVisible) visibleCount++;
    });

    if (cityTitle) cityTitle.textContent = selectedCity === 'all' ? 'em todas as cidades' : `em ${selectedCity}`;
    neighborhoodCards.forEach(card => {
      card.hidden = selectedCity !== 'all' && card.dataset.city !== selectedCity;
    });
    if (neighborhoodTitle) {
      neighborhoodTitle.textContent = selectedCity === 'all'
        ? 'Apucarana e Londrina'
        : selectedCity;
    }
    updateMatchCity(selectedCity);
    if (propertyCount) {
      propertyCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}`;
    }

    cityMenu.querySelectorAll('[role="option"]').forEach(option => {
      const selected = option.dataset.value === selectedCity;
      option.classList.toggle('selected', selected);
      option.setAttribute('aria-selected', String(selected));
    });
  };

  cityMenu.addEventListener('click', event => {
    const option = event.target.closest('[role="option"]');
    if (option) updateCityFilter(option.dataset.value);
  }, true);
  updateCityFilter(preferredCity || 'all');
}

// ===== Pills do Match =====
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    if (pill.parentElement.querySelectorAll('.pill.active').length) {
      pill.classList.toggle('active');
    } else {
      pill.classList.add('active');
    }
  });
});

// ===== Pills do Contato =====
document.querySelectorAll('.form-pills .pill-light').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.form-pills .pill-light').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  });
});

// ===== Galeria (página interna) =====
document.querySelectorAll('.gallery').forEach(gallery => {
  const photos = [...gallery.querySelectorAll('.thumb')];
  const count = gallery.querySelector('.gallery-count');
  if (count) count.textContent = `📷 ${photos.length} ${photos.length === 1 ? 'foto' : 'fotos'}`;
});

function swapImage(thumb) {
  const main = document.getElementById('mainImage');
  if (!main) return;
  main.src = thumb.src;
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

// ===== Smooth scroll para âncoras =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== Dropdowns personalizados =====
document.querySelectorAll('[data-dropdown]').forEach(dropdown => {
  const trigger = dropdown.querySelector('.field-trigger');
  const valueEl = dropdown.querySelector('.field-value');
  const menu    = dropdown.querySelector('.field-menu');
  const options = dropdown.querySelectorAll('.field-menu li');

  // Abre/fecha
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('open');

    // Fecha todos os outros
    document.querySelectorAll('[data-dropdown].open').forEach(d => {
      d.classList.remove('open');
    });

    if (!isOpen) dropdown.classList.add('open');
  });

  // Seleciona opção
  options.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();

      // Atualiza valor
      valueEl.textContent = option.dataset.label || option.dataset.value;

      // Marca selecionado
      options.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');

      // Fecha
      dropdown.classList.remove('open');
    });
  });
});

// Fecha ao clicar fora
document.addEventListener('click', () => {
  document.querySelectorAll('[data-dropdown].open').forEach(d => {
    d.classList.remove('open');
  });
});

// Fecha com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('[data-dropdown].open').forEach(d => {
      d.classList.remove('open');
    });
  }
});

// ===== Botão de voltar ao topo =====
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  const updateBackToTop = () => {
    backToTop.classList.toggle('visible', window.scrollY > 240);
  };
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  updateBackToTop();
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
