/**
 * DHIYASHRI J - PERSONAL PORTFOLIO
 * Vanilla JavaScript Logic & Interactive Electronics Modules
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroCircuitCanvas();
  initHardwareLabSandbox();
  initProjectsFilter();
  initProjectModal();
  initContactForm();
  initClipboardCopy();
  initScrollAnimations();
});

/* ==========================================================================
   1. NAVBAR & MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll header styling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy for active link
    let currentSection = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  function toggleMobileMenu() {
    const isOpen = mobileNav.classList.contains('open');
    if (isOpen) {
      mobileNav.classList.remove('open');
      mobileBackdrop.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      mobileNav.classList.add('open');
      mobileBackdrop.classList.add('open');
      navToggle.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMobileMenu);
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile nav when clicking a link
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // Back to top button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   2. INTERACTIVE CIRCUIT BACKGROUND CANVAS (HERO VISUAL)
   ========================================================================== */
function initHeroCircuitCanvas() {
  const canvas = document.getElementById('circuitCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let animationFrameId;

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Define circuit traces and pulse packets
  const traces = [];
  const packets = [];
  const numTraces = 14;

  const centerX = () => width / 2;
  const centerY = () => height / 2;

  // Generate static circuit paths radiating from chip perimeter
  function createTraces() {
    traces.length = 0;
    const w = width;
    const h = height;
    const chipRadius = 110;

    for (let i = 0; i < numTraces; i++) {
      const angle = (i / numTraces) * Math.PI * 2;
      const startX = w / 2 + Math.cos(angle) * chipRadius;
      const startY = h / 2 + Math.sin(angle) * chipRadius;

      // Make realistic circuit trace with 45/90 degree bends
      const midDist = chipRadius + 40 + Math.random() * 40;
      const cornerX = w / 2 + Math.cos(angle) * midDist;
      const cornerY = h / 2 + Math.sin(angle) * midDist;

      const endDist = chipRadius + 90 + Math.random() * 50;
      let endX, endY;
      // Snap to 45 degree angle
      if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
        endX = cornerX + (Math.cos(angle) > 0 ? 50 : -50);
        endY = cornerY;
      } else {
        endX = cornerX;
        endY = cornerY + (Math.sin(angle) > 0 ? 50 : -50);
      }

      traces.push({
        p0: { x: startX, y: startY },
        p1: { x: cornerX, y: cornerY },
        p2: { x: endX, y: endY },
        padRadius: 3.5,
        color: i % 2 === 0 ? 'rgba(0, 242, 254, 0.18)' : 'rgba(139, 92, 246, 0.18)'
      });

      // Assign a moving energy pulse
      packets.push({
        traceIndex: i,
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.005,
        color: i % 2 === 0 ? '#00f2fe' : '#c084fc',
        size: 2.5
      });
    }
  }

  createTraces();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw static circuit traces
    traces.forEach((tr) => {
      ctx.beginPath();
      ctx.moveTo(tr.p0.x, tr.p0.y);
      ctx.lineTo(tr.p1.x, tr.p1.y);
      ctx.lineTo(tr.p2.x, tr.p2.y);
      ctx.strokeStyle = tr.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // End solder pad circle
      ctx.beginPath();
      ctx.arc(tr.p2.x, tr.p2.y, tr.padRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#060911';
      ctx.fill();
      ctx.strokeStyle = tr.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Draw and update moving electron packets
    packets.forEach((pkt) => {
      pkt.progress += pkt.speed;
      if (pkt.progress > 1) {
        pkt.progress = 0;
      }

      const tr = traces[pkt.traceIndex];
      let currentX, currentY;

      // Segment 1 (p0 to p1) or Segment 2 (p1 to p2)
      if (pkt.progress < 0.5) {
        const localT = pkt.progress / 0.5;
        currentX = tr.p0.x + (tr.p1.x - tr.p0.x) * localT;
        currentY = tr.p0.y + (tr.p1.y - tr.p0.y) * localT;
      } else {
        const localT = (pkt.progress - 0.5) / 0.5;
        currentX = tr.p1.x + (tr.p2.x - tr.p1.x) * localT;
        currentY = tr.p1.y + (tr.p2.y - tr.p1.y) * localT;
      }

      // Draw packet with soft glow
      ctx.save();
      ctx.shadowColor = pkt.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(currentX, currentY, pkt.size, 0, Math.PI * 2);
      ctx.fillStyle = pkt.color;
      ctx.fill();
      ctx.restore();
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. HARDWARE LAB: INTERACTIVE PINOUT EXPLORER
   ========================================================================== */
function initHardwareLabSandbox() {
  const pinData = {
    'D9': {
      title: 'Digital Pin 9 (PWM / Timer1 Output)',
      role: 'Pulse Width Modulation (PWM)',
      tech: '8-bit timer register OCR1A / 490Hz default PWM',
      desc: 'Configured for analogWrite(). Used in my Obstacle-Avoidance RC Car project to modulate PWM duty cycle into the L298N motor driver for progressive acceleration and smooth trajectory turns without wheel skid.'
    },
    'A0': {
      title: 'Analog Pin A0 (ADC Channel 0)',
      role: '10-Bit Successive Approx ADC',
      tech: '0 to 5.0V input (1024 discrete quantization steps / 4.88mV per LSB)',
      desc: 'Used for reading continuous sensor voltages. Interfaced with analog infrared photodiodes and light-dependent resistors to calibrate ambient noise and surface reflection thresholding.'
    },
    'D2': {
      title: 'Digital Pin 2 (External Interrupt INT0)',
      role: 'Hardware Asynchronous Interrupt',
      tech: 'EICRA register trigger on RISING / FALLING edge',
      desc: 'Provides immediate processor preemption. Ideal for real-time optical rotary wheel encoders to compute RPM and obstacle proximity triggers without polling overhead in the main loop.'
    },
    'A4': {
      title: 'Analog Pin A4 (I2C SDA - Serial Data)',
      role: 'Inter-Integrated Circuit (I2C / TWI)',
      tech: 'Synchronous bidirectional 2-wire serial bus at 100kHz standard mode',
      desc: 'Shared data line for connecting multi-slave digital peripherals (e.g., 16x2 LCD modules with PCF8574 backpacks and precision temperature/humidity sensors) using only two microcontroller pins.'
    },
    'D13': {
      title: 'Digital Pin 13 (Built-in LED / SPI SCK)',
      role: 'System Heartbeat & SPI Master Clock',
      tech: 'Onboard status LED with series resistor + Serial Peripheral Interface clock',
      desc: 'Used as an essential firmware diagnostic beacon during code upload and hardware sanity checks, as well as the high-speed clock signal for SPI bus transceivers.'
    },
    '5V': {
      title: '5V Regulated Power Rail',
      role: 'VCC Power Distribution',
      tech: 'Clean 5.0V regulated DC output from onboard LDO regulator',
      desc: 'Supplies stable continuous power to logic chips, ultrasonic sensors (HC-SR04), and microcontroller reference rails, insulated with decoupling capacitors.'
    }
  };

  const pinButtons = document.querySelectorAll('.interactive-pin');
  const readoutTag = document.getElementById('readoutTag');
  const readoutTitle = document.getElementById('readoutTitle');
  const readoutText = document.getElementById('readoutText');
  const readoutTech = document.getElementById('readoutTech');

  if (!pinButtons.length || !readoutTitle) return;

  pinButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      pinButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const pinKey = btn.getAttribute('data-pin');
      const data = pinData[pinKey];

      if (data) {
        readoutTag.textContent = `// ACTIVE PIN: ${pinKey} [${data.role}]`;
        readoutTitle.textContent = data.title;
        readoutText.textContent = data.desc;
        if (readoutTech) {
          readoutTech.textContent = `Specs / Architecture: ${data.tech}`;
        }
      }
    });
  });
}

/* ==========================================================================
   4. FEATURED PROJECTS FILTER
   ========================================================================== */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   5. PROJECT DETAILS MODAL
   ========================================================================== */
function initProjectModal() {
  const modalOverlay = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDetailBtns = document.querySelectorAll('.project-btn-detail');

  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalOverview = document.getElementById('modalOverview');
  const modalBom = document.getElementById('modalBom');
  const modalCode = document.getElementById('modalCode');
  const modalLearnings = document.getElementById('modalLearnings');

  const projectDetailsDatabase = {
    'rc-car': {
      category: 'Embedded Systems & Robotics',
      title: 'Obstacle-Avoidance Autonomous RC Vehicle',
      overview: 'An autonomous ground mobile robot prototype built on an Arduino microcontroller. An ultrasonic sensor mounted on a forward servo scans a 160-degree field of view to compute distance vectors. When an obstacle violates the 25cm safety perimeter, the MCU halts forward drive, polls left and right clearance angles, and commands the L298N H-Bridge dual motor driver to execute a corrective directional pivot.',
      bom: '• Arduino Uno (ATmega328P MCU)\n• HC-SR04 Ultrasonic Distance Sensor\n• L298N Dual H-Bridge Motor Driver Module\n• SG90 Micro Servo Motor (Sensor Pan Mount)\n• 2x Geared DC Motors with Rubber Wheels\n• 2x 18650 Li-ion 3.7V Battery Pack in Series',
      code: `// Proximity Threshold & Sensor Pulse Calculation
long readUltrasonicDistance(int triggerPin, int echoPin) {
  digitalWrite(triggerPin, LOW);
  delayMicroseconds(2);
  digitalWrite(triggerPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(triggerPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH);
  // Speed of sound = 343 m/s = 0.0343 cm/us
  long distanceCm = duration * 0.034 / 2;
  return distanceCm;
}`,
      learnings: 'Mastered precise microcontroller sensor timing with microsecond pulses, learned to isolate motor EMF kickback noise from logic power rails using bypass capacitors, and implemented non-blocking PWM motor speed modulation.'
    },
    'telemetry-hub': {
      category: 'Sensors & Instrumentation',
      title: 'Microcontroller Ambient Telemetry & Sensor Monitor',
      overview: 'A digital instrumentation station that continuously samples ambient temperature, relative humidity, and environmental parameters. Telemetry is formatted and transmitted via two-wire I2C protocol to an alphanumeric LCD display, paired with threshold alert LEDs and serial data streaming for laboratory logging.',
      bom: '• Arduino Nano / Uno Microcontroller\n• DHT11 / DHT22 Digital Temperature & Humidity Sensor\n• 16x2 Character Alphanumeric LCD with PCF8574 I2C Backpack\n• Bi-color Warning Indicator LEDs & 330Ω Current Limiting Resistors\n• Mini Solderless Breadboard & Dupont Wire Harness',
      code: `// I2C Display Initialization and Polling Routine
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);

void updateTelemetry(float tempC, float humPct) {
  lcd.setCursor(0, 0);
  lcd.print("Temp: "); lcd.print(tempC, 1); lcd.print(" C");
  lcd.setCursor(0, 1);
  lcd.print("Humidity: "); lcd.print(humPct, 0); lcd.print(" %");
}`,
      learnings: 'Understood 2-wire serial bus (SDA/SCL) addressing, pull-up resistor constraints on open-drain lines, digital sensor calibration formulas, and clean UI formatting on character matrix displays.'
    },
    'logic-sandbox': {
      category: 'Circuits & Logic / Software',
      title: 'Interactive Digital Logic Gate Simulator',
      overview: 'An interactive web-based logic simulator designed to visualize fundamental Boolean operations (AND, OR, NOT, NAND, XOR, XNOR). Users can toggle input states (0/1) to observe immediate truth table verification, voltage state propagation, and digital gate symbolic representations.',
      bom: '• Web Architecture: Vanilla HTML5 Canvas, SVG Logic Symbols, CSS Grid\n• Pure JavaScript Boolean Evaluation Engine\n• Digital Logic Gates Model: IEEE Std 91-1984 symbol representations',
      code: `// Boolean Logic Evaluation Engine
const LogicEngine = {
  AND: (a, b) => a & b,
  OR:  (a, b) => a | b,
  NOT: (a)    => a ? 0 : 1,
  XOR: (a, b) => a ^ b,
  NAND:(a, b) => (a & b) ? 0 : 1
};`,
      learnings: 'Deepened conceptual understanding of combinational digital logic circuits, timing propagation delays, truth table proofs, and translating hardware engineering principles into clean web-based tools.'
    },
    'line-follower': {
      category: 'Robotics & Hardware Control',
      title: 'Infrared Array Line-Following Robot Concept',
      overview: 'A robotics study exploring surface reflectance differential steering. Dual TCRT5000 infrared reflectance optical sensors distinguish black tracking tape from reflective white surfaces, driving differential PWM signals to left and right DC drive motors.',
      bom: '• TCRT5000 Dual IR Optical Reflectance Sensors\n• LM393 Dual Differential Voltage Comparator Circuit\n• Arduino Microcontroller Board\n• Differential Gearbox Chassis with Castor Wheel\n• High-efficiency Step-down Voltage Regulator',
      code: `// Differential Steering State Control
void loop() {
  int leftSensor  = digitalRead(PIN_IR_LEFT);
  int rightSensor = digitalRead(PIN_IR_RIGHT);

  if (leftSensor == LOW && rightSensor == LOW) {
    moveForward(PWM_CRUISE);
  } else if (leftSensor == HIGH && rightSensor == LOW) {
    turnLeft(PWM_PIVOT);
  } else if (leftSensor == LOW && rightSensor == HIGH) {
    turnRight(PWM_PIVOT);
  }
}`,
      learnings: 'Gained practical experience with analog comparator sensitivity potentiometer tuning, optical ambient light interference mitigation, and differential robotic steering physics.'
    }
  };

  function openModal(projectId) {
    const data = projectDetailsDatabase[projectId];
    if (!data) return;

    modalCategory.textContent = `// ${data.category}`;
    modalTitle.textContent = data.title;
    modalOverview.textContent = data.overview;
    modalBom.textContent = data.bom;
    modalCode.textContent = data.code;
    modalLearnings.textContent = data.learnings;

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalDetailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      openModal(projectId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. CONTACT FORM VALIDATION & CONFIRMATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('contactToast');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const nameInput = document.getElementById('senderName');
    const emailInput = document.getElementById('senderEmail');
    const subjectInput = document.getElementById('senderSubject');
    const messageInput = document.getElementById('senderMessage');
    const submitBtn = document.getElementById('submitBtn');

    // Reset previous errors
    [nameInput, emailInput, subjectInput, messageInput].forEach(field => {
      field.parentElement.classList.remove('has-error');
    });

    // Validate Name
    if (!nameInput.value.trim()) {
      nameInput.parentElement.classList.add('has-error');
      isValid = false;
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      emailInput.parentElement.classList.add('has-error');
      isValid = false;
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      subjectInput.parentElement.classList.add('has-error');
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      messageInput.parentElement.classList.add('has-error');
      isValid = false;
    }

    if (!isValid) return;

    // Simulate sending with loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      Transmitting Message...
    `;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
      form.reset();

      // Show toast
      if (toast) {
        toast.style.display = 'block';
        toast.className = 'toast-notice toast-success';
        toast.innerHTML = `
          <strong>Signal Received!</strong> Thank you for reaching out. I'll review your message and reply promptly.
        `;

        setTimeout(() => {
          toast.style.display = 'none';
        }, 5500);
      }
    }, 1200);
  });
}

/* ==========================================================================
   7. 1-CLICK CLIPBOARD COPY FOR EMAIL
   ========================================================================== */
function initClipboardCopy() {
  const copyBtn = document.getElementById('copyEmailBtn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const email = copyBtn.getAttribute('data-email');
    if (!email) return;

    navigator.clipboard.writeText(email).then(() => {
      const originalHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Copied!
      `;
      copyBtn.style.color = '#34d399';
      copyBtn.style.borderColor = '#34d399';

      setTimeout(() => {
        copyBtn.innerHTML = originalHtml;
        copyBtn.style.color = '';
        copyBtn.style.borderColor = '';
      }, 2500);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  });
}

/* ==========================================================================
   8. INTERSECTION OBSERVER SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const targets = document.querySelectorAll('.glass-card, .section-header, .timeline-item');
  
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(target => {
    target.style.opacity = '0';
    target.style.transform = 'translateY(20px)';
    target.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(target);
  });
}
