window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('#webgl-canvas');
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 10.5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const jellyfishGroup = new THREE.Group();
  scene.add(jellyfishGroup);

  const headGeometry = new THREE.SphereGeometry(1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 1.8);
// নতুন আপডেটেড কোড (Purplish Glow)
const headMaterial = new THREE.MeshBasicMaterial({
  color: 0x8a3eff, //  পার্পল কালার দেওয়া হলো
  wireframe: true,
  transparent: true,
  opacity: 0.4,    // গ্লো বাড়ানোর জন্য অপাসিটি সামান্য বাড়ানো হলো
  blending: THREE.AdditiveBlending
});
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.scale.set(1, 0.9, 1);
  jellyfishGroup.add(head);

  const tentacles = [];
// নতুন আপডেটেড কালার (Purple & Violet Gradient Vibe)
const tentacleColors = [0xb166ff, 0x7b31fa, 0x9d4edd, 0xc8b6ff]; //  পার্পল শেডস

  const numTentacles = 8;
  const pointsPerTentacle = 30;

  for (let i = 0; i < numTentacles; i++) {
    const points = [];
    const angle = (i / numTentacles) * Math.PI * 2;
    const radius = 0.65;
    const startX = Math.cos(angle) * radius;
    const startZ = Math.sin(angle) * radius;
    const startY = -0.1;

    for (let j = 0; j < pointsPerTentacle; j++) {
      points.push(new THREE.Vector3(startX, startY - (j * 0.09), startZ));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const tentacleGeometry = new THREE.TubeGeometry(curve, 20, 0.02, 6, false);

    const tentacleMaterial = new THREE.MeshBasicMaterial({
      color: tentacleColors[i % tentacleColors.length],
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });

    const mesh = new THREE.Mesh(tentacleGeometry, tentacleMaterial);
    jellyfishGroup.add(mesh);

    tentacles.push({ mesh, startX, startY, startZ, speedOffset: i * 0.5 });
  }

 const ambientLight = new THREE.AmbientLight(0x1a0933, 1.8);

  scene.add(ambientLight);

  const clock = new THREE.Clock();
  let introFinished = false;
  let isMobile = window.innerWidth < 768;

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

    function setInitialPosition() {
    isMobile = window.innerWidth < 768;

    if (isMobile) {
      // মোবাইলে পেজ লোড হওয়ার সাথে সাথে জেলিফিশটি ওপরে (Y: 3.5) থাকবে
      jellyfishGroup.position.set(0.7, 3.5, -0.8); 
    } else {
      jellyfishGroup.position.set(2.4, 4.2, 0);
    }
  }


  resize();
  setInitialPosition();
//nsto hoyar por jog  korlam







































  
   // ==========================================
  // নতুন টেক্সট এবং ওয়ার্ড অ্যানিমেশন পার্ট (FIXED)
  // ==========================================
  
  // ১. সাব-টাইটেল, ডেসক্রিপশন এবং বাটন অ্যানিমেশন
  gsap.from(".hero-text .sub-title, .hero-text p, .hero-text .cta-btn", {
    opacity: 0,
    y: 30,
    duration: 1.2,
    stagger: 0.2,
    ease: "power3.out"
  });

  // ২. হেডিং-এর প্রতিটি শব্দ আলাদা করে অ্যানিমেট করা
  const heading = document.getElementById("animated-heading");
  if (heading) {
    // এখানে আমরা শুধুমাত্র আসল টেক্সটটুকু নেব, কোনো HTML ট্যাগ নেব না
    const originalText = heading.textContent.trim();
    const words = originalText.split(/\s+/);
    heading.innerHTML = ""; // আগের টেক্সট ক্লিয়ার করা

    words.forEach((word) => {
      const span = document.createElement("span");
      
      // শব্দের মাঝে স্পেসিং ঠিক রাখার জন্য CSS মার্জিন ব্যবহার করা হয়েছে
      span.style.marginRight = "12px"; 
      span.style.display = "inline-block";

      // "User" এবং "Experiences" শব্দ দুটিকে চিনে আলাদা কালার দেওয়া
      if (word === "User" || word === "Experiences") {
        span.classList.add("highlight-text");
      }
      
      span.textContent = word;
      heading.appendChild(span);
    });

    // শব্দগুলোর ওপর ড্রপ এবং ব্লার ইফেক্ট
    gsap.fromTo(
      heading.children,
      {
        opacity: 0,
        y: 25,
        filter: "blur(4px)"
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        stagger: 0.1, 
        ease: "power3.out",
        delay: 0.2
      }
    );
  }


 
  // ==========================================
  // Three.js অ্যানিমেশন ও লুপ পার্ট
  // ==========================================
  // ==========================================
  // Three.js অ্যানিমেশন ও লুপ পার্ট (Fixed for Mobile & Laptop)
  // ==========================================

  // ডিফল্ট টার্গেট পজিশন (ল্যাপটপ)
  let targetX = 5.4;
  let targetY = 0.4;

  if (isMobile) {
    // মোবাইল স্ক্রিনের জন্য ওপর থেকে নামার পর শেষ পজিশন
    targetX = 0.7; 
    targetY = 0.15; 
  }
if (window.innerWidth > 1200) {
  targetX = 5.4;
} else if (window.innerWidth > 1024) {
  targetX = 4.8;
} else if (window.innerWidth > 768) {
  targetX = 3.8;
} else {
  targetX = 0.7;
}
  // ল্যাপটপ এবং মোবাইল দুই জায়গাতেই এখন জেলিফিশটি সমানভাবে ওপর থেকে নিচে নামবে
  gsap.to(jellyfishGroup.position, {
    x: targetX,
    y: targetY,
    duration: 3.0,
    ease: "power2.out",
    onComplete: () => {
      introFinished = true; // অ্যানিমেশন শেষ হলেই কেবল ফ্ল্যাগ ট্রু হবে
    }
  });

  function animate() {
    const elapsedTime = clock.getElapsedTime();
    const speed = elapsedTime * 1.8;

    // ইন্ট্রো অ্যানিমেশন (ওপর থেকে নিচে নামা) শেষ হলে হালকা ভাসমান ইফেক্ট চালু হবে
if (introFinished) {
  if (!isMobile) {
    jellyfishGroup.position.x = targetX;
    jellyfishGroup.position.y = targetY + Math.sin(speed * 0.5) * 0.15;
  } else {
    jellyfishGroup.position.x = targetX;
    jellyfishGroup.position.y = targetY + Math.sin(speed * 0.5) * 0.1;
  }
}

    jellyfishGroup.rotation.y = elapsedTime * 0.04;

    const pulse = 1 + Math.sin(speed * 1.5) * 0.05;
    head.scale.set(pulse, 1.05 - (pulse * 0.08), pulse);

    tentacles.forEach((t) => {
      const updatedPoints = [];

      for (let j = 0; j < pointsPerTentacle; j++) {
        const tentacleProgress = j / (pointsPerTentacle - 1);
        const waveX = Math.sin(speed * 2.2 - (tentacleProgress * 5.0) + t.speedOffset) * (0.35 * tentacleProgress);
        const waveZ = Math.cos(speed * 1.8 - (tentacleProgress * 4.0) + t.speedOffset) * (0.22 * tentacleProgress);

        updatedPoints.push(new THREE.Vector3(
          t.startX * (pulse * 0.95) + waveX,
          t.startY - (j * 0.09),
          t.startZ * (pulse * 0.95) + waveZ
        ));
      }

      const newCurve = new THREE.CatmullRomCurve3(updatedPoints);
      t.mesh.geometry.dispose();
      t.mesh.geometry = new THREE.TubeGeometry(newCurve, 20, 0.02, 6, false);
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();


  window.addEventListener('resize', () => {
    resize();
    setInitialPosition();
  });
});






























function copyEmail(button) {
    const email = "humu19123@gmail.com"; // 👈 এখানে আপনার আসল ইমেইলটি বসান
    const btnText = button.querySelector('.btn-text');
    const icon = button.querySelector('.copy-icon');

    // ক্লিপবোর্ডে ইমেইল কপি করা
    navigator.clipboard.writeText(email).then(() => {
        // বাটন টেক্সট ও ক্লাস পরিবর্তন
        btnText.textContent = "Email is Copied!";
        button.classList.add('copied');
        if(icon) icon.style.display = 'none'; // কপি হওয়ার পর আইকন হাইড হবে

        // সেলিব্রেশন (কনফেটি) ইফেক্ট চালু করা
        createConfetti();

        // ৩ সেকেন্ড পর আবার আগের অবস্থায় ফেরত যাওয়া
        setTimeout(() => {
            btnText.textContent = "Copy my email address";
            button.classList.remove('copied');
            if(icon) icon.style.display = 'inline-block';
        }, 3000);
    }).catch(err => {
        console.error("কপি করতে সমস্যা হয়েছে: ", err);
    });
}

// কাস্টম লাইটওয়েট কনফেটি মেকার ফাংশন
function createConfetti() {
    const wrapper = document.getElementById('confetti-wrapper');
    wrapper.innerHTML = ''; // আগের কনফেটি পরিষ্কার করা
    
    const colors = ['#a855f7', '#3b82f6', '#ec4899', '#eab308', '#22c55e'];
    
    // ৫০টি রঙিন টুকরো তৈরি হবে
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.classList.add('confetti-piece');
        
        // র্যান্ডম পজিশন ও কালার নির্ধারণ
        piece.style.left = Math.random() * 100 + '%';
        piece.style.top = Math.random() * 60 + 40 + '%'; // বাটনের চারপাশ থেকে ছড়াবে
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // অ্যানিমেশনের জন্য র্যান্ডম ডিরেকশন ভ্যারিয়েবল
        piece.style.setProperty('--x-move', (Math.random() * 200 - 100) + 'px');
        piece.style.setProperty('--rot', (Math.random() * 360) + 'deg');
        
        // টুকরোটির সাইজ র্যান্ডম করা (কিছু বড়, কিছু ছোট)
        const size = Math.random() * 6 + 4 + 'px';
        piece.style.width = size;
        piece.style.height = size;
        if(Math.random() > 0.5) piece.style.borderRadius = '0%'; // কিছু চারকোনা টুকরো

        wrapper.appendChild(piece);
    }
}






































document.addEventListener("DOMContentLoaded", () => {
  
  // ১. আপনার আগের সোয়াইপার (Swiper) সেটিংস
  const swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,       /* মোবাইলে ১টি কার্ড দেখাবে */
    spaceBetween: 24,       /* কার্ডগুলোর মাঝের গ্যাপ */
    grabCursor: true,       /* মাউস দিয়ে টেনে স্লাইড করার কার্সার */
    pagination: {
      el: ".swiper-pagination",
      clickable: true,      /* ডটগুলোতে ক্লিক করা যাবে */
    },
    breakpoints: {
      768: {
        slidesPerView: 2,   /* ট্যাবলেট ও ল্যাপটপে ২টি কার্ড পাশাপাশি দেখাবে */
      },
      1200: {
        slidesPerView: 2,   /* ডেস্কটপেও ২টি কার্ড দেখাবে এবং সাইজ সমান থাকবে */
      }
    }
  });

  // ২. ভিডিও হোভার এবং অটো-প্লে সেটিংস (মার্জ করা অংশ)
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    const video = card.querySelector('.project-video');
    
    if (video) {
      // ভিডিওটি ব্যাকগ্রাউন্ডে প্রি-লোড করে রাখার জন্য
      video.load(); 

      // মাউস কার্ডের ওপর আনলে ভিডিও প্লে হবে
      card.addEventListener('mouseenter', () => {
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Play interrupted by browser:", error);
          });
        }
      });

      // মাউস সরিয়ে নিলে ভিডিও পজ হবে এবং শুরুতে ফিরে যাবে
      card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0; 
      });
    }
  });

});





















