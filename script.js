let flameOff = false;

window.addEventListener('DOMContentLoaded', () => {
  let name = prompt("Enter ur Name؟");
  let age = prompt(" Enter ur age؟");
  age = parseInt(age);

  if (!name || name.trim() === "") {
    name = "صديقي";
  }

  if (!isNaN(age) && age > 0 && age <= 120) {
    // تعديل عنوان التهنئة ليشمل الاسم والعمر
    document.getElementById('birthdayTitle').textContent = `Happy Birthday ${name} 🎂`;

    const container = document.getElementById('candlesContainer');
    const ageDigits = age.toString().split('');

    ageDigits.forEach((digit, index) => {
      const digitCandle = document.createElement('div');
      digitCandle.classList.add('candle-digit');

      const flame = document.createElement('div');
      flame.classList.add('flame');
      flame.id = `flame-${index}`;

      const number = document.createTextNode(digit);

      digitCandle.appendChild(flame);
      digitCandle.appendChild(number);
      container.appendChild(digitCandle);
    });
  } else {
    alert("رجاء إدخال عمر صحيح.");
  }

  startMicListener();
});

function startMicListener() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
      const audioContext = new AudioContext();
      const mic = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      mic.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);

      function checkBlow() {
        analyser.getByteFrequencyData(data);
        let volume = data.reduce((a, b) => a + b, 0) / data.length;

        if (volume > 150 && !flameOff) {
          document.querySelectorAll('.flame').forEach(f => f.style.display = 'none');
          flameOff = true;
        }

        requestAnimationFrame(checkBlow);
      }

      checkBlow();
    })
    .catch(function(err) {
      console.error('حدث خطأ في الميكروفون:', err);
    });
}

function turnOnFlames() {
  document.querySelectorAll('.flame').forEach(f => f.style.display = 'block');
  flameOff = false;
}
