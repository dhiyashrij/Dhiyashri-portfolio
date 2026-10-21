/**
 * DHIYASHRI J - PERSONAL PORTFOLIO
 * Vanilla JavaScript Logic & Interactive Electronics Modules
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
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
      title: 'Obstacle-Avoidance RC Car',
      overview: 'An autonomous ground mobile robot prototype built on an Arduino microcontroller. An ultrasonic sensor mounted on a forward servo scans a 160-degree field of view to compute distance vectors. When an obstacle violates the 25cm safety perimeter, the MCU halts forward drive, polls left and right clearance angles, and commands the L298N H-Bridge dual motor driver to execute a corrective directional pivot without manual intervention.',
      bom: '• Arduino Uno (ATmega328P MCU)\n• HC-SR04 Ultrasonic Distance Sensor\n• L298N Dual H-Bridge Motor Driver Module\n• SG90 Micro Servo Motor (Sensor Pan Mount)\n• 2x Geared DC Motors with High-Traction Wheels\n• 2x 18650 Li-ion 3.7V Battery Pack in Series',
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
    'adaptive-traffic': {
      category: 'Smart Automation & Embedded Systems',
      title: 'Adaptive Traffic Signal with Emergency Vehicle Priority',
      overview: 'A dynamic intersection traffic management controller designed to replace rigid static timers with demand-responsive traffic regulation. Infrared density sensor pairs profile vehicular queues along each intersection quadrant in real time to dynamically extend or compress green signal cycles. An integrated 2.4GHz RF transceiver module continuously monitors for incoming emergency responder beacons, instantly executing a prioritized hardware interrupt to freeze conflicting lanes on red and open an unobstructed green corridor.',
      bom: '• Arduino Mega 2560 / ATmega328P Microcontroller\n• 4x 3-Phase Traffic Signal LED Arrays (Red, Amber, Green)\n• 8x IR Obstacle & Vehicle Density Detection Sensors\n• NRF24L01+ 2.4GHz RF Transceiver Modules (Vehicle Beacon & Base)\n• 16x2 I2C Diagnostic Alphanumeric LCD Display\n• 5V Regulated Industrial Power Supply Module',
      code: `// Emergency Preemption Interrupt Routine & Dynamic Signal Control
void handleEmergencyPreemption(int emergencyLane) {
  // Immediately transition current green phase through safety amber
  setAllLanesRedExcept(emergencyLane);
  digitalWrite(TRAFFIC_GREEN_PINS[emergencyLane], HIGH);
  lcd.clear();
  lcd.print("EMERGENCY PRIORITY");
  lcd.setCursor(0, 1);
  lcd.print("CORRIDOR: LANE ");
  lcd.print(emergencyLane + 1);
  
  // Hold green corridor until emergency beacon clears the junction
  while (readEmergencyBeaconActive(emergencyLane)) {
    feedWatchdog();
  }
  resumeAdaptiveCycle();
}`,
      learnings: 'Engineered robust Finite State Machines (FSM) to eliminate race conditions between scheduled cycles and priority overrides, ensured failsafe amber transition intervals to prevent collision scenarios, and established wireless packet validation to reject spurious RF noise.'
    },
    'safety-band': {
      category: 'Sensors & Wearable IoT',
      title: 'Industrial Worker Safety Band',
      overview: 'A compact wearable IoT safety band developed to safeguard personnel operating in hazardous factory, refinery, or mining environments. The device continuously aggregates physiological vitals (heart rate and peripheral oxygen saturation via MAX30102), atmospheric hazards (toxic gas and smoke detection through calibrated MQ sensor heads), and physical worker trauma (abrupt free-fall acceleration and sudden deceleration impacts via an MPU-6050 6-axis IMU). Upon detecting safety violations, the band activates high-intensity haptic alarms and transmits automated emergency distress packets.',
      bom: '• ESP32-WROOM / Arduino Nano 33 IoT Microcontroller\n• MPU-6050 6-Axis Motion Tracking Accelerometer & Gyroscope\n• MAX30102 Pulse Oximeter & Heart Rate Biosensor\n• MQ-2 / MQ-135 Hazardous Gas Sensor Module\n• 0.96-inch I2C Monochrome OLED Display\n• Miniature Eccentric Rotating Mass (ERM) Haptic Motor\n• 3.7V 500mAh LiPo Rechargeable Cell with TP4056 USB Protection',
      code: `// Free-fall and High-Impact Fall Detection Algorithm
bool detectFallImpact(float ax, float ay, float az) {
  // Compute total acceleration magnitude vector
  float totalG = sqrt(ax * ax + ay * ay + az * az) / 9.81;
  
  // Phase 1: Near weightlessness free-fall condition
  if (totalG < FALL_FREEFALL_THRESHOLD && !potentialFallFlag) {
    potentialFallFlag = true;
    fallTimestamp = millis();
  }
  
  // Phase 2: High G-force deceleration impact within 500ms
  if (potentialFallFlag && (millis() - fallTimestamp < 500)) {
    if (totalG > FALL_IMPACT_THRESHOLD) {
      potentialFallFlag = false;
      return true; // Confirmed fall impact trigger
    }
  }
  return false;
}`,
      learnings: 'Implemented multi-device I2C bus synchronization between biosensors and inertial modules, developed vector magnitude noise filters to prevent false-positive fall alarms during natural arm movements, and integrated low-power sleep modes to maximize wearable battery runtime.'
    },
    'cable-fault': {
      category: 'Circuits & Diagnostic Instrumentation',
      title: 'Digital Cable Fault Diagnosis System',
      overview: 'A specialized diagnostic test instrument designed to pinpoint the precise location of underground and overhead cable faults without destructive line excavation. Utilizing Ohm’s law and precision stepped resistor ladder networks, the system measures the exact loop resistance proportional to cable length. When an open-circuit, short-circuit, or line-to-earth breakdown occurs, a high-precision 16-bit analog-to-digital converter measures line impedance shifts, computes distance-to-fault in meters/kilometers against calibration curves, and displays instant telemetry on an LCD screen accompanied by audio-visual alert indicators.',
      bom: '• Arduino Uno / ATmega328P Microcontroller Board\n• Precision Resistor Ladder Network (0.1% Metal Film Resistors)\n• ADS1115 16-Bit I2C Precision Analog-to-Digital Converter\n• 4-Channel Electromechanical Relay Array for Line Isolation\n• 16x2 I2C Alphanumeric Character LCD\n• Piezoelectric Buzzer & Bi-Color Fault Indicator LEDs\n• Ultra-Stable 5.0V Low-Dropout Reference Voltage Circuit',
      code: `// Voltage-to-Distance Fault Localization Formula
float computeFaultDistance(int rawADC) {
  // Convert 16-bit ADC reading to precision line voltage
  float voltage = (rawADC * 4.096) / 32768.0;
  
  // Cable resistance per unit meter constant: R_per_meter
  // V_fault = I_constant * (R_per_meter * Distance_meters)
  if (voltage >= V_OPEN_THRESHOLD) {
    return FAULT_OPEN_CIRCUIT;
  } else if (voltage <= V_SHORT_THRESHOLD) {
    return 0.0; // Short circuit at origin
  }
  
  // Proportional distance computation based on linear resistance
  float distanceMeters = (voltage / V_SUPPLY) * TOTAL_CABLE_LENGTH_METERS;
  return distanceMeters;
}`,
      learnings: 'Learned high-precision analog noise suppression using averaging filters, understood Kelvin resistance bridge techniques for detecting milliohm impedance differentials, and engineered clean calibration routines for varying conductor gauges and temperature coefficients.'
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