//testimonial
const testimonialSwiper = new Swiper(".testimonialSwiper", {
  slidesPerView: 1,
  spaceBetween: 32,
  loop: true,                 /* শেষ কার্ডের পর প্রথম কার্ড অটোমেটিক চলে আসবে */
  allowTouchMove: true,       /* মাউস দিয়েও ড্র্যাগ করা যাবে */
  speed: 8000,                /* অনবরত চলতে থাকার গতি (মিলিসেকেন্ডে) */
  autoplay: {
    delay: 0,                 /* কোনো বিরতি ছাড়া সরাসরি চলবে */
    disableOnInteraction: false,
  },
  /* এটি কার্ডগুলোকে ঝাপটা দিয়ে না সরিয়ে একদম সোজা লিনিয়ার গতিতে চালাবে */
  freeMode: {
    enabled: true,
    momentum: false,
  },
  breakpoints: {
    900: {
      slidesPerView: 2,       /* বড় স্ক্রিনে ২টি কার্ড পাশাপাশি ভেসে বেড়াবে */
    }
  }
});
















//typing
// টাইপিং অ্যানিমেশন ইনিশিয়েট করা
const typed = new Typed("#typed-text", {
  strings: [
    "your digital presence", 
    "your web application", 
    "your business brand",
    "your dream project"
  ], // 👈 এখানে কমা দিয়ে আপনি আরও নতুন নতুন শব্দ যোগ করতে পারবেন
  typeSpeed: 60,       // টাইপ হওয়ার গতি (মিলিসেকেন্ডে)
  backSpeed: 40,       // লেখা মুছে যাওয়ার গতি
  backDelay: 2000,     // একটি শব্দ টাইপ হওয়ার পর কতক্ষণ দাঁড়িয়ে থাকবে (২ সেকেন্ড)
  loop: true,          /* এটি অনবরত একের পর এক ঘুরতে থাকবে */
  showCursor: true,    /* লেখার শেষে টাইপিং কার্সার (|) দেখাবে */
  cursorChar: "|",     // কার্সার হিসেবে কোন ক্যারেক্টারটি থাকবে
});






















