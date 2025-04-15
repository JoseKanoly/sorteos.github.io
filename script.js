document.addEventListener('DOMContentLoaded', function () {
  // Referencias a elementos del DOM
  const startRaffleBtn = document.getElementById('startRaffle');
  const maxNumberInput = document.getElementById('maxNumber');
  const displayCountSelect = document.getElementById('displayCount');
  const resultsDiv = document.getElementById('results');
  const numbersContainer = document.getElementById('numbersContainer');
  const errorDiv = document.getElementById('error');
  const winnerModal = document.getElementById('winnerModal');
  const closeModalBtn = document.getElementById('closeModal');
  const winnerDisplay = document.getElementById('winnerDisplay');
  const winnerNumberFinal = document.getElementById('winnerNumberFinal'); // Este es el contenedor donde se mostrará el ganador
  const confettiContainer = document.getElementById('confettiContainer');
  const winnerRays = document.getElementById('winnerRays');
  const body = document.body;

  // Número ganador que puede cambiar dinámicamente (puedes cambiarlo a 5, 3, o cualquier número)
  const winnerNumber = 100; // Aquí puedes modificar el número ganador (3 por ejemplo)
  let isRaffleInProgress = false;

  // Crear rayos para el número ganador
  function createRays() {
    winnerRays.innerHTML = '';
    const rayCount = 0;
    
    for (let i = 0; i < rayCount; i++) {
      const ray = document.createElement('div');
      ray.className = 'ray';
      ray.style.transform = `rotate(${i * (360 / rayCount)}deg)`;
      winnerRays.appendChild(ray);
    }
  }

  // Crear confeti
  function createConfetti() {
    confettiContainer.innerHTML = '';
    const colors = ['#e63946', '#457b9d', '#1d3557', '#a8dadc', '#f1faee', '#ffb703', '#fb8500', '#ffd166', '#06d6a0'];
    
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      
      // Formas aleatorias para el confeti
      const shape = Math.random() > 0.5 ? 'circle' : 'rect';
      if (shape === 'circle') {
        confetti.style.borderRadius = '50%';
      }
      
      // Tamaño aleatorio
      const size = Math.random() * 10 + 5;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      
      // Posición aleatoria
      confetti.style.left = `${Math.random() * 100}%`;
      
      // Color aleatorio
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Animación
      const animationDuration = Math.random() * 3 + 2;
      confetti.style.animation = `confettiFall ${animationDuration}s linear forwards`;
      confetti.style.animationDelay = `${Math.random() * 5}s`;
      
      confettiContainer.appendChild(confetti);
    }
  }

  // Efecto de ripple para botones
  function createRipple(event) {
    const button = event.currentTarget;
    const ripple = button.querySelector('.ripple');
    
    if (ripple) {
      ripple.remove();
    }
    
    const circle = document.createElement('span');
    circle.className = 'ripple';
    circle.style.width = circle.style.height = `${Math.max(button.clientWidth, button.clientHeight)}px`;
    
    button.appendChild(circle);
  }

  // Mostrar números uno por uno
  async function showNextNumber(numbers, index) {
    if (index >= numbers.length) {
      // Mostrar modal cuando todos los números han sido mostrados
      winnerModal.style.display = 'flex';
      setTimeout(() => {
        winnerModal.classList.add('show');
      }, 10);
      return;
    }

    const number = numbers[index];
    const numberElement = document.createElement('div');
    numberElement.className = 'number';
    numberElement.textContent = number;
    numbersContainer.appendChild(numberElement);

    // Esperar antes de mostrar el siguiente número
    await new Promise(resolve => setTimeout(resolve, 700));
    showNextNumber(numbers, index + 1);
  }

  // Evento para el botón del modal
  closeModalBtn.addEventListener('click', () => {
    // Ocultar modal con animación
    winnerModal.classList.remove('show');
    setTimeout(() => {
      winnerModal.style.display = 'none';
      
      // Cambiar layout
      body.classList.remove('start-only');
      body.classList.add('show-winner');
      
      // Mostrar número ganador con animación
      setTimeout(() => {
        winnerDisplay.style.display = 'flex';
        createRays();
        createConfetti();
        
        // Actualizar el número ganador en el HTML (dinámicamente)
        winnerNumberFinal.textContent = winnerNumber; // Aquí se actualiza el número directamente

        setTimeout(() => {
          winnerDisplay.classList.add('show');
        }, 100);
      }, 800);
      
      isRaffleInProgress = false;
    }, 500);
  });

  // Evento para el botón de iniciar sorteo
  startRaffleBtn.addEventListener('click', function (e) {
    createRipple(e);
    
    if (isRaffleInProgress) return;

    const maxNumber = parseInt(maxNumberInput.value);
    if (isNaN(maxNumber) || maxNumber < winnerNumber) {
      errorDiv.style.display = 'block';
      return;
    }

    isRaffleInProgress = true;
    errorDiv.style.display = 'none';
    numbersContainer.innerHTML = '';
    resultsDiv.style.display = 'block';
    winnerModal.style.display = 'none';
    winnerModal.classList.remove('show');
    winnerDisplay.style.display = 'none';
    winnerDisplay.classList.remove('show');
    
    // Resetear layout si ya se había mostrado el ganador
    body.classList.add('start-only');
    body.classList.remove('show-winner');

    // Obtener la cantidad de números a mostrar del select
    const displayCount = parseInt(displayCountSelect.value);

    // Generar números aleatorios diferentes al ganador (por ejemplo, 5)
    let previousNumbers = [];
    while (previousNumbers.length < displayCount) {
      const randomNum = Math.floor(Math.random() * maxNumber) + 1;
      if (randomNum !== winnerNumber && !previousNumbers.includes(randomNum)) {
        previousNumbers.push(randomNum);
      }
    }

    // Si no hay números para mostrar, mostrar directamente el modal
    if (displayCount === 0) {
      setTimeout(() => {
        winnerModal.style.display = 'flex';
        setTimeout(() => {
          winnerModal.classList.add('show');
        }, 10);
      }, 500);
    } else {
      // Iniciar la secuencia de números después de un breve retraso
      setTimeout(() => {
        showNextNumber(previousNumbers, 0);
      }, 500);
    }
  });

  // Inicializar
  createRays();
});
