let selectedRating = 0;
const starContainer = document.getElementById('starRating');
const successMsg = document.getElementById('successMsg');

// Criar estrelas
for (let i = 1; i <= 5; i++) {
  const star = document.createElement('span');
  star.innerHTML = '★';
  star.addEventListener('click', () => setRating(i));
  starContainer.appendChild(star);
}

function setRating(rating) {
  selectedRating = rating;
  document.querySelectorAll('.stars span').forEach((star, index) => {
    star.classList.toggle('active', index < rating);
  });
}

// Alternar nome
document.querySelectorAll('input[name="identity"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.getElementById('nameField').style.display =
      radio.value === 'identified' && radio.checked ? 'block' : 'none';
  });
});

// Enviar feedback
document.getElementById('sendFeedback').addEventListener('click', () => {
  if (selectedRating === 0) {
    alert('Por favor, selecione uma nota.');
    return;
  }

  const feedback = {
    rating: selectedRating,
    comment: document.getElementById('comment').value,
    name:
      document.querySelector('input[name="identity"]:checked').value === 'anonymous'
        ? 'Cliente anônimo'
        : document.getElementById('name').value || 'Cliente anônimo',
    suggestions: Array.from(
      document.querySelectorAll('.checkboxes input:checked')
    ).map(cb => cb.value)
  };

  const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
  feedbacks.push(feedback);
  localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

  successMsg.style.display = 'block';
  setTimeout(() => location.reload(), 1500);
});

// Carregar feedbacks
function loadFeedbacks() {
  const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
  const list = document.getElementById('feedbackList');
  let total = 0;

  list.innerHTML = '';

  feedbacks.slice(-10).reverse().forEach(fb => {
    total += fb.rating;

    const card = document.createElement('div');
    card.className = 'feedback-card';

    const suggestionsHTML = fb.suggestions.length
      ? `<div class="suggestions">${fb.suggestions.map(s => `<span>${s}</span>`).join('')}</div>`
      : '';

    card.innerHTML = `
      <div class="name">${fb.name}</div>
      <div class="stars">${'★'.repeat(fb.rating)}</div>
      <p>${fb.comment || ''}</p>
      ${suggestionsHTML}
    `;

    list.appendChild(card);
  });

  const avg = feedbacks.length ? (total / feedbacks.length).toFixed(1) : '0.0';
  document.getElementById('highlightStars').innerText = `⭐ ${avg} / 5`;
  document.getElementById('highlightCount').innerText =
    `Avaliado por ${feedbacks.length} clientes`;

  loadTopSuggestions(feedbacks);
}

// Top sugestões
function loadTopSuggestions(feedbacks) {
  const counter = {};
  feedbacks.forEach(fb => {
    fb.suggestions.forEach(s => counter[s] = (counter[s] || 0) + 1);
  });

  const container = document.getElementById('topSuggestions');
  container.innerHTML = '';

  Object.entries(counter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([text, count]) => {
      const span = document.createElement('span');
      span.textContent = `${text} (${count})`;
      container.appendChild(span);
    });
}

loadFeedbacks();