//form
// ফর্ম ওপেন করার ফাংশন
function openContactForm() {
    const modal = document.getElementById('contact-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // ফর্ম খোলা থাকা অবস্থায় পেজ যাতে ব্যাকগ্রাউন্ডে স্ক্রোল না হয়
}

// ফর্ম ক্লোজ করার ফাংশন
function closeContactForm() {
    const modal = document.getElementById('contact-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';   // স্ক্রোল আবার সচল করা
}

// মোডালের বাইরের ফাঁকা জায়গায় ক্লিক করলেও যাতে ফর্ম বন্ধ হয়ে যায়
window.onclick = function(event) {
    const modal = document.getElementById('contact-modal');
    if (event.target === modal) {
        closeContactForm();
    }
}

// ফর্ম সাবমিট হ্যান্ডেলার
async function handleFormSubmit(event) {
    event.preventDefault(); // পেজ রিফ্রেশ হওয়া বন্ধ করবে
    
    const form = document.getElementById('portfolio-form');
    const fullname = document.getElementById('fullname').value;
    const msgContainer = document.getElementById('form-success-msg');
    const sendBtn = document.querySelector('.form-send-btn');

    // বাটন সাময়িকভাবে নিষ্ক্রিয় করা
    sendBtn.innerText = "Sending...";
    sendBtn.disabled = true;

    // ফর্মের সব ডাটা একসাথে কালেক্ট করা
    const formData = new FormData(form);

    try {
        // 🎯 Web3Forms এপিআই-তে ডাটা পাঠানো হচ্ছে
        const response = await fetch('https://web3forms.com/', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        // যদি ইমেইল সফলভাবে চলে যায়
        if (result.success) {
            msgContainer.textContent = `Thank you, ${fullname}! Your message has been sent successfully.`;
            msgContainer.style.color = "#22c55e"; // টেক্সট সবুজ হবে
            msgContainer.classList.add('show');

            // ফর্মটি খালি (Reset) করা
            form.reset();

            // ⏳ ৩ সেকেন্ড পর সাকসেস মেসেজটি গায়েব হবে এবং পপ-আপ ফর্মটি বন্ধ হয়ে যাবে
            setTimeout(() => {
                msgContainer.classList.remove('show');
                if (typeof closeContactForm === "function") {
                    closeContactForm(); // আপনার ফর্ম বন্ধ করার ফাংশনটি কল হবে
                }
            }, 3000);
        } else {
            msgContainer.textContent = "Something went wrong. Please try again.";
            msgContainer.style.color = "#ef4444"; // টেক্সট লাল হবে
            msgContainer.classList.add('show');
        }

    } catch (error) {
        msgContainer.textContent = "Network error. Please check your internet.";
        msgContainer.style.color = "#ef4444";
        msgContainer.classList.add('show');
    } finally {
        // বাটন আবার আগের অবস্থায় ফিরে যাবে
        sendBtn.innerText = "Send";
        sendBtn.disabled = false;
    }
}














// Mobile Navbar
document.addEventListener("DOMContentLoaded", function () {

  const menuOpen = document.getElementById("menuOpen");
  const menuClose = document.getElementById("menuClose");
  const navLinks = document.getElementById("navLinks");

  if (menuOpen && menuClose && navLinks) {

    menuOpen.addEventListener("click", function () {
      navLinks.classList.add("active");
    });

    menuClose.addEventListener("click", function () {
      navLinks.classList.remove("active");
    });

  }

});


