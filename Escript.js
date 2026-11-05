const audio = document.getElementById("siteAudio");
        const playButton = document.getElementById("audioPlay");
        const playIcon = document.getElementById("audioPlayIcon");
        const customAudioIcons = {
            play: "Midia/Play.png",
            pause: "Midia/Pause.png"
        };
        const progress = document.getElementById("audioProgress");
        const currentLabel = document.getElementById("audioCurrent");
        const durationLabel = document.getElementById("audioDuration");
        const volume = document.getElementById("audioVolume");
        const status = document.getElementById("audioStatus");

        function formatTime(seconds) {
            if (!Number.isFinite(seconds)) return "0:00";
            const minutes = Math.floor(seconds / 60);
            const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
            return `${minutes}:${remainder}`;
        }

        function updateProgress() {
            const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
            progress.max = duration;
            progress.value = audio.currentTime;
            currentLabel.textContent = formatTime(audio.currentTime);
            durationLabel.textContent = formatTime(duration);
        }

        function updatePlayButton() {
            const isPlaying = !audio.paused;
            const iconSource = isPlaying ? customAudioIcons.pause : customAudioIcons.play;
            if (iconSource) {
                const image = document.createElement("img");
                image.src = iconSource;
                image.alt = "";
                playIcon.replaceChildren(image);
            } else {
                playIcon.textContent = isPlaying ? "Ⅱ" : "▶";
            }
            playButton.setAttribute("aria-label", isPlaying ? "Pausar música" : "Tocar música");
            playButton.setAttribute("aria-pressed", String(isPlaying));
        }

        playButton.addEventListener("click", async () => {
            if (audio.paused) {
                try {
                    await audio.play();
                    status.textContent = "";
                } catch {
                    status.textContent = "Não foi possível iniciar essa bosta. Verifique o arquivo de áudio dessa caralha.";
                }
            } else {
                audio.pause();
            }
        });

        progress.addEventListener("input", () => {
            audio.currentTime = Number(progress.value);
            currentLabel.textContent = formatTime(audio.currentTime);
        });
        volume.addEventListener("input", () => {
            audio.volume = Number(volume.value);
        });
        audio.addEventListener("loadedmetadata", updateProgress);
        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("play", updatePlayButton);
        audio.addEventListener("pause", updatePlayButton);
        audio.addEventListener("error", () => {
            status.textContent = "Não foi possível carregar o arquivo de áudio. Desculpinha.";
        });

        updatePlayButton();
        audio.play().catch(() => {
            status.textContent = "Clique em reproduzir para iniciar a música seu jeca.";
        });

        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            let lastParticleTime = 0;
            let lastParticleX = 0;
            let lastParticleY = 0;

            document.addEventListener("pointermove", (event) => {
                if (event.pointerType !== "mouse") return;

                const now = performance.now();
                const distance = Math.hypot(event.clientX - lastParticleX, event.clientY - lastParticleY);
                if (now - lastParticleTime < 35 || distance < 8) return;

                const particle = document.createElement("span");
                particle.className = "EfeitoCursor";
                particle.setAttribute("aria-hidden", "true");
                particle.textContent = "✦";
                particle.style.left = `${event.clientX}px`;
                particle.style.top = `${event.clientY}px`;
                particle.style.setProperty("--desvio-x", `${Math.random() * 36 - 18}px`);
                particle.style.setProperty("--desvio-y", `${Math.random() * 36 - 18}px`);
                document.body.append(particle);
                particle.addEventListener("animationend", () => particle.remove(), { once: true });

                lastParticleTime = now;
                lastParticleX = event.clientX;
                lastParticleY = event.clientY;
            });
        }