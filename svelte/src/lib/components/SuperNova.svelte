<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { cubicIn, cubicInOut } from "svelte/easing";

    export let run: boolean;
    export let points: number;
    export let width: number = window.innerWidth;
    export let height: number = window.innerHeight;
    export let firstFrame: boolean = false;

    let canvas: HTMLCanvasElement;
    const dispatch = createEventDispatcher<{ finish: undefined }>();
    const FRAME1: number = 0.01, FRAME2: number = 0.003, FRAME3: number = 0.01;

    onMount(() => {
        const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
        let frame1: number = FRAME1, frame2: number = FRAME2, frame3: number = FRAME3;
        let radius = 200, radius2 = 200;
        let rotationAngle: number = - Math.PI / 2, lineWidth: number = 0;

        ctx.canvas.width = width;
        ctx.canvas.height = height;
        ctx.translate(canvas.width / 2, canvas.height / 2);

        function draw() {
            if ((run || firstFrame) && canvas) {
                let angle = rotationAngle;
                ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

                for (let i = 0; i < points; i++) {
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    ctx.drawImage((() => {
                        const img = new Image();
                        img.src = "point.png";

                        return img;
                    })(), x - 40, y - 40, 70, 70);

                    angle += Math.PI * 2 / points;
                }

                rotationAngle += easeInCubic(Math.PI / 200, frame1);
                if (rotationAngle == Math.PI * 2)
                    rotationAngle = 0;

                if (frame1 < 1)
                    frame1 += 0.01;
                if (frame1 > 0.5 && frame2 < 1) {
                    radius = easeInOutCubic(200, 1 - frame2);

                    frame2 += 0.003;
                }
                if (frame2 > 0.55 && frame3 < 1) {
                    radius2 = easeInOutCubic(200, 1 - frame3);
                    lineWidth = easeInCubic(20, frame3);

                    ctx.beginPath();
                    ctx.arc(0, 0, radius2, 0, 2 * Math.PI);
                    ctx.lineWidth = lineWidth;
                    ctx.strokeStyle = "#FFFFFF7F";
                    ctx.stroke();

                    frame3 += 0.01;

                    if (frame3 >= 1)
                        dispatch("finish");
                } 
            }

            if (!run && firstFrame) {
                frame1 = FRAME1;
                frame2 = FRAME2;
                frame3 = FRAME3;
            }

            requestAnimationFrame(draw);
        }

        draw();
    });

    function easeInCubic(distance: number, x: number) {
        return distance * cubicIn(x);
    }

    function easeInOutCubic(distance: number, x: number) {
        return distance * cubicInOut(x);
    }
</script>

<canvas bind:this={canvas} />