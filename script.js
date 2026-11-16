const { Engine, Bodies, Composite, Mouse, MouseConstraint } = Matter;

let gravityActive = false;
let engine;

document.getElementById('gravity-btn').addEventListener('click', () => {
    if (gravityActive) {
        location.reload(); 
        return;
    }
    gravityActive = true;
    startAntigravity();
});

function startAntigravity() {
    engine = Engine.create();
    
    engine.world.gravity.y = -0.05; 
    engine.world.gravity.x = 0.02;

    const elements = document.querySelectorAll('.floating-element');
    const bodies = [];

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    
    const walls = [
        Bodies.rectangle(width / 2, -25, width, 50, { isStatic: true }),
        Bodies.rectangle(width / 2, height + 25, width, 50, { isStatic: true }),
        Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true }),
        Bodies.rectangle(width + 25, height / 2, 50, height, { isStatic: true })
    ];
    Composite.add(engine.world, walls);

    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const body = Bodies.rectangle(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            rect.width,
            rect.height,
            { restitution: 0.85, frictionAir: 0.015 }
        );

        el.style.position = 'fixed';
        el.style.width = `${rect.width}px`;
        el.style.margin = '0';
        
        bodies.push({ el, body });
        Composite.add(engine.world, body);
    });

    
    const mouse = Mouse.create(document.body);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: { stiffness: 0.2, render: { visible: false } }
    });
    Composite.add(engine.world, mouseConstraint);

    function update() {
        Engine.update(engine, 1000 / 60);
        bodies.forEach(({ el, body }) => {
            el.style.left = `${body.position.x - el.offsetWidth / 2}px`;
            el.style.top = `${body.position.y - el.offsetHeight / 2}px`;
            el.style.transform = `rotate(${body.angle}rad)`;
        });
        requestAnimationFrame(update);
    }
    update();
}