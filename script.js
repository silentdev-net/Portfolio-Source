const canvas = document.getElementById('dot-canvas');
const ctx = canvas.getContext('2d');
let particlesArray;
let width, height;
const MOUSE_RADIUS = 200;
const mouse = {
    x: null,
    y: null,
    radius: MOUSE_RADIUS
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);

        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }

    update() {
        this.x += this.directionX;
        this.y += this.directionY;
        if (this.x < 0 || this.x > canvas.width) this.directionX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.directionY *= -1;

        this.draw();
    }
}

function init() {
    particlesArray = [];
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    let numberOfParticles = (canvas.height * canvas.width) / 9000;

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 1;
        let x = Math.random() * width;
        let y = Math.random() * height;
        let directionX = (Math.random() - 0.5) * 2;
        let directionY = (Math.random() - 0.5) * 2;
        let color = '#ffffff';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    if (mouse.x && mouse.y) {
        particlesArray.forEach(p => {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 200) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 * (1 - dist / 200)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });
    }

    particlesArray.forEach((p, i) => {
        p.update();

        for (let j = i + 1; j < particlesArray.length; j++) {
            const p2 = particlesArray[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - dist / 120)})`;
                ctx.stroke();
            }
        }
    });
}

window.addEventListener('resize', () => {
    init();
});

init();
animate();
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const gridContainer = document.querySelector('.grid-container');
let cursorX = 0;
let cursorY = 0;
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    }

    if (gridContainer) {
        const rect = gridContainer.getBoundingClientRect();
        const x = mouseX - rect.left;
        const y = mouseY - rect.top;

        gridContainer.style.setProperty('--mouse-x', `${x}px`);
        gridContainer.style.setProperty('--mouse-y', `${y}px`);
        const target = e.target;

        const interactiveSelectors = [
            'a', 'button', 'input', 'textarea',
            '.skill-tag', '.timeline-item', '.project-link'
        ];

        const isInteractive = target.closest(interactiveSelectors.join(','));

        if (isInteractive) {
            gridContainer.classList.add('interaction-active');
            if (cursorOutline) {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            }
        } else {
            gridContainer.classList.remove('interaction-active');
            if (cursorOutline) {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        }
    }
});


function animateCursor() {
    const speed = 0.15;

    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;

    if (cursorOutline) {
        cursorOutline.style.left = `${cursorX}px`;
        cursorOutline.style.top = `${cursorY}px`;
    }

    requestAnimationFrame(animateCursor);
}

animateCursor();

const LANYARD_USER_ID = "1427579035776716851";

async function fetchDiscordData() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${LANYARD_USER_ID}`);
        if (!response.ok) return;
        const res = await response.json();
        const data = res.data;
        const user = data.discord_user;
        const avatarEl = document.getElementById('discord-avatar');
        const decoEl = document.getElementById('discord-deco');
        const dotEl = document.getElementById('discord-dot');
        const nameEl = document.getElementById('discord-name');
        const rpcEl = document.getElementById('discord-rpc');

        if (!avatarEl || !nameEl) return;
        nameEl.innerText = user.display_name || user.username;
        const ext = user.avatar && user.avatar.startsWith('a_') ? 'gif' : 'png';
        if (user.avatar) {
            const avatarUrl = `https://cdn.discordapp.com/avatars/${LANYARD_USER_ID}/${user.avatar}.${ext}?size=512`;
            avatarEl.src = avatarUrl;
            avatarEl.style.display = 'block';
            const faviconImg = new Image();
            faviconImg.crossOrigin = 'anonymous';
            faviconImg.src = `https://cdn.discordapp.com/avatars/${LANYARD_USER_ID}/${user.avatar}.png?size=64`;
            faviconImg.onload = () => {
                const c = document.createElement('canvas');
                c.width = 64;
                c.height = 64;
                const fctx = c.getContext('2d');
                fctx.beginPath();
                fctx.arc(32, 32, 32, 0, Math.PI * 2);
                fctx.closePath();
                fctx.clip();
                fctx.drawImage(faviconImg, 0, 0, 64, 64);
                const favicon = document.getElementById('favicon');
                if (favicon) favicon.href = c.toDataURL('image/png');
            };
        }
        if (user.avatar_decoration_data && user.avatar_decoration_data.asset) {
            decoEl.src = `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png?size=512`;
            decoEl.style.display = 'block';
        } else {
            decoEl.style.display = 'none';
        }
        const statusColors = {
            online: '#43b581',
            idle: '#faa61a',
            dnd: '#f04747',
            offline: '#747f8d'
        };
        dotEl.style.backgroundColor = statusColors[data.discord_status] || '#747f8d';
        let statusText = 'Offline';
        if (data.discord_status !== 'offline') statusText = 'Online';
        if (data.discord_status === 'idle') statusText = 'Idle';
        if (data.discord_status === 'dnd') statusText = 'Do Not Disturb';

        if (data.activities && data.activities.length > 0) {
            const customActivity = data.activities.find(a => a.type === 4);
            const playingActivity = data.activities.find(a => a.type === 0);

            if (playingActivity) {
                statusText = `Playing ${playingActivity.name}`;
                if (playingActivity.state) statusText += ` - ${playingActivity.state}`;
            } else if (data.listening_to_spotify) {
                statusText = `Listening to ${data.spotify.song} by ${data.spotify.artist}`;
            } else if (customActivity) {
                statusText = customActivity.state || 'Custom Status';
            } else {
                statusText = data.activities[0].name || statusText;
            }
        }

        rpcEl.innerText = statusText;

    } catch (err) {
        console.error("Lanyard fetch error:", err);
    }
}

fetchDiscordData();
setInterval(fetchDiscordData, 15000);
