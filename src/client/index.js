(() => {
    const $nav = document.querySelector("nav");

    window.addEventListener("scroll", () => {
        $nav.classList.toggle("scrolled", window.scrollY > 0);
        document.body.classList.remove("nav-open");
    });

    $nav.querySelector("button").addEventListener("click", () =>
        document.body.classList.toggle("nav-open")
    );
    if (document.getElementById("vector-field")) {
        vectorField();
    }

    if (document.getElementById("venom-particles")) {
        venomParticles();
    }

    if (document.getElementById("globe")) {
        textGlobe();
    }
})();

function vectorField() {
    let canvas;
    let ctx;
    let flowFieldAnimation;

    window.onload = function () {
        canvas = document.getElementById("vector-field");
        ctx = canvas.getContext("2d");

        canvas.height = document.documentElement.clientHeight;
        canvas.width = document.documentElement.clientWidth;

        const flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
        flowField.animate(0);
    };

    window.addEventListener("resize", function () {
        console.log("check");
        this.cancelAnimationFrame(flowFieldAnimation);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
        flowField.animate(0);
    });

    const mouse = {
        x: 0,
        y: 0,
    };
    window.addEventListener("mousemove", function (e) {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    class FlowFieldEffect {
        #ctx;
        #width;
        #height;
        constructor(ctx, width, height) {
            this.#ctx = ctx;
            this.#ctx.lineWidth = 1;
            this.#ctx.strokeStyle = "white";
            this.#width = width;
            this.#height = height;
            this.lastTime = 0;
            this.interval = 1000 / 60;
            this.timer = 0;
            this.cellSize = 10;
            this.gradient;
            this.#createGradient();
            this.#ctx.strokeStyle = this.gradient;
            this.radius = 0;
            this.vr = 0.03;
        }

        #createGradient() {
            this.gradient = this.#ctx.createLinearGradient(
                0,
                0,
                this.#width,
                this.#height
            );

            // this.gradient.addColorStop("0.1", "#80353A");
            // this.gradient.addColorStop("0.2", "#f5f5f5");
            // this.gradient.addColorStop("0.4", "#e2e5de");
            // this.gradient.addColorStop("0.6", "#b2beb5");
            // this.gradient.addColorStop("0.8", "#808080");
            // this.gradient.addColorStop("0.9", "#676767");

            this.gradient.addColorStop("0.1", "#ffffff");
            this.gradient.addColorStop("0.2", "#f5f5f5");
            this.gradient.addColorStop("0.4", "#e2e5de");
            this.gradient.addColorStop("0.6", "#b2beb5");
            this.gradient.addColorStop("0.8", "#808080");
            this.gradient.addColorStop("0.9", "#676767");
        }

        #drawLine(angle, x, y) {
            let positionX = x;
            let positionY = y;
            let dx = mouse.x - positionX;
            let dy = mouse.y - positionY;
            let distance = dx * dx + dy * dy;
            const length = distance / 10000;

            if (distance > 600000) {
                distance = 600000;
            } else if (distance < 100000) {
                distance = 100000;
            }

            this.#ctx.beginPath();
            this.#ctx.moveTo(x, y);
            this.#ctx.lineTo(
                x + Math.cos(angle) * length,
                y + Math.sin(angle) * length
            ) * length;
            this.#ctx.stroke();
        }
        animate(timeStamp) {
            const deltaTime = timeStamp - this.lastTime;
            this.lastTime = timeStamp;

            if (this.timer > this.interval) {
                this.#ctx.clearRect(0, 0, this.#width, this.#height);
                this.radius += this.vr;

                if (this.radius > 10 || this.radius < -10) {
                    this.vr *= -1;
                }

                for (let y = 0; y < this.#height; y += this.cellSize) {
                    for (let x = 0; x < this.#width; x += this.cellSize) {
                        const angle =
                            (Math.cos(x * mouse.x * 0.00001) +
                                Math.sin(y * mouse.y * 0.00001)) *
                            this.radius;
                        this.#drawLine(angle, x, y);
                    }
                }

                this.timer = 0;
            } else {
                this.timer += deltaTime;
            }

            flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
        }
    }
}

function venomParticles() {
    console.log("check");
    let canvas = document.getElementById("venom-particles");
    let ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 100;

    let particleArray = [];

    let mouse = {
        x: null,
        y: null,
        radius: (canvas.height / 100) * (canvas.width / 100),
    };

    window.addEventListener("mousemove", function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = " rgb(253, 33, 84)";
            ctx.fill();
        }

        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;

            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius + this.size) {
                if (
                    mouse.x < this.x &&
                    this.x < canvas.width - this.size * 10
                ) {
                    this.x += 10;
                }
                if (
                    mouse.x > this.x &&
                    this.x > canvas.width - this.size * 10
                ) {
                    this.x -= 10;
                }

                if (
                    mouse.y < this.y &&
                    this.y < canvas.height - this.size * 10
                ) {
                    this.y += 10;
                }
                if (
                    mouse.y > this.y &&
                    this.y > canvas.height - this.size * 10
                ) {
                    this.y -= 10;
                }
            }

            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particleArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;

        for (let i = 0; i < numberOfParticles; i++) {
            let size = Math.random() * 5 + 1;

            let x =
                Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
            let y =
                Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;

            let directionX = Math.random() * 2 - 1.5;
            let directionY = Math.random() * 2 - 1.5;

            // let directionX = Math.random() * 5 - 1.5;
            // let directionY = Math.random() * 5 - 1.5;

            let color = "rgb(0,0,0)";

            particleArray.push(
                new Particle(x, y, directionX, directionY, size, color)
            );
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particleArray.length; i++) {
            particleArray[i].update();
        }

        connect();
    }

    function connect() {
        let opacityValue = 1;

        for (let a = 0; a < particleArray.length; a++) {
            for (let b = a; b < particleArray.length; b++) {
                let distance =
                    (particleArray[a].x - particleArray[b].x) *
                        (particleArray[a].x - particleArray[b].x) +
                    (particleArray[a].y - particleArray[b].y) *
                        (particleArray[a].y - particleArray[b].y);

                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - distance / 20000;
                    ctx.strokeStyle =
                        "rgba(255, 255, 255," + opacityValue + ")";
                    ctx.lineWidth = 1;

                    ctx.beginPath();
                    ctx.moveTo(particleArray[a].x, particleArray[a].y);
                    ctx.lineTo(particleArray[b].x, particleArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener("resize", function () {
        canvas.width = this.innerWidth;
        canvas.height = this.innerHeight;
        mouse.radius = (canvas.height / 89) * (canvas.width / 80);
        init();
    });

    window.addEventListener("mouseout", function () {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    init();
    animate();
}

function textGlobe() {
    const myTags = [
        "JavaScript",
        "CSS",
        "HTML",
        "React",
        "Python",
        "Vue",
        "git",
        "Node.js",
        "MySQL",
        "jQuery",
        "AWS",
    ];

    var tagCloud = TagCloud(".globe", myTags, {
        // radius in px
        radius: 300,

        // animation speed
        // slow, normal, fast
        maxSpeed: "fast",
        initSpeed: "fast",

        // 0 = top
        // 90 = left
        // 135 = right-bottom
        direction: 135,

        // interact with cursor move on mouse out
        keep: true,
    });

    var colors = ["#0CFDD7"];
    var random_color = colors[Math.floor(Math.random() * colors.length)];
    document.querySelector(".globe").style.color = random_color;
}
