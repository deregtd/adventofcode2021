// target area: x=277..318, y=-92..-53

let count = 0;
for (let initialX=1; initialX<320; initialX++) {
    for (let initialY=-100; initialY<1000; initialY++) {
        let x=0, y=0, vx=initialX, vy=initialY;
        let maxY = -1000;
        while (true) {
            maxY = Math.max(maxY, y);
            if (x >= 277 && x <= 318 && y >= -92 && y <= -53) {
                count++;
                console.log('initial: ' + initialX + ', ' + initialY);
                break;
            }
            if (y < -500) {
                break;
            }

            x += vx;
            y += vy;
            if (vx > 0) {
                vx--;
            } else if (vx < 0) {
                vx++;
            }
            vy--;
        }
    }
}

console.log(count);