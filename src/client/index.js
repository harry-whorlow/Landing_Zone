import {
    vectorField,
    venomParticles,
} from "@the-angry-englishman/canvas-particles";

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
        vectorField({
            canvasId: "vector-field",
            density: 20,
        });
    }

    if (document.getElementById("venom-particles")) {
        venomParticles({
            canvasId: "venom-particles",
            canvasHeight: screen.height - 100,
        });
    }

    if (document.getElementById("globe")) {
        textGlobe();
    }
})();

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
